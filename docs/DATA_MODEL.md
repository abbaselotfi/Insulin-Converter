# Initial Data Model

## Guideline

```json
{
  "id": "ada-standards-2026",
  "organization": "ADA",
  "title": "Standards of Care in Diabetes",
  "year": 2026,
  "status": "active",
  "sourceUrl": "https://professional.diabetes.org/standards-of-care",
  "reviewedBy": "clinical-reviewer-id",
  "reviewedAt": "2026-07-22"
}
```

## Clinical rule

```json
{
  "id": "t2d-ckd-sglt2-preferred",
  "module": "type-2-diabetes",
  "guidelineId": "ada-standards-2026",
  "status": "active",
  "conditions": ["type2Diabetes", "chronicKidneyDisease"],
  "recommendation": "Prefer an SGLT2 inhibitor when clinically appropriate.",
  "rationale": "Cardio-kidney risk reduction is prioritized in appropriate patients.",
  "safetyChecks": ["eGFR", "contraindications", "pregnancyStatus"]
}
```

## Medication

```json
{
  "id": "semaglutide",
  "genericName": "semaglutide",
  "class": "GLP-1 receptor agonist",
  "modules": ["type-2-diabetes", "obesity"],
  "renalConsiderations": [],
  "hepaticConsiderations": [],
  "pregnancyConsiderations": [],
  "hypoglycemiaRisk": "low unless combined with insulin or sulfonylurea",
  "brands": ["ozempic", "rybelsus"]
}
```

## Brand

```json
{
  "id": "ozempic",
  "genericMedicationId": "semaglutide",
  "brandName": "Ozempic",
  "brandType": "originator",
  "markets": ["global"],
  "isVisible": true
}
```

## Local market display setting

```json
{
  "id": "iran-semaglutide-display",
  "market": "IR",
  "genericMedicationId": "semaglutide",
  "preferredLabelMode": "generic_first",
  "preferredBrandIds": [],
  "availabilityStatus": "unknown",
  "displayPriority": 100,
  "localNoteFa": "",
  "localNoteEn": ""
}
```

## Display priority rule

Display priority affects only the order and label of clinically appropriate options. It must not bypass contraindications, guideline logic, pregnancy warnings, renal limits, hepatic cautions, or physician review requirements.
