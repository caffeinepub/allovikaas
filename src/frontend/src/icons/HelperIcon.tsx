export default function HelperIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" fill="transparent" />
      {/* Left hand */}
      <ellipse cx="45" cy="64" rx="18" ry="22" fill="#F97316" transform="rotate(-15 45 64)" />
      <path d="M38 52Q35 48 32 50L28 54Q26 56 28 58L35 65" fill="#EA580C" />
      {/* Right hand */}
      <ellipse cx="83" cy="64" rx="18" ry="22" fill="#F97316" transform="rotate(15 83 64)" />
      <path d="M90 52Q93 48 96 50L100 54Q102 56 100 58L93 65" fill="#EA580C" />
      {/* Heart */}
      <path
        d="M64 75L54 65Q50 61 50 56Q50 51 54 47Q58 43 64 47Q70 43 74 47Q78 51 78 56Q78 61 74 65L64 75Z"
        fill="#EF4444"
      />
      <path
        d="M64 72L56 64Q53 61 53 57Q53 53 56 50Q59 47 64 50Q69 47 72 50Q75 53 75 57Q75 61 72 64L64 72Z"
        fill="#FCA5A5"
      />
    </svg>
  );
}
