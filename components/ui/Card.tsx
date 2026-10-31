import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered" | "glass";
  hoverable?: boolean;
}

export function Card({ className, variant = "default", hoverable, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-none",
        {
          "bg-[#101A2B] border border-white/10": variant === "default",
          "bg-[#101A2B] border border-white/15": variant === "elevated",
          "bg-[#0B1320]/60 border border-white/15": variant === "bordered",
          "bg-[#0B1320]/90 border border-white/10": variant === "glass",
        },
        hoverable && "transition-colors duration-200 hover:border-geo-gold/45",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-3.5 border-b border-white/10 bg-[#0B1320]/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-mono text-xs font-semibold uppercase tracking-[0.15em] text-geo-white",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-geo-slate-light mt-1 font-sans", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-3 border-t border-white/10 bg-[#0B1320]/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
