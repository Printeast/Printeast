import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
            },
            tone: {
                default: "",
                info: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
                positive: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
                warning: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
                destructive: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
                neutral: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
            }
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, tone, ...props }: BadgeProps) {
    // If tone is provided, it overrides variant styling logic for this specific use case
    return (
        <div className={cn(badgeVariants({ variant }), tone ? badgeVariants({ tone }) : "", className)} {...props} />
    )
}

export { Badge, badgeVariants }
