const assert = require("node:assert/strict");
const {
  ALL_INSULINS,
  GLP1,
  calculateConversion,
  compositionFor,
  getInsulin,
  selectSoliquaPen,
  splitDailyDose
} = require("../clinical-engine.js");

describe("expanded therapy conversion", () => {
  test("exposes basal, premix, prandial and FRC insulin categories", () => {
    assert.deepEqual(new Set(ALL_INSULINS.map((item) => item.category)), new Set(["basal", "premix", "prandial", "frc"]));
    assert.equal(GLP1.length, 5);
  });

  test("reduces the total daily dose for a multiple-injection basal regimen", () => {
    const result = calculateConversion({
      sourceId: "glargine-u100",
      targetId: "degludec-u100",
      dailyDose: 40,
      factor: 1,
      sourceFrequency: 2
    });
    assert.equal(result.factor, 0.8);
    assert.equal(result.estimatedDose, 32);
    assert.match(result.note, /۲۰٪/);
  });

  test("applies the direction-specific Toujeo and Lantus label rules", () => {
    const toLantus = calculateConversion({
      sourceId: "glargine-u300",
      targetId: "glargine-u100",
      dailyDose: 50
    });
    assert.equal(toLantus.factor, 0.8);
    assert.equal(toLantus.estimatedDose, 40);

    const toToujeo = calculateConversion({
      sourceId: "glargine-u100",
      targetId: "glargine-u300",
      dailyDose: 40
    });
    assert.equal(toToujeo.factor, 1);
    assert.equal(toToujeo.estimatedDose, 40);
    assert.match(toToujeo.note, /دوز Toujeo بیشتری/);
  });

  test("starts Toujeo at 80% after twice-daily NPH or detemir", () => {
    for (const sourceId of ["nph-u100", "detemir-u100"]) {
      const result = calculateConversion({
        sourceId,
        targetId: "glargine-u300",
        dailyDose: 50,
        sourceFrequency: 2
      });
      assert.equal(result.estimatedDose, 40);
      assert.equal(result.factor, 0.8);
    }
  });

  test("selects and caps the Soliqua starting pen from adjusted basal dose", () => {
    assert.equal(selectSoliquaPen(19).startingDose, 10);
    assert.equal(selectSoliquaPen(19).pen, "100/50");
    assert.equal(selectSoliquaPen(20).startingDose, 20);
    assert.equal(selectSoliquaPen(29).startingDose, 20);
    assert.equal(selectSoliquaPen(30).startingDose, 30);
    assert.equal(selectSoliquaPen(60).pen, "100/33");
    assert.throws(() => selectSoliquaPen(61), /SOLIQUA_RANGE/);

    const twiceDailyBasal = calculateConversion({
      sourceId: "nph-u100",
      targetId: "soliqua",
      dailyDose: 40,
      factor: 1,
      sourceFrequency: 2
    });
    assert.equal(twiceDailyBasal.adjustedBasalDose, 32);
    assert.equal(twiceDailyBasal.estimatedDose, 30);
    assert.equal(twiceDailyBasal.soliqua.pen, "100/33");

    const fromToujeo = calculateConversion({
      sourceId: "glargine-u300",
      targetId: "soliqua",
      dailyDose: 30
    });
    assert.equal(fromToujeo.adjustedBasalDose, 24);
    assert.equal(fromToujeo.estimatedDose, 20);
    assert.equal(fromToujeo.soliqua.pen, "100/50");
  });

  test("starts Soliqua after GLP-1 with the peach 100/50 pen at 10 dose steps", () => {
    const result = calculateConversion({
      sourceId: "semaglutide-weekly",
      targetId: "soliqua"
    });
    assert.equal(result.estimatedDose, 10);
    assert.equal(result.soliqua.pen, "100/50");
    assert.equal(result.soliqua.colorClass, "pen-peach");
    assert.match(result.note, /قطع شود/);
  });

  test("uses the actual basal and prandial fractions of premixed insulin", () => {
    assert.deepEqual(compositionFor(getInsulin("lispro-mix-25"), 40), {
      basalPercent: 75,
      prandialPercent: 25,
      basalDose: 30,
      prandialDose: 10
    });

    const premixToBasal = calculateConversion({
      sourceId: "aspart-mix-30",
      targetId: "glargine-u100",
      dailyDose: 60,
      sourceFrequency: 2
    });
    assert.equal(premixToBasal.estimatedDose, 42);
    assert.equal(premixToBasal.sourceComposition.basalDose, 42);
    assert.match(premixToBasal.formula, /70% basal/);

    const basalToPremix = calculateConversion({
      sourceId: "glargine-u100",
      targetId: "lispro-mix-25",
      dailyDose: 40,
      targetFrequency: 2
    });
    assert.equal(basalToPremix.targetComposition.basalDose, 30);
    assert.equal(basalToPremix.targetComposition.prandialDose, 10);
    assert.deepEqual(basalToPremix.schedule.map((item) => item.dose), [20, 20]);
  });

  test("keeps two- and three-injection premix schedules equal to the total daily dose", () => {
    assert.deepEqual(splitDailyDose(41, 3).map((item) => item.dose), [14, 14, 13]);
    assert.equal(splitDailyDose(41, 3).reduce((sum, item) => sum + item.dose, 0), 41);
  });

  test("returns timing guidance instead of inventing an equivalent GLP-1 dose", () => {
    const weekly = calculateConversion({
      sourceId: "semaglutide-weekly",
      targetId: "dulaglutide-weekly"
    });
    assert.equal(weekly.guidanceOnly, true);
    assert.match(weekly.guidance, /۷ روز پس از آخرین دوز/);
    assert.match(weekly.guidance, /دوز معادل مستقیم/);

    const dailyToWeekly = calculateConversion({
      sourceId: "liraglutide-daily",
      targetId: "semaglutide-weekly"
    });
    assert.match(dailyToWeekly.guidance, /روز بعد/);
  });

  test("shows ADA basal initiation options after GLP-1 without claiming equivalence", () => {
    const result = calculateConversion({
      sourceId: "semaglutide-weekly",
      targetId: "glargine-u100",
      weightKg: 80
    });
    assert.equal(result.guidanceOnly, true);
    assert.equal(result.resultLabel, "۱۰ واحد یا 8–16 واحد/روز");
    assert.match(result.formula, /0.1–0.2/);
    assert.throws(() => calculateConversion({
      sourceId: "semaglutide-weekly",
      targetId: "glargine-u100"
    }), /WEIGHT_REQUIRED/);
  });

  test("refuses unsafe direct basal-to-prandial and premix-to-Soliqua estimates", () => {
    assert.throws(() => calculateConversion({
      sourceId: "glargine-u100",
      targetId: "aspart-u100",
      dailyDose: 30
    }), /INSUFFICIENT_REGIMEN/);
    assert.throws(() => calculateConversion({
      sourceId: "aspart-mix-30",
      targetId: "soliqua",
      dailyDose: 30,
      sourceFrequency: 2
    }), /SOLIQUA_BASAL_ONLY/);
  });
});
