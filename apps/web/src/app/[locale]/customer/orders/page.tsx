import { OrdersClient } from "../../seller/orders/OrdersClient";

export default async function CustomerOrdersPage() {
    return (
        <OrdersClient
            role="CUSTOMER"
            basePath="/customer"
            pageTitle="My Orders"
            pageDescription="Track and manage your personal orders."
        />
    );
}
