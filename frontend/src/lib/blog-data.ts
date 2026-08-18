export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    category: "Recipes" | "Health Benefits" | "General";
    image: string;
}

export const BLOG_POSTS: BlogPost[] = [
    // RECIPES
    {
        id: "r1",
        title: "Using Mustard Oil in Raw Preparations: Tips & Tricks",
        slug: "using-mustard-oil-in-raw-preparations",
        excerpt: "Mustard oil in raw food? Yes, it’s a thing—and a delicious one too. Especially when the oil is cold pressed, clean, and unrefined. In many Indian households, mustard oil has…",
        content: "Full content would go here...",
        date: "July 29, 2025",
        category: "Recipes",
        image: "/images/product_mustard.jpg"
    },
    {
        id: "r2",
        title: "Nutty Goodness: Tasty Dishes You Can Create with Organic Sesame Oil",
        slug: "tasty-dishes-organic-sesame-oil",
        excerpt: "Organic sesame oil brings out the best in savoury dishes. Its rich, nutty flavour elevates simple ingredients, making them taste incredible. From stir-fries to dips, here are seven must-try recipes.…",
        content: "Full content would go here...",
        date: "March 6, 2025",
        category: "Recipes",
        image: "/images/product_sesame.jpg"
    },
    {
        id: "r3",
        title: "Traditional Pickles Made Easy with Cold-Pressed Mustard Oil",
        slug: "traditional-pickles-cold-pressed-mustard-oil",
        excerpt: "Cold-pressed mustard oil is an essential ingredient in traditional Indian pickles. It not only adds depth of flavour but also acts as a natural preservative, keeping pickles fresh for months.…",
        content: "Full content would go here...",
        date: "March 6, 2025",
        category: "Recipes",
        image: "/images/product_mustard.jpg"
    },
    {
        id: "r4",
        title: "Healthier Desserts with Extra Virgin Coconut Oil: Recipes You’ll Love",
        slug: "healthier-desserts-extra-virgin-coconut-oil",
        excerpt: "Extra virgin coconut oil isn’t just a healthy alternative—it enhances desserts with a light, natural sweetness. Whether you’re baking, stirring, or setting your treats, this oil adds a rich texture…",
        content: "Full content would go here...",
        date: "March 4, 2025",
        category: "Recipes",
        image: "/images/product_coconut.jpg"
    },
    {
        id: "r5",
        title: "5 Delicious Recipes Using Wooden Cold-Pressed Groundnut Oil",
        slug: "5-delicious-recipes-groundnut-oil",
        excerpt: "Wooden cold-pressed groundnut oil isn’t just a healthier choice—it’s a flavour booster. Thanks to its high smoke point and rich, nutty taste, this oil is perfect for Indian and international…",
        content: "Full content would go here...",
        date: "March 2, 2025",
        category: "Recipes",
        image: "/images/product_groundnut.jpg"
    },
    {
        id: "r6",
        title: "Asian Delights: How to Use Sesame Oil for Wok Cooking",
        slug: "asian-delights-sesame-oil-wok",
        excerpt: "What’s the secret to making restaurant-quality stir-fries at home? It all starts with the right oil. And when it comes to Asian cooking, nothing beats sesame oil for wok cooking.…",
        content: "Full content would go here...",
        date: "March 1, 2025",
        category: "Recipes",
        image: "/images/product_sesame.jpg"
    },

    // HEALTH BENEFITS
    {
        id: "h1",
        title: "Healing with Heat: Mustard Oil in Indian Home Remedies",
        slug: "healing-with-heat-mustard-oil",
        excerpt: "Indian homes have always had their own pharmacy—the kitchen. Among all the jars and bottles, mustard oil has held a permanent spot. More than just a cooking medium, it has…",
        content: "Full content would go here...",
        date: "July 29, 2025",
        category: "Health Benefits",
        image: "/images/product_mustard.jpg"
    },
    {
        id: "h2",
        title: "Homemade Remedies Using Cold Pressed Mustard Oil",
        slug: "homemade-remedies-cold-pressed-mustard-oil",
        excerpt: "If you grew up in an Indian household, chances are you’ve already experienced the power of mustard oil. From head massages to homemade remedies for cold and joint pain—this oil…",
        content: "Full content would go here...",
        date: "July 29, 2025",
        category: "Health Benefits",
        image: "/images/product_mustard.jpg"
    },
    {
        id: "h3",
        title: "How to Incorporate Groundnut Oil Into a Weight Loss-Friendly Diet",
        slug: "groundnut-oil-weight-loss",
        excerpt: "Trying to eat better without giving up actual food? You're not alone. Cutting calories is one thing. Cutting taste is another. That’s where cooking oils enter the chat. You’ve probably…",
        content: "Full content would go here...",
        date: "April 18, 2025",
        category: "Health Benefits",
        image: "/images/product_groundnut.jpg"
    },
    {
        id: "h4",
        title: "What Makes Unrefined Almond Oil So Effective for Skin Health?",
        slug: "unrefined-almond-oil-skin-health",
        excerpt: "Tried a dozen creams and still waking up with dry, cranky skin? You’re not alone. Sometimes, the solution isn’t a new product—it’s an old one you’ve overlooked. That’s where unrefined…",
        content: "Full content would go here...",
        date: "April 18, 2025",
        category: "Health Benefits",
        image: "/images/product_almond.jpg"
    },
    {
        id: "h5",
        title: "Is Almond Oil a Natural Solution for Chronic Inflammation?",
        slug: "almond-oil-chronic-inflammation",
        excerpt: "Almond oil has quietly moved from grandma’s stash to the spotlight. It’s everywhere now—on shelves, in skincare, and even in smoothies. But here’s the question worth asking: is almond oil…",
        content: "Full content would go here...",
        date: "April 18, 2025",
        category: "Health Benefits",
        image: "/images/product_almond.jpg"
    },
    {
        id: "h6",
        title: "Does Almond Oil Help with Dry Skin? A Complete Guide",
        slug: "almond-oil-dry-skin-guide",
        excerpt: "Dry skin is more than just an inconvenience; it’s uncomfortable, itchy, and sometimes even painful. If you’re constantly battling flaky patches, rough texture, or that tight feeling after washing your…",
        content: "Full content would go here...",
        date: "March 6, 2025",
        category: "Health Benefits",
        image: "/images/product_almond.jpg"
    },
    {
        id: "h7",
        title: "The Heart-Healthy Benefits of Wooden Cold-Pressed Groundnut Oil",
        slug: "heart-healthy-groundnut-oil",
        excerpt: "Groundnut oil, also known as peanut oil, is a popular cooking oil known for its mild flavour and versatility. But did you know that wooden cold-pressed groundnut oil can offer…",
        content: "Full content would go here...",
        date: "March 6, 2025",
        category: "Health Benefits",
        image: "/images/product_groundnut.jpg"
    },
    {
        id: "h8",
        title: "Why Extra Virgin Coconut Oil is a Superfood for Your Skin and Hair ?",
        slug: "coconut-oil-superfood-skin-hair",
        excerpt: "Extra virgin coconut oil has been celebrated for centuries as a multi-purpose wonder product. While it has long been a staple in kitchens for its health benefits when consumed, extra…",
        content: "Full content would go here...",
        date: "March 6, 2025",
        category: "Health Benefits",
        image: "/images/product_coconut.jpg"
    },

    // GENERAL
    {
        id: "g1",
        title: "Is Wood-Pressed Sunflower Oil Healthy? 10 Benefits You Should Know",
        slug: "wood-pressed-sunflower-oil-benefits",
        excerpt: "If you're trying to switch to a lighter, cleaner cooking oil, you’ve probably wondered: Is wood-pressed sunflower oil healthy? The short answer is yes — especially when it’s made the…",
        content: "Full content would go here...",
        date: "January 30, 2026",
        category: "General",
        image: "/images/card_sunflower.png"
    },
    {
        id: "g2",
        title: "Wood-Pressed White Sesame Oil Benefits, Uses & How to Choose the Right One",
        slug: "white-sesame-oil-benefits",
        excerpt: "If you’ve been searching for a clean, flavorful oil for everyday cooking, you’ve probably come across wood-pressed white sesame oil. It’s gaining attention for good reasons. The version from EKAS…",
        content: "Full content would go here...",
        date: "January 28, 2026",
        category: "General",
        image: "/images/product_sesame.jpg"
    },
    {
        id: "g3",
        title: "A2 Gir Cow Ghee vs Regular Ghee: What’s the Real Difference?",
        slug: "a2-gir-cow-ghee-vs-regular",
        excerpt: "Ghee is comfort. It’s tradition. It’s that warm smell that fills your kitchen in seconds. But today, the debate is loud: A2 Gir Cow Ghee vs Regular Ghee—which is truly…",
        content: "Full content would go here...",
        date: "January 2, 2026",
        category: "General",
        image: "/images/product_ghee.jpg"
    },
    {
        id: "g4",
        title: "How Cold Pressed Organic Sesame Oil Supports Skin, Heart & Digestion",
        slug: "organic-sesame-oil-health",
        excerpt: "Looking for an all-in-one oil that works for your food, skin, and wellness? You’re not alone. Many are now switching to organic sesame oil cold pressed for its incredible versatility…",
        content: "Full content would go here...",
        date: "December 19, 2025",
        category: "General",
        image: "/images/product_sesame.jpg"
    },
    {
        id: "g5",
        title: "Best Places to Buy Cold Pressed Mustard Oil in India",
        slug: "buy-cold-pressed-mustard-oil-india",
        excerpt: "Wondering what's cold pressed mustard oil and where to buy and how to know if it’s fresh, authentic, and safe? You're not alone. With shelves flooded with refined oils and…",
        content: "Full content would go here...",
        date: "August 18, 2025",
        category: "General",
        image: "/images/product_mustard.jpg"
    },
    {
        id: "g6",
        title: "How to Identify High-Quality Mustard Oil: A Buyer’s Guide",
        slug: "identify-quality-mustard-oil",
        excerpt: "Mustard oil is a common item in many Indian kitchens—but not all bottles are the same. With so many choices in the market, it's easy to get confused. This buyer’s…",
        content: "Full content would go here...",
        date: "August 18, 2025",
        category: "General",
        image: "/images/product_mustard.jpg"
    },
    {
        id: "g7",
        title: "How Mustard Essential Oil Can Transform Your Daily Routine",
        slug: "mustard-essential-oil-routine",
        excerpt: "Ever wondered why your grandmother swore by mustard oil? There’s a reason it’s been a trusted name in Indian homes for generations. From cooking to skincare, mustard essential oil holds…",
        content: "Full content would go here...",
        date: "July 29, 2025",
        category: "General",
        image: "/images/product_mustard.jpg"
    },
    {
        id: "g8",
        title: "Which Is Better for Frying? A Look at Cold-Pressed vs Refined Groundnut Oil",
        slug: "frying-groundnut-oil-comparison",
        excerpt: "Frying makes or breaks a dish. The oil you choose? That’s half the battle won—or lost. With so many options on the shelf, it’s easy to get lost in the…",
        content: "Full content would go here...",
        date: "April 18, 2025",
        category: "General",
        image: "/images/product_groundnut.jpg"
    },
    {
        id: "g9",
        title: "Is Wood Pressed Mustard Oil Just a Trend or a Timeless Technique?",
        slug: "wood-pressed-trend-vs-time",
        excerpt: "Let’s start with a question no one’s asking out loud—is wood pressed mustard oil actually better, or is it just another fancy label slapped on a bottle to charge more?…",
        content: "Full content would go here...",
        date: "April 15, 2025",
        category: "General",
        image: "/images/product_mustard.jpg"
    },
    {
        id: "g10",
        title: "10 Unexpected Household Uses of Mustard Oil",
        slug: "household-uses-mustard-oil",
        excerpt: "Mustard oil has lived quietly in kitchen corners, mostly used for frying or pickling. But here’s the thing—it does a lot more. Old-school families already know this, but for many,…",
        content: "Full content would go here...",
        date: "April 7, 2025",
        category: "General",
        image: "/images/product_mustard.jpg"
    }
];
