import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { MotionPreferences, useMotionPreferences } from "./motion/preferences";
import { Modal } from "./shell";
let reduced = false;
let listeners: Set<() => void>;
function Probe() {
  const p = useMotionPreferences();
  return (
    <>
      <output>{p.enabled ? "moving" : "still"}</output>
    </>
  );
}
beforeEach(() => {
  localStorage.clear();
  reduced = false;
  listeners = new Set();
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_s: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_s: string, cb: () => void) => listeners.delete(cb),
  }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("motion preferences", () => {
  it("ignores the legacy visual preference without clearing identity data", () => {
    localStorage.setItem("yingzuo-static", "true");
    localStorage.setItem("identity-fixture", "preserved");
    render(
      <MotionPreferences>
        <Probe />
      </MotionPreferences>,
    );
    expect(screen.getByText("moving")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(localStorage.getItem("identity-fixture")).toBe("preserved");
    expect(localStorage.getItem("yingzuo-static")).toBeNull();
  });
  it("honors live system reduce and removes its listener on unmount", () => {
    const view = render(
      <MotionPreferences>
        <Probe />
      </MotionPreferences>,
    );
    act(() => {
      reduced = true;
      listeners.forEach((f) => f());
    });
    expect(screen.getByText("still")).toBeInTheDocument();
    view.unmount();
    expect(listeners.size).toBe(0);
  });
  it("stops when document is hidden and resumes without changing saved preference", () => {
    render(
      <MotionPreferences>
        <Probe />
      </MotionPreferences>,
    );
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    fireEvent(document, new Event("visibilitychange"));
    expect(screen.getByText("still")).toBeInTheDocument();
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    fireEvent(document, new Event("visibilitychange"));
    expect(screen.getByText("moving")).toBeInTheDocument();
    expect(localStorage.getItem("yingzuo-static")).toBeNull();
  });
});

describe("dialog exit lifecycle", () => {
  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
      }),
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.removeAttribute("open");
      }),
    });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>)
      .showModal;
    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close;
  });
  it("closes at the 120ms bound without losing its accessible name", () => {
    vi.useFakeTimers();
    const close = vi.fn();
    render(
      <MotionPreferences>
        <Modal title="作品预览" onClose={close}>
          图片
        </Modal>
      </MotionPreferences>,
    );
    expect(
      screen.getByRole("dialog", { name: "作品预览" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "关闭对话框" }));
    expect(close).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(120));
    expect(close).toHaveBeenCalledTimes(1);
  });
  it("cancels pending exit on route unmount", () => {
    vi.useFakeTimers();
    const close = vi.fn();
    const v = render(
      <MotionPreferences>
        <Modal title="作品预览" onClose={close}>
          图片
        </Modal>
      </MotionPreferences>,
    );
    fireEvent.click(screen.getByRole("button", { name: "关闭对话框" }));
    v.unmount();
    act(() => vi.advanceTimersByTime(200));
    expect(close).not.toHaveBeenCalled();
  });
});

describe("GPU boundary", () => {
  afterEach(() => vi.restoreAllMocks());
  it("releases an owned canvas on removal even if the child did not register cleanup", async () => {
    const { SafeEffect } = await import("./creative/showcase");
    const lose = vi.fn();
    const context = {
      getExtension: () => ({ loseContext: lose }),
    } as unknown as WebGL2RenderingContext;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context,
    );
    const view = render(
      <SafeEffect>
        <canvas aria-label="owned canvas" />
      </SafeEffect>,
    );
    const { rememberContext } = await import("./react-bits/context-lifecycle");
    rememberContext(
      screen.getByLabelText("owned canvas") as HTMLCanvasElement,
      context,
    );
    view.unmount();
    expect(lose).toHaveBeenCalledTimes(1);
  });
});

describe("creative fallbacks", () => {
  afterEach(() => vi.restoreAllMocks());
  it("does not allocate a context while disposing an uninitialized canvas", async () => {
    const { SafeEffect } = await import("./creative/showcase");
    const get = vi.spyOn(HTMLCanvasElement.prototype, "getContext");
    const view = render(
      <SafeEffect>
        <canvas />
      </SafeEffect>,
    );
    view.unmount();
    expect(get).not.toHaveBeenCalled();
  });
  it("allows a valid image after a previous source failed", async () => {
    const { PublicImage } = await import("./creative/showcase");
    const view = render(<PublicImage src="/bad.jpg" alt="作品" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/media/demo/postcard.png",
    );
    view.rerender(<PublicImage src="/good.jpg" alt="作品" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/good.jpg");
  });
});
