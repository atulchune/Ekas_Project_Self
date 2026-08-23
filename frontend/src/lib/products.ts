export interface ProductSize {
    label: string;
    price: number;
    originalPrice?: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    category: string;
    image: string;
    gallery: string[];
    rating: number;
    reviews: number;
    badge?: string;
    sizes: ProductSize[];
    inStock: boolean;
    features: string[]; // e.g., ["Cold Pressed", "Organic", "Glass Bottle"]
    benefits: string[];
    healthHighlights?: { title: string; description: string }[];
    usage: string;
    nutrition: { label: string; value: string }[];
}

export const PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Wood Pressed Groundnut Oil",
        slug: "wood-pressed-groundnut-oil",
        description: "Extracted from premium quality groundnuts using the traditional wood-pressing method (Chekku/Ghani) at low temperatures. This ensures the oil retains its natural aroma, nutrients, and authentic flavor. It is unrefined, unfiltered, and preservatives-free. Ideal for daily cooking due to its high smoke point.",
        shortDescription: "Traditional wood-pressed nutrient-rich oil for healthy cooking.",
        category: "Cold Pressed Oils",
        image: "/images/product_groundnut.jpg",
        gallery: ["/images/product_groundnut.jpg", "/images/hero.png", "/images/hero_3d.png"],
        rating: 4.8,
        reviews: 245,
        badge: "Best Seller",
        sizes: [
            { label: "500ml", price: 240, originalPrice: 280 },
            { label: "1 Litre", price: 450, originalPrice: 550 },
            { label: "5 Litres", price: 2100, originalPrice: 2750 },
        ],
        inStock: true,
        features: ["Wood Pressed", "Unrefined", "High Smoke Point", "No Preservatives"],
        benefits: [
            "Rich in Resveratrol (good for heart health)",
            "High smoke point, perfect for deep frying",
            "Contains healthy monounsaturated fats",
            "Naturally chemical-free and unrefined"
        ],
        healthHighlights: [
            { title: "High Resveratrol", description: "Protects heart cells and reduces inflammation." },
            { title: "Monounsaturated Fats", description: "Helps lower bad cholesterol (LDL) levels." },
            { title: "Vitamin E", description: "Potent antioxidant that fights free radicals." },
            { title: "Omega 6", description: "Essential for healthy brain function and growth." }
        ],
        usage: "Best for stir-frying, deep frying, and daily traditional Indian cooking.",
        nutrition: [
            { label: "Energy", value: "884 kcal" },
            { label: "Total Fat", value: "100g" },
            { label: "Saturated f Fat", value: "17g" },
            { label: "Mono Unsaturated Fat", value: "46g" },
            { label: "Poly Unsaturated Fat", value: "32g" },
        ]
    },
    {
        id: "p2",
        name: "Pure A2 Gir Cow Ghee",
        slug: "pure-a2-gir-cow-ghee",
        description: "Made from the milk of free-grazing Gir Cows using the ancient Bilona method (hand-churning curd). Our ghee has a signature golden texture, grainy consistency, and a rich, nutty aroma. It improves digestion, boosts immunity, and promotes overall vitality.",
        shortDescription: "Traditional Bilona method ghee from free-grazing Gir cows.",
        category: "Ghee",
        image: "/images/product_ghee.jpg",
        gallery: ["/images/product_ghee.jpg", "/images/cat-ghee.png"],
        rating: 5.0,
        reviews: 189,
        badge: "Premium",
        sizes: [
            { label: "250ml", price: 950, originalPrice: 1100 },
            { label: "500ml", price: 1800, originalPrice: 2200 },
            { label: "1 Litre", price: 3500, originalPrice: 4200 },
        ],
        inStock: true,
        features: ["Bilona Method", "A2 Milk", "Cultured Ghee", "Glass Jar"],
        benefits: [
            "Easier to digest than regular ghee",
            "Rich in antioxidants and Omega-3",
            "Boosts immunity and metabolism",
            "Great for skin and hair health"
        ],
        healthHighlights: [
            { title: "Butyric Acid", description: "Nourishes colon cells and supports gut health." },
            { title: "Omega 3 & 9", description: "Anti-inflammatory properties for joint health." },
            { title: "Vitamins A, D, E, K", description: "Essential fat-soluble vitamins for immunity." },
            { title: "CLA (Conjugated Linoleic Acid)", description: "Aids in fat loss and improved metabolism." }
        ],
        usage: "Drizzle on hot rotis/rice, use for sautéing, or consume a spoonful in morning coffee.",
        nutrition: [
            { label: "Energy", value: "814 kcal" },
            { label: "Total Fat", value: "100g" },
            { label: "Saturated Fat", value: "62g" },
            { label: "Cholesterol", value: "190mg" },
        ]
    },
    {
        id: "p3",
        name: "Wood Pressed Coconut Oil",
        slug: "wood-pressed-coconut-oil",
        description: "Made from premium dried coconuts (copra) without any sulphur or chemicals. Our wood-pressed coconut oil is crystal clear, aromatic, and light. It contains healthy MCTs and lauric acid, making it excellent for cooking, baking, and even skincare.",
        shortDescription: "Pure, sulphur-free coconut oil for cooking & wellness.",
        category: "Cold Pressed Oils",
        image: "/images/product_coconut.jpg",
        gallery: ["/images/product_coconut.jpg", "/images/cat-oils.png"],
        rating: 4.7,
        reviews: 156,
        badge: "Organic",
        sizes: [
            { label: "500ml", price: 320, originalPrice: 380 },
            { label: "1 Litre", price: 600, originalPrice: 750 },
        ],
        inStock: true,
        features: ["Sulphur Free", "Cold Pressed", "MCT Rich", "Multipurpose"],
        benefits: [
            "Rich in Lauric Acid (boosts immunity)",
            "Promotes healthy metabolism",
            "Excellent moisturizer for skin & hair",
            "Ideal for Kerala-style cooking"
        ],
        healthHighlights: [
            { title: "Lauric Acid", description: "Powerful anti-viral and immune-boosting compound." },
            { title: "MCTs", description: "Provides instant energy and supports weight management." },
            { title: "Caprylic Acid", description: "Natural anti-fungal properties for gut health." },
            { title: "Vitamin E", description: "Nourishes skin and promotes hair growth." }
        ],
        usage: "Use for cooking curries, baking, oil pulling, or applying on skin and hair.",
        nutrition: [
            { label: "Energy", value: "862 kcal" },
            { label: "Saturated Fat", value: "87g" },
            { label: "Trans Fat", value: "0g" },
            { label: "Dietary Fiber", value: "0g" },
        ]
    },
    {
        id: "p4",
        name: "Wood Pressed Yellow Mustard Oil",
        slug: "wood-pressed-mustard-oil",
        description: "Extracted from the finest yellow mustard seeds. Unlike regular black mustard oil, this variant is milder in pungency but higher in aroma. It helps in maintaining a healthy heart and adds a distinct flavor to North Indian dishes.",
        shortDescription: "Mildly pungent, aromatic powerhouse for heart health.",
        category: "Cold Pressed Oils",
        image: "/images/product_mustard.jpg",
        gallery: ["/images/product_mustard.jpg", "/images/card_mustard.png"],
        rating: 4.6,
        reviews: 98,
        badge: undefined,
        sizes: [
            { label: "1 Litre", price: 380, originalPrice: 450 },
            { label: "5 Litres", price: 1800, originalPrice: 2200 },
        ],
        inStock: true,
        features: ["Yellow Mustard", "Strong Aroma", "Heart Healthy", "Kachi Ghani"],
        benefits: [
            "Contains Omega-3 and Omega-6",
            "Natural antibacterial properties",
            "Stimulates digestion",
            "Relieves congestion when used for massage"
        ],
        healthHighlights: [
            { title: "Omega 3 & 6", description: "Maintains healthy cholesterol levels for heart health." },
            { title: "Anti-bacterial", description: "Fights infections naturally." },
            { title: "Allyl Isothiocyanate", description: "Relieves pain and reduces inflammation." },
            { title: "Vitamin K", description: "Essential for blood clotting and bone health." }
        ],
        usage: "Perfect for pickles, Curries, and sautering vegetables.",
        nutrition: [
            { label: "Energy", value: "884 kcal" },
            { label: "Total Fat", value: "100g" },
            { label: "MUFA", value: "60g" },
            { label: "PUFA", value: "21g" },
        ]
    },
    {
        id: "p5",
        name: "Wood Pressed Sesame Oil",
        slug: "wood-pressed-sesame-oil",
        description: "Known as the 'Queen of Oils', our sesame oil is extracted from black sesame seeds. It has a robust, nutty flavor and is widely used in Asian cooking and Ayurvedic practices for body massage (Abhyanga).",
        shortDescription: "Nutty, robust oil for pickles and Ayurvedic massage.",
        category: "Cold Pressed Oils",
        image: "/images/product_sesame.jpg",
        gallery: ["/images/product_sesame.jpg", "/images/cat-oils.png"],
        rating: 4.9,
        reviews: 112,
        sizes: [
            { label: "500ml", price: 380, originalPrice: 420 },
            { label: "1 Litre", price: 720, originalPrice: 850 },
        ],
        inStock: true,
        features: ["Black Sesame", "Nutty Flavor", "Ayurvedic", "High Stability"],
        benefits: [
            "Good source of Calcium and Zinc",
            "Contains antioxidants Sesamol & Sesamolin",
            "Helps lower blood pressure",
            "Best oil for oil pulling and massage"
        ],
        healthHighlights: [
            { title: "Sesamol", description: "Powerful antioxidant that prevents cell damage." },
            { title: "Calcium", description: "Crucial for strong bones and teeth." },
            { title: "Tyrosine", description: "Amino acid that boosts serotonin and mood." },
            { title: "Copper", description: "Reduces pain and swelling in joints." }
        ],
        usage: "Drizzle on salads, use for pickles, dosa, idli podi, or body massage.",
        nutrition: [
            { label: "Energy", value: "884 kcal" },
            { label: "Total Fat", value: "100g" },
            { label: "Protein", value: "0g" },
        ]
    },
    {
        id: "p6",
        name: "Unrefined Sweet Almond Oil",
        slug: "sweet-almond-oil",
        description: "100% pure almond oil extracted from Mamra almonds. It is light, non-greasy, and packed with Vitamin E. While it can be used for salad dressings, it is most prized for its skincare benefits, reducing dark circles and softening skin.",
        shortDescription: "Vitamin E rich beauty elixir for skin and hair.",
        category: "Cold Pressed Oils",
        image: "/images/product_almond.jpg",
        gallery: ["/images/product_almond.jpg", "/images/card_almond.png"],
        rating: 4.8,
        reviews: 75,
        sizes: [
            { label: "100ml", price: 450, originalPrice: 600 },
            { label: "250ml", price: 1050, originalPrice: 1400 },
        ],
        inStock: true,
        features: ["Mamra Almonds", "Vitamin E", "Non-Sticky", "Edible Grade"],
        benefits: [
            "Deeply moisturizes skin",
            "Reduces dark circles",
            "Strengthens hair roots",
            "Good for brain health (consumption)"
        ],
        healthHighlights: [
            { title: "High in Vitamin E", description: "Supports brain health and glowing skin." },
            { title: "Omega Fatty Acids", description: "Improves cardiovascular health." },
            { title: "Antioxidants", description: "Protects the body from oxidative stress." },
            { title: "Rich in Magnesium", description: "Promotes bone health." }
        ],
        usage: "Apply on face/hair overnight, or add a teaspoon to warm milk.",
        nutrition: [
            { label: "Energy", value: "884 kcal" },
            { label: "Vitamin E", value: "5mg" },
        ]
    }
];
