import { useEffect, useMemo, useState } from "react";
import { calculateConversion, getCompatibleTargets, getInsulin, getSourceInsulins } from "./clinical/engine.js";
import { copy, type Language } from "./i18n/translations";

type View = "home" | "converter";
type EngineResult = ReturnType<typeof calculateConversion>;
type Insulin = ReturnType<typeof getInsulin>;

const label = (item: Insulin, autoLabel: string) => item?.id === "suliqua-auto" ? autoLabel : `${item?.generic} — ${item?.brand}`;

export default function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("diabeto-language") as Language) || "fa");
  const [view, setView] = useState<View>(() => location.hash === "#converter" ? "converter" : "home");
  const [sourceId, setSourceId] = useState("glargine-u100");
  const [targetId, setTargetId] = useState("glargine-u300");
  const [dose, setDose] = useState("24");
  const [sourceFrequency, setSourceFrequency] = useState(1);
  const [targetFrequency, setTargetFrequency] = useState(1);
  const [factor, setFactor] = useState(1);
  const [result, setResult] = useState<EngineResult | null>(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[language];
  const source = getInsulin(sourceId)!;
  const targets = useMemo(() => getCompatibleTargets(sourceId), [sourceId]);
  const target = getInsulin(targetId) || targets[0];
  const isSuliqua = target?.id === "suliqua-auto";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    localStorage.setItem("diabeto-language", language);
  }, [language]);

  useEffect(() => {
    if (!targets.some((item: Insulin) => item?.id === targetId)) setTargetId(targets[0]?.id || "");
  }, [sourceId, targetId, targets]);

  useEffect(() => {
    setSourceFrequency(source.frequencies.includes(sourceFrequency) ? sourceFrequency : source.frequencies[0]);
  }, [source, sourceFrequency]);

  useEffect(() => {
    if (target) setTargetFrequency(target.frequencies.includes(targetFrequency) ? targetFrequency : target.frequencies[0]);
  }, [target, targetFrequency]);

  const open = (next: View) => {
    setView(next); setMenuOpen(false); history.replaceState(null, "", `#${next}`); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    try {
      setResult(calculateConversion({ sourceId, targetId: target.id, dailyDose: dose, factor, sourceFrequency, targetFrequency }));
    } catch (caught) {
      const code = caught instanceof Error ? caught.message : "INVALID_DOSE";
      setResult(null);
      setError(code === "SULIQUA_ABOVE_MAXIMUM" ? t.maximum : code === "INVALID_DOSE" ? t.invalidDose : t.incompatible);
    }
  };

  const reset = () => { setDose("24"); setResult(null); setError(""); };
  const frequencyText = (value: number) => value === 1 ? t.once : value === 2 ? t.twice : t.thrice;
  const autoLabel = language === "fa" ? "Suliqua FRC — انتخاب خودکار قلم" : "Suliqua FRC — automatic pen selection";

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <button className="brand" onClick={() => open("home")}><span className="brand-mark">D</span><span><strong>Diabeto</strong><small>{t.platform}</small></span></button>
      <nav className="main-nav">
        <button className={`nav-item ${view === "home" ? "active" : ""}`} onClick={() => open("home")}><span>⌂</span>{t.dashboard}</button>
        <button className={`nav-item ${view === "converter" ? "active" : ""}`} onClick={() => open("converter")}><span>⇄</span>{t.converter}</button>
        <button className="nav-item disabled" disabled><span>♙</span>{t.patients}<small>{t.soon}</small></button>
        <button className="nav-item disabled" disabled><span>◇</span>{t.medications}<small>{t.soon}</small></button>
      </nav>
      <div className="sidebar-note"><span className="status-dot"/><div><strong>{t.prototype}</strong><small>{t.notPrescription}</small></div></div>
    </aside>
    {menuOpen && <button className="sidebar-overlay visible" aria-label="Close menu" onClick={() => setMenuOpen(false)}/>}

    <div className="content-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <div className="topbar-title"><strong>{t.workspace}</strong><span>{t.workspaceHint}</span></div>
        <div className="topbar-actions"><button className="language-toggle" onClick={() => setLanguage(language === "fa" ? "en" : "fa")}><b>{language === "fa" ? "فا" : "EN"}</b><span/>{language === "fa" ? "EN" : "فا"}</button><div className="avatar">د</div></div>
      </header>

      <main>
        {view === "home" ? <section className="view active">
          <div className="hero"><div><span className="eyebrow">Clinical workspace</span><h1>{t.welcome}</h1><p>{t.welcomeBody}</p></div><button className="primary-button" onClick={() => open("converter")}>⇄ {t.start}</button></div>
          <div className="safety-banner"><span className="safety-icon">i</span><div><strong>{t.physicianDecision}</strong><p>{t.safety}</p></div></div>
          <div className="section-heading"><div><h2>{t.tools}</h2><p>{t.toolsHint}</p></div></div>
          <div className="tool-grid">
            <article className="tool-card featured"><div className="tool-icon teal">⇄</div><span className="card-status available">{t.active}</span><h3>{t.converter}</h3><p>{t.converterBody}</p><button className="text-button" onClick={() => open("converter")}>{t.open}<span>←</span></button></article>
            <article className="tool-card muted-card"><div className="tool-icon blue">G</div><span className="card-status">{t.soon}</span><h3>GLP-1 / GIP</h3><p>{t.glpBody}</p></article>
            <article className="tool-card muted-card"><div className="tool-icon amber">⌁</div><span className="card-status">{t.soon}</span><h3>{t.pathway}</h3><p>{t.pathwayBody}</p></article>
          </div>
          <div className="version-strip"><div><span className="version-icon">✓</span><div><strong>{t.contentStatus}</strong><p>{t.contentStatusBody}</p></div></div><span className="version-badge">Clinical content v0.2</span></div>
        </section> : <section className="view active">
          <button className="back-button" onClick={() => open("home")}>→ {t.back}</button>
          <div className="page-heading"><div><span className="eyebrow">Calculator</span><h1>{t.calculator}</h1><p>{t.calculatorBody}</p></div><span className="version-badge">Engine v0.2</span></div>
          <div className="calculator-layout">
            <form className="calculator-card" onSubmit={submit}>
              <SectionTitle number="1" title={t.currentRegimen}/>
              <div className="field-grid">
                <Field label={t.currentInsulin}><select value={sourceId} onChange={e => { setSourceId(e.target.value); setResult(null); }}>{getSourceInsulins().map((item: Insulin) => <option key={item!.id} value={item!.id}>{label(item, autoLabel)}</option>)}</select><small>{source.group === "rapid" ? "Rapid/Regular → Rapid/Regular" : source.group === "basal" ? "Basal → Basal/Premix/FRC" : source.group === "premix" ? "Premix → Premix/Basal" : "FRC → Basal"}</small></Field>
                <Field label={t.dailyDose}><span className="input-with-unit"><input type="number" min="1" max="300" value={dose} onChange={e => setDose(e.target.value)}/><b>{t.units}</b></span></Field>
                <Field label={t.sourceFrequency}><select value={sourceFrequency} onChange={e => setSourceFrequency(Number(e.target.value))}>{source.frequencies.map((value: number) => <option key={value} value={value}>{frequencyText(value)}</option>)}</select></Field>
              </div>
              <div className="form-divider"/><SectionTitle number="2" title={t.replacement} hint={t.compatibleOnly}/>
              <div className="field-grid">
                <Field label={t.targetInsulin}><select value={target?.id} onChange={e => { setTargetId(e.target.value); setResult(null); }}>{targets.map((item: Insulin) => <option key={item!.id} value={item!.id}>{label(item, autoLabel)}</option>)}</select></Field>
                {!isSuliqua && <Field label={t.targetFrequency}><select value={targetFrequency} onChange={e => setTargetFrequency(Number(e.target.value))}>{target?.frequencies.map((value: number) => <option key={value} value={value}>{frequencyText(value)}</option>)}</select></Field>}
                {!isSuliqua && <Field label={t.approach}><select value={factor} onChange={e => setFactor(Number(e.target.value))}><option value="1">{t.oneToOne}</option><option value="0.8">{t.reduce}</option></select><small>{t.manualWarning}</small></Field>}
              </div>
              {error && <div className="form-error visible" role="alert">{error}</div>}
              <button className="primary-button calculate-button" type="submit">{t.calculate} ←</button>
            </form>
            <ResultPanel result={result} t={t} frequencyText={frequencyText} reset={reset}/>
          </div>
        </section>}
      </main>
    </div>
  </div>;
}

