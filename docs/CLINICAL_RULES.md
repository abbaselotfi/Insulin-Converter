# Clinical conversion rules (v0.3)

This file records the rule provenance used by `clinical-engine.js`. The calculator is
clinical decision support, not an autonomous prescription generator.

## Evidence hierarchy

1. Product-specific switching instructions take precedence over generic calculator factors.
2. ADA Standards of Care in Diabetes—2026 informs treatment selection and insulin initiation.
3. Where ADA 2026 does not provide a numerical switch, the engine either uses an approved
   product label, identifies a peer-reviewed practical approach, or declines to calculate.

## Basal insulin rules

- Toujeo U-300 to Lantus U-100: start Lantus at 80% of the discontinued Toujeo dose.
- Once-daily Lantus or another once-daily basal to Toujeo: start unit-for-unit; the Toujeo
  label notes that a higher titrated dose may later be required.
- Twice-daily NPH or detemir to Toujeo: start at 80% of the total daily source dose.
- Once-daily NPH to Lantus: start unit-for-unit.
- Twice-daily NPH to Lantus: start at 80% of total daily NPH.
- For a reported three-times-daily basal regimen, the calculator applies the requested
  conservative 20% reduction but explicitly marks the path for specialist review. This is not
  presented as an ADA-endorsed administration frequency.

## Premixed insulin

The engine stores the actual basal/prandial fraction of each product:

| Product | Basal fraction | Prandial fraction |
|---|---:|---:|
| NovoMix 30 | 70% | 30% |
| Humalog Mix 25 | 75% | 25% |
| Humalog Mix 50 | 50% | 50% |
| Human 70/30 | 70% | 30% |
| Ryzodeg 70/30 | 70% | 30% |

When converting a premix to basal insulin, only the basal component of the source total daily
dose is used as the calculation basis. For a premix destination, the result shows its
basal/prandial composition and an equal arithmetic split across the selected number of
injections. The split is explicitly labeled as an initial display that must be individualized to
meals and SMBG/CGM; it is not a universal meal-allocation protocol.

## Prandial insulin

Prandial insulin is only offered when both source and destination are prandial products. The
UI does not offer basal or premix targets for a prandial source, or prandial targets for a basal
or premix source.

- Rapid-acting analog to rapid-acting analog: start unit-for-unit.
- Rapid-acting analog to Regular, or Regular to a rapid-acting analog: use 80% of the previous
  total daily prandial dose as a conservative therapeutic-interchange starting dose.
- Regular is generally administered about 30 minutes before a meal; rapid-acting analogs are
  administered close to the start of the meal.

Final meal doses still require individualization to carbohydrate intake and premeal glucose.

## FRC Soliqua / Suliqua

The target dropdown contains one `FRC Soliqua` option. The result identifies the required pen:

| Adjusted previous basal dose | Starting pen | Starting dose |
|---|---|---:|
| <20 units | 100/50, peach, 10–40 pen | 10 dose steps |
| 20 to <30 units | 100/50, peach, 10–40 pen | 20 dose steps |
| 30 to 60 units | 100/33, olive, 30–60 pen | 30 dose steps |

For twice-daily basal insulin or insulin glargine U-300, the previous total daily dose is reduced
by 20% before the table is applied. The 100/50 pen is never started above 20 dose steps and the
100/33 pen is never started above 30 dose steps. These caps limit the initial lixisenatide dose
to 10 micrograms or less.

Automatic premix-to-Soliqua conversion is not offered because it is not specified in the
product initiation table.

## Primary references

- [ADA Standards of Care in Diabetes—2026, section 9](https://pmc.ncbi.nlm.nih.gov/articles/PMC12690185/)
- [Suliqua EU Product Information](https://www.ema.europa.eu/en/documents/product-information/suliqua-epar-product-information_en.pdf)
- [Lantus Prescribing Information](https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/021081s076lbl.pdf)
- [Toujeo Prescribing Information](https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/206538Orig1s017Lbl.pdf)
- [2025 Guide to Therapeutic Interchange of Insulin Products](https://www.cardi-oh.org/files/resources/cardi-oh-guide-to-therapeutic-interchange-of-insulin-products-for-safe-and-effective-transitions-in-diabetes-management.pdf)
