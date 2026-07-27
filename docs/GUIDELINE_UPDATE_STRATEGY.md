# Guideline and Medication Update Strategy

## Problem

Diabetes, hypertension, kidney, heart, and liver guidelines change regularly. New medications, new indications, safety warnings, and market availability changes must be updateable without rewriting the application.

## Core strategy

The application should treat guidelines and medication data as versioned content, not hard-coded UI text.

## Guideline versioning

Each guideline-backed rule should store:

- Guideline organization, such as ADA, EASD, AACE, NICE, KDIGO, or local societies.
- Guideline title.
- Publication year.
- Version or supplement identifier when available.
- Rule status: draft, active, deprecated, or archived.
- Date added to the application.
- Date reviewed by a clinical reviewer.
- Source citation.
- A short physician-facing rationale.

## Annual update workflow

1. **Monitor new guideline releases**
   - ADA Standards of Care annually.
   - ADA/EASD consensus updates when published.
   - Kidney, cardiovascular, pregnancy, and hypertension guidelines.

2. **Create a draft guideline version**
   - New rules are entered as draft.
   - Existing active rules remain unchanged until review is complete.

3. **Clinical review**
   - A clinician reviews each changed rule.
   - The system records reviewer, date, source, and notes.

4. **Regression testing**
   - Existing clinical calculators and sample patient scenarios are tested against expected outputs.
   - Any changed recommendation must be visible in release notes.

5. **Activation**
   - The new guideline version becomes active.
   - Old versions are archived, not deleted.

6. **Release notes**
   - Physician-facing summary of important changes.
   - Internal technical changelog.

## Medication update workflow

Medication data should support rapid updates for:

- New generic medications.
- New originator brands.
- New local market brands.
- Availability changes.
- Insurance or access notes.
- New contraindications or warnings.
- New renal, hepatic, pregnancy, or cardiovascular evidence.

## Safety rules

- Do not delete old guideline versions; archive them.
- Do not silently change active clinical recommendations.
- Every recommendation should be traceable to a guideline version and source.
- Display priority must not override clinical contraindications.
