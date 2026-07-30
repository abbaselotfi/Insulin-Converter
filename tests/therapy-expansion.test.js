const assert = require("node:assert/strict");
const { ALL_INSULINS, GLP1, calculateConversion, selectSoliquaPen } = require("../clinical-engine.js");

describe("expanded therapy conversion", () => {
  test("exposes basal, premix, prandial and FRC insulin categories", () => {
    assert.deepEqual(new Set(ALL_INSULINS.map((item) => item.category)), new Set(["basal", "premix", "prandial", "frc"]));
    assert.equal(GLP1.length, 4);
  });

  test("reduces the total daily dose for a multiple-injection source regimen", () => {
    const result = calculateConversion({ sourceId: "glargine-u100", targetId: "degludec-u100", dailyDose: 40, factor: 1, sourceFrequency: 2 });
    assert.equal(result.factor, 0.8);
    assert.equal(result.estimatedDose, 32);
  });

  test("selects and caps the Soliqua starting pen from adjusted basal dose", () => {
    assert.deepEqual(selectSoliquaPen(19), { pen: "100/50", colorClass: "pen-peach", startingDose: 10, maxStartingDose: 20 });
    assert.deepEqual(selectSoliquaPen(25), { pen: "100/50", colorClass: "pen-peach", startingDose: 20, maxStartingDose: 20 });
    assert.deepEqual(selectSoliquaPen(40), { pen: "100/33", colorClass: "pen-olive", startingDose: 30, maxStartingDose: 30 });
    const result = calculateConversion({ sourceId: "nph-u100", targetId: "soliqua", dailyDose: 40, factor: 1, sourceFrequency: 2 });
    assert.equal(result.estimatedDose, 30);
    assert.equal(result.soliqua.pen, "100/33");
  });

  test("returns guidance instead of inventing an equivalent GLP-1 dose", () => {
    const result = calculateConversion({ sourceId: "semaglutide-weekly", targetId: "liraglutide-daily", dailyDose: 1 });
    assert.equal(result.guidanceOnly, true);
    assert.match(result.guidance, /تبدیل دوز معادل توصیه نمی‌شود/);
  });
});
