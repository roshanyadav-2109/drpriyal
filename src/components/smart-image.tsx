"use client";

import * as React from "react";
import Image from "next/image";

/**
 * Tries `primarySrc` first and falls back to `fallbackSrc` if it fails to load.
 *
 * Used for the doctor's portrait: drop her real photo at `public/dr-priyal.jpg`
 * and it appears automatically. Until then, a professional placeholder is shown.
 * (Her LinkedIn photo can't be fetched automatically — LinkedIn blocks it.)
 */
export function SmartImage({
  primarySrc,
  fallbackSrc,
  alt,
  className,
  sizes,
  priority,
}: {
  primarySrc: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [src, setSrc] = React.useState(primarySrc);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
    />
  );
}
