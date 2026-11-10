# Verification record

Local implementation tested on 2026-11-10. Publication checks are recorded separately below.

## Automated checks

- `npm run check`: passed syntax checks for all application modules/server and 15 model tests.
- `npm run build`: passed; generated a static `dist/` without dependencies.
- Tests cover canvas boundaries, transparent blank pixels, connected lines, eraser alpha, symmetry, flood-fill boundaries/no-op, reversed-drag rectangles, horizontal flip, independent frame cels, layers across frames, alpha compositing, hidden layers, partial-alpha JSON roundtrip, malformed project rejection, size/count limits, undo/redo, history cap, and valid demo data.

## Browser verification

Used the supported managed HTTP preview at `http://127.0.0.1:4173/` in Chromium through CUA, not `file://`.

- Initial layered demo rendered in editor, navigator and all four thumbnails.
- Added a layer; drew a connected stroke with pointer drag; undo/redo changed the visible canvas and history state; removed the temporary layer.
- Entered a custom six-digit hex color, added it to the palette, and verified selected color state. Fixed hex-input live update found in this check, then retested it.
- Created a fresh 16×16 transparent document and drew bright pink pixels on it. Used eraser and undo/redo on the stroke.
- Played and paused the four-frame demo; the active frame indicator advanced.
- Duplicated and deleted a frame. Enabled and disabled previous-frame onion skin.
- Hid and restored the Cottage layer; observed the cottage disappear while the garden/fireflies remained.
- Downloaded a real PNG frame, PNG sheet, and editable project through the browser. Decoded the files separately: frame was **64×64 RGBA**, sheet was **256×64 RGBA**, both had alpha range **0–255** and transparent corner `(0,0,0,0)`. Project retained the **64×64 document, three layers, four frames**.
- Opened that downloaded project file, accepted replacement, and observed the restored document.
- Imported the exported PNG, accepted replacement, and observed a single-layer/single-frame 64×64 project. This flattened PNG workflow is separate from editable project roundtrip.
- Verified New Canvas cancellation and successful creation; reloaded the original demo after tests.
- Reloaded the page after edits and observed browser autosave restoration.
- Opened/closed help in the responsive layout.
- Tested the narrow layout at **500 CSS px**; measured document width **485 px** after scrollbar, with no main element overflowing that width. Added stable scrollbar gutter to prevent screenshot/layout width shifts.
- Revisited desktop after responsive testing. No application-origin console errors were reported. Browser extension metadata warnings were outside the app.
- Fixed fit sizing after document replacement so old zoom does not inflate the next canvas; reloaded and captured the final code.

## Screenshots

`docs/screenshots/desktop.jpg` and `mobile.jpg` are genuine full-page browser captures of the working local app. They were not generated, composited, retouched, or cropped. Exact dimensions, capture timestamps, source, and SHA-256 hashes are in `app.json`.

## Coverage limits

This was a focused Chromium workflow pass, not a comprehensive cross-browser, assistive-technology, touch-device, performance or penetration audit. The narrow layout was a resized browser window, not physical-phone testing. Layer reordering, rename, opacity, each brush size and every keyboard chord have model/source coverage as applicable, but were not all individually exercised in the browser. Edge-case validation and resource caps were automated; storage exhaustion and 32-frame/12-layer maximum-size rendering were not load tested.
