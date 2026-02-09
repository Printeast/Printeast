"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export interface ActionMenuOption {
    icon: ReactNode;
    title: string;
    description: string;
    href?: string;
    onClick?: () => void;
}

interface ActionMenuButtonProps {
    label: string;
    options: ActionMenuOption[];
}

export function ActionMenuButton({ label, options }: ActionMenuButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-9 px-4 bg-[#111827] hover:bg-[#1f2937] text-white rounded-full shadow-sm font-medium text-sm gap-2 transition-all">
                    <span>{label}</span>
                    <Plus className="w-4 h-4 ml-1 opacity-70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[320px] p-2 rounded-xl shadow-xl border-slate-100/50 bg-white/95 backdrop-blur-sm"
                sideOffset={8}
            >
                <div className="flex flex-col gap-1">
                    {options.map((option, index) => {
                        const Content = (
                            <div className="flex items-start gap-4 p-2 cursor-pointer group">
                                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-500 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600 transition-colors">
                                    {option.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                                        {option.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5 group-hover:text-blue-600/70 transition-colors">
                                        {option.description}
                                    </p>
                                </div>
                            </div>
                        );

                        return (
                            <DropdownMenuItem
                                key={index}
                                className="focus:bg-transparent p-0 outline-none"
                                asChild
                            >
                                {option.href ? (
                                    <Link href={option.href} className="w-full block">
                                        {Content}
                                    </Link>
                                ) : (
                                    <div onClick={option.onClick} className="w-full">
                                        {Content}
                                    </div>
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
