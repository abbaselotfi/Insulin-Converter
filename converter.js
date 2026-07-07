// ============================================================
// Shared Utilities
// ============================================================

/**
 * Insulin group classification.
 * Replaces repeated inline arrays with a single source of truth.
 */
const INSULIN_GROUPS = {
    basal: ['lantus', 'toujeo', 'tresiba', 'levemir', 'nph_basal'],
    premix: ['novomix', 'humalog_mix_25', 'humalog_mix_50', 'ryzodeg', 'human_mix'],
    soliqua: ['soliqua_50', 'soliqua_33', 'soliqua_combined'],
    bolus: ['apidra_novorapid', 'regular']
};

/** Insulins that are always once-daily (no frequency selector shown). */
const FIXED_DOSE_INSULINS = ['toujeo', 'tresiba', 'soliqua_50', 'soliqua_33', 'soliqua_combined'];

/** Guideline code to display name mapping. */
const GUIDELINE_NAMES = {
    ada: 'ADA',
    aace: 'AACE',
    canadian: 'Diabetes Canada',
    nice: 'NICE',
    sanofi: 'Sanofi'
};

/**
 * Determine the insulin group type for a given insulin value.
 */
function getGroupType(value) {
    for (const [group, members] of Object.entries(INSULIN_GROUPS)) {
        if (members.includes(value)) return group;
    }
    return 'basal';
}

/**
 * Cached DOM element references to avoid repeated getElementById calls.
 * Populated on page load via initDOMCache().
 */
const DOM = {};

function initDOMCache() {
    const ids = [
        'insFrom', 'insTo', 'freqFromBox', 'freqFrom',
        'freqToBox', 'freqTo', 'guideline', 'strategy',
        'strategyBox', 'currentDose', 'resultBox',
        'resultText', 'descText', 'alertBox'
    ];
    for (const id of ids) {
        DOM[id] = document.getElementById(id);
    }
}

// ============================================================
// Frequency State Helpers (previously duplicated across functions)
// ============================================================

/**
 * Read the current frequency state from the DOM.
 * Previously this 4-line pattern was copy-pasted in both
 * updateStrategies() and convertInsulin().
 */
function getFrequencyState() {
    const fromVisible = DOM.freqFromBox.style.display !== 'none';
    const toVisible = DOM.freqToBox.style.display !== 'none';
    return {
        isFromBID: fromVisible && DOM.freqFrom.value === '2',
        isFromTID: fromVisible && DOM.freqFrom.value === '3',
        isToBID: toVisible && DOM.freqTo.value === '2',
        isToTID: toVisible && DOM.freqTo.value === '3'
    };
}

/**
 * Configure a frequency select box (show/hide, add/remove TID option).
 * Previously this logic was duplicated for freqFrom and freqTo in updateRegimen().
 */
function configureFrequencySelect(boxEl, selectEl, insulinValue, groupType) {
    if (FIXED_DOSE_INSULINS.includes(insulinValue) || groupType === 'bolus') {
        boxEl.style.display = 'none';
        selectEl.value = '1';
        return;
    }

    boxEl.style.display = 'block';

    if (groupType === 'premix' && insulinValue !== 'ryzodeg') {
        if (selectEl.options.length < 3) {
            const opt = document.createElement('option');
            opt.value = '3';
            opt.text = '\u06F3 بار در روز (TID)';
            selectEl.add(opt);
        }
    } else {
        if (selectEl.options.length > 2) {
            if (selectEl.value === '3') selectEl.value = '2';
            selectEl.remove(2);
        }
    }
}

// ============================================================
// Dose Distribution Utilities (previously duplicated inline)
// ============================================================

/**
 * Calculate BID (twice-daily) dose distribution.
 * Returns a description string for the 2/3-1/3 split.
 */
function formatBIDDistribution(totalDose) {
    const morning = Math.round(0.66 * totalDose);
    const evening = totalDose - morning;
    return `\n\n[توزیع دوز مقصد BID]: پیشنهاد می‌شود دوز کل به صورت ۲/۳ قبل از صبحانه (${morning} واحد) و ۱/۳ قبل از شام (${evening} واحد) تزریق گردد.`;
}

