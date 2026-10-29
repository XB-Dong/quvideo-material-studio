import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  act,
} from "@testing-library/react";
import { Maker } from "./studio";
import { Providers, useIdentity } from "./providers";
import { currentSessionGeneration } from "../lib/session-generation";
import { api } from "../lib/api";
import type { Template } from "../lib/types";
vi.mock("../lib/api", async (original) => ({
  ...(await original<typeof import("../lib/api")>()),
  api: vi.fn(),
}));
const request = vi.mocked(api);
const template: Template = {
  id: "demo",
  title: "示例模板",
  categoryId: "art",
  coverUrl: "/cover",
  description: "示例",
  requiredImageCount: 1,
  acceptedMimeTypes: ["image/png"],
  maxFileSizeBytes: 1000,
};
beforeEach(() => {
  request.mockReset();
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
});
afterEach(cleanup);
async function ready() {
  render(
    <Providers>
      <Maker template={template} />
    </Providers>,
  );
  await waitFor(() =>
    expect(screen.getByLabelText("选择第1张图片")).toBeEnabled(),
  );
  fireEvent.change(screen.getByLabelText("选择第1张图片"), {
    target: { files: [new File(["x"], "ok.png", { type: "image/png" })] },
  });
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /开始制作/ })).toBeEnabled(),
  );
}
function defaults(path: string) {
  if (path === "/api/session")
    return {
      userId: "u",
      displayName: "匿名用户",
      expiresAt: "2030-01-01T00:00:00Z",
    };
  return {
    id: "asset",
    url: "/asset",
    mimeType: "image/png",
    sizeBytes: 1,
    width: 1,
    height: 1,
  };
}
describe("task submission", () => {
  it("releases an old user's pending submission and ignores its stale finally", async () => {
    let identity = 0;
    let posts = 0;
    let firstSignal: AbortSignal | undefined;
    let resolveOld!: (value: unknown) => void;
    let resolveNew!: (value: unknown) => void;
    request.mockImplementation(async (path, init) => {
      if (path === "/api/session")
        return {
          ...defaults(path),
          userId: ++identity === 1 ? "user-a" : "user-b",
        };
      if (path === "/api/tasks") {
        if (++posts === 1) {
          firstSignal = init?.signal as AbortSignal;
          return new Promise((resolve) => (resolveOld = resolve));
        }
        return new Promise((resolve) => (resolveNew = resolve));
      }
      return defaults(path);
    });
    function Reconnect() {
      const { retry } = useIdentity();
      return <button onClick={retry}>Reconnect</button>;
    }
    render(
      <Providers>
        <Reconnect />
        <Maker template={template} />
      </Providers>,
    );
    await waitFor(() =>
      expect(screen.getByLabelText("选择第1张图片")).toBeEnabled(),
    );
    const upload = async () => {
      fireEvent.change(screen.getByLabelText("选择第1张图片"), {
        target: { files: [new File(["x"], "ok.png", { type: "image/png" })] },
      });
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /开始制作/ })).toBeEnabled(),
      );
    };
    await upload();
    fireEvent.click(screen.getByRole("button", { name: /开始制作/ }));
    await screen.findByRole("button", { name: /正在提交/ });
    act(() =>
      window.dispatchEvent(
        new CustomEvent("session-expired", {
          detail: { generation: currentSessionGeneration() },
        }),
      ),
    );
    await waitFor(() => expect(firstSignal?.aborted).toBe(true));
    fireEvent.click(screen.getByRole("button", { name: "Reconnect" }));
    await waitFor(() =>
      expect(screen.getByLabelText("选择第1张图片")).toBeEnabled(),
    );
    await upload();
    fireEvent.click(screen.getByRole("button", { name: /开始制作/ }));
    await waitFor(() => expect(posts).toBe(2));
    await act(async () =>
      resolveOld({ id: "old-task", status: "QUEUED", version: 1 }),
    );
    expect(screen.getByRole("button", { name: /正在提交/ })).toBeDisabled();
    expect(
      screen.queryByText("任务已受理，你可以继续创建作品。"),
    ).not.toBeInTheDocument();
    await act(async () =>
      resolveNew({ id: "new-task", status: "QUEUED", version: 1 }),
    );
    expect(screen.getByRole("button", { name: /开始制作/ })).toBeEnabled();
  });
  it("unlocks after acceptance and allows a second independent task", async () => {
    let count = 0;
    request.mockImplementation(async (path) =>
      path === "/api/tasks"
        ? { id: "task-" + ++count, status: "QUEUED", version: 1 }
        : defaults(path),
    );
    await ready();
    fireEvent.click(screen.getByRole("button", { name: /开始制作/ }));
    await screen.findByText("任务已受理，你可以继续创建作品。");
    expect(screen.getByRole("button", { name: /开始制作/ })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: /开始制作/ }));
    await waitFor(() => expect(count).toBe(2));
  });
  it("does not retry an uncertain POST or invent a failed backend task", async () => {
    request.mockImplementation(async (path) => {
      if (path === "/api/tasks") throw Error("Connection lost");
      return defaults(path);
    });
    await ready();
    fireEvent.click(screen.getByRole("button", { name: /开始制作/ }));
    await screen.findByText(/提交结果未确认/);
    expect(request.mock.calls.filter(([p]) => p === "/api/tasks")).toHaveLength(
      1,
    );
    expect(screen.queryByText("制作失败")).not.toBeInTheDocument();
  });
  it("blocks submission until every required upload is ready", async () => {
    request.mockImplementation(async (path) => defaults(path));
    render(
      <Providers>
        <Maker template={{ ...template, requiredImageCount: 2 }} />
      </Providers>,
    );
    expect(screen.getByRole("button", { name: /开始制作/ })).toBeDisabled();
    await waitFor(() =>
      expect(screen.getByLabelText("选择第1张图片")).toBeEnabled(),
    );
    fireEvent.change(screen.getByLabelText("选择第1张图片"), {
      target: { files: [new File(["x"], "ok.png", { type: "image/png" })] },
    });
    await screen.findByText("点击替换");
    expect(screen.getByRole("button", { name: /开始制作/ })).toBeDisabled();
  });
});
