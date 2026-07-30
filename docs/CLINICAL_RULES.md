# Clinical conversion rules (v0.2)

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

When converting a premix to basal or prandial insulin, only the matching component of the
source total daily dose is used as the calculation basis. For a premix destination, the result
shows its basal/prandial composition and an equal arithmetic split across the selected number
of injections. The split is explicitly labeled as an initial display that must be individualized
to meals and SMBG/CGM; it is not a universal meal-allocation protocol.

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

Patients switching from a GLP-1 receptor agonist start at 10 dose steps using the 100/50 pen,
after discontinuing the previous GLP-1 therapy. Automatic premix-to-Soliqua conversion is not
offered because it is not specified in the product initiation table.

## GLP-1–based therapy

ADA 2026 does not provide a dose-equivalence table for switching between GLP-1 products.
The calculator therefore displays timing guidance and the labeled starting dose of the
destination rather than inventing an equivalent dose.

For a weekly-to-weekly switch, the new drug starts at the next weekly dose. Daily-to-weekly
starts the day after the last daily dose; weekly-to-daily starts when the next weekly dose would
have been due. If switching because of gastrointestinal intolerance, symptoms should resolve
and the destination should be restarted at its lowest labeled dose.

For GLP-1 to basal insulin, there is no unit-for-unit conversion. The calculator shows the
ADA 2026 basal initiation options of 10 units/day or 0.1–0.2 units/kg/day. It also notes that,
without severe hyperglycemia, ADA 2026 prefers GLP-1–based therapy to insulin and generally
considers combining GLP-1 therapy with insulin rather than automatically stopping it.

## Primary references

- [ADA Standards of Care in Diabetes—2026, section 9](https://pmc.ncbi.nlm.nih.gov/articles/PMC12690185/)
- [Suliqua EU Product Information](https://www.ema.europa.eu/en/documents/product-information/suliqua-epar-product-information_en.pdf)
- [Lantus Prescribing Information](https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/021081s076lbl.pdf)
- [Toujeo Prescribing Information](https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/206538Orig1s017Lbl.pdf)
- [Switching Between GLP-1 Receptor Agonists: Rationale and Practical Guidance](https://pmc.ncbi.nlm.nih.gov/articles/PMC7566932/)
