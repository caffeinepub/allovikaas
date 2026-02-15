export default function TransportIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" fill="transparent" />
      {/* Truck body */}
      <rect x="25" y="55" width="50" height="30" rx="3" fill="#8B5CF6" />
      {/* Truck cabin */}
      <rect x="75" y="60" width="25" height="25" rx="2" fill="#7C3AED" />
      {/* Window */}
      <rect x="78" y="63" width="19" height="12" rx="1" fill="#DDD6FE" />
      {/* Wheels */}
      <circle cx="40" cy="90" r="8" fill="#1F2937" />
      <circle cx="40" cy="90" r="5" fill="#6B7280" />
      <circle cx="85" cy="90" r="8" fill="#1F2937" />
      <circle cx="85" cy="90" r="5" fill="#6B7280" />
      {/* Motion lines */}
      <line x1="15" y1="50" x2="25" y2="50" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="60" x2="22" y2="60" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="10" y1="70" x2="20" y2="70" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
