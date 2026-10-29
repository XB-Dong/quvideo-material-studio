"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useIdentity } from "./providers";
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
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="关闭对话框"
          onClick={onClose}
        >
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
          <span className="brand-mark">映</span>
          <span>
            映作<span className="brand-caption">MATERIAL STUDIO</span>
          </span>
        </Link>
        <nav>
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
        映作工作室 <span>让每一份灵感，都有自己的画面。</span>
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
