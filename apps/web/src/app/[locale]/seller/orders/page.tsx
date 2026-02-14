"use client";

import { OrdersClient } from "./OrdersClient";

export default function SellerOrdersPage() {
    return <OrdersClient role="SELLER" basePath="/seller" />;
}
