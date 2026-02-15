export default function AgricultureIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" fill="transparent" />
      {/* Soil */}
      <ellipse cx="64" cy="90" rx="35" ry="12" fill="#92400E" />
      {/* Stem */}
      <rect x="60" y="50" width="8" height="45" rx="2" fill="#16A34A" />
      {/* Leaves */}
      <ellipse cx="50" cy="60" rx="15" ry="8" fill="#22C55E" transform="rotate(-30 50 60)" />
      <ellipse cx="78" cy="60" rx="15" ry="8" fill="#22C55E" transform="rotate(30 78 60)" />
      <ellipse cx="48" cy="70" rx="12" ry="7" fill="#16A34A" transform="rotate(-40 48 70)" />
      <ellipse cx="80" cy="70" rx="12" ry="7" fill="#16A34A" transform="rotate(40 80 70)" />
      {/* Sprout */}
      <circle cx="64" cy="45" r="8" fill="#4ADE80" />
      <path d="M64 45L60 38L64 40L68 38L64 45Z" fill="#22C55E" />
    </svg>
  );
}
