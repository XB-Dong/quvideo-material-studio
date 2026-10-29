import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { Providers, useIdentity } from "../components/providers";
import { api } from "./api";
import { advanceSessionGeneration } from "./session-generation";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function IdentityProbe() {
  const { session, error, retry } = useIdentity();
  return (
    <div>
      <span>{session?.userId || error || "connecting"}</span>
      <button onClick={retry}>Reconnect</button>
    </div>
  );
}
describe("request-scoped session expiration", () => {
  it("ignores an old 401 body arriving after expiry and reconnect", async () => {
    let identity = 0;
    let finishOldBody!: (value: unknown) => void;
    const delayedBody = new Promise((resolve) => {
      finishOldBody = resolve;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (path: string) => {
        if (path === "/api/session")
          return new Response(
            JSON.stringify({
              userId: ++identity === 1 ? "user-a" : "user-b",
              displayName: "Guest",
              expiresAt: "2030-01-01T00:00:00Z",
            }),
          );
        if (path === "/old")
          return { ok: false, status: 401, json: () => delayedBody };
        return new Response(JSON.stringify({ message: "expired" }), {
          status: 401,
        });
      }),
    );
    render(
      <Providers>
        <IdentityProbe />
      </Providers>,
    );
    await screen.findByText("user-a");
    let oldResult!: Promise<unknown>;
    await act(async () => {
      oldResult = api("/old").catch((error) => error);
      await Promise.resolve();
    });
    await act(async () => {
      await api("/expire").catch(() => {});
    });
    await screen.findByText("会话已失效，请重新连接身份");
    fireEvent.click(screen.getByRole("button", { name: "Reconnect" }));
    await screen.findByText("user-b");
    await act(async () => {
      finishOldBody({ message: "old expired" });
      await oldResult;
    });
    expect(screen.getByText("user-b")).toBeInTheDocument();
    expect(
      screen.queryByText("会话已失效，请重新连接身份"),
    ).not.toBeInTheDocument();
  });
  it("does not expire the current identity for an aborted request's late 401", async () => {
    advanceSessionGeneration();
    const abort = new AbortController();
    let finishBody!: (value: unknown) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 401,
        json: () => new Promise((resolve) => (finishBody = resolve)),
      })),
    );
    const expired = vi.fn();
    window.addEventListener("session-expired", expired);
    const result = api("/cancelled", { signal: abort.signal }).catch(() => {});
    await Promise.resolve();
    abort.abort();
    finishBody({ message: "expired" });
    await result;
    window.removeEventListener("session-expired", expired);
    expect(expired).not.toHaveBeenCalled();
  });
});
