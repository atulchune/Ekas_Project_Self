# EKAS Healthy Foods — Complete Ecommerce Build Specification

## Claude execution instruction

Act as a senior full-stack architect, ecommerce engineer, DevOps engineer, and UI/UX designer. Read this specification completely before editing code.

Inspect the repository and its assets first. Then plan, implement, containerize, test, run, and verify the application. Do not stop after generating a mockup, architecture document, scaffold, or sample code. Preserve useful existing code and assets, but replace incomplete or unsuitable implementations where necessary.

The implementation is complete only when the production frontend and backend images build, the Docker Compose stack starts, the customer storefront works, and authorized EKAS staff can operate the business through the custom React Operations Portal without using Django Admin.

## 1. Product and brand

Build a production-ready ecommerce platform for **EKAS Healthy Foods**.

References:

- Existing EKAS website: <https://www.ekashealthyfoods.com/>
- Experience inspiration: <https://www.anveshan.farm/>

Use Anveshan only as inspiration for premium product presentation, product discovery, quick-add shopping, offers, combo packs, reviews, and traditional-process storytelling. Do not copy its source code, branding, text, illustrations, or exact layouts.

Primary EKAS products:

- A2 Gir Cow Bilona Ghee
- Wood-Pressed Coconut Oil
- Wood-Pressed Groundnut Oil
- Wood-Pressed Mustard Oil
- Wood-Pressed Sesame Oil
- Wood-Pressed Sunflower Oil
- Wood-Pressed Almond Oil
- Honey
- Preservative-free foods
- Healthy combo packs

Brand themes:

- Traditional preparation
- Purity and transparency
- Chemical-free products
- Ethical sourcing
- Farmer support
- Women-led entrepreneurship
- Rural women empowerment
- Sustainability
- Traceability and quality

Positioning: **Pure. Traditional. Empowering.**

Do not invent prices, packaging, medical claims, certifications, nutritional values, awards, reviews, team details, or impact statistics. All unverified information must remain editable and unpublished until EKAS supplies it.

## 2. Mandatory stack

### Frontend

- React.js with Vite
- JavaScript, unless the repository already uses TypeScript
- React Router
- Tailwind CSS
- Framer Motion for restrained animation
- TanStack Query
- Axios or a structured fetch client
- Zustand or Context API for cart and UI state
- React Hook Form with Zod or Yup
- Recharts for operational analytics
- Mobile-first responsive implementation

### Backend

- Python and Django
- Django REST Framework
- PostgreSQL
- Redis
- Celery worker
- Celery Beat
- Gunicorn
- Versioned REST APIs
- OpenAPI/Swagger documentation

### Deployment

- Separate production Docker image for the React frontend
- Separate production Docker image for the Django backend
- The Celery worker, Celery Beat, and migration service must reuse the backend image
- Docker Compose services for frontend, backend, migrations, Celery worker, Celery Beat, PostgreSQL, and Redis
- Multi-stage Dockerfiles
- Environment-based configuration
- Health checks, restart policies, and named volumes
- `.env.example` with no secrets
- The complete stack must start with:

```bash
docker compose up -d --build
```

## 3. Existing assets

Search the complete repository before designing the UI. Reuse the EKAS logo, portfolio, product photography, product videos, process media, team photographs, and existing approved content.

Likely filenames include:

- `ekas - mascot.png`
- `ekas coconut oil.png`

Use real product images wherever available. Never alter labels or generate inaccurate packaging.

Use the mascot selectively in the welcome experience, traditional-process story, tips, empty cart, order-success page, and newsletter. It must support rather than dominate the premium product presentation.

## 4. Original visual system

Create an original premium Indian natural-food identity.

Palette:

- Deep forest green
- Coconut leaf green
- Warm ivory
- Natural cream
- Ghee gold
- Earthy brown
- Muted terracotta accent

Use an elegant editorial serif for major headings and a clean sans-serif for interface text. The design should feel warm, handcrafted, credible, spacious, and contemporary.

Use:

- High-quality product imagery
- Generous whitespace
- Soft rounded cards
- Refined shadows
- Subtle botanical details
- Smooth, lightweight motion
- Strong mobile typography

Avoid generic templates, excessive gradients, neon colours, excessive glassmorphism, animation overload, fake counters, Lorem Ipsum, non-functional controls, or copying the reference site.

Meet accessibility expectations:

- Semantic HTML
- Keyboard navigation
- Visible focus styles
- Form labels
- Screen-reader support
- Sufficient contrast
- Reduced-motion behaviour
- Responsive layouts from 320px upward

