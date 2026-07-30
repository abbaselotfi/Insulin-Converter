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
    { id: "aspart-u100", generic: "Insulin aspart U-100", brand: "NovoRapid", category: "prandial", actionProfile: "rapid", frequencies: [1, 2, 3] },
    { id: "lispro-u100", generic: "Insulin lispro U-100", brand: "Humalog", category: "prandial", actionProfile: "rapid", frequencies: [1, 2, 3] },
    { id: "glulisine-u100", generic: "Insulin glulisine U-100", brand: "Apidra", category: "prandial", actionProfile: "rapid", frequencies: [1, 2, 3] },
    { id: "regular-u100", generic: "Human regular insulin U-100", brand: "Regular", category: "prandial", actionProfile: "short", frequencies: [1, 2, 3] },
    { id: "soliqua", generic: "Insulin glargine/lixisenatide", brand: "FRC Soliqua", category: "frc", targetOnly: true, frequencies: [1] }
  ]);

  const INSULINS = Object.freeze(ALL_INSULINS.filter((item) => item.category === "basal"));
  const THERAPIES = ALL_INSULINS;

  function getTherapy(id) { return THERAPIES.find((item) => item.id === id); }
  function getInsulin(id) { return ALL_INSULINS.find((item) => item.id === id); }
  function reductionForFrequency(frequency) { return Number(frequency) > 1 ? 0.8 : 1; }
  function roundDose(value) { return Math.round(value); }

  function selectSoliquaPen(basalDose) {
    if (!Number.isFinite(basalDose) || basalDose <= 0 || basalDose > 60) throw new Error("SOLIQUA_RANGE");
    if (basalDose < 20) {
      return Object.freeze({
        pen: "100/50", penRange: "10–40", colorClass: "pen-peach", colorName: "هلویی",
        startingDose: 10, lixisenatideStartingDose: 5, maxStartingDose: 20
      });
    }
    if (basalDose < 30) {
      return Object.freeze({
        pen: "100/50", penRange: "10–40", colorClass: "pen-peach", colorName: "هلویی",
        startingDose: 20, lixisenatideStartingDose: 10, maxStartingDose: 20
      });
    }
    return Object.freeze({
      pen: "100/33", penRange: "30–60", colorClass: "pen-olive", colorName: "زیتونی",
      startingDose: 30, lixisenatideStartingDose: 10, maxStartingDose: 30
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

  function validateInsulinPath(source, target) {
    if (target.category === "frc" && source.category !== "basal") throw new Error("SOLIQUA_BASAL_ONLY");
    if (source.category === "prandial" && target.category !== "prandial") throw new Error("INSUFFICIENT_REGIMEN");
    if (target.category === "prandial" && source.category !== "prandial") throw new Error("INSUFFICIENT_REGIMEN");
  }

  function automaticFactor(source, target, sourceFrequency) {
    const frequency = Number(sourceFrequency);
    if (source.category === "prandial" && target.category === "prandial") {
      if (source.actionProfile !== target.actionProfile) {
        return {
          factor: 0.8,
          locked: true,
          reason: "برای interchange بین انسولین rapid-acting و Regular، کاهش ۲۰٪ دوز جهت کاهش خطر هیپوگلیسمی اعمال شد."
        };
      }
      return {
        factor: 1,
        locked: true,
        reason: "تبدیل بین آنالوگ‌های rapid-acting به‌صورت واحدبه‌واحد (۱:۱) انجام شد."
      };
    }
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
    if (source.category !== "premix") return { dose: dailyDose, label: "", sourceComposition: null };
    const sourceComposition = compositionFor(source, dailyDose);
    if (target.category === "basal") {
      return {
        dose: dailyDose * source.basalPercent / 100,
        label: ` × ${source.basalPercent}% basal`,
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
    targetFrequency = 1
  }) {
    const source = getTherapy(sourceId);
    const target = getTherapy(targetId);
    const dose = Number(dailyDose);
    const selectedFactor = Number(factor);
    const frequency = Number(sourceFrequency);
    const destinationFrequency = Number(targetFrequency);

    if (!source || !target) throw new Error("UNKNOWN_THERAPY");
    if (source.id === target.id) throw new Error("SAME_INSULIN");
    if (!Number.isFinite(dose) || dose <= 0 || dose > 300) throw new Error("INVALID_DOSE");
    if (![0.8, 1].includes(selectedFactor)) throw new Error("INVALID_FACTOR");
    if (source.frequencies && !source.frequencies.includes(frequency)) throw new Error("INVALID_FREQUENCY");
    if (target.category === "premix" && !(target.targetFrequencies || target.frequencies).includes(destinationFrequency)) throw new Error("INVALID_TARGET_FREQUENCY");

    validateInsulinPath(source, target);
    const basis = conversionBasis(source, target, dose);
    const rule = automaticFactor(source, target, frequency);
    const finalFactor = rule.locked ? rule.factor : Math.min(selectedFactor, rule.factor);
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
    if (source.category === "prandial" && target.category === "prandial") {
      const timing = target.actionProfile === "short"
        ? "Regular معمولاً حدود ۳۰ دقیقه پیش از غذا تزریق می‌شود."
        : "آنالوگ rapid-acting نزدیک شروع وعده غذایی تزریق می‌شود.";
      note = `${note} ${timing} تنظیم نهایی باید بر اساس کربوهیدرات وعده و قند پیش از غذا انجام شود.`;
    }
    if (basis.sourceComposition && target.category === "basal") {
      note = `از مجموع دوز میکس، فقط سهم بیزال فرآورده مبدأ مبنای محاسبه قرار گرفت. ${note}`;
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
      evidence: ["ada-2026", "product-label", "insulin-interchange"]
    });
  }

  return Object.freeze({
    INSULINS,
    ALL_INSULINS,
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
