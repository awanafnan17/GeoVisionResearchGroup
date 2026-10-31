import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
  xl: "h-16 w-16 text-base",
};

const pixelMap = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function Avatar({ src, alt, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt || name || "Avatar"}
        width={pixelMap[size]}
        height={pixelMap[size]}
        unoptimized
        className={cn("rounded-none border border-white/15 object-cover", sizeMap[size], className)}
      />
    );
  }

  const initials = name ? getInitials(name) : "?";

  return (
    <div
      className={cn(
        "rounded-none flex items-center justify-center font-mono font-semibold tracking-wider text-geo-gold bg-[#101A2B] border border-geo-gold/40",
        sizeMap[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
