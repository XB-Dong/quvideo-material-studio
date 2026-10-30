import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, it, expect, vi } from "vitest";
const authenticate = vi.hoisted(() => vi.fn());
vi.mock("./providers", () => ({
  useIdentity: () => ({
    session: { userId: "guest", kind: "GUEST" },
    authBusy: false,
    authenticate,
  }),
}));
vi.mock("./shell", () => ({
  Modal: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <section role="dialog" aria-label={title}>
      {children}
    </section>
  ),
}));
import AccountDialog from "./account/dialog";
beforeEach(() => authenticate.mockReset());
afterEach(cleanup);
it("accepts emoji code-point limits without native UTF16 maxlength rejection and clears secrets on completion", async () => {
  authenticate.mockResolvedValue({ userId: "guest", kind: "ACCOUNT" });
  render(<AccountDialog initial="register" onClose={() => {}} />);
  const name = screen.getByLabelText("昵称"),
    password = screen.getByLabelText("密码", { exact: true }),
    confirm = screen.getByLabelText("确认密码");
  expect(name).not.toHaveAttribute("maxlength");
  expect(password).not.toHaveAttribute("maxlength");
  expect(password).not.toHaveAttribute("minlength");
  fireEvent.change(name, { target: { value: "🌿".repeat(30) } });
  fireEvent.change(screen.getByLabelText("邮箱"), {
    target: { value: "synthetic@example.test" },
  });
  fireEvent.change(password, { target: { value: "🌿".repeat(12) } });
  fireEvent.change(confirm, { target: { value: "🌿".repeat(12) } });
  fireEvent.click(screen.getByRole("button", { name: "注册并保留作品" }));
  await waitFor(() => expect(authenticate).toHaveBeenCalledOnce());
  expect(authenticate).toHaveBeenCalledWith("register", {
    displayName: "🌿".repeat(30),
    email: "synthetic@example.test",
    password: "🌿".repeat(12),
  });
  await waitFor(() => expect(password).toHaveValue(""));
  expect(confirm).toHaveValue("");
});
it("rejects mismatching confirmation before issuing registration", () => {
  render(<AccountDialog initial="register" onClose={() => {}} />);
  fireEvent.change(screen.getByLabelText("昵称"), {
    target: { value: "访客升级" },
  });
  fireEvent.change(screen.getByLabelText("邮箱"), {
    target: { value: "synthetic@example.test" },
  });
  fireEvent.change(screen.getByLabelText("密码", { exact: true }), {
    target: { value: "test-password-123" },
  });
  fireEvent.change(screen.getByLabelText("确认密码"), {
    target: { value: "other-password-123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "注册并保留作品" }));
  expect(screen.getByRole("status")).toHaveTextContent("两次输入的密码不一致");
  expect(authenticate).not.toHaveBeenCalled();
});
