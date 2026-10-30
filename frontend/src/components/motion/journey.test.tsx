import { useRef } from "react";
import { render, cleanup, act } from "@testing-library/react";
import { afterEach, beforeEach, it, expect, vi } from "vitest";
const state = vi.hoisted(() => ({ pathname: "/", enabled: true }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("../providers", () => ({
  useIdentity: () => ({ session: { userId: "test-user" } }),
}));
vi.mock("./preferences", () => ({
  useMotionPreferences: () => ({ enabled: state.enabled }),
}));
import {
  beginCoverTransition,
  clickFeedback,
  VisualJourney,
  useSceneVisibility,
} from "./journey";
let resizeCallbacks: ResizeObserverCallback[];
let resizeDisconnect: ReturnType<typeof vi.fn>;
function resizeEntry(
  target: Element,
  width: number,
  height: number,
): ResizeObserverEntry {
  const size = { inlineSize: width, blockSize: height };
  return {
    target,
    contentRect: new DOMRect(0, 0, width, height),
    borderBoxSize: [size],
    contentBoxSize: [size],
    devicePixelContentBoxSize: [size],
  };
}
beforeEach(() => {
  resizeCallbacks = [];
  resizeDisconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(cb: ResizeObserverCallback) {
        resizeCallbacks.push(cb);
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = resizeDisconnect;
    },
  );
  state.pathname = "/";
  state.enabled = true;
  vi.stubGlobal("CSS", { escape: (x: string) => x });
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});
it("refuses private or blob images as route bridge sources", () => {
  const listener = vi.fn();
  window.addEventListener("shuying-cover", listener);
  const img = document.createElement("img");
  img.dataset.publicCover = "demo-pet";
  document.body.append(img);
  for (const src of [
    "blob:private",
    "/media/files/private-result.png",
    "https://outside.invalid/media/demo/pet.jpg",
  ]) {
    img.src = src;
    beginCoverTransition("demo-pet");
  }
  expect(listener).not.toHaveBeenCalled();
  window.removeEventListener("shuying-cover", listener);
});
it("cancels the public bridge immediately on identity invalidation", () => {
  const cancel = vi.fn();
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    left: 10,
    top: 20,
    width: 100,
    height: 140,
    right: 110,
    bottom: 160,
    x: 10,
    y: 20,
    toJSON: () => ({}),
  });
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    value: vi.fn(() => ({ cancel, onfinish: null, oncancel: null })),
  });
  const img = document.createElement("img");
  img.src = "/media/demo/pet.jpg";
  img.dataset.publicCover = "demo-pet";
  document.body.append(img);
  const view = render(<VisualJourney />);
  act(() => beginCoverTransition("demo-pet"));
  state.pathname = "/templates/demo-pet";
  view.rerender(<VisualJourney />);
  expect(document.querySelector(".p12-cover-bridge")).toBeNull();
  expect(img.getBoundingClientRect).toHaveBeenCalledOnce();
  act(() => resizeCallbacks[0]([resizeEntry(img, 0, 0)], {} as ResizeObserver));
  expect(document.querySelector(".p12-cover-bridge")).toBeNull();
  expect(img.getBoundingClientRect).toHaveBeenCalledOnce();
  act(() =>
    resizeCallbacks[0]([resizeEntry(img, 100, 140)], {} as ResizeObserver),
  );
  expect(resizeDisconnect).toHaveBeenCalled();
  expect(document.querySelector(".p12-cover-bridge")).not.toBeNull();
  const frames = vi.mocked(HTMLElement.prototype.animate).mock
    .calls[0][0] as Keyframe[];
  expect(frames[0]).toHaveProperty("width");
  expect(frames[0]).toHaveProperty("height");
  expect(frames.every((frame) => !frame.transform)).toBe(true);
  act(() => window.dispatchEvent(new Event("session-expired")));
  expect(cancel).toHaveBeenCalledOnce();
  expect(document.querySelector(".p12-cover-bridge")).toBeNull();
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate;
});
it("clears short click particles when system motion becomes unavailable", () => {
  const view = render(<VisualJourney />);
  const button = document.createElement("button");
  document.body.append(button);
  act(() => clickFeedback(button));
  expect(document.querySelectorAll(".p12-click-bloom i")).toHaveLength(6);
  state.enabled = false;
  view.rerender(<VisualJourney />);
  expect(document.querySelector(".p12-click-bloom")).toBeNull();
});

it("pauses an observed visual scope offscreen, resumes and disconnects without removing its business children", () => {
  let callback: IntersectionObserverCallback = () => {};
  const disconnect = vi.fn();
  const observe = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  function Probe({ phase = "empty" }: { phase?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    useSceneVisibility(ref);
    return (
      <div ref={ref} className={phase} data-testid="visual">
        <input aria-label="still available" />
      </div>
    );
  }
  const view = render(<Probe />);
  const el = view.getByTestId("visual");
  expect(observe).toHaveBeenCalledWith(el);
  act(() =>
    callback(
      [{ isIntersecting: false }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    ),
  );
  expect(el).toHaveClass("p12-offscreen");
  view.rerender(<Probe phase="ready" />);
  expect(el).toHaveClass("ready");
  expect(el).toHaveAttribute("data-p12-offscreen");
  expect(view.getByLabelText("still available")).toBeInTheDocument();
  act(() =>
    callback(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    ),
  );
  expect(el).not.toHaveClass("p12-offscreen");
  expect(el).not.toHaveAttribute("data-p12-offscreen");
  view.unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});

it("cancels pending natural-layout observation before a late ResizeObserver delivery", () => {
  const img = document.createElement("img");
  img.dataset.publicCover = "demo-pet";
  img.src = "/media/demo/pet.jpg";
  document.body.append(img);
  const rect = vi.spyOn(img, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    width: 100,
    height: 140,
    right: 100,
    bottom: 140,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  const view = render(<VisualJourney />);
  act(() => beginCoverTransition("demo-pet"));
  state.pathname = "/templates/demo-pet";
  view.rerender(<VisualJourney />);
  expect(rect).toHaveBeenCalledOnce();
  act(() => window.dispatchEvent(new Event("session-expired")));
  expect(resizeDisconnect).toHaveBeenCalled();
  act(() =>
    resizeCallbacks[0]([resizeEntry(img, 100, 140)], {} as ResizeObserver),
  );
  expect(rect).toHaveBeenCalledOnce();
  expect(document.querySelector(".p12-cover-bridge")).toBeNull();
});
it("keeps ordinary navigation feedback when ResizeObserver is unavailable", () => {
  vi.stubGlobal("ResizeObserver", undefined);
  const img = document.createElement("img");
  img.dataset.publicCover = "demo-pet";
  img.src = "/media/demo/pet.jpg";
  document.body.append(img);
  const view = render(<VisualJourney />);
  act(() => beginCoverTransition("demo-pet"));
  state.pathname = "/templates/demo-pet";
  view.rerender(<VisualJourney />);
  expect(document.querySelector(".p12-cover-bridge")).toBeNull();
  expect(resizeCallbacks).toHaveLength(0);
  expect(view.container.querySelector(".p12-visual-layer")).not.toBeNull();
});
