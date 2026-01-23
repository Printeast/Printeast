import { AsyncLocalStorage } from "node:async_hooks";

export const paramsStore = new AsyncLocalStorage<Map<string, any>>();

export const getTenantId = (): string | undefined => {
    const store = paramsStore.getStore();
    return store?.get("tenantId");
};

export const runWithTenant = <T>(tenantId: string, callback: () => T): T => {
    const store = new Map<string, any>();
    store.set("tenantId", tenantId);
    return paramsStore.run(store, callback);
};
