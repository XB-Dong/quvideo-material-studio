import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  cleanup,
} from "@testing-library/react";
import { UploadSlot, type Slot } from "./studio";
import { api } from "../lib/api";
import type { Asset, Template } from "../lib/types";
vi.mock("../lib/api", () => ({
  api: vi.fn(),
  ApiError: class extends Error {
    status = 500;
  },
}));
const request = vi.mocked(api);
const template: Template = {
  id: "demo",
  title: "示例",
  categoryId: "art",
  coverUrl: "/cover",
  description: "",
  requiredImageCount: 1,
  acceptedMimeTypes: ["image/png"],
  maxFileSizeBytes: 1000,
};
const asset: Asset = {
  id: "asset-1",
  url: "/asset",
  mimeType: "image/png",
  sizeBytes: 1,
  width: 1,
  height: 1,
};
beforeEach(() => {
  request.mockReset();
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
});
afterEach(cleanup);
describe("upload lifecycle", () => {
  it("does not restore a removed upload when its request resolves late", async () => {
    let resolve!: (v: Asset) => void;
    request.mockReturnValue(new Promise((r) => (resolve = r)));
    const changes = vi.fn<(s: Slot) => void>();
    render(<UploadSlot index={0} template={template} onChange={changes} />);
    fireEvent.change(screen.getByLabelText("选择第1张图片"), {
      target: { files: [new File(["x"], "test.png", { type: "image/png" })] },
    });
    expect(changes.mock.lastCall?.[0].status).toBe("UPLOADING");
    fireEvent.click(screen.getByLabelText("移除第1张图片"));
    await act(async () => resolve(asset));
    expect(changes.mock.lastCall?.[0].status).toBe("EMPTY");
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
  it("latest replacement wins when responses arrive out of order", async () => {
    let first!: (v: Asset) => void;
    let second!: (v: Asset) => void;
    request
      .mockReturnValueOnce(new Promise((r) => (first = r)))
      .mockReturnValueOnce(new Promise((r) => (second = r)));
    const changes = vi.fn<(s: Slot) => void>();
    render(<UploadSlot index={0} template={template} onChange={changes} />);
    const input = screen.getByLabelText("选择第1张图片");
    fireEvent.change(input, {
      target: { files: [new File(["x"], "a.png", { type: "image/png" })] },
    });
    fireEvent.change(input, {
      target: { files: [new File(["y"], "b.png", { type: "image/png" })] },
    });
    await act(async () => second({ ...asset, id: "new" }));
    await act(async () => first(asset));
    expect(changes.mock.lastCall?.[0].asset?.id).toBe("new");
  });
  it("rejects type and size before network and never reports READY after failure", async () => {
    const changes = vi.fn();
    render(<UploadSlot index={0} template={template} onChange={changes} />);
    const input = screen.getByLabelText("选择第1张图片");
    fireEvent.change(input, {
      target: { files: [new File(["x"], "bad.txt", { type: "text/plain" })] },
    });
    expect(request).not.toHaveBeenCalled();
    fireEvent.change(input, {
      target: {
        files: [
          new File(["x".repeat(1001)], "large.png", { type: "image/png" }),
        ],
      },
    });
    expect(request).not.toHaveBeenCalled();
    request.mockRejectedValueOnce(Error("上传失败"));
    await act(async () =>
      fireEvent.change(input, {
        target: { files: [new File(["x"], "ok.png", { type: "image/png" })] },
      }),
    );
    expect(changes.mock.lastCall?.[0].status).toBe("ERROR");
    expect(changes.mock.lastCall?.[0].asset).toBeUndefined();
  });
});
