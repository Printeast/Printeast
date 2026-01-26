"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/browser";
import { AlertTriangle, Boxes, Download, Plus } from "lucide-react";

type InventoryItem = {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    base_price?: number;
};

interface Props {
    userEmail: string;
    tenantId: string | null;
    initialInventory: InventoryItem[];
}

export function SellerInventoryClient({ userEmail, tenantId, initialInventory }: Props) {
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
    const [form, setForm] = useState({ name: "", sku: "", price: "", quantity: "0" });
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const lowStock = inventory.filter((i) => i.quantity < 20);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenantId) return;
        setLoading(true);
        try {
            const { data: productRes, error: productErr } = await supabase
                .from("products")
                .insert({
                    tenant_id: tenantId,
                    name: form.name,
                    sku: form.sku,
                    base_price: form.price ? Number(form.price) : null,
                })
                .select("id, name, sku, base_price")
                .single();

            if (productErr || !productRes) throw productErr;

            await supabase.from("inventory").insert({
                product_id: productRes.id,
                quantity: Number(form.quantity || 0),
            });

            setInventory((prev) => [
                {
                    id: productRes.id,
                    name: productRes.name,
                    sku: productRes.sku,
                    base_price: productRes.base_price ? Number(productRes.base_price) : undefined,
                    quantity: Number(form.quantity || 0),
                },
                ...prev,
            ]);

            setForm({ name: "", sku: "", price: "", quantity: "0" });
        } catch (err) {
            console.error("Add SKU error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const header = "name,sku,quantity,base_price";
        const rows = inventory.map((i) => `${csv(i.name)},${csv(i.sku)},${i.quantity},${i.base_price ?? ""}`);
        const csvContent = [header, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "inventory.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role: "SELLER" }}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Inventory</p>
                        <h1 className="text-3xl font-black text-white">Supply & Reorder</h1>
                        <p className="text-slate-400 mt-1">Manage SKUs, stock, and exports directly from Supabase.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleExport} disabled={!inventory.length}>
                            <Download className="h-4 w-4 mr-2" /> Export CSV
                        </Button>
                    </div>
                </div>

                <form
                    onSubmit={handleAdd}
                    className="rounded-2xl border border-white/5 bg-white/5 p-5 grid grid-cols-1 md:grid-cols-5 gap-3"
                >
                    <Input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="SKU"
                        value={form.sku}
                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                        required
                    />
                    <Input
                        placeholder="Base price"
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                    <Input
                        placeholder="Quantity"
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    />
                    <Button type="submit" disabled={loading || !tenantId} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Add SKU
                    </Button>
                </form>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Stock levels</h3>
                            <span className="text-xs text-slate-400">{inventory.length} SKUs</span>
                        </div>
                        {inventory.length === 0 ? (
                            <EmptyState title="No products yet" subtitle="Add a SKU to start tracking inventory." />
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-white/10">
                                <div className="grid grid-cols-5 bg-black/30 px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">
                                    <span>Name</span>
                                    <span>SKU</span>
                                    <span>Stock</span>
                                    <span>Base price</span>
                                    <span className="text-right">Status</span>
                                </div>
                                <div className="divide-y divide-white/10 bg-black/10">
                                    {inventory.map((row) => (
                                        <div key={row.id} className="grid grid-cols-5 px-4 py-3 text-sm text-slate-100">
                                            <span className="font-semibold">{row.name}</span>
                                            <span className="text-slate-300">{row.sku}</span>
                                            <span>{row.quantity}</span>
                                            <span>{row.base_price ? currency(row.base_price) : "-"}</span>
                                            <span className="text-right">
                                                <Badge tone={row.quantity < 20 ? "warning" : "neutral"} text={row.quantity < 20 ? "Low" : "OK"} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-amber-200">
                            <AlertTriangle className="h-4 w-4" />
                            <p className="text-sm">Low stock threshold set to 20 units.</p>
                        </div>
                        <div className="flex items-center gap-2 text-slate-200">
                            <Boxes className="h-4 w-4" />
                            <p className="text-sm">Use “Add SKU” to create products and seed stock.</p>
                        </div>
                        {lowStock.length === 0 ? (
                            <EmptyState title="No low stock" subtitle="All SKUs are above threshold." compact />
                        ) : (
                            <div className="space-y-3">
                                {lowStock.map((item) => (
                                    <div key={item.id} className="rounded-xl bg-black/20 border border-white/5 p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-semibold text-sm">{item.name}</p>
                                            <p className="text-[11px] text-slate-400">{item.sku}</p>
                                        </div>
                                        <Badge tone="warning" text={`${item.quantity} left`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function Badge({ text, tone }: { text: string; tone: "neutral" | "warning" }) {
    const toneClass = tone === "warning" ? "bg-amber-500/20 border-amber-500/40 text-amber-100" : "bg-white/10 border-white/15 text-slate-100";
    return <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${toneClass}`}>{text}</span>;
}

function EmptyState({ title, subtitle, compact }: { title: string; subtitle: string; compact?: boolean }) {
    return (
        <div className={`rounded-2xl border border-dashed border-white/10 bg-black/10 text-slate-200 ${compact ? "p-4" : "p-6"}`}>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
    );
}

function currency(amount: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount || 0);
}

function csv(value: string) {
    if (value.includes(",") || value.includes("\"")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
