import { getTenantId } from "../utils/async-context";
import { prisma as basePrisma } from "@repo/database";

export const prisma = basePrisma.$extends({
    query: {
        $allModels: {
            async $allOperations({ model, args, query }: { model: any; args: any; query: any }) {
                // List of models that MUST be tenant isolated
                const tenantModels = [
                    "Product", "Order", "Design", "Category",
                    "Vendor", "Review", "Notification"
                ];

                if (tenantModels.includes(model)) {
                    const tenantId = getTenantId();

                    if (tenantId && args !== undefined && typeof args === 'object') {
                        // Cast to any to access 'where' on generic args safely
                        const queryArgs = args as any;

                        if (!queryArgs.where) {
                            queryArgs.where = {};
                        }
                        if (queryArgs.where.tenantId === undefined) {
                            queryArgs.where.tenantId = tenantId;
                        }
                    }
                }
                return query(args);
            },
        },
    },
});
