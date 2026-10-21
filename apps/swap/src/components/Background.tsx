export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 10% 15%, color-mix(in oklab, var(--color-secondary) 9%, transparent), transparent 50%), radial-gradient(ellipse at 95% 35%, color-mix(in oklab, var(--color-primary) 7%, transparent), transparent 45%), var(--color-base-200)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-base-content) 1px, transparent 1px), linear-gradient(90deg, var(--color-base-content) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 20%, #000, transparent 75%)",
        }}
      />
      <div className="absolute -left-60 top-1/3 h-[600px] w-[600px] rounded-full border border-primary/5" />
      <div className="absolute -left-44 top-[calc(33%_-_64px)] h-[600px] w-[600px] rounded-full border border-primary/5" />
    </div>
  );
}
