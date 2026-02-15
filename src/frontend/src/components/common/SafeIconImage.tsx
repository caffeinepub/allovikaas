import { useState, useEffect } from 'react';

interface SafeIconImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * Image component with safe fallback handling for missing or invalid sources.
 * Supports both PNG and SVG fallbacks with single-attempt error recovery.
 */
export default function SafeIconImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/assets/generated/icon-fallback.dim_128x128.png',
}: SafeIconImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  // Reset error state when src prop changes
  useEffect(() => {
    setImgSrc(src);
    setHasErrored(false);
  }, [src]);

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Validate src is not empty or invalid
  const validSrc = imgSrc && imgSrc.trim() !== '' ? imgSrc : fallbackSrc;

  return (
    <img
      src={validSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
