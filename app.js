const translations = {
  fa: {
    skip: "پرش به محتوای اصلی", clinicalPlatform: "پلتفرم بالینی", dashboard: "داشبورد",
    insulinConverter: "تبدیل انسولین", patients: "بیماران", medications: "داروها", soon: "به‌زودی",
    prototype: "نسخه آزمایشی", notForPrescription: "برای تجویز مستقل نیست", workspace: "فضای کار بالینی",
    todayFocus: "ابزارهای تصمیم‌یار برای ویزیت امروز", clinicalWorkspace: "Clinical workspace",
    welcome: "سلام دکتر، آماده‌اید؟", welcomeText: "ابزارهای مورد نیاز برای تصمیم‌گیری سریع‌تر و مستندتر را از اینجا در دسترس دارید.",
    startConversion: "شروع تبدیل انسولین", safetyTitle: "تصمیم نهایی با پزشک است",
    safetyText: "خروجی‌های این نسخه، برآورد محاسباتی هستند و باید با وضعیت بیمار، قند خون و منابع تأییدشده تطبیق داده شوند.",
    clinicalTools: "ابزارهای بالینی", clinicalToolsText: "ماژول‌های نسخه نخست پلتفرم", available: "فعال",
    converterDescription: "تبدیل ساختاریافته انسولین‌های پایه، سریع‌الاثر، مخلوط و FRC با کنترل سازگاری و هشدار ایمنی.",
    openTool: "باز کردن ابزار", glpDescription: "مقایسه داروها، دوزها و ملاحظات ایمنی در یک نمای واحد.",
    treatmentPath: "مسیر درمان", pathDescription: "مسیر تصمیم‌گیری نسخه‌پذیر بر اساس بیماری‌های همراه و اهداف فردی.",
    contentStatus: "وضعیت محتوای بالینی", contentStatusText: "قاعده Suliqua بر اساس EMA؛ سایر تبدیل‌ها در انتظار تأیید کمیته علمی",
    calculator: "Calculator", backDashboard: "بازگشت به داشبورد", converterIntro: "یک برآورد اولیه و قابل پیگیری برای تغییر انسولین ایجاد کنید.",
    currentRegimen: "رژیم فعلی", requiredFields: "تمام فیلدها الزامی هستند", currentInsulin: "انسولین فعلی",
    dailyDose: "دوز کل روزانه", units: "واحد", doseHelp: "مجموع واحد تزریق‌شده طی ۲۴ ساعت",
    sourceFrequency: "تعداد تزریق فعلی", targetFrequency: "تعداد تزریق مقصد", frequencyHelp: "تعداد دفعات تزریق همین انسولین در ۲۴ ساعت",
    newRegimen: "رژیم جایگزین", selectTarget: "فقط مقصدهای سازگار با انسولین فعلی نمایش داده می‌شوند", targetInsulin: "انسولین مقصد",
    safetyApproach: "رویکرد محاسبه", oneToOne: "معادل ۱:۱ (انتخاب دستی)", reduceTwenty: "کاهش احتیاطی ۲۰٪ (انتخاب دستی)",
    strategyHelp: "این گزینه توصیه خودکار گایدلاین نیست و باید با منبع معتبر و شرایط بیمار تطبیق داده شود.",
    calculate: "محاسبه برآورد", resultWaiting: "نتیجه اینجا نمایش داده می‌شود", resultWaitingText: "اطلاعات رژیم فعلی و مقصد را تکمیل کنید.",
    estimatedDose: "برآورد دوز شروع", unitsPerDay: "واحد در روز", from: "مبدأ", to: "مقصد", factor: "ضریب",
    beforeUse: "پیش از استفاده بالینی", beforeUseText: "قند خون، سابقه هیپوگلیسمی، عملکرد کلیه و کبد، زمان‌بندی تزریق و اطلاعات رسمی فرآورده را بررسی کنید.",
    newCalculation: "محاسبه جدید", viewSource: "مشاهده منبع و وضعیت تأیید قاعده", timingTitle: "زمان تزریق تغییر می‌کند",
    timingText: "انسولین رگولار انسانی و آنالوگ‌های سریع زمان‌بندی یکسانی نسبت به غذا ندارند؛ اطلاعات رسمی فرآورده را بررسی کنید.",
    invalidDose: "دوز باید عددی بین ۱ تا ۳۰۰ واحد باشد.", sameInsulin: "انسولین مبدأ و مقصد باید متفاوت باشند.",
    incompatible: "این دو گروه انسولین قابل تبدیل مستقیم در این سامانه نیستند.", invalidFrequency: "تعداد تزریق انتخاب‌شده برای این فرآورده معتبر نیست.",
    suliquaMaximum: "دوز مرجع بیشتر از محدوده مجاز Suliqua است؛ این تبدیل نباید با این ابزار انجام شود.",
    basalHelp: "انسولین پایه؛ Rapid در مقصد نمایش داده نمی‌شود.", rapidHelp: "Rapid/Regular؛ فقط Rapid و Regular در مقصد نمایش داده می‌شوند.",
    premixHelp: "انسولین مخلوط؛ تعداد تزریق را مطابق رژیم واقعی بیمار انتخاب کنید.", frcHelp: "FRC حاوی انسولین پایه و آگونیست GLP-1 است.",
    once: "۱ بار در روز", twice: "۲ بار در روز", threeTimes: "۳ بار در روز", frequencySummary: "دفعات مقصد؛ توزیع دوز بین نوبت‌ها باید جداگانه و فردمحور تعیین شود",
    peachPen: "قلم هلویی Suliqua 100/50", olivePen: "قلم زیتونی Suliqua 100/33", doseSteps: "دوز استپ",
    emaAdjustment: "کاهش ۲۰٪ دوز مرجع طبق بخش ۴.۲ اطلاعات EMA اعمال شد.", suliquaAuto: "Suliqua FRC — انتخاب خودکار قلم"
  },
  en: {
    skip: "Skip to main content", clinicalPlatform: "Clinical platform", dashboard: "Dashboard",
    insulinConverter: "Insulin converter", patients: "Patients", medications: "Medications", soon: "Coming soon",
    prototype: "Prototype", notForPrescription: "Not for autonomous prescribing", workspace: "Clinical workspace",
    todayFocus: "Decision-support tools for today's visit", clinicalWorkspace: "Clinical workspace", welcome: "Welcome, Doctor",
    welcomeText: "Access focused tools for faster, more traceable clinical decisions.", startConversion: "Start insulin conversion",
    safetyTitle: "The clinician makes the final decision", safetyText: "Outputs are calculation estimates and must be reconciled with patient status, glucose data, and approved sources.",
    clinicalTools: "Clinical tools", clinicalToolsText: "Modules in the first platform release", available: "Available",
    converterDescription: "Structured basal, rapid, premixed, and FRC switching with compatibility controls and safety warnings.", openTool: "Open tool",
    glpDescription: "Compare medications, doses, and safety considerations in one view.", treatmentPath: "Treatment pathway",
    pathDescription: "Versioned decision pathways informed by comorbidities and individual goals.", contentStatus: "Clinical content status",
    contentStatusText: "Suliqua rule sourced to EMA; other switches pending scientific approval", calculator: "Calculator",
    backDashboard: "Back to dashboard", converterIntro: "Create an initial, traceable insulin-switch estimate.", currentRegimen: "Current regimen",
    requiredFields: "All fields are required", currentInsulin: "Current insulin", dailyDose: "Total daily dose", units: "units",
    doseHelp: "Total units administered over 24 hours", sourceFrequency: "Current injection frequency", targetFrequency: "Target injection frequency",
    frequencyHelp: "Number of injections of this insulin in 24 hours", newRegimen: "Replacement regimen",
    selectTarget: "Only destinations compatible with the current insulin are shown", targetInsulin: "Target insulin",
    safetyApproach: "Calculation approach", oneToOne: "1:1 equivalent (manual selection)", reduceTwenty: "20% precautionary reduction (manual selection)",
    strategyHelp: "This is not an automatic guideline recommendation; reconcile it with an approved source and patient context.", calculate: "Calculate estimate",
    resultWaiting: "Your result will appear here", resultWaitingText: "Complete the current and target regimen details.", estimatedDose: "Estimated starting dose",
    unitsPerDay: "units per day", from: "From", to: "To", factor: "Factor", beforeUse: "Before clinical use",
    beforeUseText: "Review glucose data, hypoglycemia history, kidney and liver function, injection timing, and approved product information.",
    newCalculation: "New calculation", viewSource: "View source and rule approval status", timingTitle: "Injection timing changes",
    timingText: "Human regular insulin and rapid analogues do not have identical meal timing; review the approved product information.",
    invalidDose: "Dose must be a number between 1 and 300 units.", sameInsulin: "Current and target insulin must be different.",
    incompatible: "This system does not permit a direct conversion between these insulin groups.", invalidFrequency: "The selected frequency is not valid for this product.",
    suliquaMaximum: "The reference dose exceeds the Suliqua range; do not perform this conversion with this tool.",
    basalHelp: "Basal insulin; rapid products are excluded from destinations.", rapidHelp: "Rapid/regular insulin; only rapid and regular destinations are shown.",
    premixHelp: "Premixed insulin; select the patient's actual regimen frequency.", frcHelp: "FRC contains basal insulin and a GLP-1 receptor agonist.",
    once: "Once daily", twice: "Twice daily", threeTimes: "Three times daily", frequencySummary: "Target frequency; dose distribution must be determined separately and individualized",
    peachPen: "Peach Suliqua 100/50 pen", olivePen: "Olive Suliqua 100/33 pen", doseSteps: "dose steps",
    emaAdjustment: "A 20% reference-dose reduction was applied per EMA product information section 4.2.", suliquaAuto: "Suliqua FRC — automatic pen selection"
  }
};

