import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BackendCategory } from "@/lib/api/types";

// Backend categories have no image asset yet — decorative fallbacks keyed by slug.
const IMAGE_BY_SLUG: Record<string, string> = {
    "wood-pressed-oils": "/images/cat-oils.png",
    "ghee": "/images/cat-ghee.png",
    "honey": "/images/cat-seeds.png",
    "preservative-free-foods": "/images/cat-seeds.png",
};
const DEFAULT_IMAGE = "/images/cat-oils.png";

export function Categories({ categories }: { categories: BackendCategory[] }) {
    const displayCategories = categories.filter(c => c.product_count > 0).slice(0, 3);

    if (displayCategories.length === 0) return null;

    return (
        <section className="py-24 bg-background">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 font-serif">Our Collections</h2>
                    <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
                    <p className="text-muted-foreground text-lg">Handpicked categories to nurture your health with the finest organic produce.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayCategories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            className="group relative h-[450px] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                        >
                            <Image
                                src={IMAGE_BY_SLUG[cat.slug] ?? DEFAULT_IMAGE}
                                alt={cat.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-3xl font-bold text-white mb-2 font-serif">{cat.name}</h3>
                                <p className="text-gray-200 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-4 group-hover:translate-y-0 line-clamp-2">
                                    {cat.description}
                                </p>
                                <div className="flex items-center text-secondary font-bold text-sm tracking-widest uppercase group-hover:text-white transition-colors">
                                    Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
