import React from 'react';

interface Props {
  icon: string;
  color: string;
  size?: number;
}

export function FoodIllustration({ icon, color, size = 80 }: Props) {
  const s = size;

  const illustrations: Record<string, React.ReactElement> = {
    flour: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Bag body */}
        <rect x="18" y="22" width="44" height="50" rx="6" fill={color} stroke="#c9a96e" strokeWidth="2" />
        {/* Bag top fold */}
        <path d="M22 22 L25 12 L55 12 L58 22 Z" fill={color} stroke="#c9a96e" strokeWidth="2" />
        {/* Tie */}
        <rect x="30" y="9" width="20" height="5" rx="2.5" fill="#c9a96e" />
        {/* Label area */}
        <rect x="24" y="38" width="32" height="22" rx="3" fill="white" opacity="0.7" />
        {/* Text lines on label */}
        <rect x="28" y="43" width="24" height="3" rx="1" fill="#c9a96e" />
        <rect x="30" y="50" width="20" height="2.5" rx="1" fill="#c9a96e" opacity="0.5" />
        <rect x="32" y="55" width="16" height="2.5" rx="1" fill="#c9a96e" opacity="0.5" />
        {/* Wheat icon on label */}
        <text x="40" y="48" textAnchor="middle" fontSize="8" fill="#c9a96e">🌾</text>
        {/* Shine */}
        <rect x="22" y="28" width="4" height="12" rx="2" fill="white" opacity="0.3" />
      </svg>
    ),

    sugar: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Box body */}
        <rect x="16" y="20" width="48" height="52" rx="4" fill={color} stroke="#f9a8d4" strokeWidth="2" />
        {/* Top */}
        <rect x="16" y="20" width="48" height="12" rx="4" fill="#fda4af" />
        {/* Label */}
        <rect x="22" y="38" width="36" height="26" rx="3" fill="white" opacity="0.8" />
        <rect x="26" y="43" width="28" height="3" rx="1" fill="#f43f5e" />
        <rect x="28" y="50" width="24" height="2" rx="1" fill="#f43f5e" opacity="0.4" />
        <rect x="30" y="55" width="20" height="2" rx="1" fill="#f43f5e" opacity="0.4" />
        {/* Sugar crystals decoration */}
        <circle cx="30" cy="30" r="2" fill="white" opacity="0.6" />
        <circle cx="40" cy="28" r="2" fill="white" opacity="0.6" />
        <circle cx="50" cy="30" r="2" fill="white" opacity="0.6" />
        <rect x="20" y="24" width="3" height="8" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    pasta: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Box */}
        <rect x="20" y="15" width="40" height="58" rx="4" fill={color} stroke="#fbbf24" strokeWidth="2" />
        {/* Top stripe */}
        <rect x="20" y="15" width="40" height="10" rx="4" fill="#f59e0b" />
        {/* Bottom stripe */}
        <rect x="20" y="63" width="40" height="10" rx="4" fill="#f59e0b" />
        {/* Window showing pasta */}
        <rect x="26" y="30" width="28" height="26" rx="3" fill="white" opacity="0.8" />
        {/* Pasta lines */}
        {[0,3,6,9,12,15,18,21].map((offset, i) => (
          <line key={i} x1="29" y1={33 + offset} x2="51" y2={33 + offset} stroke="#fbbf24" strokeWidth="1.5" />
        ))}
        {/* Label text */}
        <rect x="24" y="59" width="32" height="2" rx="1" fill="white" opacity="0.6" />
        <rect x="20" y="24" width="3" height="6" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    oil: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Bottle body */}
        <path d="M28 35 L28 68 Q28 72 32 72 L48 72 Q52 72 52 68 L52 35 Q52 25 42 22 L38 22 Q28 25 28 35 Z" fill={color} stroke="#6ee7b7" strokeWidth="2" />
        {/* Neck */}
        <rect x="34" y="14" width="12" height="12" rx="3" fill={color} stroke="#6ee7b7" strokeWidth="2" />
        {/* Cap */}
        <rect x="33" y="10" width="14" height="7" rx="3" fill="#34d399" />
        {/* Liquid level */}
        <path d="M29 50 L51 50 L51 68 Q51 71 48 71 L32 71 Q29 71 29 68 Z" fill="#6ee7b7" opacity="0.4" />
        {/* Label */}
        <rect x="30" y="40" width="20" height="14" rx="2" fill="white" opacity="0.8" />
        <rect x="32" y="43" width="16" height="2" rx="1" fill="#059669" />
        <rect x="33" y="47" width="14" height="2" rx="1" fill="#059669" opacity="0.5" />
        {/* Shine */}
        <rect x="32" y="36" width="3" height="14" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    milk: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Carton body */}
        <rect x="22" y="28" width="36" height="44" rx="3" fill={color} stroke="#bfdbfe" strokeWidth="2" />
        {/* Carton top (gable) */}
        <polygon points="22,28 40,14 58,28" fill="#93c5fd" stroke="#bfdbfe" strokeWidth="2" />
        <line x1="40" y1="14" x2="40" y2="28" stroke="#bfdbfe" strokeWidth="1" />
        {/* Label */}
        <rect x="26" y="38" width="28" height="26" rx="2" fill="white" opacity="0.85" />
        <circle cx="40" cy="48" r="8" fill="#bfdbfe" opacity="0.6" />
        <text x="40" y="52" textAnchor="middle" fontSize="10" fill="#1d4ed8">🐄</text>
        <rect x="28" y="59" width="24" height="2" rx="1" fill="#3b82f6" opacity="0.4" />
        <rect x="30" y="62" width="20" height="2" rx="1" fill="#3b82f6" opacity="0.3" />
        {/* Shine */}
        <rect x="26" y="30" width="3" height="14" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    can: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Can body */}
        <rect x="22" y="22" width="36" height="48" rx="0" fill={color} stroke="#fca5a5" strokeWidth="2" />
        {/* Top ellipse */}
        <ellipse cx="40" cy="22" rx="18" ry="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" />
        {/* Bottom ellipse */}
        <ellipse cx="40" cy="70" rx="18" ry="5" fill="#fca5a5" stroke="#fca5a5" strokeWidth="2" />
        {/* Pull ring */}
        <circle cx="40" cy="19" r="4" fill="none" stroke="#9f1239" strokeWidth="2" />
        <line x1="40" y1="15" x2="44" y2="11" stroke="#9f1239" strokeWidth="2" />
        {/* Label */}
        <rect x="24" y="32" width="32" height="26" fill="white" opacity="0.85" />
        <rect x="26" y="36" width="28" height="3" rx="1" fill="#ef4444" />
        <circle cx="40" cy="49" r="6" fill="#fee2e2" />
        <text x="40" y="53" textAnchor="middle" fontSize="9">🍅</text>
        {/* Metallic lines */}
        <line x1="22" y1="26" x2="58" y2="26" stroke="#fca5a5" strokeWidth="1" opacity="0.5" />
        <line x1="22" y1="66" x2="58" y2="66" stroke="#fca5a5" strokeWidth="1" opacity="0.5" />
      </svg>
    ),

    rice: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Bag */}
        <path d="M20 30 Q20 70 30 72 L50 72 Q60 70 60 30 Q55 18 40 18 Q25 18 20 30 Z" fill={color} stroke="#86efac" strokeWidth="2" />
        {/* Tie at top */}
        <ellipse cx="40" cy="18" rx="10" ry="5" fill="#4ade80" stroke="#86efac" strokeWidth="1.5" />
        {/* Label */}
        <rect x="26" y="38" width="28" height="22" rx="3" fill="white" opacity="0.85" />
        <rect x="28" y="42" width="24" height="2.5" rx="1" fill="#16a34a" />
        <text x="40" y="58" textAnchor="middle" fontSize="10">🌾</text>
        {/* Rice grain decorations */}
        <ellipse cx="30" cy="34" rx="2" ry="1" fill="white" opacity="0.5" transform="rotate(-20 30 34)" />
        <ellipse cx="50" cy="34" rx="2" ry="1" fill="white" opacity="0.5" transform="rotate(20 50 34)" />
        <ellipse cx="24" cy="42" rx="2" ry="1" fill="white" opacity="0.4" transform="rotate(-10 24 42)" />
        <ellipse cx="56" cy="42" rx="2" ry="1" fill="white" opacity="0.4" transform="rotate(10 56 42)" />
        {/* Shine */}
        <path d="M24 32 Q23 42 24 52" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
      </svg>
    ),

    salt: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Box */}
        <rect x="20" y="20" width="40" height="52" rx="4" fill={color} stroke="#7dd3fc" strokeWidth="2" />
        {/* Lid */}
        <rect x="20" y="20" width="40" height="10" rx="4" fill="#38bdf8" />
        {/* Pour holes */}
        <circle cx="33" cy="25" r="1.5" fill="white" />
        <circle cx="40" cy="25" r="1.5" fill="white" />
        <circle cx="47" cy="25" r="1.5" fill="white" />
        {/* Label */}
        <rect x="24" y="36" width="32" height="28" rx="3" fill="white" opacity="0.85" />
        <rect x="26" y="40" width="28" height="3" rx="1" fill="#0284c7" />
        <text x="40" y="58" textAnchor="middle" fontSize="14">🧂</text>
        {/* Salt crystal decoration */}
        <rect x="24" y="30" width="3" height="8" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    default: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Generic box */}
        <rect x="16" y="24" width="48" height="44" rx="5" fill={color} stroke="#d1d5db" strokeWidth="2" />
        {/* Top flaps */}
        <path d="M16 24 L16 16 L36 20 L36 24 Z" fill={color} stroke="#d1d5db" strokeWidth="1.5" />
        <path d="M64 24 L64 16 L44 20 L44 24 Z" fill={color} stroke="#d1d5db" strokeWidth="1.5" />
        {/* Label */}
        <rect x="22" y="34" width="36" height="26" rx="3" fill="white" opacity="0.8" />
        <rect x="26" y="39" width="28" height="3" rx="1" fill="#6b7280" />
        <rect x="28" y="46" width="24" height="2" rx="1" fill="#6b7280" opacity="0.4" />
        <rect x="30" y="51" width="20" height="2" rx="1" fill="#6b7280" opacity="0.4" />
        <rect x="20" y="28" width="3" height="10" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),
  };

  return illustrations[icon] ?? illustrations['default'];
}
