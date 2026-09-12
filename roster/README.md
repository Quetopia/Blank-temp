# The Unwritten Signal — playable roster prototype

Open `/roster/` from the project’s static server. This extends the recovered September 10 PC grove code in an isolated entry point. The original `/grove/` remains available.

Seven selectable characters, seven companions, a three-scene skippable intro, four starter skills each, three starter focus presets, saved selection, pause, retry, victory blessings and the complete three-seal / Thorn Crown encounter. New pairs use the saved procedural GLB studies with smooth root turning and prototype bob/sway. They do not yet have articulated walk rigs. Druid keeps approved original artwork; Punkin uses the existing animated renderer where WebGL is available. WebGL failure falls back to portraits.

The named focus presets are starter bonuses, not the comprehensive design document’s finished builds or passive trees. Damage/survivability tuning is provisional. No progression is erased by changing selection; the current encounter restarts.

## Forum ideas consulted September 11–12, 2026

- [Last Epoch: A Build Testing Realm with Blueprint Respec System](https://forum.lastepoch.com/t/a-build-testing-realm-with-blueprint-respec-system/79327). Player proposal, not an implemented official feature: reduce the cost of trying an unfamiliar build. Quetopia application: free selection, visible starter effects, persistent selection and no loss of earned blessings.
- [PoE2: So Why Are Only a Small Percentage Actually Viable?](https://www.pathofexile.com/forum/view-thread/4000722). Player feedback, not measured balance data: a long list of abilities is insufficient if only a few function well. Quetopia application: each kit has an inexpensive basic attack, a distinct interaction, recovery and a tested route through the same encounter.

No forum art, names, code or skill trees copied. Story and characters adapt the approved Quetopia concepts.

## Checks

`node --test roster/roster.test.mjs`: 18 tests. All seven kits execute and finish all three seals and the guardian in a deterministic harness. The encounter harness grants protection and resources to isolate damage/encounter logic; these tests do NOT establish human difficulty balance. Additional checks cover cooldowns, resets, heat gating, marked/soaked finishers, trap limits and refusing character changes during combat.

PC installation returned HTTP 200 at `/roster/`. Browser verification is recorded separately after deployment.

Models remain prototype quality. Advanced skill trees, gear acquisition, six campaign districts and final character animation are future work.
