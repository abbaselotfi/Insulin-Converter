# Insulin Converter / Clinical Diabetes Platform

This repository currently contains a Persian web/PWA insulin conversion calculator. The product direction is to grow it into a bilingual clinical decision-support platform for physicians managing diabetes, hypertension, and related cardio-kidney-metabolic conditions.

## Current scope

- Responsive clinical workspace with basal, rapid/regular, premixed, and FRC insulin conversion flows.
- Persian and English clinical UI with RTL/LTR switching.
- A small, framework-independent clinical calculation engine with automated tests.
- PWA manifest and service-worker support.
- Soliqua information page.
- Versioned clinical source register with rule-level approval boundaries.

## Run locally

The current milestone has no third-party runtime dependencies. Serve the repository
over HTTP so that the service worker and PWA features can run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Run the clinical-engine checks with:

```bash
node tests/clinical-engine.test.js
```

## Product direction

The platform should remain simple for physicians, but the clinical logic must be maintainable because guidelines, available medications, brand names, and local market priorities change over time.

Key long-term modules:

- Type 2 diabetes management based on current ADA/EASD-style algorithms.
- Type 1 diabetes support.
- Gestational diabetes and pre-existing diabetes in pregnancy.
- Insulin conversion and titration support.
- GLP-1 receptor agonist and dual GIP/GLP-1 support.
- Hypertension and cardiovascular risk management.
- Kidney, liver, and heart condition-aware prescribing suggestions.
- Persian and English localization.
- Administrative panel for non-developers to manage display behavior and local market medication visibility.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): proposed modular architecture.
- [`docs/GUIDELINE_UPDATE_STRATEGY.md`](docs/GUIDELINE_UPDATE_STRATEGY.md): yearly guideline and medication update workflow.
- [`docs/ADMIN_PANEL.md`](docs/ADMIN_PANEL.md): non-developer admin panel requirements for display priorities.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md): initial data model for guidelines, medications, brands, and display settings.
- [`docs/CLINICAL_SOURCES.md`](docs/CLINICAL_SOURCES.md): implemented evidence, review date, and safety boundaries.

## Clinical safety principle

The application should provide clinical decision support, not autonomous prescribing. Recommendations must show rationale, relevant guideline version, safety warnings, and the need for physician judgment.
