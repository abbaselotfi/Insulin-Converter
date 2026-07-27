const SOURCES = Object.freeze({
  suliquaEma: Object.freeze({
    title: "Suliqua EU product information, section 4.2",
    organization: "European Medicines Agency",
    url: "https://www.ema.europa.eu/en/documents/product-information/suliqua-epar-product-information_en.pdf",
    reviewedOn: "2026-07-27"
  }),
  calculationPolicy: Object.freeze({
    title: "Diabeto prototype same-class calculation policy",
    organization: "Internal — pending clinical approval",
    url: "https://github.com/abbaselotfi/Diabetes/blob/main/docs/CLINICAL_SOURCES.md",
    reviewedOn: "2026-07-27"
  })
});

const INSULINS = Object.freeze([
  { id: "glargine-u100", generic: "Insulin glargine U-100", brand: "Lantus", group: "basal", frequencies: [1, 2] },
  { id: "glargine-u300", generic: "Insulin glargine U-300", brand: "Toujeo", group: "basal", frequencies: [1] },
  { id: "degludec-u100", generic: "Insulin degludec U-100", brand: "Tresiba", group: "basal", frequencies: [1] },
  { id: "detemir-u100", generic: "Insulin detemir U-100", brand: "Levemir", group: "basal", frequencies: [1, 2] },
  { id: "nph-u100", generic: "Human insulin NPH U-100", brand: "NPH", group: "basal", frequencies: [1, 2] },

  { id: "aspart-u100", generic: "Insulin aspart U-100", brand: "NovoRapid / NovoLog", group: "rapid", frequencies: [1, 2, 3] },
  { id: "glulisine-u100", generic: "Insulin glulisine U-100", brand: "Apidra", group: "rapid", frequencies: [1, 2, 3] },
  { id: "lispro-u100", generic: "Insulin lispro U-100", brand: "Humalog", group: "rapid", frequencies: [1, 2, 3] },
  { id: "faster-aspart-u100", generic: "Faster insulin aspart U-100", brand: "Fiasp", group: "rapid", frequencies: [1, 2, 3] },
  { id: "regular-u100", generic: "Human insulin regular U-100", brand: "Regular", group: "rapid", frequencies: [1, 2, 3], isHumanRegular: true },

  { id: "aspart-mix30", generic: "Biphasic insulin aspart 30/70", brand: "NovoMix 30", group: "premix", frequencies: [1, 2, 3] },
  { id: "lispro-mix25", generic: "Insulin lispro mix 25/75", brand: "Humalog Mix 25", group: "premix", frequencies: [1, 2] },
  { id: "lispro-mix50", generic: "Insulin lispro mix 50/50", brand: "Humalog Mix 50", group: "premix", frequencies: [1, 2, 3] },
  { id: "human-mix30", generic: "Biphasic human insulin 30/70", brand: "Human Mix 30", group: "premix", frequencies: [1, 2] },
  { id: "degludec-aspart", generic: "Insulin degludec/aspart 70/30", brand: "Ryzodeg", group: "premix", frequencies: [1, 2] },

  { id: "suliqua-100-50", generic: "Insulin glargine/lixisenatide 100/50", brand: "Suliqua 10–40", group: "frc", frequencies: [1], pen: "peach" },
  { id: "suliqua-100-33", generic: "Insulin glargine/lixisenatide 100/33", brand: "Suliqua 30–60", group: "frc", frequencies: [1], pen: "olive" },
  { id: "suliqua-auto", generic: "Insulin glargine/lixisenatide", brand: "Suliqua — automatic pen selection", group: "frcTarget", frequencies: [1] }
]);

const TARGET_GROUPS = Object.freeze({
  basal: Object.freeze(["basal", "premix", "frcTarget"]),
  rapid: Object.freeze(["rapid"]),
  premix: Object.freeze(["premix", "basal"]),
  frc: Object.freeze(["basal"]),
  frcTarget: Object.freeze([])
});

function getInsulin(id) {
  return INSULINS.find((insulin) => insulin.id === id);
}

function getSourceInsulins() {
  return INSULINS.filter((insulin) => insulin.group !== "frcTarget");
}

function getCompatibleTargets(sourceId) {
  const source = getInsulin(sourceId);
  if (!source) return [];
  const targetGroups = TARGET_GROUPS[source.group] || [];
  return INSULINS.filter((target) => target.id !== source.id && targetGroups.includes(target.group));
}

