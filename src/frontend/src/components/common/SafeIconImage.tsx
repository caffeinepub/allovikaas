import { useState, useEffect } from 'react';

interface SafeIconImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = '/assets/generated/icon-fallback.dim_128x128.svg';

export default function SafeIconImage({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
}: SafeIconImageProps) {
  // Check if src is empty/whitespace/undefined immediately
  const isInvalidSrc = !src || typeof src !== 'string' || src.trim() === '';
  const initialSrc = isInvalidSrc ? fallbackSrc : src;
  
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);

  // Reset error state when src or fallbackSrc changes
  useEffect(() => {
    const newSrc = !src || typeof src !== 'string' || src.trim() === '' ? fallbackSrc : src;
    setImgSrc(newSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    // Only switch to fallback once to prevent infinite loops
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Icon'}
      className={className}
      onError={handleError}
    />
  );
}
