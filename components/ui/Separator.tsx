import { cn } from "@/lib/utils";

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-px w-full bg-white/[0.06]", className)} {...props} />;
}

export function VerticalSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("w-px h-6 bg-white/[0.06]", className)} {...props} />;
}
