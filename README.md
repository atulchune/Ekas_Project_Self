# EKAS Healthy Foods — Ecommerce Platform

Production-oriented ecommerce platform for EKAS Healthy Foods: a Django REST
Framework backend and a React (Vite) frontend that serves both the customer
storefront and a custom Operations Portal for staff (no Django Admin
involved in any business workflow).

## Stack

- **Frontend**: React 19 + Vite, Tailwind CSS v4, React Router, TanStack Query, Zustand, React Hook Form + Zod, Framer Motion, Recharts.
- **Backend**: Django 5 + DRF, PostgreSQL, Redis, Celery + Celery Beat, Gunicorn, drf-spectacular (OpenAPI/Swagger).
- **Payments**: Provider interface with a Razorpay implementation and an explicitly-labelled mock provider used automatically when no Razorpay credentials are configured.
- **Shipping**: Provider interface (mock provider by default; swappable for Shiprocket or another courier aggregator).
- **Containers**: Multi-stage Dockerfiles for both apps, orchestrated with Docker Compose (`postgres`, `redis`, `migrate`, `backend`, `celery-worker`, `celery-beat`, `frontend`).

## Repository layout

```
backend/            Django project (config/) + apps/ (accounts, catalog, inventory,
                     cart, promotions, orders, payments, shipping, reviews,
                     content, engagement, operations, core)
frontend/            Vite React app: storefront pages + /operations portal
docker-compose.yml    Full local/production-style stack
.env.example          Documented environment variables (no secrets)
```

## Running the stack

```bash
cp .env.example .env      # adjust values, especially POSTGRES_PASSWORD and
                           # OPERATIONS_ADMIN_PASSWORD, before any real deployment
docker compose up -d --build
```

This builds both images, starts Postgres and Redis (not published to the
host), runs migrations, seeds idempotent sample/draft data, bootstraps the
initial Operations Portal Super Admin from `OPERATIONS_ADMIN_EMAIL` /
`OPERATIONS_ADMIN_PASSWORD`, and starts the backend, Celery worker, Celery
Beat, and the frontend (Nginx) on `http://localhost:8080`.

- Storefront: <http://localhost:8080/>
- Operations Portal: <http://localhost:8080/operations/login>
- API docs (Swagger UI): <http://localhost:8080/api/docs/>
- Health: `GET /healthz/`, Readiness (DB + Redis): `GET /readyz/`

### Bootstrapping / recovering the Super Admin manually

Because Django Admin is intentionally not used for any business workflow,
staff access is bootstrapped exclusively through a management command:

```bash
docker compose exec backend python manage.py create_operations_admin \
  --email admin@ekashealthyfoods.local --password 'ChangeMe123!' --noinput
```

Run it again at any time to reset a Super Admin's password (it upserts by
email). Password is never logged.

### Seeding

```bash
docker compose exec backend python manage.py seed_data
```

Idempotent. Seeds RBAC permissions/roles, the 8 real EKAS product photos
(ghee, wood-pressed oils, honey) as published sample-priced products,
homepage sections, a sample recipe, unpublished draft static pages
(FAQ/policies/Our Story/etc — intentionally left unpublished until EKAS
supplies real copy), store settings, and sample serviceable pincodes. Every
seeded product/description is explicitly labelled as a sample pending EKAS
confirmation, per the build spec's instruction never to invent unverified
pricing, certifications, or claims.

## Local development (without Docker)

Backend:

```bash
cd backend
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # or hand-write one pointing at local Postgres/Redis
python manage.py migrate
python manage.py seed_data
python manage.py create_operations_admin --noinput --email you@example.com --password '...'
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm install
npm run dev   # proxies /api and /media to http://localhost:8000 by default
```

## Testing

```bash
cd backend
python manage.py test
```

Covers: registration/login/lockout, catalog visibility (draft vs published),
guest-cart-to-account merge on login, cart validation, checkout idempotency,
overselling protection, online-payment reservation + signature verification
+ expiry release, webhook idempotency, Operations Portal RBAC enforcement
and audit-log writes, and staff-driven storefront-visible workflows
(publish a product, restock inventory, transition an order).

## Architecture notes

- **Auth**: short-lived JWT access tokens + rotating refresh tokens, delivered
  only as HttpOnly/SameSite cookies (never localStorage). Customers and staff
  use separate cookie names/endpoints (`/api/v1/auth/*` vs
  `/api/v1/operations/auth/*`) against the same `User` table, so a customer
  session can never be mistaken for staff access.
- **Server-authoritative pricing**: cart/checkout totals, discounts, shipping,
  and tax are always computed from the database inside `apps.promotions`,
  `apps.shipping`, and `apps.orders.services` — the frontend only displays
  what the backend returns.
- **Inventory**: `apps.inventory.services` is the single choke point for
  reservation, commit-on-payment, release-on-failure/expiry, restock, and
  manual adjustment, each writing an `InventoryMovement` ledger row.
