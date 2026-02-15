export default function RepairIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" fill="transparent" />
      {/* Wrench */}
      <rect x="35" y="50" width="12" height="45" rx="3" fill="#6366F1" transform="rotate(-25 41 72.5)" />
      <circle cx="38" cy="48" r="8" fill="#4F46E5" />
      <circle cx="38" cy="48" r="4" fill="transparent" stroke="#312E81" strokeWidth="2" />
      {/* Screwdriver */}
      <rect x="70" y="45" width="8" height="50" rx="2" fill="#DC2626" transform="rotate(20 74 70)" />
      <path d="M68 42L80 42L76 38L72 38L68 42Z" fill="#991B1B" transform="rotate(20 74 40)" />
      {/* Bolt/Nut */}
      <circle cx="64" cy="75" r="10" fill="#6B7280" />
      <circle cx="64" cy="75" r="6" fill="transparent" stroke="#1F2937" strokeWidth="2" />
      <path d="M64 69L67 72L64 75L61 72L64 69Z" fill="#1F2937" />
      <path d="M64 75L67 78L64 81L61 78L64 75Z" fill="#1F2937" />
    </svg>
  );
}
