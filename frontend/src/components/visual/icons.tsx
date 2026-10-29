export function StudioIcon({ name }: { name: "refresh" | "spark" | "image" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "refresh" ? (
        <>
          <path d="M20 5v5h-5M4 19v-5h5" />
          <path d="M6 7a8 8 0 0 1 14 3M4 14a8 8 0 0 0 14 3" />
        </>
      ) : name === "spark" ? (
        <path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8Z" />
      ) : (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="m3 17 5-5 4 4 4-6 5 7" />
          <circle cx="8" cy="8" r="1" />
        </>
      )}
    </svg>
  );
}
