"use client";
import Link from "next/link";
import { nameError, passwordError } from "./validation";
import { useRef, useState, type FormEvent } from "react";
import { useIdentity } from "../providers";
export default function AccountSettings() {
  const { session, authenticate, authBusy, error, retry } = useIdentity();
  const [notice, setNotice] = useState("");
  const passwords = useRef<HTMLFormElement>(null);
  const changeName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authBusy) return;
    const displayName = String(
      new FormData(event.currentTarget).get("displayName") || "",
    ).trim();
    const invalid = nameError(displayName);
    if (invalid) {
      setNotice(invalid);
      return;
    }
    setNotice("");
    try {
      await authenticate("profile", { displayName });
      setNotice("昵称已更新");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "未能更新昵称");
    }
  };
  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authBusy) return;
    const data = new FormData(event.currentTarget),
      newPassword = String(data.get("newPassword") || "");
    const invalid = passwordError(newPassword);
    if (invalid) {
      setNotice(invalid);
      return;
    }
    if (Array.from(String(data.get("currentPassword") || "")).length > 128) {
      setNotice("当前密码超过允许长度");
      return;
    }
    if (newPassword !== data.get("confirmNewPassword")) {
      setNotice("两次输入的新密码不一致");
      return;
    }
    setNotice("");
    try {
      await authenticate("password", {
        currentPassword: String(data.get("currentPassword") || ""),
        newPassword,
      });
      setNotice("密码已修改，其他登录会话已失效。");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "未能修改密码");
    } finally {
      passwords.current?.reset();
    }
  };
  const logout = async () => {
    if (authBusy) return;
    setNotice("");
    try {
      await authenticate("logout");
      setNotice("已退出，当前为新的访客身份。");
    } catch (e) {
      setNotice(
        e instanceof Error ? e.message : "退出结果尚未确认，请恢复查询",
      );
    }
  };
  return (
    <section className="p2-account-page">
      <p className="eyebrow">账户设置</p>
      <h1>{session?.kind === "ACCOUNT" ? session.displayName : "我的账户"}</h1>
      {notice && (
        <p role="status" className="p2-form-message">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert">
          {error}{" "}
          <button onClick={retry} disabled={authBusy}>
            恢复身份查询
          </button>
        </p>
      )}
      {authBusy && !session ? (
        <div className="p2-account-card" role="status">
          正在确认身份，请稍候…
        </div>
      ) : session?.kind !== "ACCOUNT" ? (
        <div className="p2-account-card">
          <h2>你正在以访客身份使用疏影</h2>
          <p>
            浏览、上传和制作都可以直接使用。点击顶部登录 /
            注册，可连接账户并在以后恢复作品。
          </p>
          <Link href="/">探索模板 ↗</Link>
        </div>
      ) : (
        <div className="p2-settings-grid">
          <section className="p2-account-card">
            <h2>个人资料</h2>
            <dl>
              <dt>账户状态</dt>
              <dd>已注册账户</dd>
              <dt>登录邮箱</dt>
              <dd>{session.email}</dd>
            </dl>
            <p className="p2-account-muted">邮箱作为本地登录标识，尚未验证。</p>
            <form onSubmit={changeName} aria-busy={authBusy}>
              <label>
                昵称
                <input
                  name="displayName"
                  autoComplete="nickname"
                  defaultValue={session.displayName}
                  key={session.displayName}
                  required
                  disabled={authBusy}
                />
              </label>
              <button className="p2-account-primary" disabled={authBusy}>
                保存昵称
              </button>
            </form>
            <Link className="p2-personal-link" href="/history">
              查看个人作品 ↗
            </Link>
          </section>
          <section className="p2-account-card">
            <h2>修改密码</h2>
            <p className="p2-account-muted">
              修改后所有旧登录会话会失效，本次连接将自动更新。
            </p>
            <form
              ref={passwords}
              onSubmit={changePassword}
              aria-busy={authBusy}
            >
              <label>
                当前密码
                <input
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={authBusy}
                />
              </label>
              <label>
                新密码
                <input
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={authBusy}
                />
              </label>
              <label>
                确认新密码
                <input
                  name="confirmNewPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={authBusy}
                />
              </label>
              <button className="p2-account-primary" disabled={authBusy}>
                修改密码
              </button>
            </form>
          </section>
          <section className="p2-account-card p2-account-exit">
            <div>
              <h2>退出当前账户</h2>
              <p className="p2-account-muted">
                账户作品仍会保留。退出后以新的访客身份继续使用。
              </p>
            </div>
            <button onClick={logout} disabled={authBusy}>
              退出登录
            </button>
          </section>
        </div>
      )}
    </section>
  );
}
