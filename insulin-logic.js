function getGroupType(e) {
    return ["lantus", "toujeo", "tresiba", "levemir", "nph_basal"].includes(e) ? "basal" : ["novomix", "humalog_mix_25", "humalog_mix_50", "ryzodeg", "human_mix"].includes(e) ? "premix" : "soliqua_50" === e || "soliqua_33" === e || "soliqua_combined" === e ? "soliqua" : "apidra_novorapid" === e || "regular" === e ? "bolus" : "basal"
}

function updateRegimen() {
    const e = document.getElementById("insFrom"),
        t = document.getElementById("insTo");
    let n = e.value,
        a = getGroupType(n);
    const o = t.getElementsByTagName("optgroup");
    for (let e of o) {
        let t = !1;
        const o = e.getElementsByTagName("option");
        for (let i of o) {
            const o = getGroupType(i.value);
            let l = !0;
            n === i.value && (l = !1), "soliqua" === a && "soliqua" === o && (l = !1), "bolus" === a && "bolus" !== o && (l = !1), "bolus" !== a && "bolus" === o && (l = !1), i.disabled = !l, i.style.display = l ? "block" : "none", l && (t = !0)
        }
        e.style.display = t ? "block" : "none", e.disabled = !t
    }
    let i = t.options[t.selectedIndex];
    if (!i || i.disabled || "none" === i.style.display)
        for (let e of t.options)
            if (!e.disabled && "none" !== e.style.display) {
                t.value = e.value;
                break
            } let l = t.value,
        s = getGroupType(l);
    const r = document.getElementById("guideline"),
        u = r.value;
    r.innerHTML = "", n.includes("soliqua") || l.includes("soliqua") ? r.innerHTML = '<option value="sanofi">پروتکل رسمی Sanofi / EMA / FDA (پیش‌فرض)</option><option value="ada">گایدلاین ADA</option>' : (r.innerHTML = '<option value="ada">گایدلاین ADA</option><option value="aace">گایدلاین AACE</option><option value="canadian">گایدلاین Diabetes Canada</option><option value="nice">گایدلاین NICE</option>', ["ada", "aace", "canadian", "nice"].includes(u) && (r.value = u));
    const d = ["toujeo", "tresiba", "soliqua_50", "soliqua_33", "soliqua_combined"],
        c = document.getElementById("freqFromBox"),
        m = document.getElementById("freqFrom");
    if (!d.includes(n) && "bolus" !== a) {
        if (c.style.display = "block", "premix" === a && "ryzodeg" !== n) {
            if (m.options.length < 3) {
                let e = document.createElement("option");
                e.value = "3", e.text = "۳ بار در روز (TID)", m.add(e)
            }
        } else m.options.length > 2 && ("3" === m.value && (m.value = "2"), m.remove(2))
    } else c.style.display = "none", m.value = "1";
    const v = document.getElementById("freqToBox"),
        g = document.getElementById("freqTo");
    if (!d.includes(l) && "bolus" !== s) {
        if (v.style.display = "block", "premix" === s && "ryzodeg" !== l) {
            if (g.options.length < 3) {
                let e = document.createElement("option");
                e.value = "3", e.text = "۳ بار در روز (TID)", g.add(e)
            }
        } else g.options.length > 2 && ("3" === g.value && (g.value = "2"), g.remove(2))
    } else v.style.display = "none", g.value = "1";
    const y = document.getElementById("strategyBox");
    l.includes("soliqua") || "bolus" === a ? y.style.display = "none" : (y.style.display = "block", updateStrategies())
}

