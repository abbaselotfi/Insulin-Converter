import { describe, expect, it } from "vitest";
import { INSULINS, calculateConversion, getCompatibleTargets, getSourceInsulins } from "./engine.js";

describe("clinical engine catalog and boundaries", () => {
  it("contains the expected basal, rapid, premix, and FRC catalog", () => {
    expect(INSULINS).toHaveLength(18);
    expect(getSourceInsulins()).toHaveLength(17);
  });

  it("only offers rapid/regular destinations for a rapid source", () => {
    const targets = getCompatibleTargets("glulisine-u100");
    expect(targets.length).toBeGreaterThanOrEqual(4);
    expect(targets.every(item => item.group === "rapid")).toBe(true);
    expect(targets.some(item => item.group === "basal")).toBe(false);
  });

  it("does not offer rapid destinations for a basal source", () => {
    const targets = getCompatibleTargets("glargine-u100");
    expect(targets.some(item => item.group === "rapid")).toBe(false);
    expect(targets.some(item => item.id === "suliqua-auto")).toBe(true);
  });

  it("calculates manual same-class estimates deterministically", () => {
    expect(calculateConversion({ sourceId: "glargine-u100", targetId: "degludec-u100", dailyDose: 24, factor: 1 }).estimatedDose).toBe(24);
    expect(calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 31, factor: 0.8, sourceFrequency: 2 }).estimatedDose).toBe(25);
  });

  it.each([
    [18, 10, "peach", "suliqua-100-50"],
    [24, 20, "peach", "suliqua-100-50"],
    [44, 30, "olive", "suliqua-100-33"]
  ])("selects the correct Suliqua start for %i units", (dailyDose, expectedDose, pen, penId) => {
    const result = calculateConversion({ sourceId: "glargine-u100", targetId: "suliqua-auto", dailyDose, sourceFrequency: 1 });
    expect(result.estimatedDose).toBe(expectedDose);
    expect(result.selection.pen).toBe(pen);
    expect(result.target.id).toBe(penId);
  });

  it("applies the EMA reference reduction for glargine U-300", () => {
    const result = calculateConversion({ sourceId: "glargine-u300", targetId: "suliqua-auto", dailyDose: 35, sourceFrequency: 1 });
    expect(result.selection.referenceDose).toBe(28);
    expect(result.estimatedDose).toBe(20);
  });

  it("rejects unsafe groups, frequencies, factors, and ranges", () => {
    expect(() => calculateConversion({ sourceId: "aspart-u100", targetId: "glargine-u100", dailyDose: 20, factor: 1 })).toThrow("INCOMPATIBLE_GROUPS");
    expect(() => calculateConversion({ sourceId: "degludec-u100", targetId: "glargine-u100", dailyDose: 20, factor: 1, sourceFrequency: 2 })).toThrow("INVALID_FREQUENCY");
    expect(() => calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 20, factor: 0.75 })).toThrow("INVALID_FACTOR");
    expect(() => calculateConversion({ sourceId: "glargine-u100", targetId: "suliqua-auto", dailyDose: 61 })).toThrow("SULIQUA_ABOVE_MAXIMUM");
  });
});
