import React from 'react';

interface Props {
  icon: string;
  color: string;
  label?: string;
  size?: number;
}

// Derive a darker shade of the color for strokes/text
function darken(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.max(0,r-60)},${Math.max(0,g-60)},${Math.max(0,b-60)})`;
  } catch { return '#666'; }
}

function LabelText({ x, y, text, width, darkColor }: { x: number; y: number; text: string; width: number; darkColor: string }) {
  if (!text) return null;
  const maxChars = Math.floor(width / 5.5);
  const display = text.length > maxChars ? text.slice(0, maxChars - 1) + '…' : text;
  const fontSize = text.length > 8 ? 6 : 7.5;
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      fontSize={fontSize}
      fontWeight="700"
      fontFamily="system-ui, sans-serif"
      fill={darkColor}
      style={{ userSelect: 'none' }}
    >
      {display}
    </text>
  );
}

export function FoodIllustration({ icon, color, label, size = 80 }: Props) {
  const s = size;
  const dark = darken(color);

  const illustrations: Record<string, React.ReactElement> = {
    flour: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="18" y="22" width="44" height="50" rx="6" fill={color} stroke={dark} strokeWidth="1.5" />
        <path d="M22 22 L25 12 L55 12 L58 22 Z" fill={color} stroke={dark} strokeWidth="1.5" />
        <rect x="30" y="9" width="20" height="5" rx="2.5" fill={dark} />
        {/* Label */}
        <rect x="23" y="35" width="34" height="26" rx="3" fill="white" opacity="0.75" />
        <rect x="25" y="37" width="30" height="3" rx="1" fill={dark} opacity="0.5" />
        <text x="40" y="50" textAnchor="middle" fontSize="11" style={{ userSelect: 'none' }}>🌾</text>
        <LabelText x={40} y={58} text={label ?? ''} width={28} darkColor={dark} />
        <rect x="22" y="28" width="4" height="12" rx="2" fill="white" opacity="0.3" />
      </svg>
    ),

    sugar: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="16" y="20" width="48" height="52" rx="4" fill={color} stroke={dark} strokeWidth="1.5" />
        <rect x="16" y="20" width="48" height="11" rx="4" fill={dark} opacity="0.5" />
        <circle cx="30" cy="30" r="2" fill="white" opacity="0.5" />
        <circle cx="40" cy="28" r="2" fill="white" opacity="0.5" />
        <circle cx="50" cy="30" r="2" fill="white" opacity="0.5" />
        {/* Label */}
        <rect x="20" y="37" width="40" height="28" rx="3" fill="white" opacity="0.75" />
        <rect x="22" y="39" width="36" height="3" rx="1" fill={dark} opacity="0.5" />
        <text x="40" y="53" textAnchor="middle" fontSize="11" style={{ userSelect: 'none' }}>🍬</text>
        <LabelText x={40} y={62} text={label ?? ''} width={34} darkColor={dark} />
        <rect x="20" y="24" width="3" height="8" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    pasta: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="20" y="15" width="40" height="58" rx="4" fill={color} stroke={dark} strokeWidth="1.5" />
        <rect x="20" y="15" width="40" height="10" rx="4" fill={dark} opacity="0.5" />
        <rect x="20" y="63" width="40" height="10" rx="4" fill={dark} opacity="0.5" />
        {/* Window */}
        <rect x="26" y="30" width="28" height="26" rx="3" fill="white" opacity="0.8" />
        {[0,3,6,9,12,15,18,21].map((offset, i) => (
          <line key={i} x1="29" y1={33 + offset} x2="51" y2={33 + offset} stroke={dark} strokeWidth="1.2" opacity="0.5" />
        ))}
        <LabelText x={40} y={25} text={label ?? ''} width={34} darkColor="white" />
        <rect x="20" y="24" width="3" height="6" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    oil: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <path d="M28 35 L28 68 Q28 72 32 72 L48 72 Q52 72 52 68 L52 35 Q52 25 42 22 L38 22 Q28 25 28 35 Z" fill={color} stroke={dark} strokeWidth="1.5" />
        <rect x="34" y="14" width="12" height="12" rx="3" fill={color} stroke={dark} strokeWidth="1.5" />
        <rect x="33" y="10" width="14" height="7" rx="3" fill={dark} opacity="0.7" />
        <path d="M29 50 L51 50 L51 68 Q51 71 48 71 L32 71 Q29 71 29 68 Z" fill={dark} opacity="0.15" />
        {/* Label */}
        <rect x="29" y="36" width="22" height="18" rx="2" fill="white" opacity="0.8" />
        <rect x="31" y="38" width="18" height="2.5" rx="1" fill={dark} opacity="0.5" />
        <text x="40" y="50" textAnchor="middle" fontSize="9" style={{ userSelect: 'none' }}>🫒</text>
        <LabelText x={40} y={60} text={label ?? ''} width={20} darkColor={dark} />
        <rect x="32" y="36" width="3" height="14" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    milk: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="22" y="28" width="36" height="44" rx="3" fill={color} stroke={dark} strokeWidth="1.5" />
        <polygon points="22,28 40,14 58,28" fill={dark} opacity="0.4" stroke={dark} strokeWidth="1.5" />
        <line x1="40" y1="14" x2="40" y2="28" stroke={dark} strokeWidth="1" opacity="0.5" />
        {/* Label */}
        <rect x="26" y="36" width="28" height="28" rx="2" fill="white" opacity="0.8" />
        <circle cx="40" cy="47" r="8" fill={color} opacity="0.5" />
        <text x="40" y="51" textAnchor="middle" fontSize="10" style={{ userSelect: 'none' }}>🐄</text>
        <LabelText x={40} y={61} text={label ?? ''} width={24} darkColor={dark} />
        <rect x="26" y="30" width="3" height="14" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    can: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="22" y="22" width="36" height="48" fill={color} stroke={dark} strokeWidth="1.5" />
        <ellipse cx="40" cy="22" rx="18" ry="5" fill={dark} opacity="0.6" stroke={dark} strokeWidth="1.5" />
        <ellipse cx="40" cy="70" rx="18" ry="5" fill={dark} opacity="0.3" stroke={dark} strokeWidth="1.5" />
        <circle cx="40" cy="19" r="4" fill="none" stroke={dark} strokeWidth="1.5" />
        <line x1="40" y1="15" x2="44" y2="11" stroke={dark} strokeWidth="1.5" />
        {/* Label */}
        <rect x="24" y="30" width="32" height="30" fill="white" opacity="0.8" />
        <rect x="26" y="32" width="28" height="3" rx="1" fill={dark} opacity="0.5" />
        <text x="40" y="50" textAnchor="middle" fontSize="12" style={{ userSelect: 'none' }}>🥫</text>
        <LabelText x={40} y={58} text={label ?? ''} width={28} darkColor={dark} />
        <line x1="22" y1="26" x2="58" y2="26" stroke={dark} strokeWidth="0.8" opacity="0.4" />
        <line x1="22" y1="66" x2="58" y2="66" stroke={dark} strokeWidth="0.8" opacity="0.4" />
      </svg>
    ),

    rice: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <path d="M20 30 Q20 70 30 72 L50 72 Q60 70 60 30 Q55 18 40 18 Q25 18 20 30 Z" fill={color} stroke={dark} strokeWidth="1.5" />
        <ellipse cx="40" cy="18" rx="10" ry="5" fill={dark} opacity="0.5" stroke={dark} strokeWidth="1.5" />
        {/* Label */}
        <rect x="25" y="36" width="30" height="26" rx="3" fill="white" opacity="0.8" />
        <rect x="27" y="38" width="26" height="2.5" rx="1" fill={dark} opacity="0.5" />
        <text x="40" y="55" textAnchor="middle" fontSize="11" style={{ userSelect: 'none' }}>🌾</text>
        <LabelText x={40} y={59} text={label ?? ''} width={26} darkColor={dark} />
        <ellipse cx="30" cy="33" rx="2" ry="1" fill="white" opacity="0.5" transform="rotate(-20 30 33)" />
        <ellipse cx="50" cy="33" rx="2" ry="1" fill="white" opacity="0.5" transform="rotate(20 50 33)" />
        <path d="M24 32 Q23 42 24 52" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
      </svg>
    ),

    salt: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="20" y="20" width="40" height="52" rx="4" fill={color} stroke={dark} strokeWidth="1.5" />
        <rect x="20" y="20" width="40" height="11" rx="4" fill={dark} opacity="0.5" />
        <circle cx="33" cy="25" r="1.5" fill="white" />
        <circle cx="40" cy="25" r="1.5" fill="white" />
        <circle cx="47" cy="25" r="1.5" fill="white" />
        {/* Label */}
        <rect x="23" y="36" width="34" height="28" rx="3" fill="white" opacity="0.8" />
        <rect x="25" y="38" width="30" height="2.5" rx="1" fill={dark} opacity="0.5" />
        <text x="40" y="55" textAnchor="middle" fontSize="13" style={{ userSelect: 'none' }}>🧂</text>
        <LabelText x={40} y={62} text={label ?? ''} width={30} darkColor={dark} />
        <rect x="24" y="30" width="3" height="8" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),

    jar: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Lid */}
        <rect x="26" y="12" width="28" height="10" rx="3" fill={dark} opacity="0.7" />
        <rect x="24" y="20" width="32" height="4" rx="1" fill={dark} opacity="0.5" />
        {/* Jar body */}
        <path d="M24 24 Q18 30 18 45 Q18 68 40 70 Q62 68 62 45 Q62 30 56 24 Z" fill={color} stroke={dark} strokeWidth="1.5" />
        {/* Lid ring */}
        <rect x="22" y="22" width="36" height="5" rx="2" fill={dark} opacity="0.3" />
        {/* Content color */}
        <path d="M20 52 Q20 68 40 70 Q60 68 60 52 Z" fill={dark} opacity="0.15" />
        {/* Label */}
        <rect x="24" y="34" width="32" height="20" rx="3" fill="white" opacity="0.8" />
        <rect x="26" y="36" width="28" height="2.5" rx="1" fill={dark} opacity="0.4" />
        <text x="40" y="49" textAnchor="middle" fontSize="11" style={{ userSelect: 'none' }}>🍯</text>
        <LabelText x={40} y={61} text={label ?? ''} width={28} darkColor={dark} />
        <path d="M22 30 Q20 42 21 54" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      </svg>
    ),

    box: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Box with perspective */}
        <path d="M14 30 L40 20 L66 30 L66 62 L40 72 L14 62 Z" fill={color} stroke={dark} strokeWidth="1.5" />
        <path d="M40 20 L40 72" stroke={dark} strokeWidth="1" opacity="0.3" />
        <path d="M14 30 L40 40 L66 30" stroke={dark} strokeWidth="1" opacity="0.3" />
        <path d="M40 40 L40 72" stroke={dark} strokeWidth="1" opacity="0.2" />
        {/* Front face label */}
        <path d="M14 30 L40 40 L40 72 L14 62 Z" fill="white" opacity="0.15" />
        <text x="27" y="56" textAnchor="middle" fontSize="14" style={{ userSelect: 'none' }}>📦</text>
        <LabelText x={27} y={64} text={label ?? ''} width={22} darkColor={dark} />
        {/* Top shine */}
        <path d="M18 32 L38 24 L42 26 L22 34 Z" fill="white" opacity="0.2" />
      </svg>
    ),

    bottle: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Bottle */}
        <path d="M34 8 L34 16 Q26 20 24 30 L24 68 Q24 74 40 74 Q56 74 56 68 L56 30 Q54 20 46 16 L46 8 Z" fill={color} stroke={dark} strokeWidth="1.5" />
        {/* Cap */}
        <rect x="33" y="6" width="14" height="10" rx="3" fill={dark} opacity="0.7" />
        {/* Liquid fill */}
        <path d="M25 55 L55 55 L55 68 Q55 73 40 73 Q25 73 25 68 Z" fill={dark} opacity="0.2" />
        {/* Shoulders */}
        <path d="M26 32 L54 32" stroke={dark} strokeWidth="1" opacity="0.3" />
        {/* Label */}
        <rect x="26" y="36" width="28" height="18" rx="3" fill="white" opacity="0.85" />
        <rect x="28" y="38" width="24" height="2.5" rx="1" fill={dark} opacity="0.4" />
        <text x="40" y="50" textAnchor="middle" fontSize="11" style={{ userSelect: 'none' }}>🍶</text>
        <LabelText x={40} y={61} text={label ?? ''} width={24} darkColor={dark} />
        <path d="M28 30 Q26 44 27 56" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
      </svg>
    ),

    default: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="16" y="24" width="48" height="44" rx="5" fill={color} stroke={dark} strokeWidth="1.5" />
        <path d="M16 24 L16 16 L36 20 L36 24 Z" fill={color} stroke={dark} strokeWidth="1.5" />
        <path d="M64 24 L64 16 L44 20 L44 24 Z" fill={color} stroke={dark} strokeWidth="1.5" />
        {/* Label */}
        <rect x="22" y="32" width="36" height="28" rx="3" fill="white" opacity="0.75" />
        <rect x="24" y="34" width="32" height="2.5" rx="1" fill={dark} opacity="0.4" />
        <text x="40" y="50" textAnchor="middle" fontSize="12" style={{ userSelect: 'none' }}>📦</text>
        <LabelText x={40} y={58} text={label ?? ''} width={32} darkColor={dark} />
        <rect x="20" y="28" width="3" height="10" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    ),
  };

  return illustrations[icon] ?? illustrations['default'];
}
