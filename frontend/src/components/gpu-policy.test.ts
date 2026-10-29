import { beforeEach, afterEach, it, expect, vi } from "vitest";
const NativeURL=URL;
class TestWorker {
  static instances: TestWorker[] = [];
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  terminate = vi.fn();
  postMessage = vi.fn();
  constructor(
    public url: string,
    public options: WorkerOptions,
  ) {
    TestWorker.instances.push(this);
  }
}
const reply = (allowed: boolean, released = true) =>
  ({
    data: {
      kind: "yingzuo-gpu-capability",
      allowed,
      released,
      reason: allowed ? "hardware-capable" : "software-renderer",
      renderer: allowed ? "fixture hardware" : "SwiftShader",
      probeMs: 300,
      releaseMs: 1,
    },
  }) as MessageEvent;
beforeEach(() => {
  vi.resetModules();
  TestWorker.instances = [];
  vi.stubGlobal("Worker", TestWorker);
  vi.stubGlobal("OffscreenCanvas", class {});
  vi.stubGlobal("URL", class extends NativeURL {
    static createObjectURL=vi.fn(()=>"blob:fixture");
    static revokeObjectURL=vi.fn();
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
it("rejects software and never probes the main canvas", async () => {
  const get = vi.spyOn(HTMLCanvasElement.prototype, "getContext");
  const { assessGpu } = await import("./creative/gpu-policy");
  const pending = assessGpu(new AbortController().signal);
  const worker = TestWorker.instances[0];
  expect(worker.options.name).toBe("yingzuo-gpu-capability");
  worker.onmessage?.(reply(false));
  expect((await pending).allowed).toBe(false);
  expect(worker.terminate).toHaveBeenCalledTimes(1);
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:fixture");
  expect(get).not.toHaveBeenCalled();
});
it("requires release confirmation before permitting main GPU ownership", async () => {
  const { assessGpu } = await import("./creative/gpu-policy");
  const pending = assessGpu(new AbortController().signal);
  TestWorker.instances[0].onmessage?.(reply(true, false));
  expect((await pending).allowed).toBe(false);
});
it("caches a confirmed assessment instead of allocating another worker", async () => {
  const { assessGpu } = await import("./creative/gpu-policy");
  const pending = assessGpu(new AbortController().signal);
  TestWorker.instances[0].onmessage?.(reply(true));
  expect((await pending).allowed).toBe(true);
  expect((await assessGpu(new AbortController().signal)).allowed).toBe(true);
  expect(TestWorker.instances.length).toBe(1);
});
it("terminates and removes resources when the page leaves during a probe", async () => {
  const { assessGpu } = await import("./creative/gpu-policy");
  const controller = new AbortController();
  const pending = assessGpu(controller.signal);
  controller.abort();
  expect((await pending).reason).toBe("aborted");
  expect(TestWorker.instances[0].onmessage).toBeNull();
  expect(TestWorker.instances[0].terminate).toHaveBeenCalledTimes(1);
});
it("times out to static rather than running a slow main-thread probe", async () => {
  vi.useFakeTimers();
  const { assessGpu } = await import("./creative/gpu-policy");
  const pending = assessGpu(new AbortController().signal);
  vi.advanceTimersByTime(2000);
  expect((await pending).reason).toBe("probe-timeout");
  expect(TestWorker.instances[0].terminate).toHaveBeenCalledTimes(1);
});
it("keeps static artwork when worker capability is unavailable", async () => {
  vi.stubGlobal("Worker", undefined);
  const { assessGpu } = await import("./creative/gpu-policy");
  expect((await assessGpu(new AbortController().signal)).allowed).toBe(false);
  expect(TestWorker.instances.length).toBe(0);
});