function updateStrategies() {
    const e = document.getElementById("guideline").value,
        t = document.getElementById("strategy");
    if (!t) return;
    const n = "none" !== document.getElementById("freqFromBox").style.display && "2" === document.getElementById("freqFrom").value,
        a = "none" !== document.getElementById("freqFromBox").style.display && "3" === document.getElementById("freqFrom").value,
        o = "none" !== document.getElementById("freqToBox").style.display && "2" === document.getElementById("freqTo").value,
        i = "none" !== document.getElementById("freqToBox").style.display && "3" === document.getElementById("freqTo").value;
    let l = "";
    "ada" === e && (l = "ADA"), "aace" === e && (l = "AACE"), "canadian" === e && (l = "Diabetes Canada"), "nice" === e && (l = "NICE"), "sanofi" === e && (l = "Sanofi");
    a ? (t.options[0].text = `کاهش ۲۰ درصدی دوز (رویکرد الزامی گایدلاین‌ها در رژیم مبدأ TID)`, t.options[1].text = `رویکرد استاندارد گایدلاین ${l}`, t.options[2].text = `کاهش ۱۵ درصدی دوز (حداقل تعدیل محافظه‌کارانه)`, t.value = "0.8") : n ? (t.options[0].text = `کاهش ۲۰ درصدی دوز (رویکرد الزامی بر اساس رژیم BID مبدأ)`, t.options[1].text = `رویکرد استاندارد گایدلاین ${l}`, t.options[2].text = `کاهش ۱۵ درصدی دوز (حداقل تعدیل محافظه‌کارانه)`, t.value = "0.8") : i || o ? (t.options[0].text = `کاهش ۲۰ درصدی دوز (رویکرد فوق‌محافظه‌کارانه در رژیم مقصد چندتزریقی)`, t.options[1].text = `رویکرد استاندارد گایدلاین ${l}`, t.options[2].text = `کاهش ۱۵ درصدی دوز (تعدیل احتیاطی بالینی)`, t.value = "1.0") : (t.options[0].text = `کاهش ۲۰ درصدی دوز (رویکرد محافظه‌کارانه بر اساس گایدلاین ${l})`, t.options[1].text = `رویکرد استاندارد گایدلاین ${l}`, t.options[2].text = `کاهش ۱۵ درصدی دوز (تعدیل استاندارد بالینی بر اساس گایدلاین ${l})`, t.value = "1.0")
}

