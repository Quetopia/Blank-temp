# Punkin 3D motion study

Original prototype created 10 September 2026. This is a separate native Unity
motion study, not a replacement for the existing Quetopia browser game or its art.
The model is deliberately a first stylized study; it does not yet match the
detailed painted orange-tabby reference. No third-party model was downloaded.

## Saved on Puntocom

Base folder: `C:\Users\Punto\OneDrive\Documents\Quetopia`

- `PunkinMotionLab\SourceArt\Punkin.blend`: editable model, skeleton, IK controls, walk and render studio.
- `PunkinMotionLab\Assets\Punkin\Punkin.fbx`: exported skinned character and baked animation.
- `PunkinMotionLab\Assets\Scenes\PunkinMotion.unity`: native inspection scene.
- `PunkinMotionPreview\PunkinMotion.exe`: windowed Windows preview.
- `PunkinMotionLab\Assets\Punkin\gait-check.json`: Blender skeleton checks.
- `PunkinMotionLab\Punkin-unity-check.txt`: independent imported-animation checks.

## Preview controls

The preview starts walking in a circle. WASD or arrow keys take manual control.
Space pauses/resumes movement; Tab toggles the circle walk. Close the window to exit.
The controller eases velocity and interpolates continuous rotations. It has no
four-facing sprite switch. A stationary pose currently freezes the walk; a separate
idle animation and more polished transitions remain future work.

## Reproduce

1. Run `build_punkin.py` using Blender 5.2 background mode, passing `--` followed by
   the absolute `PunkinMotionLab\Assets\Punkin` output folder. It saves Blender source
   outside Assets so Unity imports only the exported FBX.
2. Copy `PunkinMotion.cs` to the Unity Assets folder and `PunkinSceneBuilder.cs` to
   Assets/Editor. Use the existing Unity 6000.6.0f1 project.
3. Run the saved `Start-QuetopiaUnity.cmd` launcher with `-batchmode -quit
   -projectPath <project> -executeMethod PunkinSceneBuilder.Build -logFile <log>`.
4. Run the same launcher with `-executeMethod PunkinSceneBuilder.BuildPreview`.

## Completed checks

- Blender build exited 0; 24 bones; 9,164 body vertices; two-second walk.
- All 12 upper/lower/ankle segments animate. IK endpoint error below 0.000001 model units.
- Start/end bone rotations match within floating-point tolerance.
- Unity initially rejected the 100x FBX scale. An importer-only .01 workaround
  failed during native playback. The final fix exports `FBX_SCALE_ALL` and uses
  importer scale 1, validated on the sampled skinned mesh and native screenshot.
- Unity import/scene build exited 0. All 12 imported leg segments move, with
  rotation ranges approximately 10–42 degrees over the walk.
- Windows preview build exited 0.
- Native preview launched and its screenshot was inspected. It shows the cat at
  the correct size. The unanimated orientation parent protects floor placement
  and forward-axis correction from imported animation curves.
- Sampled lowest body vertices vary by .0105m over the loop after floor correction.
  This numerical check does not substitute for approving a natural-looking gait.

## Remaining character work

Review the actual gait from several angles and refine weight shift, foot contacts,
and joint deformations. Match the reference with better anatomy, tabby textures,
eyes, fur silhouette, and detailed ranger clothing. Add idle/run and locomotion
blending before integrating into the existing game. Do not call this final art
or claim browser integration or visual gait approval from the skeleton checks.
