"use client";
import Link from "next/link";
import "./account/header.css";
import { useState, useRef, useEffect, useId, lazy, Suspense } from "react";
import { useIdentity } from "./providers";
import { useMotionPreferences } from "./motion/preferences";

const AccountDialog = lazy(() => import("./account/dialog"));

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
  const { session, error, retry, authBusy } = useIdentity();
  const [open, setOpen] = useState<"login" | "guest" | null>(null);
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand p12-wordmark" aria-label="疏影">
          <span>疏影</span>
        </Link>
        <nav aria-label="主导航">
          <Link href="/">探索模板</Link>
          <Link href="/history">我的作品</Link>
          {session?.kind === "ACCOUNT" ? (
            <Link
              href="/account"
              className="identity-button"
              aria-label="账户设置"
            >
              <span className="avatar">◉</span>
              <span className="p2-account-name">{session.displayName}</span>
            </Link>
          ) : (
            <>
              <button
                className="identity-button p2-identity-button"
                disabled={authBusy}
                onClick={() => setOpen("guest")}
              >
                <span className="avatar">◉</span>
                <span className="p2-identity-label">
                  <small className="p2-guest-label">访客</small>
                  {session?.displayName || "连接身份中"}
                </span>
              </button>
              <button
                className="p2-auth-entry"
                disabled={authBusy}
                onClick={() => setOpen("login")}
              >
                登录 / 注册
              </button>
            </>
          )}
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
        <a
          href="https://github.com/XB-Dong"
          target="_blank"
          rel="noopener noreferrer"
        >
          阳光魔力小牛马
        </a>
        <small>模拟制作演示 · 无真实 AI 调用</small>
      </footer>
      {open && (
        <Suspense fallback={null}>
          <AccountDialog initial={open} onClose={() => setOpen(null)} />
        </Suspense>
      )}
    </>
  );
}
