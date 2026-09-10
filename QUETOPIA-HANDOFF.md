# Quetopia handoff — 10 September 2026

Continue the existing project; do not restart the game.

## Source and goal
- Repository: Quetopia/Blank-temp; branch work/quetopia-recovery; draft PR #1.
- Existing browser game and preserved artwork: grove/.
- Browser animation checkpoint: 6aad6c9574efd2db42cf3c1089401f4d3f3073b9; 17 logic checks passed. User rejected paw deformation and abrupt four-view turning.
- A separate native Unity Punkin motion prototype now exists: original skinned cat, 24 bones, whole-leg four-beat walk, continuous steering. This is first stylized prototype art, not the finished reference-quality cat. Natural gait and visual polish still need review.
- Preserve the druid/cat artwork, existing game, and ghost-slide design.

## PC and verified startup repair
- Desktop Commander device Puntocom, id be4ffa12-bd05-428e-8098-6f28d5b1266e.
- Unity executable: C:\Program Files\Unity\Hub\Editor\6000.6.0f1\Editor\Unity.exe
- Blender executable: C:\Program Files\Blender Foundation\Blender 5.2\blender.exe; version command completed successfully.
- Unity project: C:\Users\Punto\OneDrive\Documents\Quetopia\PunkinMotionLab
- Initial Unity creation failed twice with Package Manager IPC timeout. UPM --version worked. Remote process environment lacked ComSpec, TMP, ProgramData, ALLUSERSPROFILE and several standard program-folder variables.
- Restoring ComSpec/TMP alone did not fix startup. Restoring the additional standard folder variables for the launched process succeeded: UPM resolved packages, Unity imported assets, and project creation exited with code 0.
- Exact single missing variable responsible has not been isolated. Do not claim antivirus or installation corruption was diagnosed.
- Reusable launcher: tools/Start-QuetopiaUnity.cmd, also saved next to the PC project. It fixes child-process environment only, using setlocal; no global environment, antivirus, firewall or execution-policy changes.
- Creation verification logs are in the parent Quetopia folder: Unity-full-environment.log and upm-full-environment.log.

## Workflow
Development, repo saves and previews are authorized. Keep calls short. Report completed results; do not interpret an elapsed tool timer as development. Prior sessions had long transport hangs. Update this handoff after each saved milestone. A blank Unity project is not a completed animation scene.

## Saved 3D cat milestone
- Reproducible sources: tools/build_punkin.py, tools/PunkinMotion.cs, tools/PunkinSceneBuilder.cs. Full instructions and limitations: tools/PUNKIN-MOTION-STUDY.md.
- PC editable source: PunkinMotionLab\SourceArt\Punkin.blend. Keep outside Assets to avoid Unity launching Blender automatically during import.
- PC exported character: PunkinMotionLab\Assets\Punkin\Punkin.fbx. Native scene: Assets\Scenes\PunkinMotion.unity.
- PC preview: C:\Users\Punto\OneDrive\Documents\Quetopia\PunkinMotionPreview\PunkinMotion.exe. Built successfully, launched and runtime screenshot inspected. Last launched PID 23304 (do not assume still alive later).
- Preview controls: WASD/arrows steer, Space pauses, Tab toggles circle walking. Idle currently freezes walk; no dedicated idle/run blend yet.
- Blender and independent Unity sampling checks confirm all 12 upper/lower/ankle segments move. Two-second loop, matching endpoints; imported rotation ranges about 10–42 degrees.
- FBX correction: exporter apply_scale_options='FBX_SCALE_ALL', importer globalScale=1. Initial importer-only .01 fix failed at runtime. Native screenshot verified corrected size.
- Placement uses baked animated vertices on a separate unanimated parent, not static renderer bounds. Lowest body point varies about .0105m over the cycle.
- Source/model generation and preview are saved. Existing browser game was not replaced or redeployed. Next: assess gait visually, refine anatomy/textures/clothing toward punkin-reference.jpg, then idle/run blends and integration. Do not present the motion-study cat as finished art.
