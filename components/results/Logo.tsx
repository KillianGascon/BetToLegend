// components/results/Logo.tsx
"use client";
import Image from "next/image";

export default function Logo({ src, alt, size = 24 }: Readonly<{ src?: string; alt: string; size?: number }>) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={src || "/placeholder-team.png"}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-contain rounded"
      />
    </div>
  );
}

