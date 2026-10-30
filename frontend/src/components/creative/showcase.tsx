"use client";
import {
  lazy,
  Suspense,
  Component,
  createRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { Template } from "../../lib/types";
import { releaseContext } from "../react-bits/context-lifecycle";
import { useMotionPreferences } from "../motion/preferences";
import {
  LinkPending,
  beginCoverTransition,
  clickFeedback,
} from "../motion/journey";
import { AnimatedBorder } from "./visuals";
const Orbit = lazy(() => import("../react-bits/OrbitImages"));
export class SafeEffect extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  root = createRef<HTMLDivElement>();
  canvases = new Set<HTMLCanvasElement>();
  observer: MutationObserver | null = null;
  static getDerivedStateFromError() {
    return { failed: true };
  }
  gather = (node: Node) => {
    if (node instanceof HTMLCanvasElement) this.canvases.add(node);
    if (node instanceof Element)
      node.querySelectorAll("canvas").forEach((c) => this.canvases.add(c));
  };
  release = () => {
    this.canvases.forEach(releaseContext);
    this.canvases.clear();
  };
  componentDidMount() {
    if (!this.root.current) return;
    this.gather(this.root.current);
    this.observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(this.gather));
      if (this.state.failed) this.release();
    });
    this.observer.observe(this.root.current, {
      childList: true,
      subtree: true,
    });
  }
  componentDidCatch() {
    this.release();
  }
  componentWillUnmount() {
    this.observer?.disconnect();
    this.release();
  }
  render() {
    return (
      <div ref={this.root} style={{ display: "contents" }}>
        {this.state.failed ? null : this.props.children}
      </div>
    );
  }
}
export function PublicImage({
  src,
  alt,
  className,
  loading = "lazy",
  publicId,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  publicId?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;
  return (
    <img
      src={failed ? "/media/demo/postcard.png" : src}
      alt={alt}
      data-public-cover={publicId}
      className={className}
      loading={loading}
      onError={() => {
        if (!failed) setFailedSrc(src);
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
  const hero = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (hero.current) observer.observe(hero.current);
    return () => observer.disconnect();
  }, []);
  const images = templates
    .slice(0, 3)
    .map((t) => ({ src: t.coverUrl, alt: t.title }));
  return (
    <>
      <section className="intro" aria-label="创作引导" ref={hero}>
        <div className="intro-copy">
          <p className="eyebrow">SHUYING · FOR YOUR MOMENTS</p>
          <h1>
            让灵感，
            <br />
            落成作品。
          </h1>
          <p>选一张模板，让你的照片有新的表达。</p>
          <div className="hero-actions">
            <Link
              className="hero-cta"
              onPointerDown={(e) => clickFeedback(e.currentTarget)}
              onNavigate={() => {
                if (templates[0]) beginCoverTransition(templates[0].id);
              }}
              href={
                templates[0] ? "/templates/" + templates[0].id : "#templates"
              }
            >
              <LinkPending />
              <span className="cta-label">
                开始创作 <span aria-hidden="true">↗</span>
              </span>
              <AnimatedBorder kind="electric" />
            </Link>
            <a href="#templates">浏览模板</a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="poster-stack">
            {images.map((i) => (
              <PublicImage key={i.src} src={i.src} alt="" loading="eager" />
            ))}
          </div>
          {enabled && visible && images.length > 0 && (
            <div className="orbit-slot" data-effect="orbit">
              <SafeEffect>
                <Suspense fallback={null}>
                  <Orbit
                    images={images}
                    duration={42}
                    itemSize={86}
                    height={220}
                    radiusX={130}
                    radiusY={54}
                    paused={false}
                    hoverSpeed={1}
                    hoverScale={1}
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
        </div>
      </section>
      {children}
    </>
  );
}