/**
 * Calculate TID (three-times-daily) dose distribution.
 * Returns a description string for the 40/30/30 split.
 */
function formatTIDDistribution(totalDose) {
    const morning = Math.round(0.4 * totalDose);
    const noon = Math.round(0.3 * totalDose);
    const evening = totalDose - (morning + noon);
    return `\n\n[توزیع دوز مقصد TID]: رژیم تهاجمی چندتزریقی؛ دوز کل پیشنهادی بین سه وعده تقسیم شود (${morning} واحد صبح / ${noon} واحد ظهر / ${evening} واحد شب). پایش مداوم قند خون (SMBG) الزامی است.`;
}

/**
 * Format 50:50 BID distribution message (used in basal-to-basal conversions).
 */
function formatEqualBIDDistribution(totalDose) {
    const half = Math.round(0.5 * totalDose);
    return `\n\n[توزیع دوز مقصد BID]: پیشنهاد می‌شود دوز کل به صورت ۵۰:۵۰ تقسیم گردد (${half} واحد صبح / ${totalDose - half} واحد شب) یا طبق متد بالینی ۲/۳ صبح و ۱/۳ شب تجویز شود.`;
}

// ============================================================
// Premix Basal Fraction Extraction (used in multiple conversion paths)
// ============================================================

/** Premix basal fraction ratios by insulin type. */
const PREMIX_BASAL_FRACTIONS = {
    humalog_mix_25: { ratio: 0.75, name: 'هومالوگ میکس ۲۵ (نسبت ۷۵٪ بیزال)' },
    humalog_mix_50: { ratio: 0.50, name: 'هومالوگ میکس ۵۰ (نسبت ۵۰٪ بیزال)' },
    _default: { ratio: 0.70, name: 'نوومیکس/میکس انسانی/رایزودگ (نسبت ۷۰٪ بیزال)' }
};

/**
 * Extract basal component from a premix dose.
 * Returns { basalDose, description }.
 */
function extractBasalFromPremix(insulinFrom, totalDose) {
    const info = PREMIX_BASAL_FRACTIONS[insulinFrom] || PREMIX_BASAL_FRACTIONS._default;
    const basalDose = info.ratio * totalDose;
    const description = `با توجه به اینکه انسولین مبدأ از نوع مخلوط ${info.name} است، ابتدا سهم بخش پایه‌ای (بیزال) آن یعنی ${basalDose.toFixed(1)} واحد استخراج گردید. `;
    return { basalDose, description };
}

// ============================================================
// Guideline-Specific Multiplier Logic
// ============================================================

/**
 * Determine the dose adjustment multiplier and rationale based on guideline rules.
 * Consolidates the previously duplicated guideline branching logic.
 */
