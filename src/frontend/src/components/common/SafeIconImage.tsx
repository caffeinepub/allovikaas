import { useState } from 'react';

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
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // Use fallback if src is empty or invalid
  const finalSrc = !src || src.trim() === '' ? fallbackSrc : imgSrc;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