## 5. Customer storefront

Build functional pages for:

- Home
- All products
- Category and subcategory
- Search results
- Product detail
- Combo packs
- Cart
- Checkout
- Payment result
- Order success
- Login and registration
- Email verification
- Forgot/reset password
- Customer dashboard
- Order history
- Order detail and tracking
- Saved addresses
- Wishlist
- Recently viewed products
- Our Story
- Our Process
- Women Behind EKAS
- Recipes and recipe detail
- Blog and blog detail
- Contact
- FAQ
- Shipping policy
- Return/refund policy
- Privacy policy
- Terms and conditions
- 404, error, and maintenance states

### Homepage

Include:

1. Admin-controlled announcement bar for offers, delivery notices, and free-shipping thresholds.
2. Sticky responsive header with Shop, Ghee, Wood-Pressed Oils, Honey, Combos, Our Process, Our Story, Recipes, search, account, wishlist, and cart.
3. Premium hero using a real product image or muted looping video, an original headline, supporting copy, `Shop Pure Foods` CTA, and `Discover Our Process` CTA.
4. Trust strip using only verifiable statements.
5. Shop-by-category cards.
6. Best-seller cards with image, variant, price, MRP, savings, rating, badges, wishlist, quick add, stock state, and notify-me.
7. Immersive product-in-focus section for Coconut Oil or A2 Gir Cow Bilona Ghee.
8. Traditional-making process story: sourcing, cleaning, wooden pressing or Bilona churning, settling/filtering, inspection, packaging, and delivery.
9. Why EKAS.
10. Women-led story using real content.
11. Combo packs and savings.
12. Recipe inspiration.
13. Testimonials with verified-purchase status where applicable.
14. Evidence-based social impact.
15. Newsletter and comprehensive footer.

All homepage sections, text, media, order, visibility, scheduling, and CTAs must be editable from the Operations Portal.

## 6. Catalogue and product details

Support:

- Categories and subcategories
- Products with multiple packaging variants
- Variant-specific SKU, price, MRP, stock, weight, and dimensions
- Multiple product images and videos
- Search and autocomplete
- Filtering by category, price, size, and availability
- Sorting and pagination
- Featured, best-seller, and new-launch flags
- Related products
- Frequently bought together
- Combo packs
- Wishlist
- Recently viewed products

The product page must include:

- Image/video gallery and zoom
- Product name, rating, reviews, price, MRP, and savings
- Variant selection and stock status
- Quantity, Add to Cart, Buy Now, and Wishlist
- Delivery-pincode check
- Source, ingredients, preparation, aroma, texture, and culinary uses
- Storage, shelf life, allergens, and nutrition when provided
- Certifications only when supplied
- Shipping information and FAQ
- Reviews and review media
- Related, frequently bought together, and recently viewed products
- Sticky mobile purchase bar

## 7. Cart, checkout, payments, and shipping

Implement:

- Persistent guest and authenticated carts
- Guest-cart merge after login
- Variant, quantity, and stock validation
- Coupon and automatic-promotion calculation
- Shipping, tax, and free-shipping rules
- Address creation and selection
- Separate billing address option
- Cash-on-delivery configuration
- Online payment
- Server-side final-total calculation
- Idempotent checkout and order creation
- Transactional inventory reservation
- Reservation expiry and release
- Payment verification
- Order confirmation
- Overselling protection

Never trust prices, discounts, taxes, shipping fees, or totals submitted by the frontend.

Create a payment-provider interface and a Razorpay-ready implementation with backend order creation, signature verification, webhooks, idempotency, transaction logging, failure handling, and refund support. Keep all secrets on the backend.

When credentials are absent, the local stack must still work through an explicitly labelled mock provider.

Create a shipping-provider interface with configurable COD, shipping zones, flat/free shipping, pincode serviceability, courier, tracking number, tracking URL, and shipment state. Keep it adaptable to Shiprocket or another provider.

## 8. Customer accounts

Implement registration, login, logout, email verification, password reset, profile, addresses, orders, tracking, wishlist, reviews, cancellation/refund requests, notification preferences, and session management.

Prefer short-lived authentication with secure HTTP-only, Secure, SameSite cookies behind the same-origin frontend proxy. Do not store long-lived tokens in localStorage. Enforce CSRF protection where applicable.

## 9. Custom React Operations Portal

Do **not** use Django Admin for business operations.

Build a custom React and Tailwind Operations Portal at:

`/operations`

Expose protected operations APIs at:

`/api/v1/operations/`