function SectionTitle({ number, title, hint }: { number: string; title: string; hint?: string }) {
  return <div className="form-section-title"><span>{number}</span><div><strong>{title}</strong>{hint && <small>{hint}</small>}</div></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="field"><span>{label}</span>{children}</label>; }

function ResultPanel({ result, t, frequencyText, reset }: { result: EngineResult | null; t: typeof copy[Language]; frequencyText: (value: number) => string; reset: () => void }) {
  if (!result) return <aside className="result-panel"><div className="empty-result"><div className="result-placeholder">⌁</div><h2>{t.waiting}</h2><p>{t.waitingBody}</p></div></aside>;
  const suliqua = result.kind === "suliqua";
  return <aside className="result-panel" aria-live="polite"><div className="result-content">
    <span className="result-label">{t.estimate}</span><div className="dose-result"><strong>{result.estimatedDose}</strong><span>{t.perDay}</span></div><div className="calculation-line">{result.formula}</div>
    <dl className="result-details"><div><dt>{t.from}</dt><dd>{label(result.source, "Suliqua")}</dd></div><div><dt>{t.to}</dt><dd>{label(result.target, "Suliqua")}</dd></div><div><dt>{t.factor}</dt><dd>{suliqua ? "EMA 4.2" : `× ${result.factor}`}</dd></div></dl>
    {suliqua && result.selection && <div className="suliqua-pen"><span className={`pen-swatch ${result.selection.pen}`}/><div><strong>{result.selection.pen === "peach" ? t.peach : t.olive}</strong><p>{result.selection.estimatedDose} dose steps = {result.selection.insulinUnits} U insulin glargine + {result.selection.lixisenatideMicrograms} mcg lixisenatide</p></div></div>}
    {!suliqua && result.timingChanged && <div className="timing-warning"><strong>{t.timingTitle}</strong><p>{t.timingBody}</p></div>}
    <p className="frequency-result">{frequencyText(result.targetFrequency)}{result.targetFrequency > 1 ? ` — ${t.frequencyNote}` : ""}</p>
    <div className="clinical-warning"><strong>{t.beforeUse}</strong><p>{t.beforeUseBody}</p></div>
    <a className="source-link" href={result.sourceReference.url} target="_blank" rel="noreferrer">{t.source} ↗</a>
    <button className="secondary-button" onClick={reset}>{t.newCalculation}</button>
  </div></aside>;
}
