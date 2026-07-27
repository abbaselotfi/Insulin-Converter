# Architecture Proposal

## Goals

The project should evolve from a single-page calculator into a maintainable clinical decision-support system. The architecture must support frequent guideline updates, newly approved medications, local market brand availability, and future mobile applications.

## Recommended layers

1. **Presentation layer**
   - Web UI for physicians.
   - Persian and English localization.
   - Future mobile UI using shared clinical logic.

2. **Clinical rules layer**
   - Insulin conversion rules.
   - Diabetes treatment algorithms.
   - Hypertension and cardio-kidney-metabolic rules.
   - Rule versioning by guideline source and publication year.

3. **Medication knowledge layer**
   - Generic medications.
   - Originator brands.
   - Local market brands.
   - Availability status.
   - Safety properties such as renal, hepatic, pregnancy, and hypoglycemia considerations.

4. **Administration layer**
   - Non-developer controls for display order, visibility, preferred labels, and local availability.
   - Audit log for changes that affect clinical display.

5. **Persistence layer**
   - Database-backed configuration for guidelines, medications, brands, translations, and display preferences.
   - Clear separation between clinical evidence and local display preferences.

## Separation of clinical and display logic

Clinical recommendations must be calculated independently from commercial or local display preferences. A local brand may be prioritized for display only after the medication is considered clinically appropriate.

## Future technology direction

A practical production direction is:

- Frontend: React or Next.js.
- Mobile: React Native or Expo with shared clinical rule packages.
- Backend: NestJS or FastAPI.
- Database: PostgreSQL.
- Admin UI: role-based web dashboard.
- CI/CD: GitHub-based workflow with tests for clinical rules.
