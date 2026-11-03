import { describe, expect, it } from "vitest";
import { applicationsOpen } from "./jobRules";

describe("vacancy deadline", () => {
  it("accepts applications on December 15, 2026", () => {
    expect(applicationsOpen("2026-12-15", "2026-12-15")).toBe(true);
  });
  it("closes after December 15, 2026", () => {
    expect(applicationsOpen("2026-12-15", "2026-12-16")).toBe(false);
  });
});