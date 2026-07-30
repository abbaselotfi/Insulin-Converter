(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ClinicalEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const ALL_INSULINS = Object.freeze([
    { id: "glargine-u100", generic: "Insulin glargine U-100", brand: "Lantus", category: "basal", frequencies: [1, 2, 3] },
    { id: "glargine-u300", generic: "Insulin glargine U-300", brand: "Toujeo", category: "basal", frequencies: [1] },
    { id: "degludec-u100", generic: "Insulin degludec U-100", brand: "Tresiba", category: "basal", frequencies: [1] },
    { id: "detemir-u100", generic: "Insulin detemir U-100", brand: "Levemir", category: "basal", frequencies: [1, 2, 3] },
    { id: "nph-u100", generic: "Human insulin NPH U-100", brand: "NPH", category: "basal", frequencies: [1, 2, 3] },
    { id: "aspart-mix-30", generic: "Biphasic insulin aspart 30", brand: "NovoMix 30", category: "premix", frequencies: [1, 2, 3] },
    { id: "lispro-mix-25", generic: "Insulin lispro mix 25", brand: "Humalog Mix 25", category: "premix", frequencies: [1, 2, 3] },
    { id: "lispro-mix-50", generic: "Insulin lispro mix 50", brand: "Humalog Mix 50", category: "premix", frequencies: [1, 2, 3] },
    { id: "human-mix-70-30", generic: "Human insulin 70/30", brand: "Premixed human insulin", category: "premix", frequencies: [1, 2, 3] },
    { id: "degludec-aspart-70-30", generic: "Insulin degludec/aspart 70/30", brand: "Ryzodeg", category: "premix", frequencies: [1, 2] },
    { id: "aspart-u100", generic: "Insulin aspart U-100", brand: "NovoRapid", category: "prandial", frequencies: [1, 2, 3] },
    { id: "lispro-u100", generic: "Insulin lispro U-100", brand: "Humalog", category: "prandial", frequencies: [1, 2, 3] },
    { id: "glulisine-u100", generic: "Insulin glulisine U-100", brand: "Apidra", category: "prandial", frequencies: [1, 2, 3] },
    { id: "regular-u100", generic: "Human regular insulin U-100", brand: "Regular", category: "prandial", frequencies: [1, 2, 3] },
    { id: "soliqua", generic: "Insulin glargine/lixisenatide", brand: "FRC Soliqua", category: "frc", targetOnly: true, frequencies: [1] }
  ]);

  const GLP1 = Object.freeze([
    { id: "semaglutide-weekly", generic: "Semaglutide", brand: "Ozempic", category: "glp1", interval: "weekly" },
    { id: "dulaglutide-weekly", generic: "Dulaglutide", brand: "Trulicity", category: "glp1", interval: "weekly" },
    { id: "liraglutide-daily", generic: "Liraglutide", brand: "Victoza", category: "glp1", interval: "daily" },
    { id: "lixisenatide-daily", generic: "Lixisenatide", brand: "Lyxumia/Adlyxin", category: "glp1", interval: "daily" }
  ]);
  // Keep the original public INSULINS contract as the five-item basal catalog.
  // Expanded insulin categories are available through ALL_INSULINS/THERAPIES.
  const INSULINS = Object.freeze(ALL_INSULINS.filter((item) => item.category === "basal"));
  const THERAPIES = Object.freeze([...ALL_INSULINS, ...GLP1]);

  function getTherapy(id) { return THERAPIES.find((item) => item.id === id); }
  function getInsulin(id) { return ALL_INSULINS.find((item) => item.id === id); }
  function reductionForFrequency(frequency) { return Number(frequency) > 1 ? 0.8 : 1; }

  function selectSoliquaPen(basalDose) {
    if (!Number.isFinite(basalDose) || basalDose <= 0 || basalDose > 60) throw new Error("SOLIQUA_RANGE");
    if (basalDose < 20) return Object.freeze({ pen: "100/50", colorClass: "pen-peach", startingDose: 10, maxStartingDose: 20 });
    if (basalDose < 30) return Object.freeze({ pen: "100/50", colorClass: "pen-peach", startingDose: 20, maxStartingDose: 20 });
    return Object.freeze({ pen: "100/33", colorClass: "pen-olive", startingDose: 30, maxStartingDose: 30 });
  }

  function calculateConversion({ sourceId, targetId, dailyDose, factor = 1, sourceFrequency = 1 }) {
    const source = getTherapy(sourceId);
    const target = getTherapy(targetId);
    const dose = Number(dailyDose);
    const selectedFactor = Number(factor);
    const frequency = Number(sourceFrequency);
    if (!source || !target) throw new Error("UNKNOWN_THERAPY");
    if (source.id === target.id) throw new Error("SAME_INSULIN");
    if (!Number.isFinite(dose) || dose <= 0 || dose > 300) throw new Error("INVALID_DOSE");
    if (![0.8, 1].includes(selectedFactor)) throw new Error("INVALID_FACTOR");
    if (source.frequencies && !source.frequencies.includes(frequency)) throw new Error("INVALID_FREQUENCY");

    if (source.category === "glp1" || target.category === "glp1") {
      return Object.freeze({
        source, target, guidanceOnly: true,
        guidance: source.category === "glp1" && target.category === "glp1"
          ? "تبدیل دوز معادل توصیه نمی‌شود. داروی جدید را در نوبت بعدی دوز قبلی و طبق دوز شروع و تیتراسیون برچسب همان فرآورده آغاز کنید؛ در صورت عوارض گوارشی از پایین‌ترین دوز شروع شود."
          : "برای تبدیل GLP-1 RA به انسولین، تبدیل واحدبه‌واحد وجود ندارد. شروع انسولین باید بر اساس HbA1c، قند ناشتا، وزن، خطر هیپوگلیسمی و دستورالعمل فرآورده تعیین شود."
      });
    }

    const frequencyFactor = reductionForFrequency(frequency);
    const finalFactor = Math.min(selectedFactor, frequencyFactor);
    const adjustedDose = Math.round(dose * finalFactor);
    if (target.category === "frc") {
      if (source.category !== "basal") throw new Error("SOLIQUA_BASAL_ONLY");
      const soliqua = selectSoliquaPen(adjustedDose);
      return Object.freeze({ source, target, currentDose: dose, sourceFrequency: frequency, factor: finalFactor,
        estimatedDose: soliqua.startingDose, formula: `${dose} × ${finalFactor} → ${soliqua.startingDose}`,
        soliqua,
        note: `دوز پایه پس از تعدیل ${adjustedDose} واحد است. دوز شروع برای قلم ${soliqua.pen} از ${soliqua.maxStartingDose} واحد بیشتر نمی‌شود تا مواجهه اولیه با lixisenatide محدود شود.` });
    }
    return Object.freeze({ source, target, currentDose: dose, sourceFrequency: frequency, factor: finalFactor,
      estimatedDose: adjustedDose, formula: `${dose} × ${finalFactor} = ${adjustedDose}`,
      note: frequencyFactor === 0.8 ? "به‌دلیل رژیم مبدأ چندتزریقی، کاهش احتیاطی ۲۰٪ بر مجموع دوز روزانه اعمال شد." : "برآورد اولیه؛ تیتراسیون بر اساس پایش قند خون لازم است." });
  }

  return Object.freeze({ INSULINS, ALL_INSULINS, GLP1, THERAPIES, getInsulin, getTherapy, reductionForFrequency, selectSoliquaPen, calculateConversion });
});
