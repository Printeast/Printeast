"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit2, Trash2, ExternalLink, Paintbrush } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { designService } from "@/services/design.service";

interface Design {
    id: string;
    promptText?: string;
    status?: string;
    createdAt?: string;
    imageUrl?: string;
    previewUrl?: string;
}

export function DesignCard({ design }: { design: Design }) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Simple confirmation
        if (!confirm("Are you sure you want to delete this design?")) return;

        // Optimistically hide the card
        setIsVisible(false);

        try {
            await designService.delete(design.id);
            // Refresh in background to sync server state
            router.refresh();
        } catch (error) {
            console.error("Failed to delete design", error);
            alert("Failed to delete design");
            // Restore if it failed
            setIsVisible(true);
        }
    };

    if (!isVisible) return null;

    const editUrl = `/seller/wizard/design?designId=${design.id}`;

    return (
        <div className="group bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 rounded-xl p-3 space-y-3 transition-all relative overflow-hidden">
            {/* Header Row: Date & Status & Menu */}
            <div className="flex items-center justify-between relative z-20">
                <span className="text-[10px] font-medium text-slate-400">
                    {design.createdAt ? new Date(design.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently"}
                </span>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors ${(design.status || "").toUpperCase() === "DRAFT"
                        ? "bg-amber-100 text-amber-700 group-hover:bg-amber-200"
                        : "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200"
                        }`}>
                        {design.status || "Draft"}
                    </span>

                    {/* Dropdown Menu - Stops propagation automatically usually, but button helps */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-6 w-6 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors focus:outline-none text-slate-400 hover:text-slate-600">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href={editUrl} className="cursor-pointer flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" />
                                    <span>Open Design</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href={editUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Open in New Tab</span>
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Click Area */}
            <Link href={editUrl} className="block group/link">
                <div className="h-52 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center relative group-hover:border-blue-100 transition-colors mt-2">
                    {design.previewUrl || design.imageUrl ? (
                        <Image
                            src={design.previewUrl || design.imageUrl || ""}
                            alt="Preview"
                            width={400}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <Paintbrush className="w-5 h-5 text-slate-200" />
                            <span className="text-[10px] text-slate-300 font-medium">No preview</span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
                            <Edit2 className="w-3 h-3 text-blue-600" />
                            <span className="text-[11px] font-bold text-blue-600 uppercase">Edit Design</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-1 mt-3">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {design.promptText || "Untitled Project"}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-full opacity-30" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Ready</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