function validateFrequency(insulin, frequency) {
  const parsed = Number(frequency);
  if (!insulin.frequencies.includes(parsed)) throw new Error("INVALID_FREQUENCY");
  return parsed;
}

function selectSuliquaStart({ source, dailyDose, sourceFrequency }) {
  if (source.group !== "basal") throw new Error("SULIQUA_REQUIRES_BASAL");
  let referenceDose = dailyDose;
  const adjustments = [];

  if (source.id === "glargine-u300" || sourceFrequency === 2) {
    referenceDose *= 0.8;
    adjustments.push("EMA_20_PERCENT_REDUCTION");
  }

  if (referenceDose > 60) throw new Error("SULIQUA_ABOVE_MAXIMUM");

  if (referenceDose < 20) {
    return Object.freeze({
      estimatedDose: 10,
      pen: "peach",
      penId: "suliqua-100-50",
      penStrength: "100 units/mL + 50 micrograms/mL",
      penRange: "10–40",
      insulinUnits: 10,
      lixisenatideMicrograms: 5,
      referenceDose,
      adjustments
    });
  }
  if (referenceDose < 30) {
    return Object.freeze({
      estimatedDose: 20,
      pen: "peach",
      penId: "suliqua-100-50",
      penStrength: "100 units/mL + 50 micrograms/mL",
      penRange: "10–40",
      insulinUnits: 20,
      lixisenatideMicrograms: 10,
      referenceDose,
      adjustments
    });
  }
  return Object.freeze({
    estimatedDose: 30,
    pen: "olive",
    penId: "suliqua-100-33",
    penStrength: "100 units/mL + 33 micrograms/mL",
    penRange: "30–60",
    insulinUnits: 30,
    lixisenatideMicrograms: 10,
    referenceDose,
    adjustments
  });
}

function calculateConversion({ sourceId, targetId, dailyDose, factor, sourceFrequency = 1, targetFrequency = 1 }) {
  const source = getInsulin(sourceId);
  const target = getInsulin(targetId);
  const dose = Number(dailyDose);
  const multiplier = Number(factor);

  if (!source || !target) throw new Error("UNKNOWN_INSULIN");
  if (source.id === target.id) throw new Error("SAME_INSULIN");
  if (!getCompatibleTargets(source.id).some((item) => item.id === target.id)) throw new Error("INCOMPATIBLE_GROUPS");
  if (!Number.isFinite(dose) || dose <= 0 || dose > 300) throw new Error("INVALID_DOSE");
  const validSourceFrequency = validateFrequency(source, sourceFrequency);
  const validTargetFrequency = validateFrequency(target, targetFrequency);

  if (target.id === "suliqua-auto") {
    const selection = selectSuliquaStart({ source, dailyDose: dose, sourceFrequency: validSourceFrequency });
    return Object.freeze({
      kind: "suliqua",
      source,
      target: getInsulin(selection.penId),
      currentDose: dose,
      sourceFrequency: validSourceFrequency,
      targetFrequency: 1,
      factor: selection.referenceDose / dose,
      estimatedDose: selection.estimatedDose,
      formula: selection.adjustments.length ? `${dose} × 0.8 → ${selection.estimatedDose}` : `${dose} → ${selection.estimatedDose}`,
      selection,
      sourceReference: SOURCES.suliquaEma
    });
  }

  if (![0.8, 1].includes(multiplier)) throw new Error("INVALID_FACTOR");
  const estimatedDose = Math.round(dose * multiplier);
  return Object.freeze({
    kind: "same-class-estimate",
    source,
    target,
    currentDose: dose,
    sourceFrequency: validSourceFrequency,
    targetFrequency: validTargetFrequency,
    factor: multiplier,
    estimatedDose,
    formula: `${dose} × ${multiplier} = ${estimatedDose}`,
    perInjectionEstimate: estimatedDose / validTargetFrequency,
    timingChanged: source.isHumanRegular !== target.isHumanRegular && source.group === "rapid",
    sourceReference: SOURCES.calculationPolicy
  });
}

export { SOURCES, INSULINS, getInsulin, getSourceInsulins, getCompatibleTargets, selectSuliquaStart, calculateConversion };