function getGuidelineAdjustment(guideline, insulinFrom, insulinTo, groupFrom, groupTo, baseMultiplier) {
    let multiplier = baseMultiplier;
    let rationale = '';

    if (guideline === 'ada') {
        if (insulinFrom === 'toujeo' && insulinTo === 'lantus') {
            multiplier = 0.8;
            rationale = 'ملاک اختصاصی ADA: در تبدیل توژئو به لانتوس، اعمال کاهش ۲۰٪ دوز جهت ایمنی الزامی است. ';
        } else if (insulinFrom === 'nph_basal' && ['lantus', 'toujeo', 'tresiba'].includes(insulinTo)) {
            multiplier = 0.8;
            rationale = 'ملاک اختصاصی ADA: تغییر از NPH به آنالوگ‌های پیشرفته طولانی‌اثر، نیازمند کاهش دوز ۲۰٪ است. ';
        } else if (groupFrom === 'premix' || groupTo === 'premix') {
            multiplier = 0.8;
            rationale = 'توصیه عمومی ADA: در تعویض رژیم‌های حاوی مخلوط (Premix)، فرمول با اعمال ۲۰٪ کاهش احتیاطی محاسبه می‌شود. ';
        } else {
            rationale = `پروتکل دوز بر مبنای معیار انتخابی ADA با ضریب ${multiplier} تنظیم شد. `;
        }
    } else if (guideline === 'aace') {
        if (groupFrom !== groupTo || insulinFrom !== insulinTo) {
            multiplier = Math.min(multiplier, 0.8);
            rationale = 'الگوریتم محافظه‌کارانه AACE: در سوییچ‌های بین‌کلاسی یا تغییر برند انسولین، کاهش ۲۰ درصدی دوز قفل می‌شود. ';
        } else {
            multiplier = Math.min(multiplier, 0.85);
            rationale = `رویکرد کنترلی AACE: اعمال کاهش دوز احتیاطی با ضریب ${multiplier} لحاظ گردید. `;
        }
    } else if (guideline === 'canadian') {
        if (groupFrom === 'basal' && groupTo === 'basal' && insulinFrom !== 'toujeo') {
            rationale = 'دستورالعمل Diabetes Canada: این گایدلاین تعویض آنالوگ‌های پایه هم‌سطح را به صورت مستقیم (1:1) مجاز می‌داند. ';
        } else if (insulinFrom === 'nph_basal') {
            multiplier = 0.8;
            rationale = 'معیار Diabetes Canada: انتقال دوز از NPH به آنالوگ‌های مدرن شامل کاهش ساختاری ۲۰ درصدی دوز کل است. ';
        } else {
            rationale = `محاسبه بر اساس استراتژی منتخب در گایدلاین Diabetes Canada با ضریب ${multiplier} انجام شد. `;
        }
    } else if (guideline === 'nice') {
        if (groupFrom === 'premix' || insulinFrom === 'nph_basal') {
            multiplier = 0.8;
            rationale = 'راهنمای کلینیکال NICE: انتقال از ساختارهای سنتی یا مخلوط به آنالوگ‌های خالص، شامل کاهش ۲۰ درصدی دوز پایه کل است. ';
        } else {
            rationale = `محاسبه بر اساس استراتژی منتخب در گایدلاین NICE با ضریب ${multiplier} انجام شد. `;
        }
    }

    return { multiplier, rationale };
}

// ============================================================
// Main Application Logic
// ============================================================

function updateRegimen() {
    const insFromEl = DOM.insFrom;
    const insToEl = DOM.insTo;
    const fromValue = insFromEl.value;
    const fromGroup = getGroupType(fromValue);

    // Filter destination options based on source selection
    const optgroups = insToEl.getElementsByTagName('optgroup');
    for (const group of optgroups) {
        let hasVisible = false;
        const options = group.getElementsByTagName('option');
        for (const opt of options) {
            const optGroup = getGroupType(opt.value);
            let enabled = true;
            if (fromValue === opt.value) enabled = false;
            if (fromGroup === 'soliqua' && optGroup === 'soliqua') enabled = false;
            if (fromGroup === 'bolus' && optGroup !== 'bolus') enabled = false;
            if (fromGroup !== 'bolus' && optGroup === 'bolus') enabled = false;

            opt.disabled = !enabled;
            opt.style.display = enabled ? 'block' : 'none';
            if (enabled) hasVisible = true;
        }
        group.style.display = hasVisible ? 'block' : 'none';
        group.disabled = !hasVisible;
    }

    // Auto-select first valid destination if current is invalid
    const selectedTo = insToEl.options[insToEl.selectedIndex];
    if (!selectedTo || selectedTo.disabled || selectedTo.style.display === 'none') {
        for (const opt of insToEl.options) {
            if (!opt.disabled && opt.style.display !== 'none') {
                insToEl.value = opt.value;
                break;
            }
        }
    }

    const toValue = insToEl.value;
    const toGroup = getGroupType(toValue);

    // Update guideline options
    const guidelineEl = DOM.guideline;
    const previousGuideline = guidelineEl.value;
    guidelineEl.innerHTML = '';

    if (fromValue.includes('soliqua') || toValue.includes('soliqua')) {
        guidelineEl.innerHTML =
            '<option value="sanofi">پروتکل رسمی Sanofi / EMA / FDA (پیش‌فرض)</option>' +
            '<option value="ada">گایدلاین ADA</option>';
    } else {
        guidelineEl.innerHTML =
            '<option value="ada">گایدلاین ADA</option>' +
            '<option value="aace">گایدلاین AACE</option>' +
            '<option value="canadian">گایدلاین Diabetes Canada</option>' +
            '<option value="nice">گایدلاین NICE</option>';
        if (['ada', 'aace', 'canadian', 'nice'].includes(previousGuideline)) {
            guidelineEl.value = previousGuideline;
        }
    }

    // Configure frequency selects using shared utility
    configureFrequencySelect(DOM.freqFromBox, DOM.freqFrom, fromValue, fromGroup);
    configureFrequencySelect(DOM.freqToBox, DOM.freqTo, toValue, toGroup);

    // Show/hide strategy box
    if (toValue.includes('soliqua') || fromGroup === 'bolus') {
        DOM.strategyBox.style.display = 'none';
    } else {
        DOM.strategyBox.style.display = 'block';
        updateStrategies();
    }
}

