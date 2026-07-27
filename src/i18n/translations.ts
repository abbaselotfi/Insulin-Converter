export type Language = "fa" | "en";

export const copy = {
  fa: {
    platform: "پلتفرم بالینی", dashboard: "داشبورد", converter: "تبدیل انسولین", patients: "بیماران", medications: "داروها",
    soon: "به‌زودی", prototype: "نسخه آزمایشی", notPrescription: "برای تجویز مستقل نیست", workspace: "فضای کار بالینی",
    workspaceHint: "ابزارهای تصمیم‌یار برای ویزیت امروز", welcome: "سلام دکتر، آماده‌اید؟",
    welcomeBody: "ابزارهای مورد نیاز برای تصمیم‌گیری سریع‌تر و مستندتر را از اینجا در دسترس دارید.", start: "شروع تبدیل انسولین",
    physicianDecision: "تصمیم نهایی با پزشک است", safety: "خروجی‌ها برآورد محاسباتی هستند و باید با وضعیت بیمار، داده‌های قند خون و منابع تأییدشده تطبیق داده شوند.",
    tools: "ابزارهای بالینی", toolsHint: "ماژول‌های نسخه نخست پلتفرم", active: "فعال", open: "باز کردن ابزار",
    converterBody: "تبدیل ساختاریافته انسولین‌های پایه، سریع‌الاثر، مخلوط و FRC با کنترل سازگاری.",
    glpBody: "مقایسه داروها، دوزها و ملاحظات ایمنی در یک نمای واحد.", pathway: "مسیر درمان", pathwayBody: "مسیرهای نسخه‌پذیر بر اساس بیماری‌های همراه و اهداف فردی.",
    contentStatus: "وضعیت محتوای بالینی", contentStatusBody: "قاعده Suliqua بر اساس EMA؛ سایر تبدیل‌ها در انتظار تأیید علمی",
    back: "بازگشت به داشبورد", calculator: "ماشین‌حساب تبدیل انسولین", calculatorBody: "یک برآورد اولیه و قابل پیگیری برای تغییر انسولین ایجاد کنید.",
    currentRegimen: "رژیم فعلی", currentInsulin: "انسولین فعلی", dailyDose: "دوز کل روزانه", units: "واحد", sourceFrequency: "تعداد تزریق فعلی",
    replacement: "رژیم جایگزین", compatibleOnly: "فقط مقصدهای سازگار نمایش داده می‌شوند", targetInsulin: "انسولین مقصد", targetFrequency: "تعداد تزریق مقصد",
    approach: "رویکرد محاسبه", oneToOne: "معادل ۱:۱ (انتخاب دستی)", reduce: "کاهش احتیاطی ۲۰٪ (انتخاب دستی)",
    manualWarning: "این گزینه توصیه خودکار گایدلاین نیست و باید با منبع معتبر و شرایط بیمار تطبیق داده شود.", calculate: "محاسبه برآورد",
    waiting: "نتیجه اینجا نمایش داده می‌شود", waitingBody: "اطلاعات رژیم فعلی و مقصد را تکمیل کنید.", estimate: "برآورد دوز شروع", perDay: "واحد در روز",
    from: "مبدأ", to: "مقصد", factor: "ضریب", beforeUse: "پیش از استفاده بالینی", beforeUseBody: "قند خون، سابقه هیپوگلیسمی، عملکرد کلیه و کبد، زمان‌بندی تزریق و اطلاعات رسمی فرآورده را بررسی کنید.",
    newCalculation: "محاسبه جدید", source: "مشاهده منبع و وضعیت تأیید قاعده", once: "۱ بار در روز", twice: "۲ بار در روز", thrice: "۳ بار در روز",
    frequencyNote: "توزیع دوز میان نوبت‌ها باید جداگانه و فردمحور تعیین شود.", timingTitle: "زمان تزریق تغییر می‌کند", timingBody: "Regular انسانی و آنالوگ‌های سریع، زمان‌بندی یکسانی نسبت به غذا ندارند.",
    peach: "قلم هلویی Suliqua 100/50", olive: "قلم زیتونی Suliqua 100/33", invalidDose: "دوز باید بین ۱ تا ۳۰۰ واحد باشد.", incompatible: "ترکیب انتخاب‌شده در این سامانه مجاز نیست.", maximum: "دوز مرجع خارج از محدوده مجاز Suliqua است."
  },
  en: {
    platform: "Clinical platform", dashboard: "Dashboard", converter: "Insulin converter", patients: "Patients", medications: "Medications",
    soon: "Coming soon", prototype: "Prototype", notPrescription: "Not for autonomous prescribing", workspace: "Clinical workspace",
    workspaceHint: "Decision-support tools for today's visit", welcome: "Welcome, Doctor", welcomeBody: "Access focused tools for faster, traceable clinical decisions.", start: "Start insulin conversion",
    physicianDecision: "The clinician makes the final decision", safety: "Outputs are calculation estimates and must be reconciled with patient status, glucose data, and approved sources.",
    tools: "Clinical tools", toolsHint: "Modules in the first platform release", active: "Available", open: "Open tool",
    converterBody: "Structured basal, rapid, premixed, and FRC switching with compatibility controls.", glpBody: "Compare medications, doses, and safety considerations in one view.",
    pathway: "Treatment pathway", pathwayBody: "Versioned pathways informed by comorbidities and individual goals.", contentStatus: "Clinical content status", contentStatusBody: "Suliqua rule sourced to EMA; other switches pending scientific approval",
    back: "Back to dashboard", calculator: "Insulin conversion calculator", calculatorBody: "Create an initial, traceable insulin-switch estimate.", currentRegimen: "Current regimen",
    currentInsulin: "Current insulin", dailyDose: "Total daily dose", units: "units", sourceFrequency: "Current injection frequency", replacement: "Replacement regimen",
    compatibleOnly: "Only compatible destinations are shown", targetInsulin: "Target insulin", targetFrequency: "Target injection frequency", approach: "Calculation approach",
    oneToOne: "1:1 equivalent (manual selection)", reduce: "20% precautionary reduction (manual selection)", manualWarning: "This is not an automatic guideline recommendation; reconcile it with an approved source and patient context.",
    calculate: "Calculate estimate", waiting: "Your result will appear here", waitingBody: "Complete the current and target regimen details.", estimate: "Estimated starting dose", perDay: "units per day",
    from: "From", to: "To", factor: "Factor", beforeUse: "Before clinical use", beforeUseBody: "Review glucose data, hypoglycemia history, kidney and liver function, injection timing, and approved product information.",
    newCalculation: "New calculation", source: "View source and rule approval status", once: "Once daily", twice: "Twice daily", thrice: "Three times daily",
    frequencyNote: "Dose distribution must be determined separately and individualized.", timingTitle: "Injection timing changes", timingBody: "Human regular insulin and rapid analogues do not have identical meal timing.",
    peach: "Peach Suliqua 100/50 pen", olive: "Olive Suliqua 100/33 pen", invalidDose: "Dose must be between 1 and 300 units.", incompatible: "The selected combination is not permitted by this tool.", maximum: "The reference dose is outside the Suliqua range."
  }
} as const;
