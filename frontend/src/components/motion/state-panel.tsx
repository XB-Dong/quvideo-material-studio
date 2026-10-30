import Link from "next/link";
import { SceneEdge } from "./journey";
export function StatePanel({
  title,
  detail,
  loading = false,
  children,
}: {
  title: string;
  detail?: string;
  loading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className="p12-boundary"
      role={loading ? "status" : undefined}
      aria-busy={loading || undefined}
    >
      <div
        className={
          loading ? "p12-state-mark p12-state-loading" : "p12-state-mark"
        }
        aria-hidden="true"
      >
        <svg viewBox="0 0 60 60">
          <path d="M12 16h36v28H12zM18 36l8-8 7 7 8-12M21 22h1" />
          <circle cx="44" cy="15" r="6" />
        </svg>
      </div>
      <p className="eyebrow">SHUYING STUDIO</p>
      <h2>{title}</h2>
      {detail && <p>{detail}</p>}
      <SceneEdge />
      <div className="p12-boundary-actions">
        {children || <Link href="/">返回探索 ↗</Link>}
      </div>
    </section>
  );
}
