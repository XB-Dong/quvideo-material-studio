"use client";
import { useEffect, useRef, type RefObject } from "react";
import { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useMotionPreferences } from "./preferences";
import { useIdentity } from "../providers";

type Cover = {
  id: string;
  src: string;
  rect: { left: number; top: number; width: number; height: number };
  from: string;
};
export function beginCoverTransition(id: string) {
  if (typeof window === "undefined") return;
  const img =
    document.querySelector<HTMLImageElement>(
      `[data-public-cover="${CSS.escape(id)}"]`,
    ) ||
    document.querySelector<HTMLImageElement>(
      `a.template-card[href="/templates/${CSS.escape(id)}"] img`,
    );
  if (!img) return;
  const src = new URL(img.currentSrc || img.src, location.href);
  if (
    src.origin !== location.origin ||
    !src.pathname.startsWith("/media/demo/")
  )
    return;
  const b = img.getBoundingClientRect();
  window.dispatchEvent(
    new CustomEvent("shuying-cover", {
      detail: {
        id,
        src: src.href,
        rect: { left: b.left, top: b.top, width: b.width, height: b.height },
        from: location.pathname,
      },
    }),
  );
}
export function clickFeedback(element: HTMLElement) {
  const r = element.getBoundingClientRect();
  window.dispatchEvent(
    new CustomEvent("shuying-click", {
      detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 },
    }),
  );
}
export function useSceneVisibility(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([e]) =>
      el.classList.toggle("p12-offscreen", !e.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
export function SceneEdge() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) =>
      el.classList.toggle("p12-offscreen", !e.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <svg
      ref={ref}
      className="p12-scene-edge"
      viewBox="0 0 600 24"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 16Q100 -8 200 12T400 12T600 10" />
      <path
        className="p12-scene-current"
        pathLength="100"
        d="M0 16Q100 -8 200 12T400 12T600 10"
      />
    </svg>
  );
}
export function VisualJourney() {
  const pathname = usePathname(),
    { enabled } = useMotionPreferences(),
    { session } = useIdentity();
  const layer = useRef<HTMLDivElement>(null),
    pending = useRef<Cover | null>(null);
  const generation = useRef(0);
  const cleanup = useRef<() => void>(() => {});
  useEffect(() => {
    if (!enabled) return;
    const start = (e: Event) => {
      cleanup.current();
      generation.current++;
      pending.current = (e as CustomEvent<Cover>).detail;
    };
    const click = (e: Event) => {
      if (!layer.current) return;
      cleanup.current();
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      const node = document.createElement("span");
      node.className = "p12-click-bloom";
      node.style.left = x + "px";
      node.style.top = y + "px";
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement("i");
        dot.style.setProperty("--dx", Math.cos((i * Math.PI) / 3) * 19 + "px");
        dot.style.setProperty("--dy", Math.sin((i * Math.PI) / 3) * 19 + "px");
        node.append(dot);
      }
      layer.current.append(node);
      const timer = setTimeout(() => node.remove(), 260);
      cleanup.current = () => {
        clearTimeout(timer);
        node.remove();
      };
    };
    const cancel = () => {
      generation.current++;
      pending.current = null;
      cleanup.current();
      layer.current?.replaceChildren();
    };
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", cancel);
    window.addEventListener("shuying-cover", start);
    window.addEventListener("shuying-click", click);
    window.addEventListener("popstate", cancel);
    window.addEventListener("session-expired", cancel);
    document.addEventListener("visibilitychange", cancel);
    return () => {
      cancel();
      media.removeEventListener("change", cancel);
      window.removeEventListener("shuying-cover", start);
      window.removeEventListener("shuying-click", click);
      window.removeEventListener("popstate", cancel);
      window.removeEventListener("session-expired", cancel);
      document.removeEventListener("visibilitychange", cancel);
    };
  }, [enabled, session?.userId]);
  useEffect(() => {
    const cover = pending.current;
    if (!enabled || !cover || cover.from === pathname) return;
    const gen = generation.current;
    let observer: MutationObserver | null = null,
      timer: ReturnType<typeof setTimeout> | undefined;
    const cancel = () => {
      observer?.disconnect();
      if (timer) clearTimeout(timer);
      cleanup.current();
    };
    const connect = () => {
      if (gen !== generation.current) return;
      const target = document.querySelector<HTMLImageElement>(
        `[data-public-cover="${CSS.escape(cover.id)}"]`,
      );
      if (!target || !layer.current) return false;
      const to = target.getBoundingClientRect();
      if (!to.width || !to.height) return false;
      observer?.disconnect();
      pending.current = null;
      cleanup.current();
      const image = document.createElement("img");
      image.src = cover.src;
      image.alt = "";
      image.className = "p12-cover-bridge";
      image.style.cssText += `;left:${to.left}px;top:${to.top}px;width:${to.width}px;height:${to.height}px`;
      layer.current.append(image);
      if (typeof image.animate !== "function") {
        image.remove();
        return true;
      }
      const animation = image.animate(
        [
          {
            left: cover.rect.left + "px",
            top: cover.rect.top + "px",
            width: cover.rect.width + "px",
            height: cover.rect.height + "px",
            opacity: 0.9,
          },
          {
            left: to.left + "px",
            top: to.top + "px",
            width: to.width + "px",
            height: to.height + "px",
            opacity: 0,
          },
        ],
        { duration: 260, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
      const remove = () => image.remove();
      animation.onfinish = remove;
      animation.oncancel = remove;
      cleanup.current = () => {
        animation.cancel();
        remove();
      };
      return true;
    };
    if (!connect()) {
      observer = new MutationObserver(connect);
      observer.observe(document.body, { subtree: true, childList: true });
      timer = setTimeout(() => {
        observer?.disconnect();
        if (gen === generation.current) pending.current = null;
      }, 700);
    }
    return cancel;
  }, [pathname, enabled]);
  return <div ref={layer} className="p12-visual-layer" aria-hidden="true" />;
}

export function LinkPending() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className="p12-link-progress"
      data-pending={pending}
    />
  );
}
