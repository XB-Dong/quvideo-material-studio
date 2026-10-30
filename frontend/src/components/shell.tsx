"use client";
import Link from "next/link";
import { InkBackdrop } from "./creative/visuals";
import { useState, useRef, useEffect, useId } from "react";
import { useIdentity } from "./providers";
import { useMotionPreferences } from "./motion/preferences";

export function Modal({
  title,
  children,
  onClose,
  origin,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  origin?: { left: number; top: number; width: number; height: number } | null;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const animation = useRef<Animation | null>(null);
  const latestClose = useRef(onClose);
  latestClose.current = onClose;
  const { enabled } = useMotionPreferences();
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const close = () => {
    if (closing) return;
    ref.current?.dispatchEvent(new Event("shuying-preview-close"));
    if (!enabled) {
      onClose();
      return;
    }
    setClosing(true);
    animation.current?.cancel();
    const image =
      ref.current?.querySelector<HTMLImageElement>(".preview-image");
    if (
      image &&
      image.naturalWidth &&
      origin &&
      typeof image.animate === "function"
    ) {
      const b = image.getBoundingClientRect();
      animation.current = image.animate(
        [
          { transform: "none", opacity: 1 },
          {
            transform: `translate(${origin.left + origin.width / 2 - b.left - b.width / 2}px,${origin.top + origin.height / 2 - b.top - b.height / 2}px) scale(.94)`,
            opacity: 0,
          },
        ],
        { duration: 120, easing: "ease-in", fill: "forwards" },
      );
    }
    timer.current = setTimeout(() => {
      ref.current?.close();
      onClose();
    }, 120);
  };
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    if (ref.current && !ref.current.open) ref.current.showModal();
    return () => {
      animation.current?.cancel();
      if (timer.current) clearTimeout(timer.current);
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  useEffect(() => {
    if (!enabled) {
      animation.current?.cancel();
      if (closing) {
        if (timer.current) clearTimeout(timer.current);
        latestClose.current();
      }
    }
  }, [enabled, closing]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={closing ? "p12-dialog modal-closing" : "p12-dialog"}
      onCancel={(event) => {
        event.preventDefault();
        ref.current?.dispatchEvent(new Event("shuying-preview-close"));
        animation.current?.cancel();
        ref.current?.close();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="modal-heading">
        <h2 id={titleId}>{title}</h2>
        <button className="icon-button" aria-label="关闭对话框" onClick={close}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Shell({
  children,
  mainClass,
}: {
  children: React.ReactNode;
  mainClass?: string;
}) {
  const { session, error, retry } = useIdentity();
  const [open, setOpen] = useState(false);
  return (
    <>
      <InkBackdrop />
      <header className="site-header">
        <Link href="/" className="brand p12-wordmark" aria-label="疏影">
          <span>疏影</span>
        </Link>
        <nav aria-label="主导航">
          <Link href="/">探索模板</Link>
          <Link href="/history">我的作品</Link>
          <button className="identity-button" onClick={() => setOpen(true)}>
            <span className="avatar">◉</span>
            {session?.displayName || "连接身份中"}
          </button>
        </nav>
      </header>
      {error && (
        <div className="banner" role="alert">
          {error}
          <button onClick={retry}>重新连接</button>
        </div>
      )}
      <main className={mainClass}>{children}</main>
      <footer>
        疏影工作室 <span>让每一份灵感，都有自己的画面。</span>
        <small>模拟制作演示 · 无真实 AI 调用</small>
      </footer>
      {open && (
        <Modal title="当前身份" onClose={() => setOpen(false)}>
          <div className="identity-panel">
            <span className="large-avatar">◉</span>
            <h3>{session?.displayName || "身份未连接"}</h3>
            <code>{session?.userId || "—"}</code>
            <p>此浏览器使用独立匿名身份，作品仅对当前会话可见。</p>
            <p>
              打开无痕窗口可体验另一位用户。清除 Cookie
              后，原身份的记录无法找回。
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