function updateStrategies() {
    const guideline = DOM.guideline.value;
    const strategyEl = DOM.strategy;
    if (!strategyEl) return;

    const freq = getFrequencyState();
    const guidelineName = GUIDELINE_NAMES[guideline] || '';

    if (freq.isFromTID) {
        strategyEl.options[0].text = `کاهش ۲۰ درصدی دوز (رویکرد الزامی گایدلاین‌ها در رژیم مبدأ TID)`;
        strategyEl.options[1].text = `رویکرد استاندارد گایدلاین ${guidelineName}`;
        strategyEl.options[2].text = `کاهش ۱۵ درصدی دوز (حداقل تعدیل محافظه‌کارانه)`;
        strategyEl.value = '0.8';
    } else if (freq.isFromBID) {
        strategyEl.options[0].text = `کاهش ۲۰ درصدی دوز (رویکرد الزامی بر اساس رژیم BID مبدأ)`;
        strategyEl.options[1].text = `رویکرد استاندارد گایدلاین ${guidelineName}`;
        strategyEl.options[2].text = `کاهش ۱۵ درصدی دوز (حداقل تعدیل محافظه‌کارانه)`;
        strategyEl.value = '0.8';
    } else if (freq.isToTID || freq.isToBID) {
        strategyEl.options[0].text = `کاهش ۲۰ درصدی دوز (رویکرد فوق‌محافظه‌کارانه در رژیم مقصد چندتزریقی)`;
        strategyEl.options[1].text = `رویکرد استاندارد گایدلاین ${guidelineName}`;
        strategyEl.options[2].text = `کاهش ۱۵ درصدی دوز (تعدیل احتیاطی بالینی)`;
        strategyEl.value = '1.0';
    } else {
        strategyEl.options[0].text = `کاهش ۲۰ درصدی دوز (رویکرد محافظه‌کارانه بر اساس گایدلاین ${guidelineName})`;
        strategyEl.options[1].text = `رویکرد استاندارد گایدلاین ${guidelineName}`;
        strategyEl.options[2].text = `کاهش ۱۵ درصدی دوز (تعدیل استاندارد بالینی بر اساس گایدلاین ${guidelineName})`;
        strategyEl.value = '1.0';
    }
}

