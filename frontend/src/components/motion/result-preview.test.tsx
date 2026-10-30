import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import { afterEach, beforeEach, it, expect, vi } from "vitest";
vi.mock("./preferences", () => ({
  useMotionPreferences: () => ({ enabled: true }),
}));
import { ResultPreview } from "./result-preview";
const origin = { left: 10, top: 20, width: 200, height: 150, aspectRatio: 1.5 };
let animate: ReturnType<typeof vi.fn>, cancel: ReturnType<typeof vi.fn>;
let mediaListeners: Set<() => void>;
beforeEach(() => {
  cancel = vi.fn();
  animate = vi.fn(() => ({ cancel }));
  Object.defineProperty(HTMLElement.prototype, "animate", {
    configurable: true,
    value: animate,
  });
  mediaListeners = new Set();
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: (_s: string, cb: () => void) => mediaListeners.add(cb),
    removeEventListener: (_s: string, cb: () => void) =>
      mediaListeners.delete(cb),
  }));
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    left: 100,
    top: 100,
    width: 600,
    height: 400,
    right: 700,
    bottom: 500,
    x: 100,
    y: 100,
    toJSON: () => ({}),
  });
});
afterEach(() => {
  cleanup();
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("reserves a stable frame before cold loading and reveals the real image exactly once", () => {
  const view = render(
    <ResultPreview
      src="/media/results/original.png"
      alt="原图"
      origin={origin}
    />,
  );
  const frame = view.container.querySelector(
    ".p12-preview-frame",
  ) as HTMLElement;
  expect(frame.style.aspectRatio).toBe("1.5");
  expect(screen.getByRole("status")).toHaveTextContent("正在载入原图");
  expect(animate).not.toHaveBeenCalled();
  const image = screen.getByRole("img");
  fireEvent.load(image);
  fireEvent.load(image);
  expect(animate).toHaveBeenCalledOnce();
  expect(frame.dataset.previewState).toBe("ready");
  expect(screen.queryByRole("status")).toBeNull();
  expect(image).toHaveAttribute("src", "/media/results/original.png");
  view.unmount();
  expect(cancel).toHaveBeenCalledOnce();
});
it("cancels pending reveal on system change before loading without hiding the loaded image", () => {
  render(
    <ResultPreview
      src="/media/results/original.png"
      alt="原图"
      origin={origin}
    />,
  );
  act(() => mediaListeners.forEach((f) => f()));
  fireEvent.load(screen.getByRole("img"));
  expect(animate).not.toHaveBeenCalled();
  expect(screen.queryByRole("status")).toBeNull();
});
it("removes pending private reveal on identity invalidation and keeps failure closable", () => {
  render(
    <ResultPreview
      src="/media/results/original.png"
      alt="原图"
      origin={origin}
    />,
  );
  const image = screen.getByRole("img");
  act(() => window.dispatchEvent(new Event("session-expired")));
  fireEvent.load(image);
  expect(animate).not.toHaveBeenCalled();
  expect(image).toHaveStyle({ visibility: "hidden" });
  fireEvent.error(image);
  expect(screen.getByRole("alert")).toHaveTextContent("请关闭后重新打开");
});

it("cancels an already running reveal as soon as dialog closing begins", () => {
  const view = render(
    <dialog open>
      <ResultPreview
        src="/media/results/original.png"
        alt="原图"
        origin={origin}
      />
    </dialog>,
  );
  fireEvent.load(screen.getByRole("img"));
  expect(animate).toHaveBeenCalledOnce();
  act(() =>
    view.container
      .querySelector("dialog")!
      .dispatchEvent(new Event("shuying-preview-close")),
  );
  expect(cancel).toHaveBeenCalledOnce();
  fireEvent.load(screen.getByRole("img"));
  expect(animate).toHaveBeenCalledOnce();
});
