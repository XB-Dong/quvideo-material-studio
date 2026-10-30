"use client";
import Link from "next/link";
import { nameError, passwordError } from "./validation";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Modal } from "../shell";
import { useIdentity } from "../providers";
import "../../app/account.css";
export default function AccountDialog({
  initial = "login",
  onClose,
}: {
  initial?: "login" | "register" | "guest";
  onClose: () => void;
}) {
  const [mode, setMode] = useState(initial),
    [message, setMessage] = useState("");
  const { session, authenticate, authBusy } = useIdentity();
  const form = useRef<HTMLFormElement>(null),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authBusy) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const invalid =
      passwordError(password) ||
      (mode === "register"
        ? nameError(String(data.get("displayName") || ""))
        : null);
    if (invalid) {
      setMessage(invalid);
      return;
    }
    if (mode === "register" && password !== data.get("confirmPassword")) {
      setMessage("两次输入的密码不一致");
      return;
    }
    setMessage("");
    try {
      await authenticate(
        mode === "register" ? "register" : "login",
        mode === "register"
          ? {
              displayName: String(data.get("displayName") || "").trim(),
              email: String(data.get("email") || "").trim(),
              password,
            }
          : { email: String(data.get("email") || "").trim(), password },
      );
      if (alive.current)
        setMessage(
          mode === "register"
            ? "注册成功，当前访客作品已保留。"
            : "已登录，个人作品已切换为此账户。",
        );
    } catch (e) {
      if (alive.current)
        setMessage(e instanceof Error ? e.message : "暂时无法完成，请稍后重试");
    } finally {
      if (alive.current)
        form.current
          ?.querySelectorAll<HTMLInputElement>('input[type="password"]')
          .forEach((input) => (input.value = ""));
    }
  };
  return (
    <Modal
      title={
        session?.kind === "ACCOUNT"
          ? "账户已连接"
          : mode === "guest"
            ? "当前访客"
            : mode === "register"
              ? "注册疏影账户"
              : "登录疏影账户"
      }
      onClose={onClose}
    >
      <div className="p2-account-form">
        {message && (
          <p className="p2-form-message" role="status">
            {message}
          </p>
        )}
        {session?.kind === "ACCOUNT" ? (
          <>
            <p className="p2-account-greeting">{session.displayName}</p>
            <p className="p2-account-muted">
              已连接账户，可以继续查看自己的作品。
            </p>
            <div className="p2-account-links">
              <Link href="/account" onClick={onClose}>
                账户设置 ↗
              </Link>
              <Link href="/history" onClick={onClose}>
                个人作品 ↗
              </Link>
            </div>
          </>
        ) : mode === "guest" ? (
          <>
            <p>你正在以访客身份创作。</p>
            <p className="p2-account-muted">
              注册后可保留当前访客作品与正在制作的任务。登录已有账户不会合并这些作品。
            </p>
            <div className="p2-account-links">
              <button type="button" onClick={() => setMode("login")}>
                登录账户
              </button>
              <button type="button" onClick={() => setMode("register")}>
                注册账户
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p2-auth-tabs" aria-label="登录或注册">
              <button
                type="button"
                aria-pressed={mode === "login"}
                disabled={authBusy}
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
              >
                登录
              </button>
              <button
                type="button"
                aria-pressed={mode === "register"}
                disabled={authBusy}
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
              >
                注册
              </button>
            </div>
            <p className="p2-account-muted">
              {mode === "register"
                ? "升级当前访客身份，已有作品会保留。"
                : "登录已有账户不会自动合并当前访客作品。"}
            </p>
            <form ref={form} onSubmit={submit} aria-busy={authBusy}>
              {mode === "register" && (
                <label>
                  昵称
                  <input
                    name="displayName"
                    autoComplete="nickname"
                    required
                    disabled={authBusy}
                  />
                </label>
              )}
              <label>
                邮箱
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  maxLength={254}
                  disabled={authBusy}
                />
              </label>
              <label>
                密码
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  required
                  disabled={authBusy}
                />
              </label>
              {mode === "register" && (
                <>
                  <label>
                    确认密码
                    <input
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      disabled={authBusy}
                    />
                  </label>
                  <small>
                    密码12–128字符。邮箱用于本地登录，尚未邮件验证。
                  </small>
                </>
              )}
              <button className="p2-account-primary" disabled={authBusy}>
                {authBusy
                  ? "正在确认身份…"
                  : mode === "register"
                    ? "注册并保留作品"
                    : "登录账户"}
              </button>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
