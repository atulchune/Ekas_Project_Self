import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api/catalog";
import { mapDetailToViewModel } from "@/lib/mappers/product";
import { ApiError } from "@/lib/api/config";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let product;
    try {
        product = mapDetailToViewModel(await getProductBySlug(slug));
    } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
            notFound();
        }
        throw err;
    }

    return <ProductDetailClient product={product} />;
}
