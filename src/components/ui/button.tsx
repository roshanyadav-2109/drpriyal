import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-[1.05em]",
  {
    variants: {
      variant: {
        primary: "bg-pine text-ivory hover:bg-pine-deep",
        accent: "bg-clay text-white hover:brightness-95",
        dark: "bg-ink text-ivory hover:bg-pine-deep",
        outline:
          "border border-pine/40 bg-transparent text-pine hover:border-pine hover:bg-sage-mist",
        secondary: "bg-bone text-ink hover:bg-sand border border-sand",
        ghost: "text-ink hover:bg-bone",
        gold: "bg-gold text-ink hover:brightness-105",
        link: "text-pine underline-offset-4 hover:underline rounded-none px-0",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        default: "h-11 px-5 text-[0.95rem]",
        lg: "h-12 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
