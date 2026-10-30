"use client";
import { useEffect, useRef } from "react";
import { useMotionPreferences } from "../motion/preferences";
export type BorderKind = "electric" | "flow" | "proximity" | "pixel";
export function AnimatedBorder({ kind }: { kind: BorderKind }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      el.classList.toggle("border-sleep", !entry.isIntersecting);
      el.dataset.borderRunning = String(entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={"animated-border border-" + kind}
      data-border={kind}
    >
      <svg viewBox="0 0 300 500" preserveAspectRatio="none">
        <path
          className="border-line"
          pathLength="100"
          d={
            kind === "electric"
              ? "M18 2L62 3 68 1 111 3 120 1 165 3 181 1 226 3 239 1 281 2Q298 2 298 20L297 111 299 121 297 203 299 219 297 313 299 328 298 480Q298 498 280 498L225 497 213 499 158 497 145 499 78 497 68 499 20 498Q2 498 2 480L3 393 1 381 3 278 1 263 3 163 1 151 2 20Q2 2 18 2Z"
              : "M20 2H280Q298 2 298 20V480Q298 498 280 498H20Q2 498 2 480V20Q2 2 20 2Z"
          }
        />
      </svg>
    </span>
  );
}
export function InkBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { enabled } = useMotionPreferences();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = new Image();
    let dead = false,
      raf = 0,
      last = 0,
      w = 0,
      h = 0;
    let points: { x: number; y: number; t: number }[] = [];
    const fog = document.createElement("canvas"),
      clear = document.createElement("canvas"),
      mask = document.createElement("canvas");
    const fc = fog.getContext("2d"),
      cc = clear.getContext("2d"),
      mc = mask.getContext("2d");
    if (!fc || !cc || !mc) return;
    let dirty: { x: number; y: number; w: number; h: number } | null = null;
    const paint = () => {
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
      fog.width = clear.width = w;
      fog.height = clear.height = h;
      // Keep the horizontal scroll at its intended scale instead of filling viewport height.
      const scale = Math.min(Math.max(w, 680) / image.width, 1);
      const iw = image.width * scale,
        ih = image.height * scale;
      const top = 96;
      cc.fillStyle = "#f8f9f7";
      cc.fillRect(0, 0, w, h);
      cc.globalAlpha = 0.78;
      cc.drawImage(image, (w - iw) / 2, top, iw, ih);
      cc.globalAlpha = 1;
      const vertical = cc.createLinearGradient(0, top, 0, top + ih);
      vertical.addColorStop(0, "rgba(248,249,247,1)");
      vertical.addColorStop(0.16, "rgba(248,249,247,0)");
      vertical.addColorStop(0.72, "rgba(248,249,247,0)");
      vertical.addColorStop(1, "rgba(248,249,247,1)");
      cc.fillStyle = vertical;
      cc.fillRect(0, top, w, ih);
      const paper = cc.createLinearGradient(0, 0, w, 0);
      paper.addColorStop(0, "rgba(248,249,247,1)");
      paper.addColorStop(0.26, "rgba(248,249,247,.98)");
      paper.addColorStop(0.56, "rgba(248,249,247,.18)");
      paper.addColorStop(1, "rgba(248,249,247,.04)");
      cc.fillStyle = paper;
      cc.fillRect(0, 0, w, h);
      fc.filter = "blur(4px)";
      fc.drawImage(clear, 0, 0);
      fc.filter = "none";
      fc.fillStyle = "rgba(248,249,247,.22)";
      fc.fillRect(0, 0, w, h);
      ctx.drawImage(fog, 0, 0);
      points = [];
      dirty = null;
      canvas.dataset.inkReady = "true";
    };
    const frame = (time: number) => {
      raf = 0;
      if (dead) return;
      if (time - last < 33) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = time;
      if (document.querySelector("dialog[open]")) points = [];
      points = points.filter((p) => time - p.t < 3500);
      let x = w,
        y = h,
        right = 0,
        bottom = 0;
      for (const p of points) {
        x = Math.min(x, p.x - 130);
        y = Math.min(y, p.y - 130);
        right = Math.max(right, p.x + 130);
        bottom = Math.max(bottom, p.y + 130);
      }
      if (dirty) {
        x = Math.min(x, dirty.x);
        y = Math.min(y, dirty.y);
        right = Math.max(right, dirty.x + dirty.w);
        bottom = Math.max(bottom, dirty.y + dirty.h);
      }
      x = Math.max(0, Math.floor(x));
      y = Math.max(0, Math.floor(y));
      right = Math.min(w, Math.ceil(right));
      bottom = Math.min(h, Math.ceil(bottom));
      const dw = right - x,
        dh = bottom - y;
      if (dw > 0 && dh > 0) {
        ctx.drawImage(fog, x, y, dw, dh, x, y, dw, dh);
        mask.width = dw;
        mask.height = dh;
        mc.clearRect(0, 0, dw, dh);
        for (const p of points) {
          const age = time - p.t,
            a = Math.min(1, (3500 - age) / 1000);
          const g = mc.createRadialGradient(
            p.x - x,
            p.y - y,
            12,
            p.x - x,
            p.y - y,
            120,
          );
          g.addColorStop(0, "rgba(255,255,255," + a + ")");
          g.addColorStop(0.55, "rgba(255,255,255," + a * 0.85 + ")");
          g.addColorStop(1, "rgba(255,255,255,0)");
          mc.fillStyle = g;
          mc.fillRect(p.x - x - 120, p.y - y - 120, 240, 240);
        }
        mc.globalCompositeOperation = "source-in";
        mc.drawImage(clear, x, y, dw, dh, 0, 0, dw, dh);
        mc.globalCompositeOperation = "source-over";
        ctx.save();
        ctx.shadowColor = "rgba(120,114,211,.18)";
        ctx.shadowBlur = 6;
        ctx.drawImage(mask, x, y);
        ctx.restore();
        dirty = points.length ? { x, y, w: dw, h: dh } : null;
      }
      if (points.length) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      if (
        !enabled ||
        e.pointerType === "touch" ||
        !matchMedia("(pointer:fine)").matches ||
        document.querySelector("dialog[open]")
      )
        return;
      const target = e.target as HTMLElement;
      if (
        target.closest(
          "a,button,input,.intro-copy,.section-top,.categories,.template-meta,.maker-panel,.history-panel,header,footer",
        )
      )
        return;
      const t = performance.now(),
        old = points.at(-1);
      if (old && Math.hypot(old.x - e.clientX, old.y - e.clientY) < 15) return;
      points.push({ x: e.clientX, y: e.clientY, t });
      if (points.length > 24) points.shift();
      if (!raf) raf = requestAnimationFrame(frame);
    };
    image.onload = () => {
      if (dead) return;
      paint();
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("resize", paint);
    };
    image.src = "/ink/landscape.webp";
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", paint);
      image.onload = null;
      canvas.width = canvas.height = 0;
      fog.width = clear.width = mask.width = 0;
    };
  }, [enabled]);
  return (
    <canvas
      ref={ref}
      className="ink-backdrop"
      data-ink="landscape"
      aria-hidden="true"
    />
  );
}
const kinds: Record<string, BorderKind> = {
  "demo-story": "electric",
  "demo-postcard": "flow",
  "demo-portrait": "proximity",
  "demo-pet": "pixel",
};
export function cardKind(id: string) {
  return kinds[id];
}
export function CardVisual({ id, src }: { id: string; src: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { enabled } = useMotionPreferences();
  useEffect(() => {
    const canvas = ref.current,
      kind = kinds[id];
    if (!canvas || !kind || !enabled) return;
    const link = canvas.closest("a");
    if (!link) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = new Image();
    const pattern = document.createElement("canvas");
    pattern.width = 0;
    const pc = pattern.getContext("2d", { willReadFrequently: true });
    let ready = false,
      dead = false,
      raf = 0,
      active = false,
      last = 0;
    let x = 0,
      y = 0;
    const particles: { x: number; y: number; t: number }[] = [];
    let phase = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width),
        h = Math.round(rect.height);
      if (canvas.width === w && canvas.height === h && pattern.width === w)
        return;
      canvas.width = w;
      canvas.height = h;
      if (!ready || !pc || !w || !h) return;
      pattern.width = w;
      pattern.height = h;
      if (kind !== "electric" && kind !== "proximity") return;
      const scale = Math.max(w / image.width, h / image.height);
      pc.drawImage(
        image,
        (w - image.width * scale) / 2,
        (h - image.height * scale) / 2,
        image.width * scale,
        image.height * scale,
      );
      const pixels = pc.getImageData(0, 0, w, h).data;
      pc.fillStyle = kind === "electric" ? "#e9e6f4" : "#f1edf5";
      pc.fillRect(0, 0, w, h);
      const step = kind === "electric" ? 6 : 12;
      for (let py = step / 2; py < h; py += step)
        for (let px = step / 2; px < w; px += step) {
          const offset = (Math.floor(py) * w + Math.floor(px)) * 4;
          const light =
            (pixels[offset] * 0.2126 +
              pixels[offset + 1] * 0.7152 +
              pixels[offset + 2] * 0.0722) /
            255;
          const size = Math.max(0.5, (1 - light) * step * 0.53);
          pc.fillStyle = kind === "electric" ? "#645789" : "#45405f";
          if (kind === "electric")
            pc.fillRect(px - size, py - size, size * 1.8, size * 1.8);
          else {
            pc.beginPath();
            pc.arc(px, py, size, 0, Math.PI * 2);
            pc.fill();
          }
        }
    };
    const frame = (time: number) => {
      raf = 0;
      if (dead || !active) return;
      if (time - last < 33) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = time;
      const w = canvas.width,
        h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      phase += 0.13;
      if (ready) {
        const scale = Math.max(w / image.width, h / image.height),
          iw = image.width * scale,
          ih = image.height * scale;
        ctx.save();
        if (kind === "flow") {
          for (let k = 0; k < 3; k++) {
            const radius = 28 + ((phase * 16 + k * 18) % 90);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle =
              "rgba(192,206,255," + 0.35 * (1 - radius / 120) + ")";
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(x, y, 70, 0, Math.PI * 2);
          ctx.clip();
          ctx.globalAlpha = 0.42;
          ctx.drawImage(
            image,
            (w - iw) / 2 + Math.sin(phase) * 3,
            (h - ih) / 2,
            iw,
            ih,
          );
        } else if (kind === "pixel") {
          particles.push({ x, y, t: time });
          while (
            particles.length > 24 ||
            (particles[0] && time - particles[0].t > 600)
          )
            particles.shift();
          for (const p of particles) {
            ctx.globalAlpha = (1 - (time - p.t) / 600) * 0.6;
            ctx.fillStyle = "#b2b5fb";
            ctx.fillRect(
              Math.floor(p.x / 12) * 12,
              Math.floor(p.y / 12) * 12,
              8,
              8,
            );
          }
        } else if (pc && pattern.width) {
          ctx.drawImage(pattern, 0, 0);
          ctx.globalCompositeOperation = "destination-out";
          const radius = kind === "electric" ? 95 : 115;
          const reveal = ctx.createRadialGradient(
            x,
            y,
            radius * 0.3,
            x,
            y,
            radius,
          );
          reveal.addColorStop(0, "rgba(255,255,255,1)");
          reveal.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = reveal;
          ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };
    const enter = () => {
      if (!matchMedia("(pointer:fine)").matches) return;
      window.dispatchEvent(
        new CustomEvent("shuying-card-active", { detail: canvas }),
      );
      active = true;
      resize();
      x = canvas.width / 2;
      y = canvas.height / 2;
      if (!raf) raf = requestAnimationFrame(frame);
      canvas.dataset.active = "true";
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !matchMedia("(pointer:fine)").matches)
        return;
      const b = canvas.getBoundingClientRect();
      x = e.clientX - b.left;
      y = e.clientY - b.top;
      const cardRect = link.getBoundingClientRect();
      link.style.setProperty("--edge-x", `${e.clientX - cardRect.left}px`);
      link.style.setProperty("--edge-y", `${e.clientY - cardRect.top}px`);
      if (!active) enter();
    };
    const leave = () => {
      active = false;
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.length = 0;
      canvas.dataset.active = "false";
    };
    const deactivate = (e: Event) => {
      if ((e as CustomEvent).detail !== canvas) leave();
    };
    window.addEventListener("shuying-card-active", deactivate);
    image.onload = () => {
      ready = true;
      resize();
    };
    image.src = src;
    link.addEventListener("pointermove", move, { passive: true });
    link.addEventListener("pointerleave", leave);
    link.addEventListener("focus", enter);
    link.addEventListener("blur", leave);
    window.addEventListener("scroll", leave, { passive: true });
    return () => {
      dead = true;
      leave();
      window.removeEventListener("shuying-card-active", deactivate);
      image.onload = null;
      link.removeEventListener("pointermove", move);
      link.removeEventListener("pointerleave", leave);
      link.removeEventListener("focus", enter);
      link.removeEventListener("blur", leave);
      window.removeEventListener("scroll", leave);
      canvas.width = canvas.height = pattern.width = pattern.height = 0;
    };
  }, [enabled, id, src]);
  return (
    <canvas
      ref={ref}
      className="card-visual"
      data-card-effect={id}
      aria-hidden="true"
    />
  );
}
