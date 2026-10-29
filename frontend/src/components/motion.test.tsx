import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import {
  MotionPreferences,
  MotionToggle,
  useMotionPreferences,
} from "./motion/preferences";
let reduced = false;
let listeners: Set<() => void>;
function Probe() {
  const p = useMotionPreferences();
  return (
    <>
      <MotionToggle />
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
  it("persists static preference without removing accessible controls", () => {
    const first = render(
      <MotionPreferences>
        <Probe />
      </MotionPreferences>,
    );
    expect(screen.getByText("moving")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "动态效果" }));
    expect(screen.getByText("still")).toBeInTheDocument();
    first.unmount();
    render(
      <MotionPreferences>
        <Probe />
      </MotionPreferences>,
    );
    expect(screen.getByRole("button", { name: "静态模式" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByText("still")).toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: "静态模式" })).toBeDisabled();
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
