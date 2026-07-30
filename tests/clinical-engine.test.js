const assert = require("node:assert/strict");
const { INSULINS, GLP1, calculateConversion, selectSoliquaPen } = require("../clinical-engine.js");

describe("clinical conversion engine", () => {
  test("exposes basal, premix, prandial and FRC insulin categories", () => {
    assert.deepEqual(new Set(INSULINS.map((item) => item.category)), new Set(["basal", "premix", "prandial", "frc"]));
    assert.equal(GLP1.length, 4);
  });

  test("calculates a direct one-to-one conversion", () => {
    const direct = calculateConversion({ sourceId: "glargine-u100", targetId: "degludec-u100", dailyDose: 24, factor: 1 });
    assert.equal(direct.estimatedDose, 24);
    assert.equal(direct.formula, "24 × 1 = 24");
  });

  test("rounds a reduced conversion to the nearest whole unit", () => {
    const reduced = calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 31, factor: 0.8 });
    assert.equal(reduced.estimatedDose, 25, "estimates should round to the nearest whole unit");
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

  test("rejects unsafe or invalid conversion inputs", () => {
    assert.throws(() => calculateConversion({ sourceId: "nph-u100", targetId: "nph-u100", dailyDose: 20, factor: 1 }), /SAME_INSULIN/);
    assert.throws(() => calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 0, factor: 1 }), /INVALID_DOSE/);
    assert.throws(() => calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 20, factor: 0.75 }), /INVALID_FACTOR/);
  });
});

console.log("Clinical engine tests passed");
