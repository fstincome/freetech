# Architecture
- Theory of Change content and job vacancies are read from their dedicated editable content tables; never duplicate their text in page code, so administration remains authoritative.
- Share Theory of Change section visibility between the public page and its admin list; retain legacy internal strategy records without displaying them so public content editing stays consistent.
- Public page composition is stored in CMS draft/published documents; collection blocks reference existing authoritative content tables rather than copying their records, preserving deadlines, team profiles and event rules.
- CMS public reads use a published-only function; anonymous column grants and admin-only authenticated table policies prevent draft exposure for both signed-out and signed-in visitors.
- Keep the retired hackathon URL as a redirect to opportunities, while retaining registration administration and its data.
- Date-only application deadlines are inclusive and compared as calendar dates, so the final application day remains open.
- Render Theory of Change CMS blocks with a shared visual pathway renderer in both administration and public views; derive stage labels and text from editable rich content to preserve publication and multilingual editing.