let language = localStorage.getItem("diabeto-language") || "fa";
const $ = (selector) => document.querySelector(selector);

function t(key) { return translations[language][key] || key; }
function insulinLabel(insulin) {
  return insulin.id === "suliqua-auto" ? t("suliquaAuto") : `${insulin.generic} — ${insulin.brand}`;
}
function frequencyLabel(value) { return value === 1 ? t("once") : value === 2 ? t("twice") : t("threeTimes"); }

function fillSelect(select, items, selectedId) {
  select.innerHTML = items.map((item) => `<option value="${item.id}" ${item.id === selectedId ? "selected" : ""}>${insulinLabel(item)}</option>`).join("");
}

function fillFrequencies(select, insulin, preferredValue) {
  select.innerHTML = insulin.frequencies.map((value) => `<option value="${value}" ${Number(preferredValue) === value ? "selected" : ""}>${frequencyLabel(value)}</option>`).join("");
  select.closest(".field").classList.toggle("single-option", insulin.frequencies.length === 1);
}

function updateSourceContext() {
  const source = ClinicalEngine.getInsulin($("#sourceInsulin").value);
  const helpKeys = { basal: "basalHelp", rapid: "rapidHelp", premix: "premixHelp", frc: "frcHelp" };
  $("#sourceGroupHelp").textContent = t(helpKeys[source.group]);
  fillFrequencies($("#sourceFrequency"), source, $("#sourceFrequency").value);

  const targets = ClinicalEngine.getCompatibleTargets(source.id);
  const previousTarget = $("#targetInsulin").value;
  fillSelect($("#targetInsulin"), targets, targets.some((item) => item.id === previousTarget) ? previousTarget : targets[0]?.id);
  updateTargetContext();
}

