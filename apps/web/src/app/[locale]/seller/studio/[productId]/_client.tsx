"use client";

import { useRouter } from "next/navigation";
import { DesignStudio } from "@/components/design-studio";

interface StudioClientProps {
    product: {
        id: string;
        name: string;
        image: string;
        price: number;
        category: string;
    };
}

export function StudioClient({ product }: StudioClientProps) {
    const router = useRouter();

    const handleBack = () => {
        // Navigate back to product details
        router.push(`/seller/wizard/product/${product.id}`);
    };

    const handleAddToOrder = () => {
        // Redirection to the Draft Order page (mock ID based on screenshot)
        router.push("/seller/orders/draft/G-260210012152");
    };

    return (
        <div className="h-screen w-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
            <DesignStudio
                productName={product.name}
                productImage={product.image}
                startFresh={true}
                headerConfig={{
                    onBack: handleBack,
                    onAddToOrder: handleAddToOrder,
                    onSaveDesign: () => alert("Design Saved!"),
                    onPreview: () => alert("Preview Mode"),
                    price: product.price,
                    currency: "$",
                    theme: 'dark', // Enable dark mode header
                    breadcrumb: [
                        { label: product.category, href: "#" },
                        { label: product.name, href: "#" }
                    ]
                }}
            />
        </div>
    );
}
