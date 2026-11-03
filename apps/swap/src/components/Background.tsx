import { useDesignVersion } from "hooks/useDesignVersion";

export default function Background() {
  const { isClassicDesign } = useDesignVersion();

  if (isClassicDesign) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(30% 30% at 50% 0%,rgba(255, 143, 224, 0.1) 0, rgba(33, 41, 70, .1) 100%)",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--color-base-200)" }}
    >
      <div className="absolute inset-y-0 left-[calc(50%_+_104px)] w-px bg-base-content/[0.025] max-[1099px]:left-1/2" />
      <svg
        className="absolute bottom-24 right-8 h-24 w-24 text-base-content/[0.07] max-[640px]:hidden"
        viewBox="0 0 96 96"
        fill="none"
      >
        <path d="M0 48h96M48 0v96M0 0h96v96H0zM12 12h72v72H12z" stroke="currentColor" strokeWidth="0.6" />
        <path d="m12 48 36-36 36 36-36 36-36-36Z" stroke="currentColor" strokeWidth="0.6" />
      </svg>
    </div>
  );
}
