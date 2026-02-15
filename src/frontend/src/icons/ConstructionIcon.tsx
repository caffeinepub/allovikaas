export default function ConstructionIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" fill="transparent" />
      {/* Hammer */}
      <path
        d="M45 75L35 85L43 93L53 83L45 75Z"
        fill="#D97706"
      />
      <rect
        x="48"
        y="50"
        width="8"
        height="35"
        rx="2"
        fill="#92400E"
        transform="rotate(-45 52 67.5)"
      />
      {/* Wrench */}
      <path
        d="M75 45L85 35L93 43L83 53L75 45Z"
        fill="#3B82F6"
      />
      <rect
        x="72"
        y="48"
        width="8"
        height="35"
        rx="2"
        fill="#1E40AF"
        transform="rotate(45 76 65.5)"
      />
      <circle cx="64" cy="64" r="12" fill="#6B7280" />
    </svg>
  );
}
