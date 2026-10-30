"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useId } from "react";
import { useIdentity } from "./providers";
import { useMotionPreferences } from "./motion/preferences";

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { enabled } = useMotionPreferences();
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const close = () => {
    if (closing) return;
    if (!enabled) {
      onClose();
      return;
    }
    setClosing(true);
    timer.current = setTimeout(() => {
      ref.current?.close();
      onClose();
    }, 120);
  };
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    if (ref.current && !ref.current.open) ref.current.showModal();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={closing ? "modal-closing" : undefined}
      onCancel={(event) => {
        event.preventDefault();
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
export function Shell({ children }: { children: React.ReactNode }) {
  const { session, error, retry } = useIdentity();
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-mark">疏</span>
          <span>
            疏影<span className="brand-caption">SHUYING STUDIO</span>
          </span>
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
      <main>{children}</main>
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
