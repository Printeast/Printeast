"use client";

import { useParams } from "next/navigation";
import { OrdersClient } from "../../seller/orders/OrdersClient";

export default function CreatorOrdersPage() {
    const params = useParams();
    const locale = params.locale as string;

    return (
        <OrdersClient
            role="CREATOR"
            basePath="/creator"
            pageTitle="Artwork Orders"
            pageDescription="Track sales and earnings from your published designs."
            inventoryPath={`/${locale}/creator/products`}
        />
    );
}
