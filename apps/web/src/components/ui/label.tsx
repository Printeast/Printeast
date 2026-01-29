"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const baseLabel = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => {
    return <label ref={ref} className={cn(baseLabel, className)} {...props} />;
});
Label.displayName = "Label";

export { Label };
