# Architecture
- Theory of Change content and job vacancies are read from their dedicated editable content tables; never duplicate their text in page code, so administration remains authoritative.
- Share Theory of Change section visibility between the public page and its admin list; retain legacy internal strategy records without displaying them so public content editing stays consistent.
- Public page composition is stored in CMS draft/published documents; collection blocks reference existing authoritative content tables rather than copying their records, preserving deadlines, team profiles and event rules.
- Anonymous CMS reads select only published columns, with column-level grants hiding draft content; publishing requires the existing server-validated admin role.
- Keep the retired hackathon URL as a redirect to opportunities, while retaining registration administration and its data.
- Date-only application deadlines are inclusive and compared as calendar dates, so the final application day remains open.