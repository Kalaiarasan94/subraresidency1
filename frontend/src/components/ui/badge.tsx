import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-brand-emerald text-brand-cream hover:bg-brand-emerald/80",
    secondary: "border-transparent bg-brand-sand text-brand-charcoal hover:bg-brand-sand/80",
    outline: "text-brand-charcoal border-brand-sand",
    success: "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80",
    warning: "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80",
    destructive: "border-transparent bg-red-100 text-red-800 hover:bg-red-100/80",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:ring-offset-2 font-manrope",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
