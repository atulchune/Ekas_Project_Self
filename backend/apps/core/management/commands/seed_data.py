from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from apps.catalog.models import Bundle, BundleItem, Category, Product, ProductImage, ProductVariant
from apps.content.models import HomepageSection, Recipe, RecipeIngredient, SiteAnnouncement, StaticPage
from apps.inventory.models import Inventory
from apps.operations.models import Permission, Role, RolePermission, StoreSetting
from apps.operations.permissions import PERMISSION_CATALOG
from apps.shipping.models import ServiceablePincode

# Real EKAS label photography supplied for this build. Lives inside the
# backend app (not the repo root) so it travels with the Docker build
# context and resolves identically in a local venv and in the container.
SEED_ASSETS_DIR = Path(settings.BASE_DIR) / "seed_assets"

ROLE_PERMISSIONS = {
    "Super Admin": None,  # all permissions
    "Operations Manager": [
        "dashboard.view", "products.view", "products.manage", "inventory.view", "inventory.manage",
        "orders.view", "orders.manage", "shipments.view", "shipments.manage", "returns.view", "returns.manage",
    ],
    "Catalogue Manager": [
        "dashboard.view", "categories.view", "categories.manage", "products.view", "products.manage",
        "media.view", "media.manage", "combos.view", "combos.manage",
    ],
    "Order Manager": [
        "dashboard.view", "orders.view", "orders.manage", "payments.view", "payments.manage",
        "shipments.view", "shipments.manage", "returns.view", "returns.manage",
    ],
    "Marketing Manager": [
        "dashboard.view", "homepage.view", "homepage.manage", "coupons.view", "coupons.manage",
        "combos.view", "combos.manage", "blogs.view", "blogs.manage", "recipes.view", "recipes.manage",
        "newsletter.view", "newsletter.manage", "media.view", "media.manage",
    ],
    "Customer Support": [
        "dashboard.view", "customers.view", "customers.manage", "orders.view", "enquiries.view",
        "enquiries.manage", "reviews.view", "reviews.manage", "notifications.view",
    ],
    "Inventory Staff": ["dashboard.view", "inventory.view", "inventory.manage", "reports.view"],
}

PRODUCT_SEED = [
    {
        "name": "A2 Gir Cow Bilona Ghee",
        "image": "a2-bilona-ghee.png",
        "category": "Ghee",
        "short_description": "Traditionally churned A2 Gir cow ghee made using the Bilona method.",
        "preparation": "Prepared using the traditional Bilona churning method from cultured A2 Gir cow curd.",
        "variants": [("500ml Jar", 500, "649.00", "749.00"), ("1L Jar", 1000, "1199.00", "1399.00")],
    },
    {
        "name": "Wood-Pressed Coconut Oil",
        "image": "coconut-oil.png",
        "category": "Wood-Pressed Oils",
        "short_description": "Cold, wood-pressed coconut oil retaining natural aroma and nutrients.",
        "preparation": "Extracted using a traditional wooden ghani (kolhu) press without heat or chemicals.",
        "variants": [("500ml", 500, "299.00", "349.00"), ("1L", 1000, "549.00", "649.00")],
    },
    {
        "name": "Wood-Pressed Groundnut Oil",
        "image": "groundnut-oil.png",
        "category": "Wood-Pressed Oils",
        "short_description": "Rich, aromatic groundnut oil pressed the traditional way.",
        "preparation": "Extracted using a traditional wooden ghani (kolhu) press without heat or chemicals.",
        "variants": [("1L", 1000, "329.00", "399.00")],
    },
    {
        "name": "Wood-Pressed Mustard Oil",
        "image": "mustard-oil.png",
        "category": "Wood-Pressed Oils",
        "short_description": "Pungent, pure mustard oil cold-pressed in small batches.",
        "preparation": "Extracted using a traditional wooden ghani (kolhu) press without heat or chemicals.",
        "variants": [("1L", 1000, "279.00", "329.00")],
    },
    {
        "name": "Wood-Pressed Sesame Oil",
        "image": "sesame-oil.png",
        "category": "Wood-Pressed Oils",
        "short_description": "Nutty, traditional sesame (til) oil, wood-pressed for purity.",
        "preparation": "Extracted using a traditional wooden ghani (kolhu) press without heat or chemicals.",
        "variants": [("500ml", 500, "349.00", "399.00")],
    },
    {
        "name": "Wood-Pressed Sunflower Oil",
        "image": "sunflower-oil.png",
        "category": "Wood-Pressed Oils",
        "short_description": "Light, everyday sunflower oil, wood-pressed in small batches.",
        "preparation": "Extracted using a traditional wooden ghani (kolhu) press without heat or chemicals.",
        "variants": [("1L", 1000, "299.00", "349.00")],
    },
    {
        "name": "Wood-Pressed Almond Oil",
        "image": "almond-oil.png",
        "category": "Wood-Pressed Oils",
        "short_description": "Premium cold, wood-pressed almond oil.",
        "preparation": "Extracted using a traditional wooden ghani (kolhu) press without heat or chemicals.",
        "variants": [("250ml", 250, "599.00", "699.00")],
    },
    {
        "name": "Raw Forest Honey",
        "image": "honey.png",
        "category": "Honey",
        "short_description": "Unprocessed, raw honey sourced from traditional beekeepers.",
        "preparation": "Harvested and filtered without heating to preserve natural enzymes.",
        "variants": [("500g", 500, "399.00", "449.00")],
    },
]

