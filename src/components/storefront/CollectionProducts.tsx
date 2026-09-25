import ProductCardWide from "./common/ProductCardWide";
import { DynamicList } from "@/components/ui";

interface Product {
    id: string;
    image: string;
    name: string;
    slug: string;
    notes: string;
    price: string;
    tag?: string;
    collection: string;
    description: string;
    isWishlisted?: boolean;
}

export default function CollectionProducts({
    products,
}: {
    products: Product[];
}) {
    return (
        <DynamicList
            items={products}
            getKey={(product) => product.id}
            className="flex flex-col gap-8 md:gap-10"
            emptyState={<p className="py-10 text-center text-textSecondary">No perfumes found in this collection.</p>}
            renderItem={(product) => (
                <ProductCardWide
                    productId={product.id}
                    image={product.image}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    description={product.description}
                    features="Long-lasting, rich & warm, perfect for evening wear."
                    notes={product.notes}
                    isWishlisted={product.isWishlisted}
                />
            )}
        />
    );
}