- **RBAC**: `apps.operations.permissions.PERMISSION_CATALOG` is the source of
  truth for permission codes; `StaffProfile.has_permission()` and the
  `HasOperationsPermission` DRF permission class enforce them on every
  `/api/v1/operations/*` endpoint, with an `AuditLog` row written on every
  create/update/delete.
- **Payments**: `apps.payments.providers` defines the provider interface.
  `MockPaymentProvider` is used automatically whenever Razorpay credentials
  are absent, including a `/payments/mock/simulate/` endpoint that stands in
  for the Razorpay checkout widget locally (never reachable when Razorpay is
  actually configured).

## Verification performed

The full stack was built and run end-to-end with `docker compose up -d --build`
in the target environment, not just locally, and independently re-verified
after fixing two container-networking issues found along the way (below):

- `docker compose build` succeeded for both `backend` and `frontend`; all 6
  long-running containers (`postgres`, `redis`, `backend`, `celery-worker`,
  `celery-beat`, `frontend`) reported **healthy**, and the one-shot `migrate`
  service applied all migrations, ran the idempotent seed command, and
  bootstrapped the Super Admin, then exited 0.
- Storefront, through `http://localhost:8080` (the real Nginx → Django path,
  not a dev server): product listing/detail, guest cart, address creation,
  and a full **COD checkout** all worked and produced a confirmed order with
  server-computed subtotal/shipping/tax/total.
- Operations Portal, through the same proxy: staff login, dashboard stats
  (reflecting the order just placed), an RBAC-gated product edit as Super
  Admin, and a corresponding `AuditLog` row.
- `python manage.py test` (25 tests) passed both in a local venv against
  dockerized Postgres/Redis and again with `docker compose exec backend
  python manage.py test` against the running stack.
- Celery Beat's database-backed schedule contained all four custom periodic
  tasks (`release-expired-reservations`, `send-abandoned-cart-reminders`,
  `send-low-stock-alerts`, `publish-scheduled-content`) plus Celery's
  built-in cleanup task.

**Bugs found and fixed during this verification pass** (kept here rather than
quietly amended, since they're instructive):

1. `apps/core/management/commands/seed_data.py` originally resolved product
   photos relative to the repo root (`Path(BASE_DIR).parent`), which only
   exists on the host — inside the container the backend's build context is
   `./backend` alone, so every seeded product silently got zero images. Fixed
   by moving the source photos into `backend/seed_assets/` (now part of the
   Docker build context) and by having the seed command backfill images on
   already-existing products, not just newly created ones.
2. `backend/` had no `.dockerignore`, so `COPY . .` was pulling in the local
   `.venv/` — this alone cost ~10 minutes and ~500MB per build. Added one;
   rebuild time dropped from ~15 minutes to ~2–3 minutes and the final image
   from ~500MB to ~275MB.
3. Nginx's `proxy_pass http://backend:8000` resolves the `backend` hostname
   once at worker startup; recreating the backend container (as happens on
   any redeploy) left Nginx pointing at a dead IP until Nginx itself
   restarted, producing a 502. Fixed with `resolver 127.0.0.11 valid=10s;`
   and a variable-based `proxy_pass` so Nginx re-resolves on a short TTL
   instead of caching indefinitely — verified by restarting only the
   backend container and confirming the storefront kept working without
   touching Nginx.
4. The same Nginx config forwarded `Host $host`, and nginx's `$host` always
   strips the port; Django then built absolute media URLs like
   `http://localhost/media/...` instead of `http://localhost:8080/media/...`.
   Fixed by forwarding `$http_host` instead, which preserves the original
   port.
5. `apps.payments.services.verify_payment` was wrapped in a single
   `@transaction.atomic`; on an invalid signature it wrote the payment's
   failed status and released the inventory reservation, then raised — which
   rolled back those very writes along with everything else, silently
   leaving stock reserved forever after a failed payment. Fixed by scoping
   `transaction.atomic()` to just the write, with the exception raised
   outside it. Caught by an automated test, not manual inspection.
6. The Razorpay/mock payment provider's `create_order` returned a `Decimal`
   amount, which is not JSON-serializable and broke Postgres's `JSONField`
   write for `Payment.raw_response`. Fixed by casting to `float`.

## Known scope notes

- No EKAS logo or mascot file was present in the repository at build time
  (only 8 product photographs), so the storefront uses a typographic
  wordmark instead of a fabricated logo.
- Testimonials, social-impact statistics, and certifications are left empty
  on the storefront until real, verified content is entered through the
  Operations Portal's Homepage Manager — nothing is invented.
- Static content pages (FAQ, Our Story, Our Process, Women Behind EKAS,
  policies) are seeded as unpublished drafts; publish them from the
  Operations Portal once EKAS supplies approved copy.
