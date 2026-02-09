import { StudioClient } from "./_client";

// Mock Data (Shared/Mirrored from Product Page for consistency)
const MOCK_PRODUCTS_DATA: Record<string, any> = {
    "1": {
        id: "1",
        name: "Premium Matte Paper Poster",
        category: "Posters",
        price: 533.67,
        image: "https://images.unsplash.com/photo-1582140163304-405494292150?auto=format&fit=crop&w=800&q=80"
    },
    "mock-1": {
        id: "mock-1",
        name: "Unisex Heavy Blend™ Crewneck Sweatshirt",
        category: "Men's clothing",
        price: 33.00,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    },
    "mock-2": {
        id: "mock-2",
        name: "Premium Fine Art Matte Paper",
        category: "Wall art",
        price: 25.00,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
    },
    // Fallback
    "default": {
        id: "default",
        name: "Untitled Product",
        category: "General",
        price: 0.00,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    }
};

export default async function StudioPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    const product = MOCK_PRODUCTS_DATA[productId] || MOCK_PRODUCTS_DATA["default"];

    return <StudioClient product={{ ...product, id: productId }} />;
}