function updateTargetContext() {
  const target = ClinicalEngine.getInsulin($("#targetInsulin").value);
  if (!target) return;
  fillFrequencies($("#targetFrequency"), target, $("#targetFrequency").value);
  const isSuliqua = target.id === "suliqua-auto";
  $("#strategyField").hidden = isSuliqua;
  $("#targetFrequencyField").hidden = isSuliqua;
}

function populateInsulins() {
  const sourceItems = ClinicalEngine.getSourceInsulins();
  const selectedSource = sourceItems.some((item) => item.id === $("#sourceInsulin").value) ? $("#sourceInsulin").value : sourceItems[0].id;
  fillSelect($("#sourceInsulin"), sourceItems, selectedSource);
  updateSourceContext();
}

function applyLanguage(nextLanguage) {
  language = nextLanguage;
  const isFa = language === "fa";
  document.documentElement.lang = language;
  document.documentElement.dir = isFa ? "rtl" : "ltr";
  document.title = isFa ? "Diabeto | دستیار بالینی دیابت" : "Diabeto | Clinical diabetes assistant";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translations[language][element.dataset.i18n];
    if (value) element.textContent = value;
  });
  $(".language-current").textContent = isFa ? "فا" : "EN";
  $("#languageToggle > span:last-child").textContent = isFa ? "EN" : "فا";
  localStorage.setItem("diabeto-language", language);
  populateInsulins();
}

