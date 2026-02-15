export default function CookingIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" fill="transparent" />
      {/* Cooking pot */}
      <ellipse cx="64" cy="65" rx="28" ry="8" fill="#DC2626" />
      <rect x="36" y="55" width="56" height="20" fill="#EF4444" />
      <ellipse cx="64" cy="55" rx="28" ry="8" fill="#F87171" />
      {/* Handles */}
      <path d="M32 60Q28 60 28 56Q28 52 32 52" stroke="#991B1B" strokeWidth="3" fill="none" />
      <path d="M96 60Q100 60 100 56Q100 52 96 52" stroke="#991B1B" strokeWidth="3" fill="none" />
      {/* Steam */}
      <path d="M55 45Q55 40 58 38Q61 36 61 31" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M64 42Q64 37 67 35Q70 33 70 28" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M73 45Q73 40 76 38Q79 36 79 31" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* Balloons */}
      <circle cx="95" cy="40" r="6" fill="#F59E0B" opacity="0.8" />
      <line x1="95" y1="46" x2="95" y2="52" stroke="#D97706" strokeWidth="1" />
      <circle cx="108" cy="50" r="5" fill="#EF4444" opacity="0.8" />
      <line x1="108" y1="55" x2="108" y2="60" stroke="#DC2626" strokeWidth="1" />
      {/* Confetti */}
      <rect x="20" y="35" width="3" height="3" fill="#F59E0B" opacity="0.7" transform="rotate(15 21.5 36.5)" />
      <rect x="105" y="65" width="3" height="3" fill="#EF4444" opacity="0.7" transform="rotate(-20 106.5 66.5)" />
    </svg>
  );
}
