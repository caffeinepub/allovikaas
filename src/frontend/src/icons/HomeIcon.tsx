export default function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" fill="transparent" />
      {/* House body */}
      <rect x="35" y="55" width="58" height="45" rx="2" fill="#3B82F6" />
      {/* Roof */}
      <path d="M64 30L25 60L35 60L64 40L93 60L103 60L64 30Z" fill="#1E40AF" />
      {/* Door */}
      <rect x="54" y="75" width="20" height="25" rx="2" fill="#1E3A8A" />
      <circle cx="68" cy="87" r="2" fill="#FCD34D" />
      {/* Windows */}
      <rect x="42" y="62" width="12" height="12" rx="1" fill="#DBEAFE" />
      <rect x="74" y="62" width="12" height="12" rx="1" fill="#DBEAFE" />
      <line x1="48" y1="62" x2="48" y2="74" stroke="#1E40AF" strokeWidth="1" />
      <line x1="42" y1="68" x2="54" y2="68" stroke="#1E40AF" strokeWidth="1" />
      <line x1="80" y1="62" x2="80" y2="74" stroke="#1E40AF" strokeWidth="1" />
      <line x1="74" y1="68" x2="86" y2="68" stroke="#1E40AF" strokeWidth="1" />
      {/* Sparkles */}
      <circle cx="100" cy="50" r="3" fill="#FCD34D" opacity="0.8" />
      <circle cx="108" cy="65" r="2" fill="#FCD34D" opacity="0.6" />
      <circle cx="95" cy="70" r="2.5" fill="#FCD34D" opacity="0.7" />
    </svg>
  );
}
