import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-none font-mono uppercase tracking-[0.14em] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-geo-gold focus-visible:ring-offset-1 focus-visible:ring-offset-[#0B1320] disabled:pointer-events-none disabled:opacity-45 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-geo-gold text-[#0B1320] border border-geo-gold hover:bg-geo-gold-light hover:border-geo-gold-light",
        secondary:
          "bg-[#101A2B] text-geo-white border border-white/15 hover:bg-white/[0.06] hover:border-white/30",
        outline:
          "bg-transparent border border-geo-gold/50 text-geo-gold-light hover:bg-geo-gold/10 hover:border-geo-gold",
        ghost:
          "bg-transparent border border-transparent text-geo-slate-light hover:text-geo-white hover:bg-white/[0.04]",
        destructive:
          "bg-[#A93528] text-geo-white border border-[#C94A3B] hover:bg-[#8F2B20] focus-visible:ring-[#E07A6F]",
      },
      size: {
        sm: "h-8 px-3 text-[11px]",
        md: "h-10 px-5 text-xs",
        lg: "h-12 px-7 text-xs",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading ? <span className="shrink-0">{rightIcon}</span> : null}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
