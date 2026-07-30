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
    { id: "aspart-mix-30", generic: "Biphasic insulin aspart 30", brand: "NovoMix 30", category: "premix", frequencies: [1, 2, 3], targetFrequencies: [2, 3], basalPercent: 70, prandialPercent: 30 },
    { id: "lispro-mix-25", generic: "Insulin lispro mix 25", brand: "Humalog Mix 25", category: "premix", frequencies: [1, 2, 3], targetFrequencies: [2, 3], basalPercent: 75, prandialPercent: 25 },
    { id: "lispro-mix-50", generic: "Insulin lispro mix 50", brand: "Humalog Mix 50", category: "premix", frequencies: [1, 2, 3], targetFrequencies: [2, 3], basalPercent: 50, prandialPercent: 50 },
    { id: "human-mix-70-30", generic: "Human insulin 70/30", brand: "Premixed human insulin", category: "premix", frequencies: [1, 2, 3], targetFrequencies: [2, 3], basalPercent: 70, prandialPercent: 30 },
    { id: "degludec-aspart-70-30", generic: "Insulin degludec/aspart 70/30", brand: "Ryzodeg", category: "premix", frequencies: [1, 2], targetFrequencies: [1, 2], basalPercent: 70, prandialPercent: 30 },
    { id: "aspart-u100", generic: "Insulin aspart U-100", brand: "NovoRapid", category: "prandial", frequencies: [1, 2, 3] },
    { id: "lispro-u100", generic: "Insulin lispro U-100", brand: "Humalog", category: "prandial", frequencies: [1, 2, 3] },
    { id: "glulisine-u100", generic: "Insulin glulisine U-100", brand: "Apidra", category: "prandial", frequencies: [1, 2, 3] },
    { id: "regular-u100", generic: "Human regular insulin U-100", brand: "Regular", category: "prandial", frequencies: [1, 2, 3] },
    { id: "soliqua", generic: "Insulin glargine/lixisenatide", brand: "FRC Soliqua", category: "frc", targetOnly: true, frequencies: [1] }
  ]);

  const GLP1 = Object.freeze([
    { id: "semaglutide-weekly", generic: "Semaglutide", brand: "Ozempic", category: "glp1", interval: "weekly", startingDose: "۰٫۲۵ میلی‌گرم هفتگی برای ۴ هفته" },
    { id: "dulaglutide-weekly", generic: "Dulaglutide", brand: "Trulicity", category: "glp1", interval: "weekly", startingDose: "۰٫۷۵ میلی‌گرم هفتگی" },
    { id: "tirzepatide-weekly", generic: "Tirzepatide", brand: "Mounjaro", category: "glp1", interval: "weekly", startingDose: "۲٫۵ میلی‌گرم هفتگی برای ۴ هفته" },
    { id: "liraglutide-daily", generic: "Liraglutide", brand: "Victoza", category: "glp1", interval: "daily", startingDose: "۰٫۶ میلی‌گرم روزانه برای حداقل ۱ هفته" },
    { id: "lixisenatide-daily", generic: "Lixisenatide", brand: "Lyxumia/Adlyxin", category: "glp1", interval: "daily", startingDose: "۱۰ میکروگرم روزانه برای ۱۴ روز" }
  ]);

  // Preserve the original public contract used by the first clinical-engine tests.
  const INSULINS = Object.freeze(ALL_INSULINS.filter((item) => item.category === "basal"));
  const THERAPIES = Object.freeze([...ALL_INSULINS, ...GLP1]);

  function getTherapy(id) { return THERAPIES.find((item) => item.id === id); }
  function getInsulin(id) { return ALL_INSULINS.find((item) => item.id === id); }
  function reductionForFrequency(frequency) { return Number(frequency) > 1 ? 0.8 : 1; }
  function roundDose(value) { return Math.round(value); }

  function selectSoliquaPen(basalDose) {
    if (!Number.isFinite(basalDose) || basalDose <= 0 || basalDose > 60) throw new Error("SOLIQUA_RANGE");
    if (basalDose < 20) {
      return Object.freeze({
        pen: "100/50",
        penRange: "10–40",
        colorClass: "pen-peach",
        colorName: "هلویی",
        startingDose: 10,
        lixisenatideStartingDose: 5,
        maxStartingDose: 20
      });
    }
    if (basalDose < 30) {
      return Object.freeze({
        pen: "100/50",
        penRange: "10–40",
        colorClass: "pen-peach",
        colorName: "هلویی",
        startingDose: 20,
        lixisenatideStartingDose: 10,
        maxStartingDose: 20
      });
    }
    return Object.freeze({
      pen: "100/33",
      penRange: "30–60",
      colorClass: "pen-olive",
      colorName: "زیتونی",
      startingDose: 30,
      lixisenatideStartingDose: 10,
      maxStartingDose: 30
    });
  }

  function compositionFor(insulin, totalDose) {
    if (!insulin || insulin.category !== "premix") return null;
    return Object.freeze({
      basalPercent: insulin.basalPercent,
      prandialPercent: insulin.prandialPercent,
      basalDose: roundDose(totalDose * insulin.basalPercent / 100),
      prandialDose: roundDose(totalDose * insulin.prandialPercent / 100)
    });
  }

  function splitDailyDose(totalDose, frequency) {
    const count = Number(frequency);
    if (!Number.isInteger(count) || count < 1 || count > 3) throw new Error("INVALID_TARGET_FREQUENCY");
    const base = Math.floor(totalDose / count);
    const remainder = totalDose - (base * count);
    return Object.freeze(Array.from({ length: count }, (_, index) => Object.freeze({
      injection: index + 1,
      dose: base + (index < remainder ? 1 : 0)
    })));
  }

  function glpSwitchTiming(source, target) {
    if (source.interval === "weekly" && target.interval === "weekly") return "داروی جدید را ۷ روز پس از آخرین دوز، در همان روز هفتگی آغاز کنید.";
    if (source.interval === "daily" && target.interval === "weekly") return "داروی هفتگی جدید را روز بعد از آخرین دوز روزانه آغاز کنید.";
    if (source.interval === "weekly" && target.interval === "daily") return "داروی روزانه جدید را در موعد دوز هفتگی بعدی، یعنی ۷ روز پس از آخرین دوز، آغاز کنید.";
    return "داروی روزانه جدید را روز بعد از آخرین دوز داروی قبلی آغاز کنید.";
  }

  function glpGuidance(source, target) {
    return Object.freeze({
      source,
      target,
      guidanceOnly: true,
      resultLabel: "بدون تبدیل دوز معادل",
      guidance: `${glpSwitchTiming(source, target)} دوز معادل مستقیم بین GLP-1ها تعریف نشده است. دوز شروع برچسب مقصد: ${target.startingDose}. اگر علت سوییچ عدم تحمل گوارشی است، پس از رفع علائم و از پایین‌ترین دوز شروع شود.`,
      note: "ADA 2026 انتخاب GLP-1–based therapy را بر اساس اثربخشی، بیماری‌های همراه، تحمل و دسترسی توصیه می‌کند، اما جدول تبدیل دوز بین فرآورده‌ها ارائه نمی‌دهد.",
      evidence: ["ada-2026", "glp-switch-paper", "product-label"]
    });
  }

  function glpToBasalGuidance(source, target, weightKg) {
    const weight = Number(weightKg);
    if (!Number.isFinite(weight) || weight < 30 || weight > 300) throw new Error("WEIGHT_REQUIRED");
    const low = roundDose(weight * 0.1);
    const high = roundDose(weight * 0.2);
    return Object.freeze({
      source,
      target,
      guidanceOnly: true,
      estimatedDose: null,
      resultLabel: `۱۰ واحد یا ${low}–${high} واحد/روز`,
      formula: `${weight} kg × 0.1–0.2 U/kg = ${low}–${high} U/day`,
      guidance: "تبدیل واحدبه‌واحد از GLP-1 به انسولین وجود ندارد. در صورت اندیکاسیون شروع بازال، ADA 2026 شروع با ۱۰ واحد در روز یا ۰٫۱ تا ۰٫۲ واحد/کیلوگرم/روز و سپس تیتراسیون بر اساس قند ناشتا را پیشنهاد می‌کند.",
      note: "در نبود هیپرگلیسمی شدید، ADA 2026 درمان GLP-1–based را به انسولین ترجیح می‌دهد؛ اگر انسولین اضافه می‌شود، ادامه GLP-1 معمولاً برای اثر بهتر قندی/وزنی و هیپوگلیسمی کمتر بررسی می‌شود و قطع خودکار آن توصیه نشده است.",
      evidence: ["ada-2026", "product-label"]
    });
  }

  function glpToSoliqua(source, target) {
    const soliqua = selectSoliquaPen(10);
    return Object.freeze({
      source,
      target,
      currentDose: null,
      sourceFrequency: null,
      factor: null,
      estimatedDose: 10,
      formula: "GLP-1 RA → 10 dose steps",
      soliqua,
      note: "GLP-1 قبلی باید پیش از شروع قطع شود. طبق اطلاعات رسمی Suliqua، بیمار دریافت‌کننده GLP-1 مانند بیمار insulin-naïve با قلم 100/50 و ۱۰ dose-step (۱۰ واحد گلارژین/۵ میکروگرم lixisenatide) شروع می‌کند.",
      evidence: ["suliqua-ema"]
    });
  }

  function validateInsulinPath(source, target) {
    if (target.category === "frc" && source.category !== "basal") throw new Error("SOLIQUA_BASAL_ONLY");
    if (source.category === "prandial" && target.category !== "prandial") throw new Error("INSUFFICIENT_REGIMEN");
    if (source.category === "basal" && target.category === "prandial") throw new Error("INSUFFICIENT_REGIMEN");
  }

  function automaticFactor(source, target, sourceFrequency) {
    const frequency = Number(sourceFrequency);
    if (source.id === "glargine-u300" && target.id === "glargine-u100") {
      return { factor: 0.8, reason: "برچسب Lantus: شروع Lantus با ۸۰٪ دوز Toujeo." };
    }
    if (target.id === "glargine-u300" && ["nph-u100", "detemir-u100"].includes(source.id) && frequency > 1) {
      return { factor: 0.8, reason: "برچسب Toujeo: از NPH یا detemir دوباردرروز با ۸۰٪ مجموع دوز روزانه شروع شود." };
    }
    if (target.category === "frc" && (source.id === "glargine-u300" || frequency > 1)) {
      return { factor: 0.8, reason: "اطلاعات رسمی Suliqua: برای گلارژین U-300 یا بازال دوباردرروز، ۲۰٪ از مجموع دوز روزانه کم می‌شود." };
    }
    if (source.category === "basal" && frequency > 1) {
      return { factor: 0.8, reason: "کاهش احتیاطی ۲۰٪ بر مجموع دوز رژیم بازال چندتزریقی اعمال شد." };
    }
    return { factor: 1, reason: "" };
  }

  function conversionBasis(source, target, dailyDose) {
    if (source.category !== "premix") {
      return { dose: dailyDose, label: "", sourceComposition: null };
    }
    const sourceComposition = compositionFor(source, dailyDose);
    if (target.category === "basal") {
      return {
        dose: dailyDose * source.basalPercent / 100,
        label: ` × ${source.basalPercent}% basal`,
        sourceComposition
      };
    }
    if (target.category === "prandial") {
      return {
        dose: dailyDose * source.prandialPercent / 100,
        label: ` × ${source.prandialPercent}% prandial`,
        sourceComposition
      };
    }
    return { dose: dailyDose, label: "", sourceComposition };
  }

  function calculateConversion({
    sourceId,
    targetId,
    dailyDose,
    factor = 1,
    sourceFrequency = 1,
    targetFrequency = 1,
    weightKg
  }) {
    const source = getTherapy(sourceId);
    const target = getTherapy(targetId);
    if (!source || !target) throw new Error("UNKNOWN_THERAPY");
    if (source.id === target.id) throw new Error("SAME_INSULIN");

    if (source.category === "glp1" && target.category === "glp1") return glpGuidance(source, target);
    if (source.category === "glp1" && target.category === "frc") return glpToSoliqua(source, target);
    if (source.category === "glp1" && target.category === "basal") return glpToBasalGuidance(source, target, weightKg);
    if (source.category === "glp1") {
      return Object.freeze({
        source,
        target,
        guidanceOnly: true,
        resultLabel: "نیازمند طراحی رژیم کامل",
        guidance: "برای رفتن از GLP-1 به انسولین میکس یا پرندیال، دوز معادل مستقیم وجود ندارد و HbA1c، الگوی قند، وزن، وعده‌ها و کل رژیم انسولین لازم است.",
        note: "این ابزار برای این مسیر دوز خودکار تولید نمی‌کند.",
        evidence: ["ada-2026"]
      });
    }
    if (target.category === "glp1") {
      return Object.freeze({
        source,
        target,
        guidanceOnly: true,
        resultLabel: "بدون تبدیل دوز معادل",
        guidance: `GLP-1 مقصد با دوز شروع برچسب آن (${target.startingDose}) آغاز و تیتراسیون می‌شود. دوز انسولین به‌صورت خودکار قطع یا تبدیل نمی‌شود.`,
        note: "ADA 2026 هنگام افزودن GLP-1 به انسولین، بازبینی دوز انسولین را برای کاهش هیپوگلیسمی توصیه می‌کند؛ مقدار کاهش باید با A1C و داده‌های قند فردی تعیین شود.",
        evidence: ["ada-2026", "product-label"]
      });
    }

    const dose = Number(dailyDose);
    const selectedFactor = Number(factor);
    const frequency = Number(sourceFrequency);
    const destinationFrequency = Number(targetFrequency);
    if (!Number.isFinite(dose) || dose <= 0 || dose > 300) throw new Error("INVALID_DOSE");
    if (![0.8, 1].includes(selectedFactor)) throw new Error("INVALID_FACTOR");
    if (source.frequencies && !source.frequencies.includes(frequency)) throw new Error("INVALID_FREQUENCY");
    if (target.category === "premix" && !(target.targetFrequencies || target.frequencies).includes(destinationFrequency)) throw new Error("INVALID_TARGET_FREQUENCY");

    validateInsulinPath(source, target);
    const basis = conversionBasis(source, target, dose);
    const rule = automaticFactor(source, target, frequency);
    const finalFactor = Math.min(selectedFactor, rule.factor);
    const adjustedDose = roundDose(basis.dose * finalFactor);

    if (target.category === "frc") {
      const soliqua = selectSoliquaPen(adjustedDose);
      const offLabelFrequency = frequency > 2
        ? " رژیم بازال سه‌باردرروز در جدول رسمی Suliqua ذکر نشده است؛ کاهش ۲۰٪ در این مسیر محافظه‌کارانه است و نیاز به بازبینی متخصص دارد."
        : "";
      return Object.freeze({
        source,
        target,
        currentDose: dose,
        sourceFrequency: frequency,
        factor: finalFactor,
        adjustedBasalDose: adjustedDose,
        estimatedDose: soliqua.startingDose,
        formula: `${dose}${basis.label} × ${finalFactor} → ${soliqua.startingDose} dose steps`,
        soliqua,
        note: `${rule.reason} دوز بازال مبنا پس از تعدیل ${adjustedDose} واحد است؛ شروع قلم ${soliqua.pen} روی ${soliqua.startingDose} dose-step قفل می‌شود و از سقف شروع ${soliqua.maxStartingDose} بالاتر نمی‌رود.${offLabelFrequency}`,
        evidence: ["suliqua-ema"]
      });
    }

    const targetComposition = compositionFor(target, adjustedDose);
    const schedule = target.category === "premix" ? splitDailyDose(adjustedDose, destinationFrequency) : null;
    let note = rule.reason || "شروع برآوردی ۱:۱؛ پایش نزدیک و تیتراسیون بر اساس قند خون لازم است.";
    if (source.id === "glargine-u100" && target.id === "glargine-u300" && finalFactor === 1) {
      note = "برچسب Toujeo شروع واحدبه‌واحد از بازال یک‌باردرروز را توصیه می‌کند؛ برای رسیدن به کنترل مشابه ممکن است در ادامه دوز Toujeo بیشتری لازم شود و اثر کامل آن تا حدود ۵ روز ظاهر نشود.";
    }
    if (basis.sourceComposition && target.category !== "premix") {
      const component = target.category === "basal" ? "بیزال" : "پرندیال";
      note = `از مجموع دوز میکس، فقط سهم ${component} فرآورده مبدأ مبنای محاسبه قرار گرفت. ${note}`;
    }
    if (targetComposition) {
      note += ` میکس مقصد شامل ${targetComposition.basalPercent}٪ بیزال و ${targetComposition.prandialPercent}٪ پرندیال است. تقسیم نمایش‌داده‌شده بین تزریق‌ها یک تقسیم اولیه مساوی است و باید با الگوی وعده و SMBG/CGM فردی تنظیم شود.`;
    }
    if (frequency > 2 && source.category === "basal") {
      note += " مصرف سه‌باردرروز Lantus/Levemir/NPH در قواعد رسمی این تبدیل به‌طور اختصاصی اعتبارسنجی نشده و نیازمند بازبینی متخصص است.";
    }

    return Object.freeze({
      source,
      target,
      currentDose: dose,
      sourceFrequency: frequency,
      targetFrequency: target.category === "premix" ? destinationFrequency : null,
      factor: finalFactor,
      estimatedDose: adjustedDose,
      formula: `${dose}${basis.label} × ${finalFactor} = ${adjustedDose}`,
      sourceComposition: basis.sourceComposition,
      targetComposition,
      schedule,
      note,
      evidence: ["ada-2026", "product-label"]
    });
  }

  return Object.freeze({
    INSULINS,
    ALL_INSULINS,
    GLP1,
    THERAPIES,
    getInsulin,
    getTherapy,
    reductionForFrequency,
    selectSoliquaPen,
    compositionFor,
    splitDailyDose,
    calculateConversion
  });
});
