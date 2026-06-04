"use client";

import { useState } from "react";

interface NewsImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className: string;
  fallbackSrc: string;
  fallbackClassName?: string;
}

export default function NewsImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc,
  fallbackClassName,
}: NewsImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={fallbackClassName || className}
        loading="lazy"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
