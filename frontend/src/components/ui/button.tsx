import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'emerald' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const variants = {
      primary: "bg-brand-emerald text-brand-cream hover:bg-brand-emerald/90 shadow-md",
      gold: "bg-brand-gold text-brand-charcoal hover:bg-brand-emerald hover:text-brand-cream font-bold shadow-lg",
      outline: "border-2 border-brand-emerald text-brand-emerald hover:bg-brand-emerald hover:text-brand-cream",
      ghost: "hover:bg-brand-sand/50 text-brand-charcoal",
      emerald: "bg-brand-emerald text-brand-cream hover:bg-brand-gold hover:text-brand-charcoal border-none shadow-md",
      link: "text-brand-emerald underline-offset-4 hover:underline bg-transparent shadow-none p-0",
    };

    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 px-4 text-xs",
      lg: "h-14 px-10 text-lg rounded-luxury",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] ornate-shape ornate-border",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
