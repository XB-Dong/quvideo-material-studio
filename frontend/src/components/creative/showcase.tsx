"use client";
import {
  lazy,
  Suspense,
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { Template } from "../../lib/types";
import { useMotionPreferences } from "../motion/preferences";
const Orbit = lazy(() => import("../react-bits/OrbitImages")),
  Glow = lazy(() => import("../react-bits/GlowCursor")),
  Electric = lazy(() => import("../react-bits/ElectricBorder")),
  Dither = lazy(() => import("../react-bits/DitherVeil")),
  Ripple = lazy(() => import("../react-bits/RippleDistortion")),
  Halftone = lazy(() => import("../react-bits/HalftoneReveal")),
  Pixel = lazy(() => import("../react-bits/PixelTrail"));
class SafeEffect extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function PublicImage({
  src,
  alt,
  className,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed ? "/media/demo/postcard.png" : src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
export function CreativeShowcase({
  templates,
  children,
}: {
  templates: Template[];
  children: ReactNode;
}) {
  const { enabled } = useMotionPreferences();
  const [fine, setFine] = useState(false),
    [desktop, setDesktop] = useState(false),
    [owner, setOwner] = useState<string | null>(null),
    [paused, setPaused] = useState(false),
    [hovered, setHovered] = useState(false),
    [galleryVisible, setGalleryVisible] = useState(false),
    [heroVisible, setHeroVisible] = useState(false),
    [tab, setTab] = useState(0),
    [degraded, setDegraded] = useState(false);
  const hero = useRef<HTMLElement>(null),
    gallery = useRef<HTMLElement>(null),
    idle = useRef<ReturnType<typeof setTimeout> | null>(null),
    electricTime = useRef(-2000);
  useEffect(() => {
    const pointer = matchMedia("(hover:hover) and (pointer:fine)"),
      width = matchMedia("(min-width:901px)");
    const sync = () => {
      setFine(pointer.matches);
      setDesktop(width.matches);
    };
    sync();
    pointer.addEventListener("change", sync);
    width.addEventListener("change", sync);
    return () => {
      pointer.removeEventListener("change", sync);
      width.removeEventListener("change", sync);
    };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero.current)
            setHeroVisible(entry.isIntersecting);
          if (entry.target === gallery.current)
            setGalleryVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.15 },
    );
    if (hero.current) observer.observe(hero.current);
    if (gallery.current) observer.observe(gallery.current);
    return () => {
      observer.disconnect();
      if (idle.current) clearTimeout(idle.current);
    };
  }, []);
  useEffect(() => {
    if (!enabled || !owner) return;
    let raf = 0,
      start = 0,
      frames = 0;
    const tick = (time: number) => {
      if (!start) start = time;
      frames++;
      if (time - start > 2200) {
        if ((frames / (time - start)) * 1000 < 45) {
          setDegraded(true);
          return;
        }
        start = time;
        frames = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, owner]);
  useEffect(() => {
    const lost = () => setDegraded(true);
    document.addEventListener("webglcontextlost", lost, true);
    return () => document.removeEventListener("webglcontextlost", lost, true);
  }, []);
  const active = enabled && fine && !degraded;
  const current =
    active &&
    (owner === "glow" || owner === "electric" ? heroVisible : galleryVisible)
      ? owner
      : null;
  const clear = () => {
    if (idle.current) clearTimeout(idle.current);
    setOwner(null);
  };
  const wake = (name: string, delay: number) => {
    if (!active) return;
    if (idle.current) clearTimeout(idle.current);
    setOwner(name);
    idle.current = setTimeout(() => setOwner(null), delay);
  };
  const electric = () => {
    if (performance.now() - electricTime.current < 2000) return;
    electricTime.current = performance.now();
    wake("electric", 600);
  };
  const ordered = [
    templates.find((t) => t.id === "demo-story"),
    templates.find((t) => t.id === "demo-postcard"),
    templates.find((t) => t.id === "demo-portrait"),
    templates.find((t) => t.id === "demo-pet"),
  ].map((t, i) => t || templates[i % templates.length]);
  const selected = ordered[tab];
  const images = templates
    .slice(0, 3)
    .map((t) => ({ src: t.coverUrl, alt: t.title }));
  return (
    <>
      <section
        className="intro"
        aria-label="创作引导"
        ref={hero}
        data-owner={current || "none"}
        onPointerMove={(e) => {
          if ((e.target as HTMLElement).closest("a,button,input")) return;
          wake("glow", 480);
        }}
        onPointerLeave={clear}
      >
        {current === "glow" && (
          <SafeEffect key="glow">
            <Suspense fallback={null}>
              <Glow
                className="hero-glow"
                theme="light"
                color="#4f63d8"
                secondaryColor="#7961c5"
                intensity={0.4}
                glow={0.15}
                hotspot={0.1}
                trailWidth={0.2}
                linger={0.15}
                grain={0}
                clickBurst={false}
                quality="low"
                maxDevicePixelRatio={1.25}
              />
            </Suspense>
          </SafeEffect>
        )}
        <div>
          <p className="eyebrow">MADE OF YOUR MOMENTS</p>
          <h1>
            把日常，变成
            <br />
            值得留住的作品。
          </h1>
          <p>选一张模板，让你的照片有新的表达。</p>
          <div className="hero-actions">
            <Link
              className="hero-cta"
              href={
                templates[0] ? "/templates/" + templates[0].id : "#templates"
              }
              onPointerEnter={electric}
              onFocus={electric}
            >
              开始创作 <span aria-hidden="true">↗</span>
              {current === "electric" && (
                <span className="electric-slot" aria-hidden="true">
                  <SafeEffect key="electric">
                    <Suspense fallback={null}>
                      <Electric
                        theme="light"
                        color="#4f63d8"
                        glowColor="#7961c5"
                        glow={0}
                        spread={0.2}
                        flicker={0}
                        chaos={0.12}
                        intensity={0.5}
                        thickness={1}
                        intro={false}
                        interactive={false}
                      />
                    </Suspense>
                  </SafeEffect>
                </span>
              )}
            </Link>
            <a href="#templates" onPointerEnter={clear}>
              浏览模板
            </a>
          </div>
        </div>
        <div
          className="hero-art"
          onPointerEnter={() => {
            setHovered(true);
            clear();
          }}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => {
            setHovered(true);
            clear();
          }}
          onBlur={() => setHovered(false)}
        >
          <div
            className="poster-stack"
            aria-hidden={enabled && desktop ? true : undefined}
          >
            {images.map((i) => (
              <PublicImage
                key={i.src}
                src={i.src}
                alt={i.alt}
                loading="eager"
              />
            ))}
          </div>
          {enabled && desktop && heroVisible && (
            <div className="orbit-slot" data-effect="orbit">
              <SafeEffect>
                <Suspense fallback={null}>
                  <Orbit
                    images={images}
                    duration={36}
                    itemSize={86}
                    height={220}
                    radiusX={130}
                    radiusY={54}
                    paused={paused || hovered || current !== null}
                    alignToPath={false}
                    draggable={false}
                    clickToFront={false}
                    intro={false}
                    showPath
                    pathColor="#c8c2e8"
                    pathWidth={1}
                    depth={0}
                    shadow={0.1}
                  />
                </Suspense>
              </SafeEffect>
            </div>
          )}
          <button
            className="orbit-pause"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? "继续" : "暂停"}
          </button>
        </div>
      </section>
      {children}
      <section className="gallery" ref={gallery}>
        <div className="gallery-top">
          <h2>灵感作品</h2>
          <div className="gallery-tabs" role="tablist" aria-label="作品题材">
            {["创意", "旅行", "人像", "宠物"].map((name, i) => (
              <button
                key={name}
                role="tab"
                id={"gallery-tab-" + i}
                aria-controls="gallery-panel"
                aria-selected={tab === i}
                onClick={() => {
                  clear();
                  setTab(i);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    clear();
                    const next = (tab + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                    setTab(next);
                    e.currentTarget.parentElement
                      ?.querySelectorAll("button")
                      [next]?.focus();
                  }
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        {selected && (
          <div
            id="gallery-panel"
            role="tabpanel"
            aria-labelledby={"gallery-tab-" + tab}
            className="gallery-frame"
            data-effect={["dither", "ripple", "halftone", "pixel"][tab]}
            data-owner={current || "none"}
            onPointerMove={() => wake("gallery-" + tab, tab === 1 ? 600 : 450)}
            onPointerLeave={clear}
            onContextMenu={() => clear()}
          >
            <PublicImage
              src={selected.coverUrl}
              alt={selected.title}
              className="gallery-poster"
            />
            {current === "gallery-" + tab && (
              <div className="gallery-effect" aria-hidden="true">
                <SafeEffect key={current}>
                  <Suspense fallback={null}>
                    {tab === 0 ? (
                      <Dither
                        src={selected.coverUrl}
                        fit="contain"
                        inkColor="#4654b4"
                        paperColor="#f7f8fc"
                        revealRadius={Math.min(
                          32,
                          (gallery.current?.clientWidth || 315) * 0.1,
                        )}
                        linger={0.3}
                        wander={false}
                        clickBurst={false}
                      />
                    ) : tab === 1 ? (
                      <Ripple
                        src={selected.coverUrl}
                        strength={0.008}
                        quality="low"
                        fade={0.2}
                        dispersion={0}
                        glint={0}
                        swirl={0}
                      />
                    ) : tab === 2 ? (
                      <Halftone
                        src={selected.coverUrl}
                        fit="contain"
                        inkColor="#4654b4"
                        paperColor="#f7f8fc"
                        revealRadius={Math.min(
                          32,
                          (gallery.current?.clientWidth || 315) * 0.1,
                        )}
                        linger={0.3}
                        wander={false}
                        clickBurst={false}
                        intro={false}
                      />
                    ) : (
                      <Pixel
                        imageSrc={selected.coverUrl}
                        maxAge={450}
                        trailSize={0.2}
                        color="#7961c5"
                        sparkle={0}
                        glow={0}
                        shine={0}
                        clickBurst={false}
                        dpr={1}
                      />
                    )}
                  </Suspense>
                </SafeEffect>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
