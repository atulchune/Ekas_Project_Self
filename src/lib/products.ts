import parsedAssets from "../../parsed-assets.json";

export interface ProductSize {
    label: string;
    price: number;
    originalPrice?: number;
}

export interface ProductVideos {
    listing: string | null;
    productPage: string | null;
    ugc: string[];
}

export interface ProductImages {
    hero: string[];
    gallery: string[];
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
    images: ProductImages;
    videos: ProductVideos;
    rating: number;
    reviews: number;
    badge?: string;
    sizes: ProductSize[];
    inStock: boolean;
    features: string[];
    benefits: string[];
    healthHighlights?: { title: string; description: string }[];
    usage: string;
    nutrition: { label: string; value: string }[];
}

// Map the prefixes used in parsed-assets.json
const productMappings = [
    {
        id: "groundnut",
        name: "Wood Pressed Groundnut Oil",
        slug: "wood-pressed-groundnut-oil",
        prefix: "EKAS_Groundnut_",
        category: "Cold Pressed Oils",
        description: "Extracted from premium quality groundnuts using the traditional wood-pressing method (Chekku/Ghani) at low temperatures. This ensures the oil retains its natural aroma, nutrients, and authentic flavor. It is unrefined, unfiltered, and preservatives-free. Ideal for daily cooking due to its high smoke point.",
        shortDescription: "Traditional wood-pressed nutrient-rich oil for healthy cooking.",
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
        benefits: ["Rich in Resveratrol", "Perfect for deep frying", "Healthy monounsaturated fats", "Chemical-free"],
        usage: "Best for stir-frying, deep frying, and daily traditional Indian cooking.",
        nutrition: [{ label: "Energy", value: "884 kcal" }, { label: "Total Fat", value: "100g" }, { label: "Saturated Fat", value: "17g" }, { label: "Mono Unsaturated Fat", value: "46g" }, { label: "Poly Unsaturated Fat", value: "32g" }]
    },
    {
        id: "mustard",
        name: "Wood Pressed Mustard Oil",
        slug: "wood-pressed-mustard-oil",
        prefix: "EKAS_Mustard_",
        category: "Cold Pressed Oils",
        description: "Extracted from the finest yellow mustard seeds. Unlike regular black mustard oil, this variant is milder in pungency but higher in aroma. It helps in maintaining a healthy heart and adds a distinct flavor to North Indian dishes.",
        shortDescription: "Mildly pungent, aromatic powerhouse for heart health.",
        rating: 4.6,
        reviews: 98,
        sizes: [
            { label: "1 Litre", price: 380, originalPrice: 450 },
            { label: "5 Litres", price: 1800, originalPrice: 2200 },
        ],
        inStock: true,
        features: ["Yellow Mustard", "Strong Aroma", "Heart Healthy", "Kachi Ghani"],
        benefits: ["Contains Omega-3 and Omega-6", "Natural antibacterial properties", "Stimulates digestion", "Relieves congestion when used for massage"],
        usage: "Perfect for pickles, curries, and sautéing vegetables.",
        nutrition: [{ label: "Energy", value: "884 kcal" }, { label: "Total Fat", value: "100g" }, { label: "MUFA", value: "60g" }, { label: "PUFA", value: "21g" }]
    },
    {
        id: "sesame",
        name: "Wood Pressed Sesame Oil",
        slug: "wood-pressed-sesame-oil",
        prefix: "EKAS_Sesame_",
        category: "Cold Pressed Oils",
        description: "Known as the 'Queen of Oils', our sesame oil is extracted from black sesame seeds. It has a robust, nutty flavor and is widely used in Asian cooking and Ayurvedic practices for body massage (Abhyanga).",
        shortDescription: "Nutty, robust oil for pickles and Ayurvedic massage.",
        rating: 4.9,
        reviews: 112,
        sizes: [
            { label: "500ml", price: 380, originalPrice: 420 },
            { label: "1 Litre", price: 720, originalPrice: 850 },
        ],
        inStock: true,
        features: ["Black Sesame", "Nutty Flavor", "Ayurvedic", "High Stability"],
        benefits: ["Good source of Calcium and Zinc", "Contains antioxidants Sesamol & Sesamolin", "Helps lower blood pressure", "Best oil for oil pulling and massage"],
        usage: "Drizzle on salads, use for pickles, dosa, idli podi, or body massage.",
        nutrition: [{ label: "Energy", value: "884 kcal" }, { label: "Total Fat", value: "100g" }, { label: "Protein", value: "0g" }]
    },
    {
        id: "sunflower",
        name: "Wood Pressed Sunflower Oil",
        slug: "wood-pressed-sunflower-oil",
        prefix: "EKAS_Sunflower_",
        category: "Cold Pressed Oils",
        description: "Extracted from premium sunflower seeds, this cold-pressed oil is light, mild, and perfect for everyday cooking without overpowering the taste of your food.",
        shortDescription: "Light and mild oil for everyday cooking.",
        rating: 4.5,
        reviews: 84,
        sizes: [
            { label: "1 Litre", price: 420, originalPrice: 480 },
            { label: "5 Litres", price: 1950, originalPrice: 2200 },
        ],
        inStock: true,
        features: ["Light Taste", "High Vitamin E", "Heart Healthy", "Wood Pressed"],
        benefits: ["Rich in Vitamin E", "Promotes heart health", "Light on stomach"],
        usage: "Ideal for deep frying, baking, and everyday cooking.",
        nutrition: [{ label: "Energy", value: "884 kcal" }, { label: "Total Fat", value: "100g" }]
    },
    {
        id: "coconut",
        name: "Wood Pressed Coconut Oil",
        slug: "wood-pressed-coconut-oil",
        prefix: "EKAS_Coconut_",
        category: "Cold Pressed Oils",
        description: "Made from premium dried coconuts (copra) without any sulphur or chemicals. Our wood-pressed coconut oil is crystal clear, aromatic, and light. It contains healthy MCTs and lauric acid, making it excellent for cooking, baking, and even skincare.",
        shortDescription: "Pure, sulphur-free coconut oil for cooking & wellness.",
        rating: 4.7,
        reviews: 156,
        badge: "Organic",
        sizes: [
            { label: "500ml", price: 320, originalPrice: 380 },
            { label: "1 Litre", price: 600, originalPrice: 750 },
        ],
        inStock: true,
        features: ["Sulphur Free", "Cold Pressed", "MCT Rich", "Multipurpose"],
        benefits: ["Rich in Lauric Acid (boosts immunity)", "Promotes healthy metabolism", "Excellent moisturizer for skin & hair", "Ideal for Kerala-style cooking"],
        usage: "Use for cooking curries, baking, oil pulling, or applying on skin and hair.",
        nutrition: [{ label: "Energy", value: "862 kcal" }, { label: "Saturated Fat", value: "87g" }]
    },
    {
        id: "ghee",
        name: "A2 Gir Cow Bilona Ghee",
        slug: "pure-a2-gir-cow-ghee",
        prefix: "EKAS_Ghee_",
        category: "Ghee",
        description: "Made from the milk of free-grazing Gir Cows using the ancient Bilona method (hand-churning curd). Our ghee has a signature golden texture, grainy consistency, and a rich, nutty aroma. It improves digestion, boosts immunity, and promotes overall vitality.",
        shortDescription: "Traditional Bilona method ghee from free-grazing Gir cows.",
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
        benefits: ["Easier to digest than regular ghee", "Rich in antioxidants and Omega-3", "Boosts immunity and metabolism", "Great for skin and hair health"],
        usage: "Drizzle on hot rotis/rice, use for sautéing, or consume a spoonful in morning coffee.",
        nutrition: [{ label: "Energy", value: "814 kcal" }, { label: "Total Fat", value: "100g" }, { label: "Saturated Fat", value: "62g" }, { label: "Cholesterol", value: "190mg" }]
    },
    {
        id: "almond",
        name: "Unrefined Sweet Almond Oil",
        slug: "sweet-almond-oil",
        prefix: "EKAS_Almond_",
        category: "Cold Pressed Oils",
        description: "100% pure almond oil extracted from Mamra almonds. It is light, non-greasy, and packed with Vitamin E. While it can be used for salad dressings, it is most prized for its skincare benefits, reducing dark circles and softening skin.",
        shortDescription: "Vitamin E rich beauty elixir for skin and hair.",
        rating: 4.8,
        reviews: 75,
        sizes: [
            { label: "100ml", price: 450, originalPrice: 600 },
            { label: "250ml", price: 1050, originalPrice: 1400 },
        ],
        inStock: true,
        features: ["Mamra Almonds", "Vitamin E", "Non-Sticky", "Edible Grade"],
        benefits: ["Deeply moisturizes skin", "Reduces dark circles", "Strengthens hair roots", "Good for brain health (consumption)"],
        usage: "Apply on face/hair overnight, or add a teaspoon to warm milk.",
        nutrition: [{ label: "Energy", value: "884 kcal" }, { label: "Vitamin E", value: "5mg" }]
    }
];

