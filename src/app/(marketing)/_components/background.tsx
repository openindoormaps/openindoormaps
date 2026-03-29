function Background() {
  return (
    <>
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Navigation paths */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 20% Q 25% 18%, 50% 25% T 100% 22%"
          stroke="var(--color-primary)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 0 45% Q 30% 42%, 60% 48% T 100% 45%"
          stroke="var(--color-primary)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 0 70% Q 35% 68%, 70% 72% T 100% 70%"
          stroke="var(--color-primary)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 25% 0 L 25% 30% Q 27% 35%, 32% 35% L 35% 100%"
          stroke="var(--color-primary)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 70% 0 L 70% 40% Q 68% 45%, 65% 50% L 65% 100%"
          stroke="var(--color-primary)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </>
  );
}

export default Background;
