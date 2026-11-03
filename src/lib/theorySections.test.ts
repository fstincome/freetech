import { describe, expect, it } from "vitest";
import { isPublicTheorySection } from "./theorySections";

describe("public Theory of Change content", () => {
  it("does not publish mission or vision", () => {
    expect(isPublicTheorySection("mission")).toBe(false);
    expect(isPublicTheorySection("vision")).toBe(false);
  });
  it("does not publish strategic axes or internal planning", () => {
    for (const key of ["axes", "axis.1", "logic", "component.1.step.1", "assumption.1", "validated"]) {
      expect(isPublicTheorySection(key)).toBe(false);
    }
  });
  it("publishes training descriptions and newly added public sections", () => {
    expect(isPublicTheorySection("component.1")).toBe(true);
    expect(isPublicTheorySection("community" )).toBe(true);
  });
});