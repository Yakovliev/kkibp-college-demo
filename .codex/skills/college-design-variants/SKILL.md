---
name: college-design-variants
description: Create, compare, apply, and clean temporary responsive design variants for this static Ukrainian college website demo. Use when Codex needs to generate A/B/C visual concepts, alternate page or section layouts, color experiments, desktop/mobile preview pages, select a winning variant, move it into a real HTML page, or remove old design-lab files.
---

# College Design Variants

Use this skill to run controlled design experiments for the college demo without destabilizing the real pages. Variants are temporary until the user explicitly accepts one.

## Coordinate With Other Skills

- Use `college-frontend-design-direction` when forming the visual directions.
- Use `college-playwright-visual-review` when checking rendered desktop/mobile behavior.
- Use `college-web-interface-review` when reviewing accessibility, responsive robustness, and WordPress handoff risks.
- Use `college-decision-documentation` only after the user accepts, rejects, or asks to record an experiment.

## Directory Model

Use two categories of outputs:

- `design-lab/`: temporary experiments. Add this folder to `.gitignore`. Delete a run after its winner is applied and verified, unless the user asks to keep it.
- `design-showcase/`: longer-lived comparison sets for stakeholder review. Do not delete these automatically.

Default temporary run shape:

```text
design-lab/
  YYYY-MM-DD-page-scope/
    manifest.json
    preview.html
    mobile.html
    variant-a.html
    variant-b.html
    variant-c.html
```

Use fewer or more variants when the user asks. Keep names short and stable, for example `variant-a.html`, `variant-b.html`, `variant-c.html`.

## Manifest

Create `manifest.json` for every run:

```json
{
  "generatedBy": "college-design-variants",
  "date": "2026-06-28",
  "target": "index.html",
  "scope": "hero",
  "status": "testing",
  "variants": [
    { "id": "a", "name": "Official", "file": "variant-a.html" },
    { "id": "b", "name": "Applicant focused", "file": "variant-b.html" },
    { "id": "c", "name": "Community", "file": "variant-c.html" }
  ],
  "previews": {
    "desktop": "preview.html",
    "mobile": "mobile.html",
    "mobileViewport": "390x844"
  }
}
```

Use English ids and filenames. UI labels inside preview pages may be Ukrainian.

## Workflow

1. Identify the target page and scope.
   - If the user names a page, use that page.
   - If the user names a section or component, keep the experiment scoped to it.
   - If the request is broad, default to the smallest useful surface.
2. Read local context before designing.
   - Inspect the target HTML, shared CSS, JavaScript, relevant assets, and existing preview conventions.
   - Do not fetch external inspiration or assets unless the user explicitly asks.
3. Define variant directions before coding.
   - Variants should be meaningfully different in layout, hierarchy, rhythm, and content emphasis.
   - A color-only change is acceptable only when the user asks for palette variants.
   - Keep the institution credible, Ukrainian text readable, and existing content truthful.
4. Create the run without modifying the target page.
   - Put temporary files under `design-lab/YYYY-MM-DD-page-scope/`.
   - Keep the real `index.html` or other target unchanged until the user chooses a winner.
5. Build responsive variants.
   - Every variant must work at desktop and mobile widths.
   - Do not create separate mobile content pages. Use the same variant HTML and show it in `mobile.html`.
   - Preserve accessible names, heading order, real links where practical, and shared search/menu behavior when the variant includes global chrome.
6. Create previews.
   - `preview.html` compares the variants for desktop review and includes direct open links.
   - `mobile.html` is mandatory and compares the same variants in 390 by 844 phone frames.
   - Tablet preview is optional unless the user requests it.
7. Verify before presenting.
   - At minimum, inspect `mobile.html` and one direct variant.
   - Check horizontal overflow, clipped Ukrainian text, cramped buttons, header/menu behavior, image scaling, and visible focus states.
   - Use Playwright when the user asks for stronger confidence or when the layout change is substantial.
8. Apply only after explicit user selection.
   - The user must choose a winning variant or a combination of parts.
   - Re-read the real target file before editing it.
   - Transfer the accepted design deliberately instead of copying a whole temporary file over the target.
   - Preserve shared header, footer, navigation, search, language switch, scripts, metadata, and page-specific links unless the accepted design intentionally changes them.
9. Verify the real target.
   - Check the updated page directly, especially mobile.
   - If Playwright is available and the change affects layout, run the relevant project or smoke suite.
10. Clean up.
   - For normal `design-lab` runs, delete the temporary run after the accepted change is applied and verified.
   - For rejected runs, delete the temporary run after the user confirms no variant should be kept.
   - For `design-showcase`, keep files until the user asks to archive or delete them.

## Preview Requirements

`mobile.html` must:

- show all variants using the same source files as desktop;
- use phone frames sized 390 by 844 CSS pixels unless the user requests another viewport;
- allow each variant to be opened directly;
- avoid hiding long variant names or preview controls on small screens;
- allow horizontal scrolling when several phone frames do not fit.

`preview.html` should:

- identify the target page and scope;
- show variant names and short notes;
- include direct links to every variant and to `mobile.html`;
- avoid becoming a marketing page. It is a comparison tool.

## Path Handling

Variant files live below the site root, so relative paths need care.

- Do not use a `<base>` tag; it can break fragment links such as `#programs`.
- Rewrite asset paths from a lab run back to the project root, for example `css/styles.css` -> `../../css/styles.css`, `js/main.js` -> `../../js/main.js`, and `assets/...` -> `../../assets/...`.
- Preserve fragment-only links like `href="#programs"`.
- For links to real sibling pages, point them back to the project root, for example `admissions.html` -> `../../admissions.html`.
- For English pages, account for the extra `en/` path when copying or linking.

## Cleanup Script

Use the bundled script when deleting a generated lab run:

```bash
python3 .codex/skills/college-design-variants/scripts/cleanup_design_run.py design-lab/YYYY-MM-DD-page-scope
```

The script refuses to delete paths outside `design-lab/` by default and requires a manifest with `"generatedBy": "college-design-variants"`.

## Guardrails

- Never treat a temporary variant as accepted without the user's explicit selection.
- Do not overwrite the target page with a lab file wholesale.
- Do not keep accumulating routine experiments in the repository.
- Do not document a variant as final until the user accepts it.
- Do not add dependencies for variant generation unless the user explicitly asks.
- Keep temporary experiments out of commits unless the user asks for a showcase deliverable.
