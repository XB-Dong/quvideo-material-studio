import { useEffect } from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, it, expect, vi } from "vitest";
import { Providers, useIdentity } from "./providers";
import { api } from "../lib/api";
import type { Session } from "../lib/types";
let identity: ReturnType<typeof useIdentity>;
function Probe() {
  const current = useIdentity();
  useEffect(() => {
    identity = current;
  }, [current]);
  return (
    <output>
      {current.session?.userId || "none"}:{String(current.authBusy)}:
      {current.session?.kind}
    </output>
  );
}
const guest = {
  userId: "guest-1",
  displayName: "访客",
  expiresAt: "2030-01-01T00:00:00Z",
  kind: "GUEST",
} as Session;
const account = {
  ...guest,
  kind: "ACCOUNT",
  email: "test@example.test",
} as Session;
const response = (s: Session) => new Response(JSON.stringify(s));
beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
async function boot() {
  render(
    <Providers>
      <Probe />
    </Providers>,
  );
  await screen.findByText("guest-1:false:GUEST");
}
it("serializes initialization and retry with login and retains its lock after the consumer closes", async () => {
  let finish!: () => void;
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((path: string) => {
      calls.push(path);
      if (calls.length === 1)
        return new Promise<Response>(
          (resolve) => (finish = () => resolve(response(guest))),
        );
      return Promise.resolve(response(account));
    }),
  );
  const view = render(
    <Providers>
      <Probe />
    </Providers>,
  );
  await waitFor(() => expect(calls).toHaveLength(1));
  let rejected: unknown;
  await act(async () => {
    rejected = await identity
      .authenticate("login", {
        email: "test@example.test",
        password: "test-password-123",
      })
      .catch((e) => e);
    identity.retry();
  });
  expect(rejected).toHaveProperty("code", "AUTH_BUSY");
  expect(calls).toEqual(["/api/session"]);
  await act(async () => finish());
  await screen.findByText("guest-1:false:GUEST");
  let release!: () => void;
  vi.stubGlobal(
    "fetch",
    vi.fn((path: string) => {
      calls.push(path);
      return new Promise<Response>(
        (resolve) => (release = () => resolve(response(account))),
      );
    }),
  );
  let pending!: Promise<Session>;
  await act(async () => {
    pending = identity.authenticate("login", {
      email: "test@example.test",
      password: "test-password-123",
    });
    await Promise.resolve();
  });
  view.rerender(
    <Providers>
      <Probe />
      <p>another route</p>
    </Providers>,
  );
  let second: unknown;
  await act(async () => {
    second = await identity.authenticate("logout").catch((e) => e);
    identity.retry();
  });
  expect(second).toHaveProperty("code", "AUTH_BUSY");
  expect(calls.filter((x) => x === "/api/auth/login")).toHaveLength(1);
  await act(async () => {
    release();
    await pending;
  });
  await screen.findByText("guest-1:false:ACCOUNT");
});
it("keeps AUTH_INVALID a form error rather than expiring the current guest", async () => {
  const expired = vi.fn();
  window.addEventListener("session-expired", expired);
  vi.stubGlobal(
    "fetch",
    vi.fn(async (path: string) =>
      path === "/api/session"
        ? response(guest)
        : new Response(
            JSON.stringify({
              code: "AUTH_INVALID",
              message: "邮箱或密码不正确",
            }),
            { status: 401 },
          ),
    ),
  );
  await boot();
  await act(async () => {
    await identity
      .authenticate("login", {
        email: "test@example.test",
        password: "wrong-password-123",
      })
      .catch(() => {});
  });
  expect(expired).not.toHaveBeenCalled();
  expect(identity.session?.userId).toBe("guest-1");
  expect(identity.error).toBeNull();
  window.removeEventListener("session-expired", expired);
});
it("reconciles an unknown cookie-writing outcome only with GET session and never repeats the POST", async () => {
  const calls: { path: string; method: string }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (path: string, init: RequestInit) => {
      calls.push({ path, method: init?.method || "GET" });
      if (path === "/api/auth/register")
        throw new TypeError("connection interrupted");
      return response(calls.length === 1 ? guest : account);
    }),
  );
  await boot();
  let result: unknown;
  await act(async () => {
    result = await identity
      .authenticate("register", {
        displayName: "test",
        email: "test@example.test",
        password: "test-password-123",
      })
      .catch((e) => e);
  });
  expect(result).toHaveProperty("code", "AUTH_OUTCOME_UNKNOWN");
  expect(calls).toEqual([
    { path: "/api/session", method: "POST" },
    { path: "/api/auth/register", method: "POST" },
    { path: "/api/session", method: "GET" },
  ]);
  expect(identity.session?.kind).toBe("ACCOUNT");
  expect(identity.authBusy).toBe(false);
});
it("does not reset ownership generation or uploads for a nickname-only update", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (path: string) =>
      response(
        path === "/api/account/profile"
          ? { ...account, displayName: "新名字" }
          : account,
      ),
    ),
  );
  render(
    <Providers>
      <Probe />
    </Providers>,
  );
  await screen.findByText("guest-1:false:ACCOUNT");
  const before = identity.epoch.current;
  await act(async () => {
    await identity.authenticate("profile", { displayName: "新名字" });
  });
  expect(identity.epoch.current).toBe(before);
  expect(identity.session?.displayName).toBe("新名字");
  expect(identity.session?.userId).toBe("guest-1");
});
it("ignores an old 401 body after an account transition", async () => {
  let finish!: () => void;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (path: string) => {
      if (path === "/old-personal")
        return {
          ok: false,
          status: 401,
          json: () =>
            new Promise(
              (resolve) => (finish = () => resolve({ message: "expired" })),
            ),
        };
      return response(path === "/api/auth/login" ? account : guest);
    }),
  );
  await boot();
  const old = api("/old-personal").catch(() => {});
  await waitFor(() => expect(finish).toBeTypeOf("function"));
  await act(async () => {
    await identity.authenticate("login", {
      email: "test@example.test",
      password: "test-password-123",
    });
    finish();
    await old;
  });
  expect(identity.session?.kind).toBe("ACCOUNT");
  expect(identity.error).toBeNull();
});
