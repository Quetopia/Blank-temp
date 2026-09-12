# Full-game Punkin integration

The preserved grove game now draws Punkin from the actual Blender skinned model.
Three.js renders a small transparent image each frame, which the canvas inserts
into its existing depth-sorted actor list. Companion following, attacks, healing
blessing, combat, seals, guardian, and ghost-slide remain in the existing simulation.

Punkin turns continuously toward actual travel direction using shortest-angle
interpolation. Animation speed follows movement and freezes when paused.
Render positions interpolate between simulation steps for all characters.
The druid still uses the existing directional artwork; continuous 3D druid turning
has not been implemented. The cat remains the first stylized motion-study model.

`punkin-3d.mjs` is the editable renderer; `punkin.bundle.mjs` is its checked-in bundle.
Rebuild with `npx --yes esbuild@0.25.9 grove/punkin-3d.mjs --bundle --minify
--format=esm --outfile=grove/punkin.bundle.mjs` from repository root.
Three.js 0.180.0 is vendored with its MIT LICENSE; only loader import paths changed.
Export the Blender asset with `tools/export_punkin_web.py`.

Checks: all 17 existing tests pass. An independent Three.js GLTFLoader check
loaded the model, played its clip, verified all 12 upper/lower/ankle bones move
(smallest angular range .1827 radians), and measured model height 1.9834 units.

The cloud test browser has WebGL disabled and explicitly reports GL_RENDERER=Disabled.
It therefore exercises the visible sprite fallback. Do not claim that this browser
visually verified the 3D model or its graphics performance. On a WebGL-capable
browser the HUD reports `Punkin 3D`; otherwise it reports `sprite fallback`.

First integration preview: dpl_Cws7qf1y9jCJgHPuU9JomAu7o6Zr (READY).
https://quetopia-signal-001-ayzivcsn3-quetopia.vercel.app/
Deployment embeds the model and renderer, and references preserved original art
at immutable GitHub commit ff33839ab91e6072161a3558d65279aa9fc50634.
