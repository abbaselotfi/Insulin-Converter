const translations = {
  fa:{skip:"پرش به محتوای اصلی",clinicalPlatform:"پلتفرم بالینی",dashboard:"داشبورد",insulinConverter:"تبدیل انسولین",patients:"بیماران",medications:"داروها",soon:"به‌زودی",prototype:"نسخه آزمایشی",notForPrescription:"برای تجویز مستقل نیست",workspace:"فضای کار بالینی",todayFocus:"ابزارهای تصمیم‌یار برای ویزیت امروز",clinicalWorkspace:"Clinical workspace",welcome:"سلام دکتر، آماده‌اید؟",welcomeText:"ابزارهای مورد نیاز برای تصمیم‌گیری سریع‌تر و مستندتر را از اینجا در دسترس دارید.",startConversion:"شروع تبدیل انسولین",safetyTitle:"تصمیم نهایی با پزشک است",safetyText:"خروجی‌های این نسخه، برآورد محاسباتی هستند و باید با وضعیت بیمار، قند خون و منابع تأییدشده تطبیق داده شوند.",clinicalTools:"ابزارهای بالینی",clinicalToolsText:"ماژول‌های نسخه نخست پلتفرم",available:"فعال",converterDescription:"برآورد شفاف دوز هنگام تغییر بین انسولین‌ها و FRC، همراه با نمایش ضریب و هشدار ایمنی.",openTool:"باز کردن ابزار",glpDescription:"مقایسه داروها، دوزها و ملاحظات ایمنی در یک نمای واحد.",treatmentPath:"مسیر درمان",pathDescription:"مسیر تصمیم‌گیری نسخه‌پذیر بر اساس بیماری‌های همراه و اهداف فردی.",contentStatus:"وضعیت محتوای بالینی",contentStatusText:"قواعد نسخه آزمایشی؛ در انتظار بازبینی و تأیید کمیته علمی",calculator:"Calculator",backDashboard:"بازگشت به داشبورد",converterIntro:"یک برآورد اولیه و قابل پیگیری برای تغییر درمان ایجاد کنید.",currentRegimen:"رژیم فعلی",requiredFields:"تمام فیلدها الزامی هستند",currentInsulin:"درمان فعلی",dailyDose:"دوز کل روزانه",units:"واحد",doseHelp:"مجموع واحد تزریق‌شده طی ۲۴ ساعت",injectionsPerDay:"تعداد تزریق در روز",frequencyHelp:"دوز ورودی باید مجموع تمام تزریق‌های ۲۴ ساعت باشد.",newRegimen:"رژیم جایگزین",selectTarget:"درمان مقصد و رویکرد محاسبه را انتخاب کنید",targetInsulin:"درمان مقصد",safetyApproach:"رویکرد محاسبه",oneToOne:"معادل ۱:۱",reduceTwenty:"کاهش احتیاطی ۲۰٪",strategyHelp:"انتخاب ضریب باید بر مبنای منبع معتبر و شرایط بیمار باشد.",calculate:"محاسبه برآورد",resultWaiting:"نتیجه اینجا نمایش داده می‌شود",resultWaitingText:"اطلاعات رژیم فعلی و مقصد را تکمیل کنید.",estimatedDose:"برآورد دوز شروع",unitsPerDay:"واحد در روز",from:"مبدأ",to:"مقصد",factor:"ضریب",beforeUse:"پیش از استفاده بالینی",beforeUseText:"قند خون، سابقه هیپوگلیسمی، عملکرد کلیه و کبد، زمان‌بندی تزریق و اطلاعات رسمی فرآورده را بررسی کنید.",newCalculation:"محاسبه جدید",invalidDose:"ورودی‌ها معتبر نیستند یا این تبدیل به اطلاعات بیشتری نیاز دارد.",sameInsulin:"درمان مبدأ و مقصد باید متفاوت باشند."},
  en:{skip:"Skip to main content",clinicalPlatform:"Clinical platform",dashboard:"Dashboard",insulinConverter:"Insulin converter",patients:"Patients",medications:"Medications",soon:"Coming soon",prototype:"Prototype",notForPrescription:"Not for autonomous prescribing",workspace:"Clinical workspace",todayFocus:"Decision-support tools for today's visit",clinicalWorkspace:"Clinical workspace",welcome:"Welcome, Doctor",welcomeText:"Access focused tools for faster, more traceable clinical decisions.",startConversion:"Start insulin conversion",safetyTitle:"The clinician makes the final decision",safetyText:"Outputs in this release are calculation estimates and must be reconciled with patient status, glucose data, and approved sources.",clinicalTools:"Clinical tools",clinicalToolsText:"Modules in the first platform release",available:"Available",converterDescription:"A transparent basal-insulin switching estimate with the factor and safety cautions shown.",openTool:"Open tool",glpDescription:"Compare medications, doses, and safety considerations in one view.",treatmentPath:"Treatment pathway",pathDescription:"Versioned decision pathways informed by comorbidities and individual goals.",contentStatus:"Clinical content status",contentStatusText:"Prototype rules; pending scientific committee review and approval",calculator:"Calculator",backDashboard:"Back to dashboard",converterIntro:"Create an initial, traceable estimate for a basal-insulin switch.",currentRegimen:"Current regimen",requiredFields:"All fields are required",currentInsulin:"Current insulin",dailyDose:"Total daily dose",units:"units",doseHelp:"Total units administered over 24 hours",newRegimen:"Replacement regimen",selectTarget:"Select the target insulin and calculation approach",targetInsulin:"Target insulin",safetyApproach:"Calculation approach",oneToOne:"1:1 equivalent",reduceTwenty:"20% precautionary reduction",strategyHelp:"The factor must be selected using an approved source and patient context.",calculate:"Calculate estimate",resultWaiting:"Your result will appear here",resultWaitingText:"Complete the current and target regimen details.",estimatedDose:"Estimated starting dose",unitsPerDay:"units per day",from:"From",to:"To",factor:"Factor",beforeUse:"Before clinical use",beforeUseText:"Review glucose data, hypoglycemia history, kidney and liver function, injection timing, and approved product information.",newCalculation:"New calculation",invalidDose:"Dose must be a number between 1 and 300 units.",sameInsulin:"Current and target insulin must be different."}
};

