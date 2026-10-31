import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "gold" | "white" | "slate";
  className?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
const colorMap = {
  gold: "border-geo-gold/30 border-t-geo-gold",
  white: "border-white/30 border-t-white",
  slate: "border-geo-slate/30 border-t-geo-slate",
};

export function Spinner({ size = "md", color = "gold", className }: SpinnerProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2", sizeMap[size], colorMap[color], className)}
      role="status"
      aria-label="Loading"
    />
  );
}
