
"use client";

import { useRouter } from "next/navigation";
import { DesignStudio } from "@/components/design-studio";

interface CustomerDesignClientProps {
    product: {
        id: string;
        name: string;
        image: string;
        price: number;
        currency?: string;
    };
    designId?: string | undefined;
    fresh?: boolean;
}

export function CustomerDesignClient({ product, designId, fresh }: CustomerDesignClientProps) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const handleAddToOrder = () => {
        // Redirect to the customer draft order flow (mimicking seller flow)
        router.push("/customer/orders/draft/G-260210012152");
    };

    return (
        <DesignStudio
            initialMode="standalone"
            designId={designId}
            startFresh={fresh ?? false}
            productImage={product.image}
            productName={product.name}
            headerConfig={{
                theme: "light",
                price: product.price,
                currency: product.currency || "$",
                onBack: handleBack,
                onAddToOrder: handleAddToOrder,
            }}
        />
    );
}