function convertInsulin() {
    const e = parseFloat(document.getElementById("currentDose").value),
        t = document.getElementById("insFrom").value,
        n = document.getElementById("insTo").value,
        a = document.getElementById("guideline").value,
        o = "none" !== document.getElementById("freqFromBox").style.display && "2" === document.getElementById("freqFrom").value,
        i = "none" !== document.getElementById("freqFromBox").style.display && "3" === document.getElementById("freqFrom").value,
        l = "none" !== document.getElementById("freqToBox").style.display && "2" === document.getElementById("freqTo").value,
        s = "none" !== document.getElementById("freqToBox").style.display && "3" === document.getElementById("freqTo").value;
    let r = parseFloat(document.getElementById("strategy").value);
    if (isNaN(e) || e <= 0) {
        alert("لطفاً دوز معتبری وارد کنید.");
        return
    }
    let u = 0,
        d = "",
        c = getGroupType(t),
        m = getGroupType(n),
        v = "",
        g = "#333",
        y = e,
        p = "";
    if ("premix" === c && ("basal" === m || "soliqua" === m)) {
        let e = .7,
            n = "نوومیکس/میکس انسانی/رایزودگ (نسبت ۷۰٪ بیزال)";
        "humalog_mix_25" === t ? (e = .75, n = "هومالوگ میکس ۲۵ (نسبت ۷۵٪ بیزال)") : "humalog_mix_50" === t && (e = .5, n = "هومالوگ میکس ۵۰ (نسبت ۵۰٪ بیزال)"), y = e * e, p = `با توجه به اینکه انسولین مبدأ از نوع مخلوط ${n} است، ابتدا سهم بخش پایه‌ای (بیزال) آن یعنی ${y.toFixed(1)} واحد استخراج گردید. `
    }
    if ("bolus" === c) u = Math.round(e), d = "تبدیل انسولین‌های سریع‌الاثر/بولوس: طبق راهنماهای بالینی، تعویض بین آنالوگ‌های سریع هم‌گروه (مانند نوورپید به آپیدرا) کاملاً به صورت مستقیم و واحدبه-واحد (1:1) انجام می‌شود.";
    else if ("soliqua_combined" === n) {
        let e = y,
            n = "";
        "toujeo" === t && (e = .8 * y, n = "با توجه به سوییچ از انسولین توژئو (Glargine U-300)، طبق دستورالعمل رسمی سازنده سولیکوآ، کاهش ساختاری ۲۰٪ جهت ایمنی بالینی و بروز غلظت تزریق اعمال شد. "), e >= 30 ? (u = 30, v = "Insulin FRC Soliqua 100/33", g = "#446600", d = p + n + "سوییچ به سولیکوآ: دوز انسولین پایه محاسباتی شما ۳۰ واحد یا بالاتر (در بازه ۳۰ تا ۶۰ واحد) است؛ بنابراین قلم Insulin FRC Soliqua 100/33 تعیین شد. جهت پیشگیری از عوارض گوارشی شدید (تهوع/استفراغ حاد) ناشی از جزء لایکسیزناتاید، دوز شروع درمان طبق گایدلاین باید دقیقاً روی دوز پایه‌ی ۳۰ واحد قفل (Cap) شده و سپس تیتراسیون انجام شود.") : e >= 20 && e < 30 ? (u = 20, v = "Insulin FRC Soliqua 100/50", g = "#d66800", d = p + n + "سوییچ به سولیکوآ: دوز انسولین پایه محاسباتی شما بین ۲۰ تا ۲۹ واحد است؛ بنابراین قلم Insulin FRC Soliqua 100/50 تعیین شد. طبق پروتکل رسمی سازنده، برای غلبه بر عوارض ناخواسته گوارشی داروی ترکیبی، دوز شروع درمان دقیقاً روی دوز ایمن ۲۰ واحد فیکس شده و افزایش دوز بر اساس تیتراسیون صورت می‌گیرد.") : (u = 10, v = "Insulin FRC Soliqua 100/50", g = "#d66800", d = p + n + "سوییچ به سولیکوآ: به دلیل دوز پایه پایین قبلی (کمتر از ۲۰ واحد)، قلم Insulin FRC Soliqua 100/50 انتخاب شده و دوز شروع ایمن از کف دوز رسمی قلم یعنی ۱۰ واحد تعیین گردید.")
    } else if ("basal" === c && "premix" === m) {
        let t = r,
            n = "";
        "humalog_mix_50" === n && (t = Math.min(t, .8), n = "⚠️ هشدار اختصاصی: انسولین مقصد (هومالوگ میکس ۵۰) حاوی ۵۰٪ انسولین سریع‌الاثر است. جهت پیشگیری از هیپوگلیسمی حاد بعد از غذا، کاهش دوز ۲۰٪ به صورت پیش‌فرض اعمال شد. "), u = Math.round(e * t), d = n + `سوییچ از انسولین پایه به انسولین میکس با ضریب ${t} انجام شد. دوز کل جدید روزانه ${u} واحد می‌باشد. `, l ? 益(u) : s ? function(e) {
            let t = Math.round(.4 * e),
                n = Math.round(.3 * e),
                a = e - (t + n);
            d += `\\n\\n[توزیع دوز مقصد TID]: رژیم تهاجمی چندتزریقی؛ دوز کل پیشنهادی بین سه وعده تقسیم شود (${t} واحد صبح / ${n} واحد ظهر / ${a} واحد شب). پایش مداوم قند خون (SMBG) الزامی است.`
        }(u) : d += "\n\n[توزیع دوز مقصد QD]: دوز کل جدید باید به صورت یک‌بار در روز، دقیقاً قبل از بزرگ‌ترین وعده غذایی بیمار تزریق شود."
    } else {
        let t = r,
            l = "";
        "ada" === a ? "toujeo" === t && "lantus" === n ? (t = .8, l = "ملاک اختصاصی ADA: در تبدیل توژئو به لانتوس، اعمال کاهش ۲۰٪ دوز جهت ایمنی الزامی است. ") : "nph_basal" === t && ["lantus", "toujeo", "tresiba"].includes(n) ? (t = .8, l = "ملاک اختصاصی ADA: تغییر از NPH به آنالوگ‌های پیشرفته طولانی‌اثر، نیازمند کاهش دوز ۲۰٪ است. ") : "premix" === c || "premix" === m ? (t = .8, l = "توصیه عمومی ADA: در تعویض رژیم‌های حاوی مخلوط (Premix)، فرمول با اعمال ۲۰٪ کاهش احتیاطی محاسبه می‌شود. ") : l = `پروتکل دوز بر مبنای معیار انتخابی ADA با ضریب ${t} تنظیم شد. ` : "aace" === a ? c !== m || t !== n ? (t = Math.min(t, .8), l = "الگوریتم محافظه‌کارانه AACE: در سوییچ‌های بین‌کلاسی یا تغییر برند انسولین، کاهش ۲۰ درصدی دوز قفل می‌شود. ") : (t = Math.min(t, .85), l = `رویکرد کنترلی AACE: اعمال کاهش دوز احتیاطی با ضریب ${t} لحاظ گردید. `) : "canadian" === a ? "basal" === c && "basal" === m && "toujeo" !== t ? l = "دستورالعمل Diabetes Canada: این گایدلاین تعویض آنالوگ‌های پایه هم‌سطح را به صورت مستقیم (1:1) مجاز می‌داند. " : "nph_basal" === t ? (t = .8, l = "معیار Diabetes Canada: انتقال دوز از NPH به آنالوگ‌های مدرن شامل کاهش ساختاری ۲۰ درصدی دوز کل است. ") : l = `محاسبه بر اساس استراتژی منتخب در گایدلاین Diabetes Canada با ضریب ${t} انجام شد. ` : "nice" === a && ("premix" === c || "nph_basal" === t ? (t = .8, l = "راهنمای کلینیکال NICE: انتقال از ساختارهای سنتی یا مخلوط به آنالوگ‌های خالص، شامل کاهش ۲۰ درصدی دوز پایه کل است. ") : l = `محاسبه بر اساس استراتژی منتخب در گایدلاین NICE با ضریب ${t} انجام شد. `), i ? (t = Math.min(t, .8), d = p + "تعدیل رژیم پیچیده (TID Premix به Basal QD): با توجه به فرکانس ۳ بار در روز انسولین میکس، سهم پایه استخراج و به دلیل حذف کامل دوزهای سریع‌الاثر، کاهش دوز ۲۰ درصدی جهت پیشگیری از تجمع دوز اعمال شد. " + l) : o ? (t = Math.min(t, .8), d = p + "تعدیل فرکانس (BID به QD): به دلیل فرکانس ۲ بار در روز انسولین مبدأ, جهت جلوگیری از تجمع دوز در یک نوبت، کاهش دوز ۲۰ درصدی بر محاسبات اعمال شد. " + l) : l ? 1.0 === initialMultiplier && 1.0 === t ? d = p + "دستورالعمل بالینی QD به BID: در این نوع سوییچ، تبدیل ۱:۱ توصیه اصلی است؛ زیرا شکستن دوز به دو نوبت، خودبه‌خود ریسک پیک غلظتی را کنترل می‌کند. " + l : d = p + `محاسبه دوز با ضریب تعدیل بالینی نهایی ${t} جهت انتقال ایمن به رژیم مقصد BID انجام شد. ` + l : d = p + l, u = Math.round(y * t), l && !o && (d += `\\n\\n[توزیع دوز مقصد BID]: پیشنهاد می‌شود دوز کل به صورت ۵۰:۵۰ تقسیم گردد (${Math.round(.5*u)} واحد صبح / ${u-Math.round(.5*u)} واحد شب) یا طبق متد بالینی ۲/۳ صبح و ۱/۳ شب تجویز شود.`)
    }
    "soliqua_combined" === n ? document.getElementById("resultText").innerHTML = `<div style="font-size: 16px; color: ${g}; font-weight: bold; margin-bottom: 4px;">${v}</div><div style="font-size: 24px; font-weight: bold; color: #004085;">${u} واحد</div>` : document.getElementById("resultText").innerHTML = `<div style="font-size: 24px; font-weight: bold; color: #004085;">${u} واحد</div>`, document.getElementById("descText").innerText = d, document.getElementById("resultBox").style.display = "block", document.getElementById("alertBox").style.display = "block"
}

function 益(e) {
    let t = Math.round(.66 * e),
        n = e - t;
    d += `\\n\\n[توزیع دوز مقصد BID]: پیشنهاد می‌شود دوز کل به صورت ۲/۳ قبل از صبحانه (${t} واحد) و ۱/۳ قبل از شام (${n} واحد) تزریق گردد.`
}
window.onload = function() {
    updateRegimen()
};
// Node/CommonJS export guard (no-op in the browser where `module` is undefined).
if (typeof module !== "undefined" && module.exports) {
    module.exports = { getGroupType, updateRegimen, updateStrategies, convertInsulin };
}
