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
import { beginCoverTransition, clickFeedback, VisualJourney } from "./journey";
beforeEach(() => {
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
