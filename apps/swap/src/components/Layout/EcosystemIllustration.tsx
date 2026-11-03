import { useId } from "react";

const orbits = [
  { angle: -28, tone: "copper" },
  { angle: 28, tone: "sage" },
];

export function EcosystemIllustration() {
  const id = useId();
  const shadeId = `planet-shade-${id}`;
  const frontClipId = `planet-orbit-front-${id}`;
  const surfaceClipId = `planet-surface-${id}`;

  return (
    <svg className="ics-ecosystem-art" viewBox="0 0 160 148" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={shadeId} cx="30%" cy="25%" r="80%">
          <stop stopColor="var(--color-primary)" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="var(--color-secondary)" stopOpacity="0.065" />
          <stop offset="1" stopColor="var(--color-base-200)" stopOpacity="0.8" />
        </radialGradient>
        <clipPath id={frontClipId}>
          <rect x="0" y="74" width="160" height="74" />
        </clipPath>
        <clipPath id={surfaceClipId}>
          <circle cx="80" cy="74" r="33" />
        </clipPath>
      </defs>

      <path className="ics-ecosystem-grid" d="M16 37H144M16 73H144M16 109H144M44 9V137M80 9V137M116 9V137" />
      <path className="ics-ecosystem-registration" d="M4 25V13H16M144 13H156V25M4 123V135H16M144 135H156V123" />

      <g className="ics-ecosystem-structure">
        <circle className="ics-planet-atmosphere" cx="80" cy="74" r="37" />

        {orbits.map(({ angle, tone }) => (
          <g key={tone} transform={`rotate(${angle} 80 74)`}>
            <ellipse className="ics-planet-orbit" cx="80" cy="74" rx="72" ry="24" />
            <ellipse
              className={`ics-planet-trace ics-planet-trace-${tone}`}
              cx="80"
              cy="74"
              rx="72"
              ry="24"
              pathLength="100"
            />
          </g>
        ))}

        <circle className="ics-planet-body" cx="80" cy="74" r="33" />
        <g className="ics-planet-land" clipPath={`url(#${surfaceClipId})`}>
          <path d="M49 56c4-3 7-6 12-7l4 2 4-2 6 3-1 4-5 1-2 5-5 2-1 5-4-1-3-5-4-2Z" />
          <path d="m75 45 5-2 4 3-2 5-4 2-3-3Z" />
          <path d="M69 73c4-1 8 1 11 5l1 5-4 5-1 7-4 7-3-3 1-7-3-4-1-6-3-4Z" />
          <path d="m87 49 6-3 6 2 8-2 6 6-2 5-5 1-1 4-6 1-4-3-5 2-3-3-4 1-2-4 3-3Z" />
          <path d="m86 64 7-1 6 5-1 7-4 3-2 8-4 1-2-6-3-3-2-8Z" />
          <path d="m99 82 2 1-1 6-2-1Z" />
          <path d="m104 90 5-3 6 3-1 5-7 1-4-3Z" />
          <path d="m104 72 3 1 2 4-2 2-3-3Z" />
        </g>
        <circle cx="80" cy="74" r="33" fill={`url(#${shadeId})`} />

        <circle className="ics-planet-outline" cx="80" cy="74" r="33" />
        <path className="ics-planet-rim" d="M47 74a33 33 0 0 1 33-33" />

        {orbits.map(({ angle, tone }) => (
          <g key={tone} transform={`rotate(${angle} 80 74)`}>
            <path className="ics-planet-orbit-front" d="M8 74a72 24 0 0 0 144 0" />
            <ellipse
              className={`ics-planet-trace ics-planet-trace-${tone}`}
              cx="80"
              cy="74"
              rx="72"
              ry="24"
              pathLength="100"
              clipPath={`url(#${frontClipId})`}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
