function Background() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage: `
            linear-gradient(to right, var(--color-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)
          `,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

export default Background;
