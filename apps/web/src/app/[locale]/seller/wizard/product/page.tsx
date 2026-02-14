import { getGlobalCatalog } from "../../_data";
import { WizardCatalogClient } from "./_client";

export default async function WizardProductPage() {
    const products = await getGlobalCatalog();
    return <WizardCatalogClient initialProducts={products} />;
}
