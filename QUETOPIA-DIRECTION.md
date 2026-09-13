# Quetopia — art and gameplay development brief

Research and recovery: 7 September 2026. This is a development brief, not a claim that the visual target has been implemented.

## Recovered project

Repository: Quetopia/Blank-temp. The published entry says Signal 021, but loads signal020.html, which patches signal015-core.html, which patches signal014.html, which patches signal007.html. The Signal 020 bundle then loads sixteen additional scripts. The repository also contains a separate Next.js collaboration app; its package.json is not the game runtime.

The recovery branch adds tools/recover-runtime.mjs. It resolves the historical HTML transformations at build time and produces recovered.html, using local module URLs in the recorded load order. It preserves historical pages. This eliminates the nested GitHub fetch/document.write chain from the new entry point. JavaScript syntax checks pass; interactive verification remains outstanding because the cloud browser refused the local server URL.

## Visual identity from recovered references

Inspected Druid and Cat in the Fractured Grove.png and Hypnotic Biomechanical Crustacean Guardian.png. Also recovered the Fractured Grove title image, Neon Mantis Hunt, and related biomechanical artwork. These are reference illustrations, not rigged models or game screenshots.

The grove reference establishes ancient wet stone, layered roots, deep chasms, violet fungi, cyan water, a cloaked elder druid, and a cat companion. Brass/gold filigree should frame a restrained interface. The guardian reference establishes intricate orange chitin, porcelain-metal insets, enormous slit-pupil eyes, symmetry and repeating biological architecture.

Quetopia should contrast quiet, tangible surfaces with moments of impossible geometry. Keep the playable floor subdued; reserve the brightest emissions for spells, interactive objects and enemy warnings. Do not flood the whole frame with equally bright purple lights. Different silhouettes and motion matter more than recoloring the same mantis.

The TikTok profile @quetopia3 was located in search, but direct video retrieval failed and TikTok video search was robots-blocked. No claims here are based on watching that channel. User-selected original clips remain necessary for an actual motion/music analysis.

## What the community evidence changes

These are selected qualitative reports across years, not a representative survey or a claim about every current player.

| Evidence | Development consequence |
| --- | --- |
| Last Epoch players praise systems while criticizing animations and thin audio | Design attack anticipation, contact, enemy flinch and recovery together. Layer launch, impact and death sounds. More damage numbers are not a substitute. |
| PoE players report ground hazards buried under effects | Give enemy telegraphs a distinct shape and value contrast; do not rely on hue alone. Reduce friendly effects over hazards. |
| Loot-filter discussions emphasize useful affixes | Include simple useful-for-my-build filtering and comparison before producing large quantities of loot. |
| Build-diversity discussions disagree about viability and experimentation cost | First offer three genuinely different skill behaviors with cheap respecs, then test each against the same encounters. |
| Last Epoch's Monolith developer blog emphasizes medium-term goals | Each short expedition needs a visible purpose, a reward, and a reason to change the next run. |

Sources:
- https://www.reddit.com/r/LastEpoch/comments/1k50eft/mechanics_loot_crafting_everything_works_very/
- https://forum.lastepoch.com/t/combat-feel/49681
- https://forum.lastepoch.com/t/new-items-animations-and-quality-of-life-coming-to-last-epoch-march-26/80545
- https://www.pathofexile.com/forum/view-thread/3668457
- https://www.pathofexile.com/forum/view-thread/3598854
- https://forum.lastepoch.com/t/guide-creating-useful-loot-filters/45778
- https://www.reddit.com/r/pathofexile/comments/owuz52/the_leveling_process_kills_build_diversity_for_me/
- https://www.reddit.com/r/pathofexile/comments/fp7zkn/what_build_diversity_means_or_used_to_mean_in_poe/
- https://forum.lastepoch.com/t/monolith-overhaul/37245

## First polished playable section

Target one 10–15 minute Fractured Grove expedition. One druid, Punkin companion, three enemy archetypes and one guardian. Travel through a grounded ruin, a bioluminescent grove and a short veil-crossing encounter. Activate three anchors to expose the guardian. Defeat it, choose a skill mutation, return and retain progress.

Enemy roles: a close-range mantis with a clearly telegraphed lunge; a stationary extractor with a breakable line-of-sight channel; a guardian alternating safe movement windows and deliberate attacks. Companion behavior must be reliable and visible, with a recall and a purposeful assist.

The proposed unique mechanic is Veil Shift: temporarily reveal a second layer of the same space. It exposes paths, weak points and resonance nodes. It must alter player decisions, not merely apply a purple screen filter. The signal is a musical motif that gains layers as anchors awaken; gameplay should remain usable with audio muted.

Initial build branches: spore damage-over-time, prismatic chained attacks, and companion/bond support. Use a small set of equipment with readable tradeoffs and one deliberate crafting operation. Save equipment, skill choices and expedition rewards locally before adding accounts or multiplayer.

## Production requirements

Replace procedural placeholder characters with a coherent asset set: druid mesh and materials; idle, walk, cast, hit, dodge and death animations; cat locomotion and assist animations; mantis locomotion, anticipation, attack and death; modular ground, bridge, root, ruin and fungus assets. Budget and profile these at the actual gameplay camera distance. A close-up concept image is not a ready-to-use model or animation.

A native Windows build remains the intended destination. A browser prototype is useful for validating controls and encounters; changing the container alone cannot create the reference fidelity. Choose the production engine after inspecting available PC tools and testing the asset import/render workflow. Do not promise commercial ARPG fidelity from a cosmetic patch.

## Acceptance gates

1. Cold boot and enter without script exceptions; no dependence on mutable files from another deployment.
2. Ten minutes of movement and combat without getting stuck, duplicate actions or accumulating orphan effects.
3. Player, hostile silhouettes and telegraphs readable at 1080p, with reduced effects and without audio.
4. Guardian encounter can be understood and survived by observation; defeat/retry works.
5. Equip, craft, change skill, quit and reload preserve intended state.
6. Measure frame time on Puntocom during dense combat; set a target after measuring the actual hardware, not from a synthetic boot check.
7. Compare a real gameplay capture to the recovered art references. Label remaining placeholder assets explicitly in the development checklist.
