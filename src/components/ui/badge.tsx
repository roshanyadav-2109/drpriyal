import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sage-mist text-pine px-3 py-1",
        outline: "border border-sand text-ink-soft px-3 py-1",
        gold: "bg-gold/15 text-[#7a6427] px-3 py-1",
        clay: "bg-blush/40 text-[#9a4d42] px-3 py-1",
        solid: "bg-pine text-ivory px-3 py-1",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
