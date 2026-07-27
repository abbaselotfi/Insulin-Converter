(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ClinicalEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const INSULINS = Object.freeze([
    { id: "glargine-u100", generic: "Insulin glargine U-100", brand: "Lantus", group: "basal" },
    { id: "glargine-u300", generic: "Insulin glargine U-300", brand: "Toujeo", group: "basal" },
    { id: "degludec-u100", generic: "Insulin degludec U-100", brand: "Tresiba", group: "basal" },
    { id: "detemir-u100", generic: "Insulin detemir U-100", brand: "Levemir", group: "basal" },
    { id: "nph-u100", generic: "Human insulin NPH U-100", brand: "NPH", group: "basal" }
  ]);

  function getInsulin(id) {
    return INSULINS.find((insulin) => insulin.id === id);
  }

  function calculateConversion({ sourceId, targetId, dailyDose, factor }) {
    const source = getInsulin(sourceId);
    const target = getInsulin(targetId);
    const dose = Number(dailyDose);
    const multiplier = Number(factor);

    if (!source || !target) throw new Error("UNKNOWN_INSULIN");
    if (source.id === target.id) throw new Error("SAME_INSULIN");
    if (!Number.isFinite(dose) || dose <= 0 || dose > 300) throw new Error("INVALID_DOSE");
    if (![0.8, 1].includes(multiplier)) throw new Error("INVALID_FACTOR");

    return Object.freeze({
      source,
      target,
      currentDose: dose,
      factor: multiplier,
      estimatedDose: Math.round(dose * multiplier),
      formula: `${dose} × ${multiplier} = ${Math.round(dose * multiplier)}`
    });
  }

  return Object.freeze({ INSULINS, getInsulin, calculateConversion });
});