Do not expose or route staff to Django Admin. Do not make any required business workflow dependent on Django Admin classes, direct database access, source edits, or management commands except initial bootstrap/recovery commands.

The Operations Portal may share the React repository and frontend image with the storefront, but it must use a separate layout, navigation, protected routes, lazy-loaded bundle, visual presentation, and backend-enforced permissions.

### Navigation

- Dashboard
- Orders
- Products
- Categories
- Inventory
- Customers
- Payments
- Shipments
- Returns and Refunds
- Coupons and Offers
- Combo Packs
- Reviews
- Homepage Manager
- Media Library
- Recipes
- Blogs
- Notifications
- Newsletter
- Contact Enquiries
- Reports
- Staff and Roles
- Audit Logs
- Store Settings
- Profile and Security

The portal needs a collapsible sidebar, top navigation, global search, breadcrumbs, responsive tablet support, emergency mobile access, accessible tables/forms, loading states, empty states, confirmations, notifications, unsaved-change warnings, server pagination, saved filters, column selection, bulk selection, and CSV export.

No important button may be decorative.

## 10. Operations security and RBAC

Implement:

- Dedicated staff login
- Secure access/refresh-token lifecycle
- Refresh rotation and session expiry
- Password reset
- Repeated-login lockout
- Login history
- Active-session management
- Force logout
- Staff activation/deactivation
- Optional email OTP/2FA-ready provider interface
- Route guards in React
- Permission enforcement on every backend operations endpoint
- Sensitive-action confirmation or reauthentication

Initial roles:

1. **Super Admin:** complete access, staff, roles, settings, and audit logs.
2. **Operations Manager:** products, inventory, orders, shipments, and returns.
3. **Catalogue Manager:** categories, products, variants, media, and SEO.
4. **Order Manager:** orders, payments, fulfilment, cancellations, and refund requests.
5. **Marketing Manager:** homepage, offers, combos, blog, recipes, and newsletter.
6. **Customer Support:** customers, orders, enquiries, reviews, and notifications, without price/payment editing.
7. **Inventory Staff:** stock adjustments and inventory reports, without customer/payment access.

Super Admin must be able to create roles and assign granular permissions.

## 11. Operations modules

### Dashboard

Show sales today/week/month, order counts, pending fulfilment, cancellations, refunds, average order value, best sellers, low/out-of-stock variants, new/repeat customers, coupon usage, payment success/failure, recent orders, recent staff activity, date filters, and exports.

### Products

Allow authorized staff to create, edit, duplicate, archive, restore, draft, preview, publish, and schedule products; manage slugs, SKUs, categories, content, ingredients, preparation, storage, shelf life, allergens, nutrition, media, variants, pricing, cost, inventory, badges, recommendations, SEO, and CSV imports/exports.

### Inventory

Track available, reserved, and sold quantities per variant. Support low-stock thresholds, reasoned manual adjustments, bulk updates, stock ledgers, movement history, order-linked movements, reservations, expiration/release, reports, and transactional overselling protection.

### Orders

Support search and filters, timeline, customer and address details, line items, totals, payment details, staff notes, invoices, packing slips, confirmation, packing, courier/tracking, shipment, delivery, cancellation, refund workflow, partial-refund architecture, notification resend, and exports.

Every state transition must be backend-validated and audited.

### Customers

Support search, profile, orders, addresses, spend metrics, enquiries, notifications, internal notes, account disable/reactivation, and permitted exports. Mask sensitive data according to permission.

### Homepage manager

Allow marketing staff to control announcement bars, hero media, headlines, CTAs, featured categories, best sellers, product focus, process story, combos, testimonials, women-led stories, impact, recipes, newsletter, visibility, order, device-specific media, draft, preview, publish, and schedules.

### Promotions

Support fixed/percentage discounts, product/category scopes, minimum value, maximum discount, total/per-customer limits, start/end dates, free shipping, automatic promotions, combo pricing, priority, stacking rules, conflict prevention, and reports.

### Content

Provide rich editors for blogs, recipes, FAQs, policies, Our Story, Our Process, Women Behind EKAS, and guides. Support media, authors, categories, tags, slugs, SEO, draft, preview, publish, and scheduling.

Recipes must support timing, servings, difficulty, ingredients, instructions, EKAS products used, dietary tags, and supplied nutrition.

### Media

Provide upload validation, search, filtering, alt text, dimensions, size, thumbnails, WebP conversion where appropriate, reuse, usage references, reorder, desktop/mobile versions, and safe-deletion protection.

### Reviews and enquiries

Support verified-purchase reviews, ratings, text, media, moderation, staff replies, reports, and rating aggregation.

