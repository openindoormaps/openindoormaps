function DesktopMap() {
  return (
    <svg
      className="absolute inset-0 hidden h-full w-full md:block"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
    >
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0.9 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Floor plan ──────────────────────────────── */}
      <g className="opacity-20">
        {/* Building outline */}
        <rect
          x="140"
          y="110"
          width="1640"
          height="860"
          rx="4"
          className="fill-none stroke-foreground/10"
          strokeWidth="2"
        />

        {/* Main horizontal corridor*/}
        <rect
          x="140"
          y="480"
          width="1640"
          height="100"
          className="fill-foreground/3 stroke-foreground/10"
          strokeWidth="1"
        />

        {/* Vertical corridor*/}
        <rect
          x="900"
          y="110"
          width="100"
          height="860"
          className="fill-foreground/3 stroke-foreground/10"
          strokeWidth="1"
        />

        {/* ── Rooms above corridor ─────────────────── */}
        {/* R1 – large room top-left */}
        <rect
          x="140"
          y="110"
          width="300"
          height="370"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R2 */}
        <rect
          x="440"
          y="110"
          width="220"
          height="370"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R3 */}
        <rect
          x="660"
          y="110"
          width="240"
          height="370"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R4 */}
        <rect
          x="1000"
          y="110"
          width="240"
          height="370"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R5 */}
        <rect
          x="1240"
          y="110"
          width="220"
          height="370"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R6 – large room top-right */}
        <rect
          x="1460"
          y="110"
          width="320"
          height="370"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />

        {/* ── Rooms below corridor ─────────────────── */}
        {/* R7 */}
        <rect
          x="140"
          y="580"
          width="300"
          height="390"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R8 */}
        <rect
          x="440"
          y="580"
          width="220"
          height="390"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R9 */}
        <rect
          x="660"
          y="580"
          width="240"
          height="390"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R10 */}
        <rect
          x="1000"
          y="580"
          width="240"
          height="390"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R11 */}
        <rect
          x="1240"
          y="580"
          width="220"
          height="390"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />
        {/* R12 – large room bottom-right */}
        <rect
          x="1460"
          y="580"
          width="320"
          height="390"
          className="fill-none stroke-foreground/15"
          strokeWidth="1.5"
        />

        {/* ── Doorways (gaps in walls) – small rects to "erase" wall line ── */}
        {/* Top doors into corridor */}
        <rect x="260" y="477" width="60" height="6" className="fill-background" />
        <rect x="520" y="477" width="60" height="6" className="fill-background" />
        <rect x="740" y="477" width="60" height="6" className="fill-background" />
        <rect x="1060" y="477" width="60" height="6" className="fill-background" />
        <rect x="1300" y="477" width="60" height="6" className="fill-background" />
        <rect x="1560" y="477" width="60" height="6" className="fill-background" />
        {/* Bottom doors into corridor */}
        <rect x="260" y="577" width="60" height="6" className="fill-background" />
        <rect x="520" y="577" width="60" height="6" className="fill-background" />
        <rect x="740" y="577" width="60" height="6" className="fill-background" />
        <rect x="1060" y="577" width="60" height="6" className="fill-background" />
        <rect x="1300" y="577" width="60" height="6" className="fill-background" />
        <rect x="1560" y="577" width="60" height="6" className="fill-background" />
        {/* Vertical corridor doors */}
        <rect x="897" y="270" width="6" height="50" className="fill-background" />
        <rect x="897" y="760" width="6" height="50" className="fill-background" />
      </g>

      {/* ── Navigation route ─────────────────────── */}

      <path
        id="mainPath"
        d="
          M 290 775
          L 290 580
          L 290 530
          L 950 530
          L 1590 530
          L 1590 320
        "
        stroke="url(#pathGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-none"
        strokeDasharray="18 10"
        filter="url(#glow)"
        opacity="0.6"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="28;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      {/* ── Waypoints ────────────────────────────── */}
      {/* Start – R7 */}
      <circle cx="290" cy="775" r="10" className="fill-primary" opacity="0.9" />
      <circle cx="290" cy="775" r="18" className="fill-primary" opacity="0.15" />

      {/* End – R5 */}
      <circle cx="1590" cy="320" r="10" className="fill-accent" opacity="0.9" />
      <circle cx="1590" cy="320" r="18" className="fill-accent" opacity="0.15" />

      {/* ── Moving dot ───────────────────────────── */}
      <circle r="9" className="fill-white" opacity="0.95">
        <animateMotion dur="30s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#mainPath" />
        </animateMotion>
      </circle>
      <circle r="6" className="fill-primary" opacity="1">
        <animateMotion dur="30s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#mainPath" />
        </animateMotion>
      </circle>
    </svg>
  );
}

function MobileMap() {
  return (
    <svg
      className="absolute inset-0 block h-full w-full md:hidden"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 200"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="pathGradientMobile" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0.9 }} />
        </linearGradient>
        <filter id="glowMobile">
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Abstract nav-grid background ────────────────────────────────── */}
      {/* Horizontal lines */}
      <g className="stroke-foreground/5" strokeWidth="0.3" strokeDasharray="2 4">
        <line x1="0" y1="40" x2="100" y2="40" />
        <line x1="0" y1="80" x2="100" y2="80" />
        <line x1="0" y1="120" x2="100" y2="120" />
        <line x1="0" y1="160" x2="100" y2="160" />
      </g>
      {/* Vertical lines */}
      <g className="stroke-foreground/5" strokeWidth="0.3" strokeDasharray="2 4">
        <line x1="20" y1="0" x2="20" y2="200" />
        <line x1="40" y1="0" x2="40" y2="200" />
        <line x1="60" y1="0" x2="60" y2="200" />
        <line x1="80" y1="0" x2="80" y2="200" />
      </g>

      {/* ── Navigation route ────────────────────────────────────────────── */}
      <path
        id="mainPathMobile"
        d="M 15 160 L 60 160 L 60 132 L 20 132 L 20 80 L 80 80 L 80 45"
        stroke="url(#pathGradientMobile)"
        strokeWidth="1"
        opacity={0.3}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-none"
        strokeDasharray="4 2.5"
        filter="url(#glowMobile)"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="6.5;0"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </path>

      {/* ── Waypoints ───────────────────────────────────────────────────── */}
      {/* Start — bottom-left */}
      <circle cx="15" cy="160" r="1" className="fill-primary" opacity="0.3" />
      <circle cx="15" cy="160" r="2" className="fill-primary" opacity="0.15" />

      {/* End — top-right */}
      <circle cx="80" cy="45" r="1" className="fill-accent" opacity="0.9" />
      <circle cx="80" cy="45" r="2" className="fill-accent" opacity="0.15" />

      {/* ── Moving dot ──────────────────────────────────────────────────── */}
      <circle
        r="1.4"
        className="fill-white"
        opacity="0.95"
        filter="url(#glowMobile)"
        vectorEffect="non-scaling-stroke"
      >
        <animateMotion dur="30s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#mainPathMobile" />
        </animateMotion>
      </circle>
      <circle r="0.9" className="fill-primary">
        <animateMotion dur="30s" repeatCount="indefinite" calcMode="linear">
          <mpath href="#mainPathMobile" />
        </animateMotion>
      </circle>
    </svg>
  );
}

export function HeroBackground() {
  return (
    <>
      <DesktopMap />
      <MobileMap />
    </>
  );
}
