import { it, expect } from "vitest";
import { nameError, passwordError } from "./validation";
it("counts nickname Unicode code points after trimming", () => {
  expect(nameError("  ")).not.toBeNull();
  expect(nameError("  " + "🌿".repeat(30) + "  ")).toBeNull();
  expect(nameError("🌿".repeat(31))).not.toBeNull();
});
it("accepts password code-point bounds without UTF16 truncation", () => {
  expect(passwordError("🌿".repeat(12))).toBeNull();
  expect(passwordError("🌿".repeat(128))).toBeNull();
  expect(passwordError("🌿".repeat(11))).not.toBeNull();
  expect(passwordError("🌿".repeat(129))).not.toBeNull();
});
it("does not trim or normalize password input", () => {
  expect(passwordError(" ".repeat(12))).toBeNull();
  expect(passwordError("x".repeat(11))).not.toBeNull();
});
