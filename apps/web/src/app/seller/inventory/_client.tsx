"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/utils/supabase/browser";
import { IconBoxes, IconDownload, IconPlus, IconWarning } from "@/components/ui/icons";

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
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const lowStock = inventory.filter((i) => i.quantity < 20);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenantId) return;
        setLoading(true);
        setMessage(null);
        setError(null);
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
            setMessage("SKU added successfully.");
        } catch (err) {
            console.error("Add SKU error", err);
            setError("Could not add SKU. Check Supabase RLS or credentials.");
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
            <div className="flex flex-col gap-8 dash-text">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Inventory</p>
                        <h1 className="text-3xl font-black dash-text">Supply & Reorder</h1>
                        <p className="dash-muted mt-1">Manage SKUs, stock, and exports directly from Supabase.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={handleExport} disabled={!inventory.length}>
                            <IconDownload className="h-4 w-4 mr-2" /> Export CSV
                        </Button>
                    </div>
                </div>

                {(message || error) && (
                    <div className={`rounded-xl border px-4 py-3 ${error ? "border-red-500/40 bg-red-500/10 text-[color:var(--dash-text)]" : "border-emerald-500/30 bg-emerald-500/10 text-[color:var(--dash-text)]"}`}>
                        {error || message}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>New SKU</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
                                <IconPlus className="h-4 w-4 mr-2" /> Add SKU
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Stock levels</CardTitle>
                                <Badge>{inventory.length} SKUs</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {inventory.length === 0 ? (
                                <EmptyState title="No products yet" subtitle="Add a SKU to start tracking inventory." />
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Base price</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {inventory.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell className="font-semibold">{row.name}</TableCell>
                                                <TableCell className="dash-muted">{row.sku}</TableCell>
                                                <TableCell>{row.quantity}</TableCell>
                                                <TableCell>{row.base_price ? currency(row.base_price) : "-"}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge tone={row.quantity < 20 ? "warning" : "neutral"}>{row.quantity < 20 ? "Low" : "OK"}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stock alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-[color:var(--dash-accent-start)]">
                                <IconWarning className="h-4 w-4" />
                                <p className="text-sm">Low stock threshold set to 20 units.</p>
                            </div>
                            <div className="flex items-center gap-2 dash-muted-strong">
                                <IconBoxes className="h-4 w-4" />
                                <p className="text-sm">Use “Add SKU” to create products and seed stock.</p>
                            </div>
                            {lowStock.length === 0 ? (
                                <EmptyState title="No low stock" subtitle="All SKUs are above threshold." compact />
                            ) : (
                                <div className="space-y-3">
                                    {lowStock.map((item) => (
                                        <div key={item.id} className="rounded-xl border dash-border dash-panel p-3 flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-sm dash-text">{item.name}</p>
                                                <p className="text-[11px] dash-muted">{item.sku}</p>
                                            </div>
                                            <Badge tone="warning">{`${item.quantity} left`}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

function EmptyState({ title, subtitle, compact }: { title: string; subtitle: string; compact?: boolean }) {
    return (
        <div className={`rounded-2xl border border-dashed dash-border dash-panel ${compact ? "p-4" : "p-6"}`}>
            <p className="font-semibold">{title}</p>
            <p className="text-sm dash-muted">{subtitle}</p>
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
