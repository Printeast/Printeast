import { ProductDetailsClient } from "./_client";

// Mock data for server side (or fetch from DB)
const MOCK_PRODUCTS_DETAILS: Record<string, any> = {
    "1": {
        id: "1",
        name: "Premium Matte Paper Poster",
        category: "Posters",
        description: "Museum-quality posters made on thick and durable matte paper.",
        price: 533.67,
        currency: "INR",
        shipping: 528.84,
        images: [
            "https://images.unsplash.com/photo-1582140163304-405494292150?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
        ],
        orientations: ["Vertical", "Horizontal"],
        sizes: ["13x18 cm / 5x7\"", "21x30 cm / 8x12\"", "30x40 cm / 12x16\"", "50x70 cm / 20x28\"", "70x100 cm / 28x40\""],
        isBestseller: true,
        provider: "Gelato"
    },
    // Inventory Mock Items
    "mock-1": {
        id: "mock-1",
        name: "Unisex Heavy Blend™ Crewneck Sweatshirt",
        category: "Men's clothing",
        description: "Pure comfort in a garment. These garments are made from polyester and cotton.",
        price: 33.00,
        currency: "USD",
        shipping: 5.99,
        images: [
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["S", "M", "L", "XL", "2XL"],
        isBestseller: true,
        provider: "Gildan"
    },
    "mock-2": {
        id: "mock-2",
        name: "Premium Fine Art Matte Paper",
        category: "Wall art",
        description: "Museum-quality posters made on thick and durable matte paper.",
        price: 25.00,
        currency: "USD",
        shipping: 4.50,
        images: [
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["18x24", "24x36"],
        provider: "Printeast Art"
    },
    "mock-3": {
        id: "mock-3",
        name: "Stainless Steel Water Bottle",
        category: "Mugs & Bottle",
        description: "High-quality stainless steel water bottle.",
        price: 28.00,
        currency: "USD",
        shipping: 6.00,
        images: [
            "https://images.unsplash.com/photo-1602143407151-01114192003b?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["500ml", "750ml"],
        provider: "Orca"
    },
    "default": {
        id: "default",
        name: "Product Not Found",
        category: "General",
        description: "This product description is unavailable.",
        price: 0.00,
        currency: "USD",
        shipping: 0.00,
        images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"],
        sizes: ["One Size"],
        provider: "Unknown"
    }
};

export default async function ProductDetailsPage({ params }: { params: Promise<{ productId: string }> }) {
    // In a real app, fetch from DB
    const { productId } = await params;
    const product = MOCK_PRODUCTS_DETAILS[productId] || MOCK_PRODUCTS_DETAILS["default"];

    // Simulate data fetch
    // const supabase = await createClient();

    return <ProductDetailsClient product={{ ...product, id: productId }} />;
}
