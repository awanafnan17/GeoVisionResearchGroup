import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-geo-slate-light"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-geo-slate">{leftIcon}</div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-none border bg-[#0B1320] px-3.5 py-2 text-sm font-sans text-geo-white placeholder:text-geo-slate/60 transition-colors duration-150",
              "focus:outline-none focus:border-geo-gold focus:ring-1 focus:ring-geo-gold/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-[#A93528]" : "border-white/15 hover:border-white/25",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-geo-slate">{rightIcon}</div>
          )}
        </div>
        {error && <p className="font-mono text-[11px] text-[#E07A6F]">{error}</p>}
        {hint && !error && <p className="font-mono text-[11px] text-geo-slate">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
