export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-label="BasketFit logo"
    >
      <defs>
        <radialGradient
          id="bf-ball"
          cx="38%"
          cy="28%"
          r="60%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%"   stopColor="#FFAE4A" />
          <stop offset="32%"  stopColor="#E85C00" />
          <stop offset="72%"  stopColor="#BF3F00" />
          <stop offset="100%" stopColor="#5C1600" />
        </radialGradient>
        <radialGradient
          id="bf-shine"
          cx="40%"
          cy="32%"
          r="50%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%"   stopColor="#fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ball body */}
      <circle cx="18" cy="18" r="17" fill="url(#bf-ball)" />

      {/* Seams, rotated 14 deg for in-motion feel */}
      <g transform="rotate(14, 18, 18)" strokeLinecap="round" stroke="#2A0700" strokeWidth="1.55" fill="none">
        {/* Horizontal */}
        <line x1="1.5" y1="18" x2="34.5" y2="18" />
        {/* Vertical */}
        <line x1="18" y1="1.5" x2="18" y2="34.5" />
        {/* Top S-curve */}
        <path d="M1.5,18 C6,6 12,6 18,18 C24,30 30,30 34.5,18" />
        {/* Bottom S-curve */}
        <path d="M1.5,18 C6,30 12,30 18,18 C24,6 30,6 34.5,18" />
      </g>

      {/* Specular shine */}
      <circle cx="18" cy="18" r="17" fill="url(#bf-shine)" />

      {/* Highlight glint */}
      <ellipse
        cx="11.5" cy="10"
        rx="4.5" ry="2.8"
        fill="rgba(255,255,255,0.18)"
        transform="rotate(-18, 11.5, 10)"
      />
    </svg>
  );
}
