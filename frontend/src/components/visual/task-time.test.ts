import { describe, it, expect } from "vitest";
import { formatTaskTime } from "./task-time";
describe("task timestamp local numeric display", () => {
  it("pads all four fields without slicing the UTC ISO representation", () => {
    expect(formatTaskTime(new Date(2026, 0, 2, 3, 4).toISOString())).toBe(
      "01/02 03:04",
    );
  });
  it("uses 00 for local midnight", () => {
    expect(formatTaskTime(new Date(2026, 9, 30, 0, 0).toISOString())).toBe(
      "10/30 00:00",
    );
  });
  it("crosses the local year boundary without retaining stale calendar fields", () => {
    const end = new Date(2026, 11, 31, 23, 59);
    expect(formatTaskTime(end.toISOString())).toBe("12/31 23:59");
    expect(formatTaskTime(new Date(end.getTime() + 60000).toISOString())).toBe(
      "01/01 00:00",
    );
  });
  it("handles leap-day month rollover", () => {
    const end = new Date(2024, 1, 29, 23, 59);
    expect(formatTaskTime(end.toISOString())).toBe("02/29 23:59");
    expect(formatTaskTime(new Date(end.getTime() + 60000).toISOString())).toBe(
      "03/01 00:00",
    );
  });
  it.each(["", "not-a-date", "2026-99-99T00:00:00Z"])(
    "preserves the existing invalid-date fallback for %j",
    (iso) => {
      expect(formatTaskTime(iso)).toBe("Invalid Date");
    },
  );
});