Support assigned contact enquiries, status, staff notes, response history, and Celery acknowledgements.

### Reports

Provide date-filtered tables, charts, and CSV exports for sales, products, categories, orders, payments, failures, inventory, coupons, acquisition, repeat customers, average order value, returns, refunds, and newsletter growth.

### Audit log

Create immutable audit records containing staff member, action, resource, previous/new values, timestamp, request ID, and appropriate IP/user-agent context. Restrict access by permission.

## 12. Suggested Django models

Create or adapt maintainable models for:

- User
- CustomerProfile
- Address
- Category
- Product
- ProductVariant
- ProductImage
- ProductVideo
- Inventory
- InventoryMovement
- Cart
- CartItem
- Wishlist
- RecentlyViewed
- Order
- OrderItem
- OrderStatusHistory
- InternalOrderNote
- Payment
- Refund
- Shipment
- Coupon
- Promotion
- CouponUsage
- Bundle
- BundleItem
- Review
- ReviewMedia
- Recipe
- RecipeIngredient
- BlogPost
- NewsletterSubscriber
- ContactEnquiry
- StockNotification
- SiteAnnouncement
- HomepageSection
- MediaAsset
- NotificationLog
- NotificationTemplate
- StoreSetting
- StaffProfile
- Role
- Permission
- RolePermission
- StaffRole
- AuditLog
- LoginHistory
- StaffSession
- ReportExport

Use UUIDs where appropriate, timestamps, slugs, creator/updater tracking, publication states, soft deactivation, constraints, indexes, and transactional updates.

## 13. APIs

Customer APIs under `/api/v1/`:

- Authentication
- Profile and addresses
- Categories, products, variants
- Search and suggestions
- Cart and wishlist
- Checkout, orders, and payments
- Coupons
- Reviews
- Recipes and blog
- Newsletter and contact
- Homepage content
- Pincode/serviceability
- Health and readiness

Operations APIs under `/api/v1/operations/`:

- Staff authentication
- Dashboard
- Products, categories, variants, media
- Inventory
- Orders, payments, shipments, refunds
- Customers and reviews
- Promotions, coupons, and bundles
- Homepage, blog, and recipes
- Notifications, newsletter, and enquiries
- Reports
- Staff, roles, and permissions
- Audit logs and store settings

All list APIs need server-side pagination, search, filtering, and sorting where relevant. Add bulk actions, CSV import/export, consistent errors, validation, throttling, permission classes, transaction safety, and API documentation.

## 14. Redis

Use Redis for catalogue/homepage caching, search suggestions, rate limiting, temporary stock reservations, applicable sessions, Celery broker, and result backend.

Invalidate affected caches after product, category, price, inventory, promotion, homepage, or rating changes. Checkout must always validate authoritative database prices and inventory.

## 15. Celery and notifications

Use Celery for:

- Welcome and verification email
- Password reset
- Order/payment confirmation or failure
- Shipment and delivery updates
- Cancellation and refund updates
- Abandoned-cart reminders
- Review requests
- Back-in-stock notifications
- Low-stock staff alerts
- Newsletters
- Enquiry acknowledgements
- Report exports
- Scheduled content publication

Use Celery Beat for reminders, newsletters, scheduled content/promotions, reservation cleanup, retries, and maintenance.

Create provider interfaces for email, SMS, and WhatsApp. Use safe console/mock providers in development and environment-supplied credentials in production.

## 16. SEO, performance, and accessibility

Implement dynamic metadata, canonical URLs, Open Graph, organization/product/review/breadcrumb/article/recipe structured data, sitemap, robots.txt, human-readable slugs, responsive images, WebP/AVIF where supported, lazy loading, code splitting, skeleton states, optimized video, stable dimensions, and good Core Web Vitals.

Use a practical SEO strategy for the chosen React architecture and document any SPA indexing limitations.

## 17. Security

Implement secure password storage, HTTP-only authentication cookies, CSRF/CORS restrictions, input and upload validation, backend RBAC, throttling, login lockout, server-side totals, payment/webhook verification, idempotency, security headers, secret management, structured logs, sensitive-data masking, audit trails, inventory locking, and duplicate-refund protection.

Require permission and explicit confirmation for refunds, cancellation, stock adjustments, price changes, archive/delete actions, customer/staff deactivation, role changes, and media deletion.

## 18. Container architecture

Create:

- `frontend/Dockerfile`
- `backend/Dockerfile`
- `docker-compose.yml`
- `.env.example`
- Frontend Nginx configuration
- Backend entrypoint
- Health/readiness endpoints
- Named volumes
- README

