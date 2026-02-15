import { useState, useEffect } from 'react';

interface SafeIconImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * SafeIconImage component with enhanced validation and error handling.
 * - Validates src before rendering to prevent broken image placeholders
 * - Falls back to a default SVG icon on error or invalid src
 * - Resets error state when src prop changes
 * - Prevents infinite error loops with single-attempt recovery
 */
export default function SafeIconImage({ src, alt, className = '', fallbackSrc = '/assets/generated/icon-fallback.dim_128x128.svg' }: SafeIconImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    // Validate src before setting
    if (!src || typeof src !== 'string' || src.trim() === '') {
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    // Only attempt fallback once to prevent infinite loops
    if (!hasError && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}
