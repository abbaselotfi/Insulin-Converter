const assert = require("node:assert/strict");
const { INSULINS, calculateConversion } = require("../clinical-engine.js");

assert.equal(INSULINS.length, 5, "initial basal insulin catalog should be available");

const direct = calculateConversion({ sourceId: "glargine-u100", targetId: "degludec-u100", dailyDose: 24, factor: 1 });
assert.equal(direct.estimatedDose, 24);
assert.equal(direct.formula, "24 × 1 = 24");

const reduced = calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 31, factor: 0.8 });
assert.equal(reduced.estimatedDose, 25, "estimates should round to the nearest whole unit");

assert.throws(() => calculateConversion({ sourceId: "nph-u100", targetId: "nph-u100", dailyDose: 20, factor: 1 }), /SAME_INSULIN/);
assert.throws(() => calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 0, factor: 1 }), /INVALID_DOSE/);
assert.throws(() => calculateConversion({ sourceId: "nph-u100", targetId: "glargine-u100", dailyDose: 20, factor: 0.75 }), /INVALID_FACTOR/);

console.log("Clinical engine tests passed");