Recommended services:

- `frontend`
- `backend`
- `migrate`
- `celery-worker`
- `celery-beat`
- `postgres`
- `redis`

The frontend multi-stage image must build React with Node and serve it through Nginx. Proxy `/api/` to Django, provide SPA fallback for storefront and `/operations/*`, compress responses, cache versioned assets, avoid permanent HTML caching, and add suitable security headers.

The backend image must run Gunicorn and be reused by workers, Beat, and migration services. Prefer a non-root runtime. Do not embed secrets.

Persist PostgreSQL and uploaded media through named volumes. Do not publish PostgreSQL or Redis ports by default. Keep media storage adaptable to S3-compatible object storage.

## 19. Environment variables

Document variables for Django secret/debug/hosts, CSRF and CORS origins, PostgreSQL, Redis/Celery, frontend API and public site URLs, email/SMTP, Razorpay, webhook secrets, shipping provider, media, secure cookies, and initial operations-admin identity.

Never include actual secrets.

## 20. Initial Super Admin

Because Django Admin is forbidden, implement:

```bash
python manage.py create_operations_admin
```

Use it to create the first Operations Portal Super Admin. Support a safe, non-interactive deployment mode using environment variables without logging passwords.

Document creation, `/operations` login, password reset, staff deactivation, session revocation, and role assignment.

## 21. Testing

Backend tests must cover models, authentication, permissions, products, variants, inventory, carts, coupons, checkout, orders, payment verification, webhooks, refunds, reviews, Celery tasks, audit logs, and operations authorization.

Frontend tests must cover product/variant selection, cart, checkout, authentication, protected customer and operations routes, RBAC controls, product management, inventory adjustment, and order transitions.

Verify these end-to-end flows:

1. Browse product → choose variant → cart → checkout → order.
2. Guest cart → login → merged cart.
3. Staff login → create/publish product → storefront visibility.
4. Inventory adjustment → storefront stock update.
5. Order → fulfilment/tracking → customer status.
6. Unauthorized staff blocked from restricted actions.
7. Duplicate payment webhook cannot duplicate an order.
8. Failed/expired payment releases inventory.

## 22. Seed data

Create an idempotent command that seeds initial roles, permissions, categories, sample products, variants, homepage structure, recipes, and store settings using approved EKAS content where available.

Clearly label uncertain records as sample/draft. Everything must be manageable from the Operations Portal.

## 23. Code-quality expectations

Use reusable components, a service layer, thin API views, strong serializers, database transaction boundaries, consistent errors, structured logging, linting/formatting, meaningful names, and minimal duplication.

Do not hardcode production URLs or credentials. Do not leave critical TODOs, fake data after integration, silent failures, decorative controls, or required workflows that depend on Django Admin.

## 24. Execution workflow

1. Inspect repository structure and assets.
2. Summarize existing useful code and constraints.
3. Give a concise implementation plan.
4. Define architecture and data model.
5. Implement Django models, services, APIs, migrations, and tests.
6. Implement the React storefront.
7. Implement the React Operations Portal.
8. Add Redis, Celery, payments, shipping, and notifications.
9. Add production Dockerfiles, Compose, Nginx, and environment configuration.
10. Add seed/bootstrap commands.
11. Build both production images.
12. Start the Docker Compose stack.
13. Run migrations and seed data.
14. Verify frontend, backend, PostgreSQL, Redis, worker, and Beat health.
15. Run tests and exercise critical flows.
16. Fix blocking issues.
17. Deliver documentation and verification results.

Work in coherent vertical slices and keep the application runnable. If the full scope cannot be finished in one pass, prioritize secure foundations and fully working critical paths, clearly record remaining work, and continue implementing rather than stopping at a plan.

## 25. Acceptance criteria

The project is complete only when:

- `docker compose up -d --build` succeeds.
- Required containers become healthy.
- Migrations complete.
- The storefront loads and uses the Django API.
- Search, variants, cart, checkout, and order creation work.
- Redis caching and invalidation work.
- Celery worker and Beat work.
- Development notifications work safely.
- Authorized staff can log in at `/operations`.
- Staff can manage products, variants, inventory, orders, shipping, content, and promotions.
- Super Admin can manage roles and permissions.
- Unauthorized operations are rejected by Django.
- Staff never need Django Admin.
- Important changes are audited.
- Frontend and backend production images build.
- Critical tests pass.
- No important control is decorative.
- No unsupported claims or invented certifications are published.

Deliver a maintainable production foundation for EKAS Healthy Foods, not a disposable demonstration.
