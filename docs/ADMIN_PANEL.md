# Administrative Panel Requirements

## Purpose

The admin panel should allow an authorized non-developer user to manage how medications and clinical items are displayed in the application without changing source code.

The initial commercial requirement is not direct advertising. The main need is to control whether generic names, originator brand names, or locally available market brands appear more prominently in relevant boxes.

## User roles

1. **Clinical admin**
   - Can edit clinical content drafts.
   - Can submit guideline or medication changes for review.

2. **Display admin**
   - Can change display order, visibility, preferred label style, and local market availability.
   - Cannot change clinical rules or safety constraints.

3. **Reviewer**
   - Can approve or reject guideline and medication safety changes.

4. **System admin**
   - Can manage users and permissions.

## Configurable display options

The admin panel should support:

- Preferred medication label:
  - Generic first.
  - Originator brand first.
  - Local market brand first.
- Show or hide a medication in specific modules.
- Set local market availability.
- Set local display priority for brands.
- Add short notes, such as insurance or access notes.
- Add Persian and English display names.
- Mark a brand as preferred in Iran or another local market.

## Important safety boundary

A display admin may prioritize a local brand only after the clinical engine has selected the medication class or generic option as appropriate. Display settings must never force a clinically inappropriate drug to appear as recommended.

## Audit requirements

Every admin change should record:

- User.
- Timestamp.
- Changed field.
- Previous value.
- New value.
- Reason or note.

## Example use case

If semaglutide is clinically appropriate and a specific semaglutide brand is available in Iran, the display admin can set that local brand to appear first in the medication box. The system should still show the generic name and should not hide safety warnings.