function convertInsulin() {
    const dose = parseFloat(DOM.currentDose.value);
    const insulinFrom = DOM.insFrom.value;
    const insulinTo = DOM.insTo.value;
    const guideline = DOM.guideline.value;
    const freq = getFrequencyState();
    let strategyMultiplier = parseFloat(DOM.strategy.value);

    if (isNaN(dose) || dose <= 0) {
        alert('لطفا دوز معتبری وارد کنید.');
        return;
    }

    let resultDose = 0;
    let description = '';
    const groupFrom = getGroupType(insulinFrom);
    const groupTo = getGroupType(insulinTo);
    let penLabel = '';
    let penColor = '#333';
    let effectiveDose = dose;
    let premixNote = '';

    // Extract basal component from premix source using shared utility
    if (groupFrom === 'premix' && (groupTo === 'basal' || groupTo === 'soliqua')) {
        const extraction = extractBasalFromPremix(insulinFrom, dose);
        effectiveDose = extraction.basalDose;
        premixNote = extraction.description;
    }

    // Bolus-to-bolus: direct 1:1 conversion
    if (groupFrom === 'bolus') {
        resultDose = Math.round(dose);
        description = 'تبدیل انسولین‌های سریع‌الاثر/بولوس: طبق راهنماهای بالینی، تعویض بین آنالوگ‌های سریع هم‌گروه (مانند نوورپید به آپیدرا) کاملا به صورت مستقیم و واحد‌به-واحد (1:1) انجام می‌شود.';
    }
    // Conversion TO Soliqua
    else if (insulinTo === 'soliqua_combined') {
        let adjustedDose = effectiveDose;
        let toujeoNote = '';

        if (insulinFrom === 'toujeo') {
            adjustedDose = 0.8 * effectiveDose;
            toujeoNote = 'با توجه به سوییچ از انسولین توژئو (Glargine U-300)، طبق دستورالعمل رسمی سازنده سولیکوآ، کاهش ساختاری ۲۰٪ جهت ایمنی بالینی و بروز غلظت تزریق اعمال شد. ';
        }

        if (adjustedDose >= 30) {
            resultDose = 30;
            penLabel = 'Insulin FRC Soliqua 100/33';
            penColor = '#446600';
            description = premixNote + toujeoNote + 'سوییچ به سولیکوآ: دوز انسولین پایه محاسباتی شما ۳۰ واحد یا بالاتر (در بازه ۳۰ تا ۶۰ واحد) است؛ بنابراین قلم Insulin FRC Soliqua 100/33 تعیین شد. جهت پیشگیری از عوارض گوارشی شدید (تهوع/استفراغ حاد) ناشی از جزء لایکسیزناتاید، دوز شروع درمان طبق گایدلاین باید دقیقا روی دوز پایه‌ی ۳۰ واحد قفل (Cap) شده و سپس تیتراسیون انجام شود.';
        } else if (adjustedDose >= 20) {
            resultDose = 20;
            penLabel = 'Insulin FRC Soliqua 100/50';
            penColor = '#d66800';
            description = premixNote + toujeoNote + 'سوییچ به سولیکوآ: دوز انسولین پایه محاسباتی شما بین ۲۰ تا ۲۹ واحد است؛ بنابراین قلم Insulin FRC Soliqua 100/50 تعیین شد. طبق پروتکل رسمی سازنده، برای غلبه بر عوارض ناخواسته گوارشی داروی ترکیبی، دوز شروع درمان دقیقا روی دوز ایمن ۲۰ واحد فیکس شده و افزایش دوز بر اساس تیتراسیون صورت می‌گیرد.';
        } else {
            resultDose = 10;
            penLabel = 'Insulin FRC Soliqua 100/50';
            penColor = '#d66800';
            description = premixNote + toujeoNote + 'سوییچ به سولیکوآ: به دلیل دوز پایه پایین قبلی (کمتر از ۲۰ واحد)، قلم Insulin FRC Soliqua 100/50 انتخاب شده و دوز شروع ایمن از کف دوز رسمی قلم یعنی ۱۰ واحد تعیین گردید.';
        }
    }
    // Basal to Premix conversion
    else if (groupFrom === 'basal' && groupTo === 'premix') {
        let multiplier = strategyMultiplier;
        let note = '';

        if (insulinTo === 'humalog_mix_50') {
            multiplier = Math.min(multiplier, 0.8);
            note = '⚠ هشدار اختصاصی: انسولین مقصد (هومالوگ میکس ۵۰) حاوی ۵۰٪ انسولین سریع‌الاثر است. جهت پیشگیری از هیپوگلیسمی حاد بعد از غذا، کاهش دوز ۲۰٪ به صورت پیش‌فرض اعمال شد. ';
        }

        resultDose = Math.round(dose * multiplier);
        description = note + `سوییچ از انسولین پایه به انسولین میکس با ضریب ${multiplier} انجام شد. دوز کل جدید روزانه ${resultDose} واحد می‌باشد. `;

        // Append dose distribution using shared utilities
        if (freq.isToBID) {
            description += formatBIDDistribution(resultDose);
        } else if (freq.isToTID) {
            description += formatTIDDistribution(resultDose);
        } else {
            description += '\n\n[توزیع دوز مقصد QD]: دوز کل جدید باید به صورت یکبار در روز، دقیقا قبل از بزرگ‌ترین وعده غذایی بیمار تزریق شود.';
        }
    }
    // General conversion (basal-to-basal, premix-to-premix, etc.)
    else {
        const adjustment = getGuidelineAdjustment(
            guideline, insulinFrom, insulinTo, groupFrom, groupTo, strategyMultiplier
        );
        let multiplier = adjustment.multiplier;
        let rationale = adjustment.rationale;

        // Apply frequency-based safety adjustments
        if (freq.isFromTID) {
            multiplier = Math.min(multiplier, 0.8);
            description = premixNote + 'تعدیل رژیم پیچیده (TID Premix به Basal QD): با توجه به فرکانس ۳ بار در روز انسولین میکس، سهم پایه استخراج و به دلیل حذف کامل دوزهای سریع‌الاثر، کاهش دوز ۲۰ درصدی جهت پیشگیری از تجمع دوز اعمال شد. ' + rationale;
        } else if (freq.isFromBID) {
            multiplier = Math.min(multiplier, 0.8);
            description = premixNote + 'تعدیل فرکانس (BID به QD): به دلیل فرکانس ۲ بار در روز انسولین مبدأ, جهت جلوگیری از تجمع دوز در یک نوبت، کاهش دوز ۲۰ درصدی بر محاسبات اعمال شد. ' + rationale;
        } else if (rationale) {
            if (strategyMultiplier === 1.0 && multiplier === 1.0) {
                description = premixNote + 'دستورالعمل بالینی QD به BID: در این نوع سوییچ، تبدیل ۱:۱ توصیه اصلی است؛ زیرا شکستن دوز به دو نوبت، خودبه‌خود ریسک پیک غلظتی را کنترل می‌کند. ' + rationale;
            } else {
                description = premixNote + `محاسبه دوز با ضریب تعدیل بالینی نهایی ${multiplier} جهت انتقال ایمن به رژیم مقصد BID انجام شد. ` + rationale;
            }
        } else {
            description = premixNote + rationale;
        }

        resultDose = Math.round(effectiveDose * multiplier);

        // Append BID distribution if target is BID and not from BID
        if (rationale && !freq.isFromBID) {
            description += formatEqualBIDDistribution(resultDose);
        }
    }

    // Render results
    if (insulinTo === 'soliqua_combined') {
        DOM.resultText.innerHTML =
            `<div style="font-size: 16px; color: ${penColor}; font-weight: bold; margin-bottom: 4px;">${penLabel}</div>` +
            `<div style="font-size: 24px; font-weight: bold; color: #004085;">${resultDose} واحد</div>`;
    } else {
        DOM.resultText.innerHTML =
            `<div style="font-size: 24px; font-weight: bold; color: #004085;">${resultDose} واحد</div>`;
    }

    DOM.descText.innerText = description;
    DOM.resultBox.style.display = 'block';
    DOM.alertBox.style.display = 'block';
}

// Initialize on page load
window.onload = function () {
    initDOMCache();
    updateRegimen();
};
