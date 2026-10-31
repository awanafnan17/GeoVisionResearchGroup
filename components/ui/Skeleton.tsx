import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ className, width, height, rounded }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/[0.06]",
        rounded ? "rounded-full" : "rounded-lg",
        className
      )}
      style={{ width, height }}
    />
  );
}