SAMPLE_NOTE = (
    "Sample listing seeded for local development. Pricing, packaging, and copy are "
    "placeholders pending confirmation and approval from EKAS Healthy Foods."
)

# Sourced from the live EKAS Healthy Foods WordPress site (ekashealthyfoods.com) so
# static pages ship with real copy instead of "pending approval" placeholders.
STATIC_PAGE_CONTENT = {
    "our-story": (
        "EKAS Healthy Foods began as a passion initiative in 2021 and grew into a "
        "mission-driven food company in November 2024, built by engineers-turned-entrepreneurs "
        "Sanjit Kaur and Charan Kanwal Singh.\n\n"
        "Our Mission\n"
        "We empower women by providing sustainable employment opportunities while delivering "
        "100% organic, wood-pressed cooking oils, with an unwavering commitment to purity, "
        "health, and ethical practices.\n\n"
        "Our Vision\n"
        "To create a healthier world with pure, chemical-free oils, while fostering a strong "
        "community of empowered women entrepreneurs.\n\n"
        "Our Values\n"
        "Everything we do is rooted in tradition, transparency, and trust. Pure ~ Organic ~ Empowering!\n\n"
        "Every EKAS product, from wood-pressed oils to A2 Bilona ghee, raw honey, and "
        "preservative-free foods, is pure, traditional, and chemical-free, made to promote "
        "health and wellness while positively impacting the planet and the people who grow "
        "and press it."
    ),
    "our-process": (
        "Every EKAS product is made the traditional way: slow, careful, and true to how our "
        "grandmothers made it.\n\n"
        "1. Sourcing\n"
        "Ingredients are sourced directly from trusted farmers and rural producers across India.\n\n"
        "2. Cleaning\n"
        "Raw material is cleaned and sorted by hand before it ever touches the press.\n\n"
        "3. Wood Pressing / Bilona Churning\n"
        "Slow, traditional extraction using a wooden ghani (kolhu) for our oils and the Bilona "
        "method for our ghee preserves natural aroma and nutrients, without heat or chemicals.\n\n"
        "4. Settling & Filtering\n"
        "Oils are left to settle naturally and are filtered without any chemical refining.\n\n"
        "5. Inspection\n"
        "Every batch is checked for quality before it is packaged.\n\n"
        "6. Packaging & Delivery\n"
        "Each product is sealed and shipped carefully to protect its purity in transit, from "
        "our press to your kitchen."
    ),
    "women-behind-ekas": (
        "EKAS Healthy Foods was built on a simple belief: that empowering rural women matters "
        "as much as the purity of what's in the bottle.\n\n"
        "We work directly with rural women artisans and farmers, providing sustainable "
        "employment and fair, transparent partnerships instead of anonymous supply chains. "
        "Every jar of Bilona-churned ghee and every bottle of wood-pressed oil carries the "
        "work of hands we know by name.\n\n"
        "By choosing EKAS, you're supporting a community of empowered women entrepreneurs, and "
        "helping build a model where purity, health, and ethical practices go hand in hand."
    ),
    "faq": (
        "Wood-Pressed Groundnut Oil\n\n"
        "Is the oil suitable for frying and high-heat cooking?\n"
        "Yes, its high smoke point makes it perfect for all types of cooking.\n\n"
        "What makes wood-pressed oil different from refined oil?\n"
        "Wood-pressed oil is chemical-free, unrefined, and retains all its nutrients, unlike refined oils.\n\n"
        "Can this oil be used for children?\n"
        "Absolutely. It's pure and safe for the whole family, including kids.\n\n"
        "How should I store the oil?\n"
        "Store in a cool, dark place to maintain freshness for up to 9 months.\n\n"
        "Wood-Pressed Mustard Oil\n\n"
        "Is this mustard oil good for pickling?\n"
        "Yes, its pungency and natural antibacterial properties make it ideal for pickling.\n\n"
        "Can it help relieve muscle pain?\n"
        "Yes, mustard oil is traditionally used for massages to relieve aches and improve circulation.\n\n"
        "Is it safe to consume daily?\n"
        "Yes, when used in moderation, it is highly nutritious and supports heart health.\n\n"
        "What gives mustard oil its strong smell?\n"
        "The pungency comes from allyl isothiocyanate, a natural compound with health benefits.\n\n"
        "Can I use it to treat dandruff?\n"
        "Yes, regular scalp massages with mustard oil can help reduce dandruff naturally.\n\n"
        "Wood-Pressed Coconut Oil\n\n"
        "Can this coconut oil be used for baking?\n"
        "Yes, its mild flavor makes it perfect for baking cakes, cookies, and breads.\n\n"
        "Is the oil suitable for oil pulling?\n"
        "Absolutely. Coconut oil is excellent for oil pulling and oral hygiene.\n\n"
        "Can it be used for pets?\n"
        "Yes, it's safe for pets and can improve their coat health when added to their diet.\n\n"
        "Does it solidify in cold weather?\n"
        "Yes, coconut oil naturally solidifies below 24 degrees C, which is a sign of purity.\n\n"
        "Is it suitable for all skin types?\n"
        "Yes, it's gentle, non-comedogenic, and works well for all skin types.\n\n"
        "Wood-Pressed Sesame Oil\n\n"
        "What dishes can I prepare with sesame oil?\n"
        "It's perfect for stir-fries, Asian recipes, soups, and salad dressings.\n\n"
        "Can it be used for oil pulling?\n"
        "Yes, sesame oil is one of the best oils for oral detoxification and gum health.\n\n"
        "Is sesame oil good for joint pain?\n"
        "Yes, it is traditionally used in massages to alleviate joint pain and stiffness.\n\n"
        "Wood-Pressed Almond Oil\n\n"
        "Is almond oil safe for babies?\n"
        "Yes, it is gentle and can be used for baby massages or as a moisturizer.\n\n"
        "Is it suitable for dry and sensitive skin?\n"
        "Absolutely. Almond oil deeply hydrates and soothes dry, sensitive skin.\n\n"
        "Can it be used for cooking?\n"
        "Yes, its light flavor makes it ideal for salad dressings, smoothies, and desserts."
    ),
    "shipping-policy": (
        "1. General Information\n"
        "We are committed to delivering pure, traditional, and chemical-free products across "
        "India with careful handling.\n\n"
        "2. Shipping Locations\n"
        "We currently deliver across India. For areas outside our service zones, contact us at "
        "+91 9081238888 or wecare@ekashealthyfoods.com.\n\n"
        "3. Processing Time\n"
        "Orders are typically processed within 1-2 business days (excluding weekends and holidays).\n\n"
        "4. Estimated Delivery Time\n"
        "Metro Cities: 3-5 business days\n"
        "Tier 2 & 3 Cities: 5-7 business days\n"
        "Remote Locations: 7-10 business days\n"
        "Timeframes may vary due to weather, courier issues, or holidays.\n\n"
        "5. Shipping Charges\n"
        "We offer free shipping on orders above Rs. 999. Orders below this threshold incur a "
        "nominal fee calculated at checkout.\n\n"
        "6. Order Tracking\n"
        "You'll receive an email/SMS with a tracking link for real-time monitoring.\n\n"
        "7. Delayed or Missing Deliveries\n"
        "Contact support if your order doesn't arrive within the estimated timeframe.\n\n"
        "8. Incorrect Address & Non-Delivery\n"
        "We aren't responsible for delivery failures caused by inaccurate addresses. Reshipping "
        "may incur additional charges.\n\n"
        "9. Damaged or Tampered Packages\n"
        "Please refuse damaged packages and notify us immediately, or report damage within 24 "
        "hours with photographic evidence.\n\n"
        "10. Changes & Cancellations\n"
        "Order modifications or cancellations are accepted within 6 hours of placing the order."
    ),
    "return-refund-policy": (
        "At Ekas Marketing Solutions Private Limited, we strive to ensure the highest level of "
        "satisfaction with our products. If you are not satisfied with your purchase, you may "
        "request a refund within 24 hours of the transaction under the following terms.\n\n"
        "1. Eligibility for Refund\n"
        "Refund claims must be made within 24 hours of the original purchase. Refunds are only "
        "applicable to orders that have not yet been shipped or delivered.\n\n"
        "2. How to Request a Refund\n"
        "Contact us within 24 hours of purchase at sales@ekashealthyfoods.com with your order "
        "details, including the transaction ID and reason for the refund. We'll review your "
        "request and notify you of the approval or rejection within 2 business days.\n\n"
        "3. Refund Process\n"
        "If approved, the refund will be credited back to your original payment method within "
        "7-10 business days, depending on your payment provider. If rejected, we'll provide an "
        "explanation for the decision.\n\n"
        "4. Exceptions\n"
        "Refunds are not applicable to discounted or promotional purchases unless specifically stated.\n\n"
        "5. Changes to This Policy\n"
        "We reserve the right to modify this policy at any time. Changes will be posted on this "
        "page, and it's your responsibility to review it periodically.\n\n"
        "6. Contact\n"
        "For any questions about refunds, reach out to sales@ekashealthyfoods.com."
    ),
    "privacy-policy": (
        "1. Introduction\n"
        "Ekas Marketing Solutions Private Limited is committed to protecting your privacy. This "
        "policy outlines how we collect and use your information when you visit our website or "
        "use our services.\n\n"
        "2. Information We Collect\n"
        "Personal data such as your name, email, phone, and billing information collected during "
        "purchases; and non-personal data such as IP address, browser type, and usage data "
        "through cookies and similar technologies.\n\n"
        "3. Use of Collected Information\n"
        "Your data is used to provide services, process transactions, and communicate about "
        "orders. Payment information is only shared with secure third-party payment gateways as "
        "required.\n\n"
        "4. Disclosure of Information\n"
        "We do not sell, trade, or otherwise transfer your personal information to outside "
        "parties without your consent, except when necessary for service provision or legal "
        "requirements.\n\n"
        "5. Security\n"
        "We take reasonable measures to protect your information from unauthorized access, "
        "alteration, or destruction, though absolute security cannot be guaranteed.\n\n"
        "6. Third-Party Services\n"
        "Our site may contain links to external sites. We are not responsible for the privacy "
        "practices or content of these external sites.\n\n"
        "7. Your Rights\n"
        "You may access, correct, or delete your personal information by contacting "
        "info@ekashealthyfoods.com.\n\n"
        "8. Changes to This Policy\n"
        "Updates will be posted on this page; we encourage you to review it periodically.\n\n"
        "9. Contact Us\n"
        "Questions: info@ekashealthyfoods.com"
    ),
    "terms-and-conditions": (
        "1. Introduction\n"
        "Welcome to www.ekashealthyfoods.com. These terms and conditions outline the rules and "
        "regulations for the use of Ekas Marketing Solutions Private Limited's website and "
        "services. By accessing this website, you accept these terms. Please do not use the "
        "site if you disagree with any stated condition.\n\n"
        "2. Payment Terms\n"
        "Transactions are processed through a secure third-party payment gateway. Payments are "
        "non-refundable unless otherwise specified. You must provide accurate payment "
        "information; unauthorized or fraudulent payment use may result in service termination "
        "and legal action.\n\n"
        "3. Use of Website\n"
        "You agree to avoid unlawful activities or misuse of the service. We reserve the right "
        "to suspend access for violations of these terms without advance notice.\n\n"
        "4. Intellectual Property\n"
        "All content, including text, graphics, logos, and software, is the intellectual "
        "property of Ekas Marketing Solutions Private Limited or its licensors. Unauthorized "
        "use is prohibited.\n\n"
        "5. Disclaimer of Warranties\n"
        "Services are provided on an 'as is' and 'as available' basis. No warranties are made "
        "regarding the website or services.\n\n"
        "6. Limitation of Liability\n"
        "We are not responsible for damages arising from use of, or inability to use, the "
        "website.\n\n"
        "7. Governing Law\n"
        "These terms are governed by Indian law, with exclusive jurisdiction in the courts of "
        "Daman."
    ),
}