export const PRODUCTS: Product[] = productMappings.map(base => {
    // Filter assets for this specific product prefix
    const productAssets = parsedAssets.filter((a: any) => a.Filename && a.Filename.startsWith(base.prefix));
    
    // Categorize images
    const heroImages = productAssets.filter((a: any) => a.Filename.includes('_01_Hero_') && (a.Filename.endsWith('.png') || a.Filename.endsWith('.jpg'))).map((a: any) => a['Public URL']);
    const allImages = productAssets.filter((a: any) => a.Filename.endsWith('.png') && !a.Filename.includes('_ListingVideo_')).map((a: any) => a['Public URL']);
    
    // Categorize videos
    const listingVideo = productAssets.find((a: any) => a.Filename.includes('_ListingVideo_'))?.['Public URL'] || null;
    const productPageVideo = productAssets.find((a: any) => a.Filename.includes('_ProductPage_16x9'))?.['Public URL'] || null;
    const ugcVideos = productAssets.filter((a: any) => a.Filename.includes('_UGC')).map((a: any) => a['Public URL']);

    // Fallbacks
    const primaryImage = heroImages[0] || "/images/placeholder.png";

    return {
        ...base,
        image: primaryImage,
        gallery: allImages, // Maintain backward compatibility
        images: {
            hero: heroImages,
            gallery: allImages
        },
        videos: {
            listing: listingVideo,
            productPage: productPageVideo,
            ugc: ugcVideos
        }
    };
});