let language = localStorage.getItem("diabeto-language") || "fa";
const $ = (selector) => document.querySelector(selector);

function insulinLabel(insulin) { return `${insulin.generic} — ${insulin.brand}`; }
const categoryLabels = { basal:"انسولین‌های بیزال", premix:"انسولین‌های میکس", prandial:"انسولین‌های پرندیال", frc:"FRC", glp1:"GLP-1 RA" };
function therapyOptions(items) {
  return Object.entries(categoryLabels).map(([category,label]) => {
    const options=items.filter(item=>item.category===category).map(item=>`<option value="${item.id}">${insulinLabel(item)}</option>`).join("");
    return options ? `<optgroup label="${label}">${options}</optgroup>` : "";
  }).join("");
}
function populateInsulins() {
  $("#sourceInsulin").innerHTML=therapyOptions(ClinicalEngine.THERAPIES.filter(item=>!item.targetOnly));
  $("#targetInsulin").innerHTML=therapyOptions(ClinicalEngine.THERAPIES);
  $("#targetInsulin").value="degludec-u100";
  updateFrequencyField();
}
function updateFrequencyField(){
  const therapy=ClinicalEngine.getTherapy($("#sourceInsulin").value); const frequencies=therapy?.frequencies||[1];
  $("#frequencyField").hidden=frequencies.length===1;
  $("#sourceFrequency").innerHTML=frequencies.map(value=>`<option value="${value}">${value} بار در روز</option>`).join("");
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
}
function openSection(sectionId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === sectionId));
  document.querySelectorAll(".nav-item[data-section]").forEach((item) => item.classList.toggle("active", item.dataset.section === sectionId));
  history.replaceState(null,"",`#${sectionId}`);
  window.scrollTo({top:0,behavior:"smooth"});
  closeMenu();
}
function closeMenu(){ $(".sidebar").classList.remove("open"); $("#sidebarOverlay").classList.remove("visible"); $("#menuButton").setAttribute("aria-expanded","false"); }
function showError(key){ const box=$("#formError"); box.textContent=translations[language][key]; box.classList.add("visible"); }
function resetResult(){ $("#conversionForm").reset(); populateInsulins(); $("#resultContent").hidden=true; $("#emptyResult").hidden=false; $("#formError").classList.remove("visible"); }

document.querySelectorAll("[data-open-section]").forEach((button) => button.addEventListener("click",()=>openSection(button.dataset.openSection)));
document.querySelectorAll(".nav-item[data-section]").forEach((item) => item.addEventListener("click",(event)=>{event.preventDefault();openSection(item.dataset.section);}));
$("#languageToggle").addEventListener("click",()=>applyLanguage(language==="fa"?"en":"fa"));
$("#menuButton").addEventListener("click",()=>{const open=$(".sidebar").classList.toggle("open");$("#sidebarOverlay").classList.toggle("visible",open);$("#menuButton").setAttribute("aria-expanded",String(open));});
$("#sidebarOverlay").addEventListener("click",closeMenu);
$("#resetButton").addEventListener("click",resetResult);
$("#sourceInsulin").addEventListener("change",updateFrequencyField);
$("#conversionForm").addEventListener("submit",(event)=>{
  event.preventDefault(); $("#formError").classList.remove("visible");
  try {
    const result=ClinicalEngine.calculateConversion({sourceId:$("#sourceInsulin").value,targetId:$("#targetInsulin").value,dailyDose:$("#currentDose").value,factor:$("#strategy").value,sourceFrequency:$("#sourceFrequency").value||1});
    $("#resultDose").textContent=result.guidanceOnly?"—":result.estimatedDose; $("#calculationText").textContent=result.guidanceOnly?result.guidance:result.formula;
    $("#resultSource").textContent=insulinLabel(result.source); $("#resultTarget").textContent=insulinLabel(result.target); $("#resultFactor").textContent=result.guidanceOnly?"—":`× ${result.factor}`;
    $("#resultNote").textContent=result.note||""; $("#penResult").hidden=!result.soliqua;
    $("#penResult").className=`pen-result ${result.soliqua?.colorClass||""}`; $("#penResult").textContent=result.soliqua?`FRC Soliqua قلم ${result.soliqua.pen}`:"";
    $("#emptyResult").hidden=true; $("#resultContent").hidden=false;
  } catch(error) { showError(error.message==="SAME_INSULIN"?"sameInsulin":"invalidDose"); }
});

populateInsulins(); applyLanguage(language); openSection(location.hash==="#converter"?"converter":"home");