class Command(BaseCommand):
    help = "Idempotently seeds RBAC permissions/roles, catalog, homepage, recipes, and store settings."

    def handle(self, *args, **options):
        with transaction.atomic():
            self.seed_permissions()
            self.seed_roles()
            self.seed_catalog()
            self.seed_homepage()
            self.seed_recipes()
            self.seed_static_pages()
            self.seed_store_settings()
            self.seed_pincodes()
        self.stdout.write(self.style.SUCCESS("Seed data applied."))

    def seed_permissions(self):
        for module, codes in PERMISSION_CATALOG.items():
            for code in codes:
                Permission.objects.get_or_create(code=code, defaults={"module": module})
        self.stdout.write("Permissions seeded.")

    def seed_roles(self):
        all_codes = Permission.objects.all()
        for name, codes in ROLE_PERMISSIONS.items():
            role, _ = Role.objects.get_or_create(name=name, defaults={"is_system": True})
            perms = all_codes if codes is None else Permission.objects.filter(code__in=codes)
            for perm in perms:
                RolePermission.objects.get_or_create(role=role, permission=perm)
        self.stdout.write("Roles seeded.")

    def _copy_image(self, filename):
        src = SEED_ASSETS_DIR / filename
        if not src.exists():
            return None
        return src

    def seed_catalog(self):
        categories = {}
        for name in ["Ghee", "Wood-Pressed Oils", "Honey", "Preservative-Free Foods", "Combos"]:
            slug = slugify(name)
            category, _ = Category.objects.get_or_create(
                slug=slug, defaults={"name": name, "description": f"{name} from EKAS Healthy Foods.", "is_active": True}
            )
            categories[name] = category

        for entry in PRODUCT_SEED:
            slug = slugify(entry["name"])
            product, created = Product.objects.get_or_create(
                slug=slug,
                defaults={
                    "category": categories[entry["category"]],
                    "name": entry["name"],
                    "short_description": entry["short_description"],
                    "description": SAMPLE_NOTE,
                    "preparation": entry["preparation"],
                    "status": Product.PUBLISHED,
                    "is_bestseller": True,
                },
            )
            if created:
                for i, (label, grams, price, mrp) in enumerate(entry["variants"]):
                    sku = f"{slug.upper()[:20]}-{grams}"
                    variant = ProductVariant.objects.create(
                        product=product, sku=sku, label=label, weight_grams=grams,
                        price=Decimal(price), mrp=Decimal(mrp), is_default=(i == 0), display_order=i,
                    )
                    Inventory.objects.create(variant=variant, on_hand_quantity=150, low_stock_threshold=15)

            if not product.images.exists():
                image_path = self._copy_image(entry["image"])
                if image_path:
                    with open(image_path, "rb") as fh:
                        image = ProductImage(product=product, alt_text=entry["name"], is_primary=True)
                        image.image.save(entry["image"], File(fh), save=True)

        # A simple combo pack using the first two seeded products, if present.
        oil = ProductVariant.objects.filter(product__slug="wood-pressed-coconut-oil").first()
        ghee = ProductVariant.objects.filter(product__slug="a2-gir-cow-bilona-ghee").first()
        if oil and ghee and not Bundle.objects.filter(slug="pure-kitchen-starter-combo").exists():
            bundle = Bundle.objects.create(
                name="Pure Kitchen Starter Combo",
                slug="pure-kitchen-starter-combo",
                description="Everything you need to start cooking the traditional way: wood-pressed "
                "coconut oil paired with A2 Gir cow Bilona ghee, bundled at a special price.",
                bundle_price=Decimal(oil.price) + Decimal(ghee.price) - Decimal("100.00"),
                status=Bundle.PUBLISHED,
            )
            BundleItem.objects.create(bundle=bundle, variant=oil, quantity=1)
            BundleItem.objects.create(bundle=bundle, variant=ghee, quantity=1)

        self.stdout.write("Catalog seeded.")

    def seed_homepage(self):
        SiteAnnouncement.objects.get_or_create(
            message="Free shipping on orders above Rs. 999. Pure ~ Organic ~ Empowering!",
            defaults={"is_active": True, "display_order": 0},
        )
        sections = [
            (
                HomepageSection.HERO,
                "Pure. Traditional. Empowering.",
                "Nurturing health with 100% organic, wood-pressed cooking oils, A2 Bilona ghee, and raw "
                "honey -- chemical-free, traditionally made, and rooted in empowering rural women artisans.",
                0,
            ),
            (
                HomepageSection.TRUST_STRIP,
                "",
                "Pure & Natural. Sustainable & Ethical. Community Driven. Uncompromised Quality.",
                1,
            ),
            (HomepageSection.CATEGORY_GRID, "Shop by Category", "", 2),
            (HomepageSection.BESTSELLERS, "Best Sellers", "", 3),
            (
                HomepageSection.PRODUCT_FOCUS,
                "Wood-Pressed Coconut Oil",
                "Pure, versatile, and packed with nutrients -- cold, wood-pressed to lock in aroma and nutrition.",
                4,
            ),
            (
                HomepageSection.PROCESS_STORY,
                "How We Make It",
                "From farm to bottle -- see how each product is traditionally pressed, churned, and packaged by hand.",
                5,
            ),
            (
                HomepageSection.WHY_EKAS,
                "Why EKAS",
                "Chemical-free, nutrient-rich foods made using traditional methods, sourced directly from "
                "farmers and rural women artisans who share in every batch's success.",
                6,
            ),
            (
                HomepageSection.WOMEN_LED,
                "Women Behind EKAS",
                "EKAS empowers women by providing sustainable employment opportunities while delivering "
                "100% organic, wood-pressed cooking oils -- built on tradition, transparency, and trust.",
                7,
            ),
            (HomepageSection.COMBOS, "Combo Packs & Savings", "", 8),
            (HomepageSection.RECIPES, "Recipe Inspiration", "", 9),
            (HomepageSection.TESTIMONIALS, "What Our Customers Say", "", 10),
            (HomepageSection.IMPACT, "Our Impact", "", 11),
            (HomepageSection.NEWSLETTER, "Join Our Newsletter", "", 12),
        ]
        for section_type, title, body, order in sections:
            HomepageSection.objects.get_or_create(
                section_type=section_type,
                defaults={
                    "title": title, "body": body, "display_order": order,
                    "status": HomepageSection.PUBLISHED, "is_visible": True,
                },
            )
        self.stdout.write("Homepage sections seeded.")

    def seed_recipes(self):
        if Recipe.objects.exists():
            return
        recipe = Recipe.objects.create(
            title="Traditional Ghee Rice",
            slug="traditional-ghee-rice",
            description=SAMPLE_NOTE,
            prep_time_minutes=10,
            cook_time_minutes=20,
            servings=4,
            difficulty=Recipe.EASY,
            instructions=[
                "Cook rice and set aside.",
                "Warm A2 Bilona ghee in a pan.",
                "Temper with cumin and cashews.",
                "Fold through the rice and serve hot.",
            ],
            dietary_tags=["vegetarian", "gluten-free"],
            status=Recipe.PUBLISHED,
        )
        for i, (name, qty) in enumerate([("Rice", "2 cups"), ("A2 Bilona Ghee", "3 tbsp"), ("Cumin seeds", "1 tsp"), ("Cashews", "10")]):
            RecipeIngredient.objects.create(recipe=recipe, name=name, quantity=qty, display_order=i)
        ghee_product = Product.objects.filter(slug="a2-gir-cow-bilona-ghee").first()
        if ghee_product:
            recipe.ekas_products.add(ghee_product)
        self.stdout.write("Recipes seeded.")

    def seed_static_pages(self):
        for slug, title in StaticPage.SLUG_CHOICES:
            StaticPage.objects.get_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "body": STATIC_PAGE_CONTENT.get(slug, ""),
                    "is_published": slug in STATIC_PAGE_CONTENT,
                },
            )
        self.stdout.write("Static pages seeded.")

    def seed_store_settings(self):
        defaults = {
            "site_name": "EKAS Healthy Foods",
            "support_email": "wecare@ekashealthyfoods.com",
            "support_phone": "+91 9081238888",
            "social_links": {
                "instagram": "https://www.instagram.com/ekashealthyfoods",
                "facebook": "https://www.facebook.com/ekashealthyfoods",
                "youtube": "",
            },
            "free_shipping_threshold": settings.FREE_SHIPPING_THRESHOLD,
            "flat_shipping_fee": settings.FLAT_SHIPPING_FEE,
            "cod_enabled": settings.COD_ENABLED,
        }
        for key, value in defaults.items():
            StoreSetting.objects.get_or_create(key=key, defaults={"value": value})
        self.stdout.write("Store settings seeded.")

    def seed_pincodes(self):
        samples = [
            ("560001", "Bengaluru", "Karnataka"), ("400001", "Mumbai", "Maharashtra"),
            ("110001", "New Delhi", "Delhi"), ("600001", "Chennai", "Tamil Nadu"),
            ("500001", "Hyderabad", "Telangana"), ("700001", "Kolkata", "West Bengal"),
        ]
        for pincode, city, state in samples:
            ServiceablePincode.objects.get_or_create(
                pincode=pincode, defaults={"city": city, "state": state, "cod_available": True, "estimated_days": 4}
            )
        self.stdout.write("Serviceable pincodes seeded.")
