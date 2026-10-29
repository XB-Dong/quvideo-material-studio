import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "./api";
import { useTasks } from "./use-tasks";
import { mergeTask, type Task } from "./types";
vi.mock("./api", () => ({ api: vi.fn() }));
const request = vi.mocked(api);
export function task(
  id: string,
  status: Task["status"] = "RUNNING",
  version = 1,
): Task {
  return {
    id,
    templateId: "demo",
    templateTitle: id,
    status,
    version,
    stage: "GENERATE",
    failedStage: null,
    failureCode: null,
    failureReason: status === "FAILED" ? "模拟失败" : null,
    resultUrl: status === "SUCCEEDED" ? "/media/results/" + id : null,
    createdAt: "2026-10-29T00:00:00Z",
    updatedAt: "2026-10-29T00:00:00Z",
    startedAt: null,
    completedAt: null,
    steps: [],
  };
}
function setup(userId = "user-a") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return {
    client,
    ...renderHook(({ id }) => useTasks(id), {
      initialProps: { id: userId },
      wrapper,
    }),
  };
}
async function flush() {
  await act(async () => {
    for (let i = 0; i < 15; i++) await Promise.resolve();
    await vi.advanceTimersByTimeAsync(1);
  });
}
beforeEach(() => {
  vi.useFakeTimers();
  request.mockReset();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe("independent task lifecycle", () => {
  it("keeps A failure and B success independent under reversed responses", async () => {
    let resolveA!: (v: Task) => void;
    let resolveB!: (v: Task) => void;
    request.mockImplementation(async (path) => {
      if (path.includes("?"))
        return { items: [task("A"), task("B")], nextCursor: null };
      if (path.endsWith("/A")) return new Promise<Task>((r) => (resolveA = r));
      return new Promise<Task>((r) => (resolveB = r));
    });
    const h = setup();
    await flush();
    await act(async () => resolveB(task("B", "SUCCEEDED", 3)));
    await flush();
    await act(async () => resolveA(task("A", "FAILED", 2)));
    await flush();
    expect(
      h.result.current.tasks.find((x) => x.task.id === "A")?.task.status,
    ).toBe("FAILED");
    expect(
      h.result.current.tasks.find((x) => x.task.id === "B")?.task.status,
    ).toBe("SUCCEEDED");
  });
  it("keeps server state on query outage and recovers separately", async () => {
    let failed = true;
    request.mockImplementation(async (path) => {
      if (path.includes("?")) return { items: [task("A")], nextCursor: null };
      if (failed) throw Error("network outage");
      return task("A", "SUCCEEDED", 2);
    });
    const h = setup();
    await flush();
    expect(h.result.current.tasks[0].task.status).toBe("RUNNING");
    expect(h.result.current.tasks[0].queryError).toBeTruthy();
    failed = false;
    await act(async () => {
      await h.result.current.tasks[0].refresh();
    });
    await flush();
    expect(h.result.current.tasks[0].task.status).toBe("SUCCEEDED");
    expect(h.result.current.tasks[0].queryError).toBeFalsy();
  });
  it("stops polling ended tasks while another remains active, then stops all", async () => {
    let endB = false;
    request.mockImplementation(async (path) =>
      path.includes("?")
        ? { items: [task("A"), task("B")], nextCursor: null }
        : task(
            path.endsWith("/A") ? "A" : "B",
            path.endsWith("/A") || endB ? "SUCCEEDED" : "RUNNING",
            2,
          ),
    );
    const h = setup();
    await flush();
    request.mockClear();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2100);
    });
    expect(request.mock.calls.some(([p]) => p.endsWith("/A"))).toBe(false);
    expect(request.mock.calls.some(([p]) => p.endsWith("/B"))).toBe(true);
    endB = true;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2100);
    });
    await flush();
    request.mockClear();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000);
    });
    expect(request).not.toHaveBeenCalled();
    h.unmount();
  });
  it("cancels requests and timers on unmount", async () => {
    let signal: AbortSignal | undefined;
    request.mockImplementation(async (path, init) => {
      if (path.includes("?")) return { items: [task("A")], nextCursor: null };
      signal = init?.signal as AbortSignal;
      return new Promise(() => {});
    });
    const h = setup();
    await flush();
    h.unmount();
    expect(signal?.aborted).toBe(true);
    request.mockClear();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(request).not.toHaveBeenCalled();
  });
  it("discovers active tasks beyond the first history page", async () => {
    request.mockImplementation(async (path) => {
      if (path.includes("activeOnly"))
        return path.includes("cursor=")
          ? { items: [task("older")], nextCursor: null }
          : { items: [], nextCursor: "page2" };
      if (path.includes("?")) return { items: [], nextCursor: null };
      return task("older", "SUCCEEDED", 2);
    });
    const h = setup();
    await flush();
    expect(h.result.current.tasks.map((x) => x.task.id)).toContain("older");
    expect(request.mock.calls.some(([p]) => p.includes("cursor=page2"))).toBe(
      true,
    );
  });
  it("does not display prior-user late data after changing identity", async () => {
    let resolveOld!: (v: unknown) => void;
    let current = "a";
    request.mockImplementation(async () => {
      if (current === "a") return new Promise((r) => (resolveOld = r));
      return { items: [], nextCursor: null };
    });
    const h = setup("a");
    await flush();
    current = "b";
    h.rerender({ id: "b" });
    await flush();
    await act(async () =>
      resolveOld({ items: [task("private-a")], nextCursor: null }),
    );
    await flush();
    expect(h.result.current.tasks).toHaveLength(0);
  });
});
describe("snapshot merging", () => {
  it("never regresses versions or terminal state", () => {
    const done = task("A", "SUCCEEDED", 8);
    expect(mergeTask(done, task("A", "RUNNING", 1))).toBe(done);
    expect(mergeTask(done, task("A", "RUNNING", 9))).toBe(done);
    expect(mergeTask(task("A"), task("A", "FAILED", 2)).status).toBe("FAILED");
  });
});
