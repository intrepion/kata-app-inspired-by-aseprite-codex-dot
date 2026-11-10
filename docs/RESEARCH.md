# Workflow research and scope

Reviewed official Aseprite documentation on 2026-11-10:

- https://www.aseprite.org/docs/drawing/ — pixel pencil, eraser, picker, shape tools, zoom, symmetry, and preview are central drawing aids.
- https://www.aseprite.org/docs/layers/ — independent transparent layers, named layers, visibility, and cels organize a sprite.
- https://www.aseprite.org/docs/animation/ — draw a frame, add/duplicate frames, preview the animation, and use onion skin to inspect motion.
- https://www.aseprite.org/docs/sprite-sheet/ — sprites can be arranged into a single horizontal, vertical, or matrix image for export.

## Kata interpretation

Implement one complete loop: make precise pixel edits → separate details into layers → duplicate frames → preview motion → save an editable file → export a useful transparent sprite image/sheet. Use a fixed shared frame rate and a horizontal sheet to keep the first version honest and testable.

Excluded professional capabilities include native Aseprite file support, linked cels, tags, variable frame timing, tilemaps, selection/move tools, advanced blend modes, and animated image encoding. The app does not display decorative controls for those missing features.

## Original identity

Pixel Loom is a compact forest-green workbench with botanical colors, restrained typography, spacious checkerboard editing, and a miniature navigator. The default Mosslight cottage illustration is authored in code from simple pixel shapes and has independently edited firefly frames. It does not imitate Aseprite's chrome, logo, icons, or sample artwork.
