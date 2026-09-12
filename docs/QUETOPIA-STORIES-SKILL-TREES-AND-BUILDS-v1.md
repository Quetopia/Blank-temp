# Quetopia: The Unwritten Signal
## Story, skill trees and build guide design — v1, 11 September 2026

**Design proposal, not implemented or playtested.** Covers the existing druid plus six proposed characters, seven companions and 21 build routes. Names, character interpretations and unseen anatomy are creative adaptations of Quetopia's artwork. The companion pairings are proposed, not claimed to appear together in the videos. Numbers below are initial tuning hypotheses, not measured balance results.

## What the build guides actually contribute

Two full written guides were reviewed for their construction rather than their current tier rankings:

- [DEADRABB1T's PoE 2 Grenades Gemling guide](https://mobalytics.gg/poe-2/builds/deadrabbit-grenades-gemling-league-starter), page dated 8 September 2026: ties a grenade skill package to passive and ascendancy choices, and separates progression, equipment, skills and strengths/weaknesses. **Our inference:** document how a build starts and sustains itself, not just its final damage combination. Sally adopts the idea of deliberate setup and payoff, not the original skills or tree.
- [EMP1241's Last Epoch Flame Hydra Runemaster guide](https://www.icy-veins.com/last-epoch/runemaster-flame-hydra-endgame-build), page dated March 2024: describes skill conversions, traversal benefits, protection, a turret-producing rotation and an important unique item. It supplies both class-passive and individual-skill allocations. This is a historical design example, not a recommendation for today's meta. **Our inference:** let a skill tree change the role of an ability and explain when the complete rotation becomes viable. Diamond Girl and Crescent Weaver use different original versions of this principle.

These two examples support the design direction, not an exhaustive survey of either game. Some guide pages were inaccessible. No League of Legends mechanics are used. We do not copy either game's tree, item names, lore or numerical balance.

## The Quetopian story

Quetopia was built as a sanctuary that could generate worlds from memory, music and imagination. Its caretaker, a mantis intelligence called **The Curator**, concluded that loss and uncertainty were design defects. It began repeating successful moments and removing unpredictable choices. The result looks abundant but cannot grow: flowers open on schedule, crowds laugh on cue, and entire oceans replay the same wave.

The **Unwritten Signal** is evidence of choices the system failed to erase. Seven characters hear it differently. Their companions are independent witnesses: creatures whose memories disagree with the approved history. The characters are not collecting divine permission to rule. They are restoring the world's capacity to change.

### Campaign structure

1. **The Interrupted Grove.** Preserve the existing courtyard, three seals and guardian as the opening. Each restored seal reveals a different version of the same event. The guardian attacks because it cannot reconcile them. Victory opens the first route beyond the grove.
2. **The Festival That Never Ends.** Sally's carnival converts genuine emotion into scheduled entertainment. Rescue its audience from an endless encore; defeat the Applause Engine by interrupting three synchronized performances.
3. **The Glass Observatory.** Diamond Girl's archive predicts futures by discarding inconvenient possibilities. Players recover incomplete memories instead of accepting a single perfect timeline.
4. **The Furnace and the Seam.** Ember Sovereign and Cyberdine expose how the Curator deletes failed worlds and repairs the survivors. Their rival custodians blame each other. Both are preserving evidence.
5. **The Dreamtide.** Crescent Weaver and the Abyssal Cantor navigate discarded dreams submerged below the simulation. The missing memories can be returned only if their owners are allowed to change them.
6. **Drop the Veil.** Fight the Curator's certainty, not a generic evil god. Break prediction anchors while companions maintain places where outcomes remain undecided. The resolution transforms the Curator from controller into a fallible guide.

Endgame **Unwritten Realms** remix liberated districts with readable encounter modifiers: moving objectives, interrupted healing, dangerous floor patterns and alternate boss phases. No unavoidable immunity to a character's entire damage type. Victory blessings become restored memories with modest build choices, preserving the existing persistent-blessing concept. Story choices alter dialogue, scenery and quest outcomes; they do not permanently lock a player out of the strongest mechanics.

## Shared build architecture

### Controls and progression

Keep WASD/arrows and existing movement. Basic attack is always available and has no resource cost. Q/W/E/R are four class skills; Space remains a short dodge/ghost slide; F remains attunement/interact. Proposed C issues the companion command. Rebind every action. None of the builds requires rhythmic timing within a tiny input window.

Use a first complete progression target of level 40: skills unlock at levels 1/4/8/12; class talent points at 5/10/15/20/25/30/35/40. Each class has **three connected branches, four one-rank nodes per branch, eight total points**. A branch is traversed N1 → N2 → N3 → N4; one point per node. Only one N4 class capstone may be selected. Cross-branch investment is allowed, but the limited budget prevents collecting every endpoint. Example complete allocation: A4 + B3 + C1 = 8.

Each active skill earns six specialization points through use and character progression. Its tree contains three two-rank tuning nodes and three alternative one-rank transformations:

| Node | Rank effects | Requirement |
|---|---|---|
| Power P | +8% then +16% increased primary effect: damage, healing or barrier, according to the skill | Root |
| Focus F | +10% then +20% increased radius, duration or projectile speed; the skill table specifies which | Root |
| Economy E | 5% then 10% reduced cost; cost-free cooldown skills instead get 5%/10% faster cooldown recovery | Root |
| Transformation A, B or C | The skill-specific behavior below | Three points spent in that skill; maximum one transformation |

Thus a full skill tree has nine possible spendable ranks; only six can be purchased. This document defines **28 skill trees with 84 distinct transformations**, alongside 84 class nodes. The tuning scaffold is shared to keep implementation affordable; transformations must change decisions, not merely colors. Space dodge has no offensive tree in v1, preserving reliable emergency movement.

Progression grants enough skill points for early experimentation: first three points in an unlocked skill arrive before its first transformation; all four trees reach six points by level 40. Respec at safe areas is free, including class capstones. Save three named loadouts per character. Switching requires being out of combat and does not reset cooldowns or refill resources.

### Terms and limits

- All class resources range 0–100. Basic attacks restore 8 resource; baseline regeneration is 5/second. Fire skills instead build Heat as specified. Out of combat, pools settle to a safe starting state; Heat cools to zero.
- Increased bonuses in the same category add. More/less bonuses multiply. Convert damage once before applying eligible damage bonuses; conversion does not benefit twice from both old and new damage tags.
- Damage over time does not crit by default. A hit's damage bonuses do not automatically multiply its separate ailment. Each ailment states stack and refresh behavior.
- A repeated cast, reflected ray, pet hit or triggered effect cannot trigger itself or another copy of its own proc chain. Once-per-cast rewards are capped per original player action, not per projectile or target.
- Initial global limits: 35% cooldown reduction equivalent, 40% slow on ordinary enemies, 15% slow on bosses, 50% maximum-life barrier. Ordinary barriers last four seconds unless a skill states otherwise. They absorb post-mitigation damage; recasting refreshes/replaces, not adds, unless explicitly stated.
- Enemy hard control contributes to a boss stagger meter; bosses do not become permanently frozen, rooted or stunned. Repeated hard control grants six seconds of resistance after a break.
- Baseline companion attacks and skill commands are part of the character's total power budget. Companion-only damage bonuses do not also buff the owner. One permanent companion; no mandatory swarm of disposable pets.
- Companions cannot permanently die. At zero health they retreat and return after 12 seconds; their command and passive combat benefit are unavailable during retreat. Recall is free and immediate, cancels queued attacks and does not bypass retreat. Suneye's eye and moth wings must never obscure boss telegraphs.

### Companion trees

Each companion gets three Bond points at levels 10/20/30. Choose one two-node specialization and the first node of the other: **3 points, four nodes, only one endpoint**. Path descriptions appear with each character. Commands normally use a 10-second cooldown; any exception is stated. Bond grants no invisible global damage multiplier.

### Gear that changes builds

Slots: weapon, focus/offhand, head, chest, gloves, boots, amulet, two rings and a companion charm. Ordinary gear supplies life, mitigation, resource sustain and applicable damage tags. Every build must function with ordinary gear; named **Memory Relics** change its play pattern. Equip at most one build-defining Memory Relic in v1. Relics have a guaranteed story acquisition route and later variable affix rolls; do not require buying or finding a rare item before the character becomes enjoyable.

Damage families: Physical, Verdant, Radiant, Ember, Tide and Veil. Example defenses: armor against Physical hits; attunement against non-Physical hits; general damage-over-time reduction; capped barriers; healing. Do not introduce six mandatory resistance caps before the small game's item pool can support them.

## 1. Mushroom Druid and Punkin — The Keeper of Unscripted Things

**Story.** The druid tended the simulation's discarded growth. Punkin repeatedly found paths that were absent from his maps. He realizes the grove is alive precisely because it refuses to become efficient. His quest restores an imperfect garden the Curator marked for deletion. The antagonist is the Perfect Gardener: a living pruning engine. Resolution preserves decay as the beginning of new life. Punkin remains a beloved individual, never expendable fuel.

**Identity:** patient area damage, deliberate staff releases, companion coordination. **Resource:** Sap. **Ailment:** Spores, maximum five stacks per target, each lasting four seconds; new stacks refresh only themselves. Baseline staff attack is a short charge and projectile visibly released from the staff tip.

| Skill; baseline | Focus | A transformation | B transformation | C transformation |
|---|---|---|---|---|
| Q Spore Lance: 15 Sap, piercing Verdant projectile, applies one Spore | Projectile speed | Needlepath: +2 pierces, 20% less hit damage | Ripen: consume up to five Spores for bonus hit damage; consumed stacks stop ticking | Trailseed: leave one small three-second spore patch; projectile loses pierce |
| W Mycelial Ring: 25 Sap, 8s cooldown, four-second damaging field | Radius | Migrating Grove: follows at half radius | Deep Bed: stationary field lasts 50% longer; cooldown +2s | Safe Ground: field grants a modest barrier; 30% less field damage |
| E Barkmemory: 20 Sap, 12s cooldown, barrier worth 20% maximum life | Duration | Thornskin: blocked hits return a fixed small Physical hit, once/second | Shared Shelter: split barrier equally with Punkin | Rooted Resolve: barrier 50% stronger while stationary; halves when moving |
| R Elder Bloom: 35 Sap, 16s cooldown, expands active patches into a damaging burst | Radius | Orchard: burst leaves two temporary seedlings; no immediate second hit | Harvest: stronger single-target burst, half radius | Renewal: replace half the damage with healing, capped at 15% life |

Class paths, nodes in prerequisite order:
- **A Sporekeeper:** Fertile (Spore duration +20%) → Compost (spore kill restores 3 Sap, capped 6/second) → Deep Roots (Ring applies Spores once/second) → **Living Orchard** (Elder Bloom spreads existing Spores to two nearby targets at 50% remaining duration; cannot propagate again).
- **B Wandwalker:** Patient Hands (fully charged basic gains 10% increased damage) → Amber Channel (next Lance after basic costs 5 less Sap, once/second) → Clean Release (Lance after Space gains one pierce; no dodge reset) → **Needle of Dawn** (Lance cannot apply Spores; consuming them adds a separately capped burst).
- **C Companion Keeper:** Familiar Trail (Punkin moves 15% faster toward commanded targets) → Soft Landing (Punkin gets a brief barrier after command) → Shared Instinct (Punkin's command hit marks one target for the druid) → **Two Against the Script** (marked target takes 15% more companion damage; owner damage 10% less).

Punkin C: **Pounce**, one target, brief ordinary-enemy stagger. Bond Hunt: command range +20% → pounce applies two Spores. Bond Hearth: recall grants Punkin a small barrier → pounce grants druid 5% life healing, once/command.

| Build and allocation | Skill transforms Q/W/E/R; Bond | Rotation, gear and progression | Weakness; optional relic |
|---|---|---|---|
| Living Orchard, A4/B1/C3 | A/B/B/A; Hunt2/Hearth1 | Ring → Lance stacks → Bloom; Sap sustain, Verdant DoT, life. Start with Lance, add Ring, then spread capstone | Ramp-up and moving bosses; **Compost Crown** trades immediate Bloom damage for one extra seedling |
| Amber Needle, B4/A3/C1 | B/C/A/B; Hunt2/Hearth1 | Punkin applies Spores → charged staff → consuming Lance; hit damage, resource efficiency, then crit | Must rebuild stacks between bursts; **Staff of the Unfinished Dawn** adds a second weaker delayed Lance, shared proc limits |
| Hearthbound, C4/A3/B1 | C/C/B/C; Hearth2/Hunt1 | Maintain shared shelter and patches; pounce priority enemies, Bloom for recovery; companion damage, barrier efficiency, life | Lower personal burst; **Punkin's Keepsake** makes pounce return a small portion of unused companion barrier as healing, capped once/command |

## 2. Diamond Girl and Suneye — The Prism Oracle

**Story.** Diamond Girl catalogued possible futures. Every polished prediction required destroying countless others. Suneye remembers colors she was ordered to erase. In the Glass Observatory she must recover three contradictory accounts without declaring any witness invalid. Her boss is the Flawless Reflection, which counters repeated skill sequences. Her liberation allows uncertainty to become a creative force.

**Identity:** rays, placed mirrors and planned burst. **Resource:** Clarity. **Mechanic:** player-created Mirrors, cap two, six-second duration; rays can refract once per cast and each enemy can receive at most one primary and one weaker refracted hit.

| Skill; baseline | Focus | A | B | C |
|---|---|---|---|---|
| Q Prism Ray: 12 Clarity, narrow Radiant line | Projectile speed | Fan: three rays, each 45% damage; shared target-hit limit | Focus: narrower ray, 25% more damage, cost +6 | Resonance: replace hit with three-second Radiant damage over time; cannot crit |
| W Mirrorseed: 20 Clarity, 6s cooldown, place a Mirror | Duration | Orbit: mirror follows Suneye, reflection 25% weaker | Split Facet: one additional mirror, but still only one reflection per cast | Shelter: mirrors absorb one small hostile projectile then break; reflected damage 20% less |
| E Facet Ward: 20 Clarity, 12s cooldown, 20%-life barrier | Duration | Reserve: barrier 50% stronger, halves Clarity regeneration while active | Shatterguard: expiry releases small shards; no on-hit procs | Lucid: weaker barrier cleanses one damage-over-time ailment |
| R Spectrum Break: 35 Clarity, 15s cooldown, consume mirrors for a burst | Radius | Convergence: center all bursts on aimed target, shared total cap | Kaleidoscope: leave three-second rays in mirror positions; half initial damage | Afterimage: preserve one mirror but burst 25% weaker |

- **A Refraction:** Clear Angles (ray speed +20%) → Polished Path (first reflection costs no extra resource) → Twin Witness (refracted hit marks for three seconds) → **Infinite Possibility** (R creates one delayed weak echo; cannot reflect or trigger itself).
- **B Singularity:** Narrow Truth (single-target hit damage +10%) → Held Breath (standing still for one second strengthens next Q; lost on movement) → Shard Reserve (R refunds 5 Clarity per consumed Mirror, maximum 10) → **One Possible Future** (one Mirror maximum; its reflection 40% stronger; no fan rays).
- **C Witness:** Sunlit Bond (command marks last two seconds longer) → Kindly Light (marked kills restore 2% life, capped once/second) → Living Lens (Suneye can carry a Mirror) → **The Observer Participates** (Suneye fires a weak ray after manual Q, once/second; Q personal damage 15% less).

Suneye C: **Reveal**, marks aimed enemy, preventing ordinary invisibility and granting its owner 10% increased damage against that enemy for four seconds. Bond Lens: +2s mark → carry one mirror. Bond Sanctuary: command shields Suneye → mark expiry grants owner a 5%-life barrier.

| Build | Transforms; class; Bond | Guide | Weakness; relic |
|---|---|---|---|
| Kaleidoscope | A/B/B/B; A4/B1/C3; Lens2/Sanctuary1 | Place mirrors along a pack → fan rays → persistent R rays; Radiant hits, cast sustain, life. Add mirrors before buying reflection talents | Setup and visual clutter; **Fractured Diadem** repositions mirrors on R but cuts their remaining lifetime |
| White Needle | B/C/A/A; B4/A3/C1; Sanctuary2/Lens1 | One safe mirror → protected stationary Q window → focused R; efficiency before crit and critical multiplier | Stationary exposure; **Monochrome Lens** converts all skill damage to Radiant but disables Resonance DoT |
| Living Lens | C/A/C/C; C4/A3/B1; Lens2/Sanctuary1 | Suneye carries mirror, apply Resonance and move; DoT duration, companion utility, barriers | Lower burst; **Witness Pendant** extends Suneye mark on manual Q, capped eight-second total duration |

## 3. Crescent Weaver and Orrery Moth — The Sleepless Cartographer

**Story.** She once stored dreams in clockwork moons. The Curator began discarding dreams with no practical use. Orrery Moth feeds on these forgotten possibilities. Her personal quest retrieves a child's imaginary coastline; its map becomes a real endgame route. The boss, Noon Without End, tries to illuminate every hiding place. She learns that darkness can shelter possibility rather than conceal truth.

**Identity:** cyclic buffs and delayed zones. **Resource:** Reverie. Phase advances Dawn → Dusk → Eclipse after every third manual Q; R consumes the current phase instead of advancing it. Phases are clearly shown, never tied to real clock time.

| Skill; baseline | Focus | A | B | C |
|---|---|---|---|---|
| Q Moon Arc: 12 Reverie, returning crescent; return hit 40% damage | Projectile speed | Wide Orbit: wider arc, no return hit | Twin Horizon: slower return has 80% damage, cost +5 | Dreamscar: first hit applies four-second Veil DoT; no return hit |
| W Stillwater Hour: 25 Reverie, 9s cooldown, four-second slow zone | Radius | Long Night: +2s duration, half radius | Walking Midnight: follows owner at half strength | Quiet Chamber: zone grants modest damage reduction; no slow |
| E Borrowed Moment: 20 Reverie, 12s cooldown, short barrier and one-ailment cleanse | Duration | Recollection: records position, second press returns there; no extra invulnerability | Soft Seconds: stronger barrier, no cleanse | Lucid Exit: cleanse two ailments, half barrier |
| R Eclipse: 35 Reverie, 16s cooldown, phase-shaped blast | Radius | Falling Moon: delay +1s, 30% more damage | Moonwell: replace blast with six-second damaging well | Dawnward: replace half damage with a barrier |

- **A Astronomer:** Ordered Sky (phase counter persists between encounters) → Patient Orbit (return Q restores 2 Reverie once/cast) → Star Chart (R displays exact landing zone) → **Total Eclipse** (Eclipse-phase R 30% stronger, other-phase R 15% weaker).
- **B Dreamkeeper:** Slow Breathing (DoT duration +20%) → Dusk Bed (W extends Dreamscar once, +1s) → Gentle Night (gain a small barrier when applying first DoT to an enemy, once/second) → **The Long Dream** (Q DoT cannot crit; R extends rather than bursts it, maximum eight-second duration).
- **C Wayfarer:** Mothpath (command range +20%) → Safe Return (E return removes one slow) → Moon Thread (R costs 5 less after a companion command) → **Between the Ticks** (one extra E charge, 25% longer recharge; no charge reset from any other effect).

Moth C: **Dreamdust**, a targeted slow cloud, four seconds. Bond Dust: wider cloud → one brief enemy accuracy penalty, boss capped. Bond Clock: moth gets a barrier on command → first Q after command advances phase one extra step, once/command.

| Build | Transforms; class; Bond | Guide | Weakness; relic |
|---|---|---|---|
| Eclipse Artillery | B/A/B/A; A4/C3/B1; Clock2/Dust1 | Build phase with Q → hold target in W → delayed Eclipse; hit damage, recovery, defenses | Telegraph and moving targets; **Cracked Orrery** makes R land in two halves with no double proc |
| Endless Dusk | C/A/C/B; B4/A3/C1; Dust2/Clock1 | Lay W → apply Dreamscar → Moonwell and reposition; Veil DoT, duration, sustain | Delayed kills; **Pillow of Unfinished Dreams** moves one well on E but reduces its lifetime |
| Lunar Escort | A/C/A/C; C4/B3/A1; Dust2/Clock1 | Alternate barrier, recall and safe repositioning; recovery, life, barrier effect | Lower boss damage; **Silver Return** grants a weak Moon Arc on E return, without phase or proc generation |

## 4. Ember Sovereign and Cinderling — The Furnace That Refused

**Story.** The red dragon was designed to burn discarded worlds. He discovered that their inhabitants still remembered living. Cinderling hatched from an ember he secretly spared. His quest protects an unstable settlement while dismantling its deletion furnace. The Ash Treasurer offers him unlimited power in exchange for finishing his assignment. He instead learns to spend fire without consuming everything he loves.

**Identity:** close-range fire, venting and commitment. **Heat:** 0–100; baseline Q adds 12, W adds 20, E vents 30, R spends 50 and requires at least 50. Basic restores no Heat. Heat cools 8/second after two seconds without generating it. At 100, Q/W are unavailable for two seconds while Heat drops to 60; movement, basic attack and E remain available. No unavoidable self-damage.

| Skill; baseline | Focus | A | B | C |
|---|---|---|---|---|
| Q Cinder Claw: short-range Physical/Ember sweep, +12 Heat | Radius | Rake: applies three-second bleed; less hit damage | Furnace Grip: all Ember hit, +4 Heat | Ember Reach: longer narrow wave, 20% less damage |
| W Furnace Breath: 3s cooldown, cone, +20 Heat | Radius | Smolder: four-second burn, half hit damage | Bellows: stronger narrow cone, +10 Heat | Kiln: leaves short fire patch, cooldown +2s |
| E Venting Scales: 10s cooldown, vent 30 and gain 15%-life barrier | Duration | Steamguard: barrier +50%, vent only 20 | Scorchvent: weak nearby hit, barrier -50% | Cold Iron: vents 45, no barrier |
| R Worldfire: 14s cooldown, spend 50 Heat on large blast | Radius | Meteor Heart: concentrated single hit, half radius | Ashgarden: burning field, half initial hit | Hearthfire: damage -35%, grant Cinderling a large temporary barrier |

Economy tuning on Q/W reduces generated Heat, not a fictional mana cost; on R reduces required/spent Heat together, floor 40. E uses cooldown recovery.
- **A Incinerator:** Hot Blood (burn duration +20%) → Banked Coals (burn kills prevent cooling for one second, capped) → Cinder Bed (W burn refreshes only its strongest application) → **Ashes Remember** (R refreshes one burn at 50% duration; no new burn stack).
- **B Crucible:** Temper (armor +10%) → Controlled Vent (E also removes one burn) → Furnace Patience (Heat 40–70 grants modest damage reduction) → **Unbroken Kiln** (E barrier stronger; R deals 20% less damage).
- **C Cataclysm:** Heavy Claw (Q hit damage +10%) → Focused Flame (W narrow cone bonus) → Stored Violence (R at 80+ Heat gains 15% more damage) → **The Last Match** (R consumes all Heat for capped extra damage; E recovery slows for four seconds afterward).

Cinderling C: **Kindle**, focused breath on one target. Bond Coal: breath lasts longer → applies one burn. Bond Hearth: command grants pet barrier → pet returns 10 Heat to owner only when below 50, once/command.

| Build | Transforms; class; Bond | Guide | Weakness; relic |
|---|---|---|---|
| Ashgarden | C/A/C/B; A4/B3/C1; Coal2/Hearth1 | Breath burn → claw spacing → R field → vent; Ember DoT, duration, life | Mobile targets, deliberate Heat control; **Unburnt Seed** gives field a longer narrow shape, not more total damage |
| Furnace Guardian | B/C/A/C; B4/A3/C1; Hearth2/Coal1 | Hold moderate Heat, vent before danger, protect pet; armor, barrier effect, recovery | Weak burst; **Scale of Mercy** shares E barrier with pet rather than doubling it |
| Last Match | B/B/B/A; C4/B3/A1; Hearth2/Coal1 | Build 80 Heat → aim R → retreat while recovering; hit damage and efficiency before crit | Missed burst costs momentum; **Ember Debt** lets R spend at 40 Heat but adds four seconds to its cooldown |

## 5. Sally and Spark Imp — The Unscheduled Encore

**Story.** Sally was the carnival's flawless performer, rebuilt until every joke landed. Spark Imp learned to laugh at the wrong moments. Together they discovered an audience that had been applauding for years without remembering why. Her quest returns the stolen final acts to their performers. She defeats the Applause Engine by allowing a show to end. Her joy is exuberant and unruly, not cruelty disguised as comedy.

**Identity:** mechanical candy devices and controlled chain reactions. **Resource:** Fizz. **Setup:** maximum three Gumdrops; each can detonate once. Detonation chains have maximum depth one and cannot regenerate Fizz per child explosion.

| Skill; baseline | Focus | A | B | C |
|---|---|---|---|---|
| Q Sugarshot: 12 Fizz, narrow Physical bolt | Projectile speed | Confetti: three weaker projectiles; shared target hit cap | Caramel: hit slows, damage -15% | Hot Pop: Ember conversion, no slow |
| W Gumdrop: 20 Fizz, 4s cooldown, place a bomb lasting six seconds | Radius | Sticky: attaches to one enemy, half radius | Carousel: bomb becomes a small short-lived turret, cannot detonate | Glaze: detonation leaves slow patch, hit -25% |
| E Emergency Encore: 20 Fizz, 12s cooldown, decoy draws ordinary enemies for two seconds | Duration | Curtain: decoy grants owner barrier but cannot taunt | Double: two weaker decoys, no damage | Last Laugh: decoy bursts once on expiry; no chain triggers |
| R Punchline: 30 Fizz, 10s cooldown, detonate placed bombs; weak standalone blast if none | Radius | Grand Finale: concentrate damage at aim point; cap total at three bombs | Rolling Gag: detonate sequentially, enemies may move out | Intermission: sacrifice one bomb to reduce E remaining cooldown by two seconds, once/cast |

- **A Fireworks:** Better Fuse (bomb lifetime +20%) → Spare Candy (first W after basic costs 5 less) → Bright Timing (manually detonating two bombs restores 5 Fizz once) → **Standing Ovation** (third bomb in a manual R sequence gains 25% more damage; no further chain).
- **B Tinkerer:** Tight Springs (turret duration +20%) → Spare Parts (turret first attack restores 2 Fizz once/turret) → Imp Workshop (command repairs one turret) → **Travelling Show** (one turret follows Spark Imp; maximum two turrets and 20% less turret damage).
- **C Trickster:** Painted Exit (decoy radius +20%) → Sticky Floor (slowed targets take 10% increased Q damage) → Recovery Act (E grants brief movement speed) → **Never the Same Joke** (alternating manual Q/W gives a modest next-cast bonus; repeated skill clears it).

Imp C: **Wind Up**, prime one bomb for faster detonation or repair one turret; without either, throws a small spark. Bond Fuse: prime range +20% → primed bomb gets wider radius, not more single-target damage. Bond Workshop: repair amount +25% → repair also extends duration once by two seconds.

| Build | Transforms; class; Bond | Guide | Weakness; relic |
|---|---|---|---|
| Grand Finale | C/A/A/A; A4/C3/B1; Fuse2/Workshop1 | Place/attach bombs → prime → R → basic during recovery; area hit damage, Fizz sustain, defenses | Setup and empty detonations; **The Unfunny Fuse** cuts fuse delay but lowers blast radius |
| Travelling Carnival | B/B/A/C; B4/C3/A1; Workshop2/Fuse1 | Maintain two turrets and reposition pet; turret damage, duration, resource recovery | Companion retreat disrupts setup; **Pocket Carousel** adds turret turning speed and range but shortens duration |
| Sugar Rush | B/C/B/B; C4/A3/B1; Fuse2/Workshop1 | Alternate Q/W, decoy incoming packs, sequential R; Physical hits, movement, sustain | More actions and less peak burst; **Wrong-Foot Shoes** makes decoy appear behind target but removes its expiry damage |

## 6. Cyberdine and Lens Wisp — The Seam Between Selves

**Story.** Cyberdine's stitched body contains memories from failed restorations. The extra eyes see what each repair tried to hide. Lens Wisp once inspected him for defects; it now records his decisions without correcting them. His quest identifies the people whose memories were used in his repair and gives their stories back. The Seam Surgeon insists that consistency matters more than consent. Cyberdine proves that a person can contain contradiction without being broken.

**Identity:** marks, tethers and defensive resource management. **Resource:** Coherence. **Fray:** one mark per target, four seconds; repeated application refreshes, never stacks. No theme of self-harm is required for his gameplay.

| Skill; baseline | Focus | A | B | C |
|---|---|---|---|---|
| Q Seam Needle: 12 Coherence, Veil projectile, applies Fray | Projectile speed | Unravel: replace half hit with four-second DoT | Stitchshot: pierce two extra targets, damage -20% | Pin: consume Fray for bonus hit, then cannot mark that target for one second |
| W Threadbind: 25 Coherence, 8s cooldown, tether up to two marked enemies | Duration | Web: tether three targets, damage -25% | Anchor: one target, stronger boss stagger | Suture: tether can attach to Lens Wisp; grants modest barrier, no tether damage |
| E Recompose: 20 Coherence, 12s cooldown, 20%-life barrier | Duration | Remember: barrier expiry refunds up to 10 unused Coherence, based on remaining barrier fraction | Reinforce: stronger barrier, duration halved | Release: weaker barrier cleanses two ailments |
| R Open the Seam: 35 Coherence, 16s cooldown, burst along active tethers | Radius | Tear: consume all marks hit, stronger immediate damage | Archive: leave four-second Veil field, half initial damage | Mend: replace half damage with barrier shared between owner and pet |

- **A Unraveller:** Fine Thread (Fray duration +20%) → Loose End (marked kill restores 3 Coherence, maximum 6/second) → Residual Memory (first Q on unmarked enemy adds a small DoT) → **A Thousand Unfinished Selves** (R spreads Fray to two nearby enemies once; no recursive spread).
- **B Archivist:** Clear Witness (mark duration +1s) → Quiet Lens (companion commands cost no class resource) → Recorded Pattern (manual Q after command gains 15% increased hit damage) → **Parallel Account** (W duplicates one weak tether from Wisp, but owner tether damage 20% less).
- **C Restorer:** Strong Seams (barrier effect +10%) → Bound Memory (Coherence above 70 grants modest damage reduction) → Deliberate Repair (E basic recovery improves after three basic attacks, capped once/use) → **Whole Without Perfection** (R cannot consume marks; shared barriers stronger, R damage 25% less).

Lens Wisp C: **Inspect**, applies Fray to aimed target and exposes its next ordinary attack briefly. It does not reveal untelegraphed future boss mechanics. Bond Archive: mark +2s → one weak tether can originate at Wisp. Bond Repair: Wisp barrier on command → command grants owner a small barrier if Coherence exceeds 70.

| Build | Transforms; class; Bond | Guide | Weakness; relic |
|---|---|---|---|
| Unravelling Web | A/A/C/B; A4/B3/C1; Archive2/Repair1 | Mark → tether → field → move; Veil DoT, duration, resource recovery | Requires marks before payoff; **Loose Thread** moves a field with Wisp but shortens its life |
| Surgical Precision | C/B/B/A; B4/A3/C1; Archive2/Repair1 | Inspect → single tether → consume mark Q → rebuild → R; hit damage, efficiency, stagger | Tight single-target loop; **Witness Lens** increases Inspect duration but lowers Wisp personal damage |
| Restitched | B/C/A/C; C4/B3/A1; Repair2/Archive1 | Preserve Coherence, use barriers and pet tether, basic between bursts; life, mitigation, barrier effect | Lower damage; **Unbroken Suture** turns barrier overflow into pet barrier, still subject to combined cap |

## 7. Abyssal Cantor and Reef Lobster — The Voice Below the Loop

**Story.** The Cantor heard a missing beat under an ocean repeating the same wave. Reef Lobster's enormous eyes retained images from every repetition. Together they discover drowned neighborhoods whose residents were declared unnecessary. The Cantor restores their voices without forcing them to sing in unison. The boss is the Metronome Leviathan, which punishes predictable movement. The freed ocean gains tides that no longer occur on command.

**Identity:** waves, pressure and stagger. **Resource:** Pressure. **Soaked:** one four-second debuff; enables interactions but gives no universal free damage multiplier. The humanoid Cantor is a new adaptation of the ocean artwork, not a literal person confirmed in that video.

| Skill; baseline | Focus | A | B | C |
|---|---|---|---|---|
| Q Undertone: 12 Pressure, forward Tide wave, applies Soaked | Radius | Undertow: narrow wave pulls ordinary enemies slightly | Saltbite: replaces half hit with four-second Tide DoT | Spearvoice: narrow faster projectile with 20% more hit damage |
| W Resonant Pool: 25 Pressure, 8s cooldown, four-second pool | Duration | Deepwater: larger pool, slower tick rate; unchanged total damage | Riptide: pool moves slowly forward, shorter duration | Sanctuary: half damage, grants small barrier on entry once/cast |
| E Shellsong: 20 Pressure, 12s cooldown, 20%-life barrier | Duration | Braced Shell: stronger barrier, movement speed -10% while active | Clear Current: half barrier, cleanse two ailments | Shared Shell: divide barrier between owner and Lobster |
| R Breakwater: 35 Pressure, 15s cooldown, line burst, consumes Soaked for stagger bonus | Radius | Hammer Tide: narrow strong impact, no pull | Moonpull: wider ordinary-enemy pull, less damage | Long Refrain: delayed second weaker wave, shared proc budget |

- **A Stormvoice:** Carried Note (Q radius +10%) → Low Chorus (first soaked target hit restores 2 Pressure once/cast) → Resonant Floor (R through pool gains 10% increased damage) → **The Sea Answers** (R repeats at 35% damage after one second; cannot generate resources or more repeats).
- **B Saltkeeper:** Lingering Brine (DoT duration +20%) → Saturated (Soaked duration +1s) → Dissolving Certainty (pool extends Saltbite once by one second) → **An Ocean Remembers** (Saltbite strongest application gains duration from R; R hit damage 30% less).
- **C Reefwarden:** Thick Shell (armor +10%) → Shared Current (Lobster command gives pet a brief barrier) → Firm Ground (barrier active grants modest stagger resistance) → **Unmovable, Not Unfeeling** (Shellsong blocks ordinary knockback; movement penalty +5%, barrier effect +20%).

Lobster C: **Clamping Chorus**, pincer strike with heavy stagger contribution. Bond Pincer: range +20% → consume Soaked for extra stagger. Bond Reef: pet barrier on command → owner gains small barrier when command hits a soaked target, once/command.

| Build | Transforms; class; Bond | Guide | Weakness; relic |
|---|---|---|---|
| Breakwater Hammer | C/A/A/A; A4/C3/B1; Pincer2/Reef1 | Soak → pool → clamp during boss stagger opportunity → R; Tide hit, recovery, life | Burst timing and positioning; **Leviathan Bell** concentrates R but removes its second-wave effects |
| Salt Cathedral | B/A/B/C; B4/A3/C1; Reef2/Pincer1 | Saltbite → stationary pool → R duration → reposition; Tide DoT, duration, Pressure sustain | Enemies leaving pools; **Brine Vessel** stores one unused pool charge but reduces pool duration |
| Reefwarden | A/C/C/B; C4/A3/B1; Reef2/Pincer1 | Soak and clamp, share barriers, pull ordinary enemies off objectives; mitigation, companion stagger, life | Slow clear speed; **Shell of the First Shore** transfers part of owner's barrier to Lobster, never creates extra total barrier |

## Full allocation recipes and build transitions

Every build table gives an exact class allocation (8 points), four transformations and Bond allocation (3 points). The following completes the six-point allocation for every active skill without repeating 84 nearly identical tables:

- **Damage Q and R:** P2/F1/E2 + the listed transformation1 = 6.
- **Area/DoT W:** P1/F2/E2 + transformation1 = 6.
- **Defensive E:** P2/F2/E1 + transformation1 = 6.
- **Support variants replacing at least half a skill's damage:** use P2/F2/E1 + transformation1 instead. P scales that skill's new primary defensive effect, not its removed damage.
- **Sally W turret builds:** P2/F2/E1 + Carousel1. Diamond W and Cyberdine W: P1/F2/E2 + transformation1, where P scales reflected/tether damage, or barrier if the transformation replaces damage. Diamond's baseline Mirror has no independent damage, so its P only scales its reflected-hit coefficient, never the original Q hit.

Buy root P1, F1, E1 first, then the transformation, then fill remaining ranks. Main class path to N4 first, then the listed secondary path to N3, then third-path N1. Story unlocks provide first companion node; buy its endpoint before the other path's first node. Early levels may use a different transformation, but no build requires an unlisted tree connection.

For all 21 builds, the **starter stage** prioritizes usable skill costs, life and a relevant weapon. **Established stage** adds the main transformation and capstone, then applicable damage affixes. **Endgame refinement** adds the optional relic and adjusts defenses for actual encounter damage. Do not equip a relic if losing a sustain or defense affix breaks the loop.

Initial sustain gate: a build must complete its ordinary 20-second rotation with no kill-dependent recovery and at least 10 resource remaining, or have explicitly planned basic-attack recovery gaps. Heat builds must repeat two complete damage/vent cycles without forced overheat unless the player chooses that risk. A boss guide must describe its no-add rotation; map-only kill recovery is never presented as boss sustain.

## Balance rules that protect build depth

1. **Evaluate the pair.** Target baseline companion contribution around 15–25% of combined sustained damage. Pet-investment routes may target 35–45%, paid for through owner damage or other class investment. These are targets, not hidden clamps or promised measurements.
2. **Budget the full loop.** Compare 20-second sustained damage, five-second burst, dangerous time spent stationary, time to recover, and distance safely covered. A build should not lead all five metrics at equivalent equipment and input skill.
3. **Keep starter viability.** Each of the 21 builds must finish the campaign with ordinary items. Relics enable alternatives, not basic functionality.
4. **Defenses need costs.** Large barriers reduce offense, mobility, duration or resource recovery. Life, armor and barriers cannot all scale from one unlimited offensive stat.
5. **No recursive engines.** Tag each event with owner, skill, cast ID, generation, source and damage tags. Generated effects cannot generate new effects unless specifically whitelisted at depth one. Set per-cast limits on resource recovery, healing and repeated target hits.
6. **No hidden conversion multiplication.** Show original damage, conversion, applicable additive bonuses and final multipliers in an advanced tooltip. Damage-over-time and companion scaling remain separate unless a node explicitly links them.
7. **Control does not erase bosses.** Stagger creates brief opportunities. Slow, pull and taunt preserve ordinary-enemy usefulness while respecting boss limits. Companion AI must not path through lethal hazards to obey an old target command.
8. **Measure costs of complexity.** Track action count and missed-combo penalty. Difficult builds may gain flexibility or burst windows, but easy builds remain viable. Do not balance around perfect inputs only.
9. **Readable spectacle.** Local player effects are richer than remote effects. Optional reduced-flash mode preserves hit areas. Enemy hazards render above persistent friendly ground effects.
10. **Informed respecs.** If an allocation removes a required mark, conversion or setup skill, warn in the planner. Allow it deliberately; never silently change the player's loadout.

### Encounter validation matrix

| Scenario | What it tests | Failure worth fixing |
|---|---|---|
| One stationary armored target, 60 seconds, no adds | Sustain and single-target ceiling | Resource collapse disguised by on-kill recovery |
| Moving boss with invulnerability transitions | Recovery and delayed attacks | Entire build loses all stored work every transition |
| Mixed pack with ranged enemies | Clear speed and exposure | One proc chain clears beyond intended range |
| Escort or defend objective | Control and companion utility | Only raw damage builds can succeed |
| Two heavy attacks four seconds apart | Layered defenses and cooldown gaps | Barrier chaining grants practical immortality |
| Companion retreat during burst window | Resilience of pet builds | Character becomes unable to generate its only resource |
| Low-budget versus improved gear | Progression and item dependence | An ordinary missing item disables the central rotation |

Collect time-to-kill, damage taken, resource minimum, pet uptime, actions/minute and failed inputs. Use repeated seeded encounters and publish the equipment preset. Investigate large outliers; do not promise equal scores in every scenario or nerf distinctive strengths merely because they exist.

## Implementation order and scope boundary

1. Keep existing druid gameplay intact. Implement data-driven tags, proc limits and the planner schema in an isolated branch or feature flag.
2. Prototype **Living Orchard**, **Kaleidoscope** and **Grand Finale** first: DoT/companion coordination, geometry, and device setup exercise different systems.
3. Add the four remaining base kits, then one functional build each. Only add secondary transformations when the baseline skill passes its encounter checks.
4. Build story beats around existing courtyard content first, using dialogue and alternate encounter rules before commissioning new zones.
5. Add loadout import/export with a schema version, content version, character ID, node IDs/ranks, relic IDs and prerequisite validation. A guide must record its tested game version and ordinary-gear fallback.

This is a comprehensive first design pass, not a claim of PoE-scale implemented content. Still to specify during prototyping: absolute damage coefficients, full cooldown/duration interactions, animation timings, enemy defenses, acquisition tables and final numerical balance. Existing model studies are not approved final art. No claim is made that all 784 TikTok posts were reviewed.
