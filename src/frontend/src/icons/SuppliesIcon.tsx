export default function SuppliesIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" fill="transparent" />
      {/* Box body */}
      <rect x="35" y="50" width="58" height="45" rx="3" fill="#14B8A6" />
      {/* Box top flaps */}
      <path d="M35 50L64 35L93 50" fill="#0D9488" />
      <path d="M35 50L64 65L93 50" fill="#5EEAD4" />
      {/* Tape */}
      <rect x="30" y="68" width="68" height="6" fill="#F59E0B" opacity="0.8" />
      {/* Label */}
      <rect x="50" y="75" width="28" height="12" rx="2" fill="white" opacity="0.9" />
      <line x1="54" y1="79" x2="74" y2="79" stroke="#0D9488" strokeWidth="1.5" />
      <line x1="54" y1="83" x2="70" y2="83" stroke="#0D9488" strokeWidth="1.5" />
    </svg>
  );
}
