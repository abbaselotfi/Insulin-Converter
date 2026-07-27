const assert = require("node:assert/strict");
const {
  INSULINS,
  getSourceInsulins,
  getCompatibleTargets,
  calculateConversion
} = require("../clinical-engine.js");

assert.equal(INSULINS.length, 18, "catalog should contain basal, rapid, premix, and FRC products");
assert.equal(getSourceInsulins().length, 17, "automatic Suliqua target must not appear as a current product");

const rapidTargets = getCompatibleTargets("glulisine-u100");
assert.ok(rapidTargets.length >= 4);
assert.ok(rapidTargets.every((item) => item.group === "rapid"), "rapid insulin must only switch to rapid insulin");
assert.ok(!rapidTargets.some((item) => item.group === "basal"));

const basalTargets = getCompatibleTargets("glargine-u100");
assert.ok(!basalTargets.some((item) => item.group === "rapid"), "rapid options must be hidden for a basal source");
assert.ok(basalTargets.some((item) => item.id === "suliqua-auto"));

const direct = calculateConversion({ sourceId: "glargine-u100", targetId: "degludec-u100", dailyDose: 24, factor: 1 });
assert.equal(direct.estimatedDose, 24);
assert.equal(direct.formula, "24 × 1 = 24");

const reduced = calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 31, factor: 0.8, sourceFrequency: 2 });
assert.equal(reduced.estimatedDose, 25, "estimates should round to the nearest whole unit");

const split = calculateConversion({ sourceId: "aspart-mix30", targetId: "lispro-mix50", dailyDose: 45, factor: 0.8, sourceFrequency: 3, targetFrequency: 3 });
assert.equal(split.estimatedDose, 36);
assert.equal(split.perInjectionEstimate, 12);

const rapidToRegular = calculateConversion({ sourceId: "aspart-u100", targetId: "regular-u100", dailyDose: 24, factor: 1, sourceFrequency: 3, targetFrequency: 3 });
assert.equal(rapidToRegular.timingChanged, true, "regular insulin timing change must be surfaced");

const peachLow = calculateConversion({ sourceId: "glargine-u100", targetId: "suliqua-auto", dailyDose: 18, sourceFrequency: 1 });
assert.equal(peachLow.kind, "suliqua");
assert.equal(peachLow.estimatedDose, 10);
assert.equal(peachLow.selection.pen, "peach");
assert.equal(peachLow.target.id, "suliqua-100-50");

const peachMid = calculateConversion({ sourceId: "glargine-u100", targetId: "suliqua-auto", dailyDose: 24, sourceFrequency: 1 });
assert.equal(peachMid.estimatedDose, 20);
assert.equal(peachMid.selection.lixisenatideMicrograms, 10);

const olive = calculateConversion({ sourceId: "glargine-u100", targetId: "suliqua-auto", dailyDose: 44, sourceFrequency: 1 });
assert.equal(olive.estimatedDose, 30);
assert.equal(olive.selection.pen, "olive");
assert.equal(olive.target.id, "suliqua-100-33");

const reducedToujeo = calculateConversion({ sourceId: "glargine-u300", targetId: "suliqua-auto", dailyDose: 35, sourceFrequency: 1 });
assert.equal(reducedToujeo.selection.referenceDose, 28);
assert.equal(reducedToujeo.estimatedDose, 20);
assert.deepEqual(reducedToujeo.selection.adjustments, ["EMA_20_PERCENT_REDUCTION"]);

const reducedTwiceDaily = calculateConversion({ sourceId: "nph-u100", targetId: "suliqua-auto", dailyDose: 40, sourceFrequency: 2 });
assert.equal(reducedTwiceDaily.selection.referenceDose, 32);
assert.equal(reducedTwiceDaily.estimatedDose, 30);

assert.throws(() => calculateConversion({ sourceId: "aspart-u100", targetId: "glargine-u100", dailyDose: 20, factor: 1 }), /INCOMPATIBLE_GROUPS/);
assert.throws(() => calculateConversion({ sourceId: "glargine-u100", targetId: "glargine-u100", dailyDose: 20, factor: 1 }), /SAME_INSULIN/);
assert.throws(() => calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 0, factor: 1 }), /INVALID_DOSE/);
assert.throws(() => calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 20, factor: 0.75 }), /INVALID_FACTOR/);
assert.throws(() => calculateConversion({ sourceId: "degludec-u100", targetId: "glargine-u100", dailyDose: 20, factor: 1, sourceFrequency: 2 }), /INVALID_FREQUENCY/);
assert.throws(() => calculateConversion({ sourceId: "glargine-u100", targetId: "suliqua-auto", dailyDose: 61, sourceFrequency: 1 }), /SULIQUA_ABOVE_MAXIMUM/);

console.log("Clinical engine tests passed");
