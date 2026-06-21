import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-sand bg-paper px-4 py-2 text-[0.95rem] text-ink shadow-sm transition-colors placeholder:text-ink-faint focus-visible:border-pine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/20 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-sand bg-paper px-4 py-3 text-[0.95rem] text-ink shadow-sm transition-colors placeholder:text-ink-faint focus-visible:border-pine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Input, Textarea };
