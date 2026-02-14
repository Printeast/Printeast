
import { prisma } from "@repo/database";
import { notFound } from "next/navigation";
import { CustomerDesignClient } from "./_client";

interface PageProps {
    searchParams: Promise<{
        productId?: string;
        designId?: string;
        fresh?: string;
    }>;
}

export default async function CustomerDesignPage({ searchParams }: PageProps) {
    const { productId, designId, fresh } = await searchParams;

    if (!productId && !designId) {
        return <div className="flex items-center justify-center h-screen text-slate-500">Missing Product or Design ID</div>;
    }

    let product = null;

    if (productId) {
        const p = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                images: true,
                basePrice: true,
                currency: true
            }
        });

        if (p) {
            product = {
                id: p.id,
                name: p.name,
                image: p.images[0] || "",
                price: Number(p.basePrice),
                currency: p.currency
            };
        }
    }

    if (!product) {
        return notFound();
    }

    return (
        <div className="fixed inset-0 bg-white z-50">
            <CustomerDesignClient
                product={product}
                designId={designId as string | undefined}
                fresh={fresh === "true"}
            />
        </div>
    );
}
