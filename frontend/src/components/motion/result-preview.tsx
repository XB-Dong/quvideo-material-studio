"use client";
import { useEffect, useRef, useState } from "react";
import { useMotionPreferences } from "./preferences";
export type PreviewOrigin = {
  left: number;
  top: number;
  width: number;
  height: number;
  aspectRatio?: number;
};
export function ResultPreview({
  src,
  alt,
  origin,
}: {
  src: string;
  alt: string;
  origin: PreviewOrigin | null;
}) {
  const image = useRef<HTMLImageElement>(null),
    animation = useRef<Animation | null>(null),
    started = useRef(false);
  const { enabled } = useMotionPreferences();
  const entry = useRef({ enabled, origin });
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const ratio =
    origin?.aspectRatio &&
    Number.isFinite(origin.aspectRatio) &&
    origin.aspectRatio > 0
      ? origin.aspectRatio
      : 1.5;
  useEffect(() => {
    const img = image.current;
    if (!img) return;
    let cancelled = false;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const reveal = () => {
      if (cancelled || started.current) return;
      started.current = true;
      if (
        !entry.current.enabled ||
        media.matches ||
        document.hidden ||
        typeof img.animate !== "function"
      )
        return;
      const b = img.getBoundingClientRect();
      if (!b.width || !b.height) return;
      const origin = entry.current.origin;
      const dx = origin
        ? Math.max(
            -12,
            Math.min(
              12,
              (origin.left + origin.width / 2 - b.left - b.width / 2) * 0.04,
            ),
          )
        : 0;
      const dy = origin
        ? Math.max(
            -12,
            Math.min(
              12,
              (origin.top + origin.height / 2 - b.top - b.height / 2) * 0.04,
            ),
          )
        : 4;
      animation.current = img.animate(
        [
          { opacity: 0.3, transform: `translate(${dx}px,${dy}px) scale(.96)` },
          { opacity: 1, transform: "none" },
        ],
        { duration: 200, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
    };
    const cancel = () => {
      cancelled = true;
      img.removeEventListener("load", reveal);
      animation.current?.cancel();
    };
    const expire = () => {
      cancel();
      img.style.visibility = "hidden";
    };
    const dialog = img.closest("dialog");
    dialog?.addEventListener("shuying-preview-close", cancel);
    img.addEventListener("load", reveal, { once: true });
    if (img.complete && img.naturalWidth) {
      setStatus("ready");
      reveal();
    }
    media.addEventListener("change", cancel);
    document.addEventListener("visibilitychange", cancel);
    window.addEventListener("session-expired", expire);
    return () => {
      cancel();
      dialog?.removeEventListener("shuying-preview-close", cancel);
      media.removeEventListener("change", cancel);
      document.removeEventListener("visibilitychange", cancel);
      window.removeEventListener("session-expired", expire);
    };
  }, [src]);
  return (
    <div
      className="p12-preview-frame"
      data-preview-state={status}
      aria-busy={status === "loading"}
      style={{
        aspectRatio: String(ratio),
        width: `min(702px, calc(100vw - 96px), calc((100dvh - 200px) * ${ratio}))`,
      }}
    >
      <img
        ref={image}
        className="preview-image"
        src={src}
        alt={alt}
        onLoad={() => setStatus("ready")}
        onError={() => setStatus("error")}
      />
      {status === "loading" && (
        <p className="p12-preview-message" role="status">
          正在载入原图…
        </p>
      )}
      {status === "error" && (
        <p className="p12-preview-message" role="alert">
          原图暂时无法加载，请关闭后重新打开。
        </p>
      )}
    </div>
  );
}