function openSection(sectionId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === sectionId));
  document.querySelectorAll(".nav-item[data-section]").forEach((item) => item.classList.toggle("active", item.dataset.section === sectionId));
  history.replaceState(null, "", `#${sectionId}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  closeMenu();
}

function closeMenu() {
  $(".sidebar").classList.remove("open");
  $("#sidebarOverlay").classList.remove("visible");
  $("#menuButton").setAttribute("aria-expanded", "false");
}

function showError(key) {
  const box = $("#formError");
  box.textContent = t(key);
  box.classList.add("visible");
}

function resetResult() {
  $("#conversionForm").reset();
  populateInsulins();
  $("#resultContent").hidden = true;
  $("#emptyResult").hidden = false;
  $("#formError").classList.remove("visible");
}

function renderResult(result) {
  $("#resultDose").textContent = result.estimatedDose;
  $("#calculationText").textContent = result.formula;
  $("#resultSource").textContent = insulinLabel(result.source);
  $("#resultTarget").textContent = insulinLabel(result.target);
  $("#resultFactor").textContent = result.kind === "suliqua" ? "EMA 4.2" : `× ${result.factor}`;
  $("#timingWarning").hidden = !result.timingChanged;

  const isSuliqua = result.kind === "suliqua";
  $("#suliquaPen").hidden = !isSuliqua;
  if (isSuliqua) {
    $("#penSwatch").className = `pen-swatch ${result.selection.pen}`;
    $("#penName").textContent = result.selection.pen === "peach" ? t("peachPen") : t("olivePen");
    const adjustment = result.selection.adjustments.length ? ` ${t("emaAdjustment")}` : "";
    $("#penDetails").textContent = `${result.selection.estimatedDose} ${t("doseSteps")} = ${result.selection.insulinUnits} U insulin glargine + ${result.selection.lixisenatideMicrograms} mcg lixisenatide.${adjustment}`;
    $("#frequencyResult").textContent = frequencyLabel(1);
    $("#sourceLink").href = result.sourceReference.url;
  } else {
    const frequency = result.targetFrequency;
    $("#frequencyResult").textContent = frequency > 1 ? `${frequencyLabel(frequency)} — ${t("frequencySummary")}` : frequencyLabel(1);
    $("#sourceLink").href = "docs/CLINICAL_SOURCES.md";
  }

  $("#emptyResult").hidden = true;
  $("#resultContent").hidden = false;
}

const errorKeys = {
  SAME_INSULIN: "sameInsulin", INCOMPATIBLE_GROUPS: "incompatible", INVALID_FREQUENCY: "invalidFrequency",
  SULIQUA_ABOVE_MAXIMUM: "suliquaMaximum", INVALID_DOSE: "invalidDose", UNKNOWN_INSULIN: "incompatible"
};

document.querySelectorAll("[data-open-section]").forEach((button) => button.addEventListener("click", () => openSection(button.dataset.openSection)));
document.querySelectorAll(".nav-item[data-section]").forEach((item) => item.addEventListener("click", (event) => { event.preventDefault(); openSection(item.dataset.section); }));
$("#languageToggle").addEventListener("click", () => applyLanguage(language === "fa" ? "en" : "fa"));
$("#menuButton").addEventListener("click", () => {
  const open = $(".sidebar").classList.toggle("open");
  $("#sidebarOverlay").classList.toggle("visible", open);
  $("#menuButton").setAttribute("aria-expanded", String(open));
});
$("#sidebarOverlay").addEventListener("click", closeMenu);
$("#resetButton").addEventListener("click", resetResult);
$("#sourceInsulin").addEventListener("change", updateSourceContext);
$("#targetInsulin").addEventListener("change", updateTargetContext);
$("#conversionForm").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#formError").classList.remove("visible");
  try {
    const result = ClinicalEngine.calculateConversion({
      sourceId: $("#sourceInsulin").value,
      targetId: $("#targetInsulin").value,
      dailyDose: $("#currentDose").value,
      factor: $("#strategy").value,
      sourceFrequency: $("#sourceFrequency").value,
      targetFrequency: $("#targetFrequency").value
    });
    renderResult(result);
  } catch (error) {
    showError(errorKeys[error.message] || "invalidDose");
  }
});

populateInsulins();
applyLanguage(language);
openSection(location.hash === "#converter" ? "converter" : "home");
