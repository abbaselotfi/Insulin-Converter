# Clinical source register

This register defines what is—and is not—clinically approved in the current prototype. A product being
present in the catalog does not mean that every possible switch has an approved conversion rule.

## Reviewed source

### Suliqua (insulin glargine/lixisenatide)

- **Authority:** European Medicines Agency (EMA)
- **Document:** [Suliqua EPAR product information](https://www.ema.europa.eu/en/documents/product-information/suliqua-epar-product-information_en.pdf)
- **Reviewed:** 2026-07-27
- **Implemented section:** section 4.2 starting-dose table and dosing ranges.
- **Implemented behavior:**
  - 100 units/mL + 50 micrograms/mL (10–40 dose-step) peach pen.
  - 100 units/mL + 33 micrograms/mL (30–60 dose-step) olive pen.
  - Previous basal dose below 20 units: 10 dose steps with the 10–40 pen.
  - Previous insulin glargine U-100 dose from 20 to below 30 units: 20 dose steps with the 10–40 pen.
  - Previous insulin glargine U-100 dose from 30 to 60 units: 30 dose steps with the 30–60 pen.
  - A 20% reference-dose reduction before selecting the starting dose for twice-daily basal insulin or
    insulin glargine U-300.
  - Suliqua is once daily, within one hour before a meal; close glucose monitoring is required during
    transfer and subsequent weeks.
  - The 10–40 pen cannot deliver outside 10–40 dose steps, the 30–60 pen cannot deliver outside 30–60
    dose steps, and Suliqua must not be used above 60 dose steps/day.

The UI intentionally exposes a single Suliqua destination. The engine selects and displays the required
pen, colour, strength, insulin units, and lixisenatide dose after calculation to reduce wrong-pen selection.

## Catalogued products pending rule-by-rule clinical approval

The prototype catalog includes basal insulin, rapid-acting analogues, human regular insulin, and premixed
products. For these products, the current `1:1` and `20% reduction` choices are explicitly labelled as a
**manual calculation policy**, not as an automatically selected guideline recommendation.

Before release for clinical use, every source/target/frequency pair must receive:

1. a stable rule identifier and version;
2. an official product label and/or guideline citation with section/page;
3. indication, population, and market applicability;
4. contraindications and renal/hepatic/pregnancy constraints;
5. clinical review and approval metadata;
6. regression tests for boundaries and unsafe combinations.

## Safety boundaries already enforced

- Rapid-acting and human regular insulin destinations are only shown for a rapid/regular source.
- A rapid/regular source cannot be converted to basal, premixed, or FRC products.
- Suliqua is only offered as a destination from a basal insulin source.
- Source-specific injection frequencies are validated by the calculation engine.
- Switching between human regular and a rapid analogue displays a timing-change warning.
- The application remains a prototype and must not be used for autonomous prescribing.
