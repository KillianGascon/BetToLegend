"use client";
import Image from "next/image";

export default function Logo({ src, alt, size = 24 }: Readonly<{ src?: string; alt: string; size?: number }>) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size}px`}
          className="object-contain rounded-lg"
        />
      ) : (
        <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-white font-montserrat font-bold text-xs">
            {alt.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

