# Fretboard Studio

An interactive guitar fretboard built with browser ES modules, accessible HTML, CSS, and Web Audio. Phase 10 completes the redesign with grouped inspector tools, contextual guidance, clearer study/layer feedback, responsive text reflow and measured rendering polish. Theory, practice, Studio, appearance, audio and live input share one workspace. The optional 3D view loads a locally bundled Three.js renderer on demand.

## Develop and verify

Requires Node 24+ and npm. Development dependency versions are pinned in `package-lock.json`.

```sh
npm ci
npx playwright install chromium
npm run build
npm start
```

Open `http://127.0.0.1:3000`. The server serves production `dist`; rebuild after source edits. `PORT` changes the server port. On machines with system Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when running tests instead of installing another browser.

```sh
npm run check       # syntax checks across all production JavaScript modules
npm test            # deterministic unit tests
npm run typecheck   # strict TypeScript checking of JSDoc-typed JavaScript
npm run lint        # ESLint: production code, scripts and tests
npm run build       # clean static output with local import/asset checks
npm run test:e2e    # browser regression tests against dist
npm run validate   # all of the above, in order
```

Unit tests run in one process with isolated fixtures and need no browser or network. Browser tests own a temporary local server and stop it afterward. TypeScript, ESLint, esbuild and Playwright are development tools only. Google Fonts are optional; system fallback fonts work when fonts are unavailable.

## Architecture

`src/` is the editable application source. `dist/` is generated production output for static hosting; never hand-edit it. The build copies browser assets, checks relative references, bundles the 3D renderer with esbuild, and removes obsolete output. Type-only contracts in `src/types/model.ts` are not emitted as JavaScript.

## 2D and 3D fretboards

Use **2D / 3D** beside the note controls, or **View → Model**. The setting is saved with the workspace and supported by undo/redo and scene presets. The 3D view supports background dragging, scroll/pinch zoom and Reset camera. It uses the same playable note buttons, theory layers, input highlights, practice projection and Studio overlays as 2D. Orientation, handedness, visible range, capo, zoom and custom string counts remain available. Model/network/WebGL failures keep the 2D board playable and offer a retry.

`src/assets/fretboard.glb` was exported from the supplied `Fretboard.blend` with Blender 5.2.2. The original neck, top, nut, fret and inlay meshes are retained; wood/metal finishes are applied for browser lighting. Strings are adapted to the selected instrument; necks longer than the source's 24 frets receive an extension. Source meshes remain local, with no CDN request or Blender installation required to run the app. To regenerate the asset with Blender 5.2 or later:

```sh
blender --background --disable-autoexec --python scripts/export-fretboard.py -- path/to/Fretboard.blend src/assets/fretboard.glb
```

- `theory/`: immutable catalogs, pitch/spelling/interval calculations, pattern descriptions, sequences, dynamic fret positions.
- `workspace/`: normalized state, validated immutable actions, selector subscriptions, panel/dialog lifecycle, grouped history, command registry/palette and centralized shortcuts.
- `services/`: separate versioned workspace/practice persistence, validation, migration, recovery and forward-version protection.
- `studio/`: normalized scene/preset data, a bounded local library, complete workspace arrangements and retained-cell annotation/path rendering.
- `practice/`: pure question generation/grading, deterministic adaptive weighting, session timing, statistics, bounded data contracts and temporary board presentation.
- `fretboard/`: pure layer composition, labels, styles/navigation, musical projection and retained DOM rendering; no audio or storage dependency.
- `instrument/`: bounded presets, tuning parsing and configuration.
- `audio/`: interchangeable classic/modeled/local-sample voices, cancellable direction/duration transport, isolated exercise phrases and audio-clock metronome with injectable backends/schedulers.
- `input/`: validated detected-note/source contracts, real Web MIDI and microphone adapters, pure monophonic pitch estimation and stable-note tracking.
- `features/`: explorer/playback adapters, context inspection, command registration and appearance editing.
- `themes/`: eight immutable semantic token presets, validated overrides and appearance import/export; `styles/`: application/fretboard/responsive presentation. Default token CSS is generated from preset data.

See the [pre-implementation audit](docs/ARCHITECTURE-AUDIT.md), [implementation and completion plan](docs/IMPLEMENTATION-PLAN.md), [original-specification coverage audit](docs/SPEC-COVERAGE-AUDIT.md), [Phase 1 handoff](docs/PHASE-1-HANDOFF.md), [Phase 2 handoff](docs/PHASE-2-HANDOFF.md), [Phase 3 handoff](docs/PHASE-3-HANDOFF.md), [Phase 4 handoff](docs/PHASE-4-HANDOFF.md), [Phase 5 plan](docs/PHASE-5-PLAN.md), [Phase 5 handoff](docs/PHASE-5-HANDOFF.md), [Phase 6 plan](docs/PHASE-6-PLAN.md), [Phase 6 handoff](docs/PHASE-6-HANDOFF.md), [Phase 7 plan](docs/PHASE-7-PLAN.md), [Phase 7 handoff](docs/PHASE-7-HANDOFF.md), [Phase 8 plan](docs/PHASE-8-PLAN.md), [Phase 8 handoff](docs/PHASE-8-HANDOFF.md), [Phase 9 plan](docs/PHASE-9-PLAN.md), and [Phase 9 handoff](docs/PHASE-9-HANDOFF.md).

The original seven phases delivered the major systems. Phase 8 implemented reusable theory layers and solfège corrections; Phase 9 completed appearance/theme portability; Phase 10 completed combined-workflow, responsive/accessibility and measured-performance polish. See the [Phase 10 plan](docs/PHASE-10-PLAN.md), [handoff](docs/PHASE-10-HANDOFF.md) and [final coverage of all 39 original sections](docs/FINAL-SPEC-COVERAGE.md).

## Preserved features and scope

All original seven scales and eight chord-tone collections, twelve roots, five tunings, 12/15/24 frets, note/interval labels, all-note mode, left-handed viewing, individual-note audio, scale/arpeggio playback, chord strums, BPM and mute. Help, keyboard navigation, mobile panning and reduced-motion behavior remain available.

Chord-tone maps are distinct from exact-position voicings and shapes. Built-in audio is synthesized; you can also import your own single-note recording. The instrument builder supports 1–16 strings, guitar/bass/custom tunings, 1–36 frets and physical capo positions. Layer controls compose scales, chord/arpeggio tones and custom targets with deterministic priority. The expanded catalogs contain 16 scales and 27 chords. Shapes supports calculated triads and explicit CAGED forms; Progressions connects chord/scale/guide/target maps to playback. CAGED requires six-string Standard tuning; voicing search is bounded. Practice supports fifteen scored fretboard/ear exercises, deterministic adaptive weighting, editable timed sessions, accuracy/weak areas/history/streaks/comparable bests, and a metronome with subdivisions. Unscored study and improvisation blocks track time. Studio saves complete scenes and category presets for instruments, themes, fretboards, visualization maps, practice plans and panel arrangements. Scene application is one undoable action. Live input highlights exact pitches without inventing a physical string or fingering.

Use Practice or Ear Training to configure and start exercises; press M outside editable fields/modals to toggle the metronome. Use Ctrl/Cmd+K to search commands, or the sidebar to choose a view. Click a fret to play and inspect it; open Appearance for theme controls. Desktop panels resize, tablet/mobile panels open as sheets, and focus mode expands the neck. Layers, Instrument and View controls sit beside focus/inspector controls. Right-click a note, or use Shift+F10, for context actions. Undo/redo covers musical, layer, instrument, view, theme and progression edits while retaining audio preferences and panel settings. Changing musical context cancels playback.

## Inspector guidance and final polish

The inspector's **Tools** selector groups fourteen destinations into Study, Build the board, Practice & sound, and Save & recall. Its help button opens relevant guidance with direct links to existing tools. Selecting a tool uses the same lifecycle as its sidebar entry; opening Live Input requests no device permission. Native keyboard selection and modal focus restoration are preserved.

Version **1.10.1** centralizes sidebar selection: one Workspace destination is highlighted, including Progressions. Shapes/arpeggio settings no longer leave stale highlights after switching destinations. Inspect controls and the Playback toggle reflect their separate panel states; closing a sheet retains the current Workspace selection. Active quizzes retain their Practice/Ear selection while auxiliary inspectors are open.

Version **1.10.3** replaces **Glass blur** with a **Glass effect** intensity control. Higher percentages progressively increase translucency, reflective highlights, edge definition, tint saturation and background softness. Soft ambient lighting replaces the diagonal texture. Panel opacity sets the base tint and is preserved as intensity changes; zero restores ordinary surfaces. Text, controls and notes stay sharp. Existing appearance saves and exports retain their opacity/blur fields, with the old 0–20 blur value mapped to 0–100% intensity.

Active study constraints appear beside the board. **Show whole pattern** clears study filters and progression preview as one undoable edit, retaining independent layers and board choices. Empty maps explain visibility/solo/range recovery. **Selected note** names the display layer and other matching layers, complementing labels, root outlines and overlap dots.

To reproduce the large-board profile after starting the local preview, run `node scripts/profile-workspace.mjs docs/PHASE-10-PERFORMANCE.json`. It measures pure projection, retained rendering/layout and production root changes, including a comparison with palette reuse disabled. See the Phase 10 handoff for method and limits.

## Local preferences

`fretboard-studio.workspace` contains `{version: 8, state: ...}`. It remembers selection, tuning, fret count, handedness, labels, show-all, tempo, mute, direction, note duration, classic/modeled sound, appearance/token overrides, theme defaults and board ownership, saved themes, layers including degree/string filters and CAGED recipes, instrument/view and theory configuration, progression structure, Studio overlays, sidebar/panel preferences and bounded recent scale/chord choices. Versions 1–7 migrate without losing prior musical settings. Undo history, selected fret, focus mode, playback position, DOM nodes, timers, device IDs, capture streams, MIDI access, decoded recordings and transient highlights are never persisted.

Settings stay on this browser/device; they are not cloud-synced. Invalid data is repaired or reset with a local `.recovery` copy when possible. If backup fails, the original remains untouched and the session is read-only. Newer schema versions are never overwritten. Storage failures show a status message without breaking exploration. Version 0 migration is a documented development format; the original published app had no persistence.

Practice is stored separately at `fretboard-studio.practice` as `{version: 1, data: ...}`. Settings, the current session plan, rhythm preferences, seeded selection, up to 3,000 graded attempts and 200 run summaries persist. Active questions, answers in progress, timers, playback and metronome running state are transient. First answers, reveals, skips and timeouts each count once. Replays are unscored. Accuracy and adaptation use documented deterministic calculations; they do not use AI. CAGED quizzes require six-string Standard tuning; triads require a complete eligible three-string group. Sessions pause when the page becomes hidden and do not restart after reload.

## Studio and saved configurations

Open **Studio** in the sidebar or command palette. Configure your map using the existing Layers, Instrument, View, Appearance and theory controls. Save a **Scene** for the complete setup, or choose a category to save only that part. Open **Library** to search, apply, rename, replace from the current setup, duplicate, delete, import or export. Imported entries receive fresh IDs and do not replace existing saves.

Scenes capture musical selections, theory filters, progression, instrument, note styles, view, layers, appearance, tempo, panel arrangement and overlays. They exclude mute, libraries, recent history, live playback, selected fret and practice results. New fretboard presets capture view and layers; imported older view-only fretboard presets continue to apply only the view. Visualization presets capture layers and musical context. Practice presets capture settings, blocks, tempo, meter and subdivision; applying them retains results and never starts a timer. Workspace arrangements offer Learning, Minimal fretboard, Theory, Practice and Performance starting points, plus custom saved layouts. Panel resizing and mobile sheets use the existing shell.

Right-click a fret and choose **Annotate this position**, or use Studio's position picker. Paths connect an ordered list of physical positions. Input uses one-based string:fret pairs such as `1:5, 2:8`; string 1 is the first displayed instrument string, even for custom/reentrant tuning. Labels and paths have text equivalents, color and visibility controls, and support undo. Out-of-range positions remain saved; hidden intermediate positions break a path. Quiz mode conceals all Studio overlays until practice ends. Escape cancels position picking.

The library is stored separately at `fretboard-studio.studio` as `{version: 3, entries: ...}`. Entries and portable files also use version 3; version 1 and 2 imports/libraries remain supported. Older installations cannot read new exports. Limits: 96 entries, a 2 MB portable library, 64 overlays per scene and 32 points per path. Versioned JSON exports move these settings between devices; there is no cloud sync. Storage recovery and future-version protection follow the workspace persistence policy, including protection for future entry versions inside an otherwise current library. Export if your browser reports a save failure. Browser tests on Windows can use installed Edge via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if a downloaded browser cannot launch.

## Hosting and rollback

This local transfer contains source and generated output, but no `.git` repository or `.openai/hosting.json` cloud identity. Phase 10 is available locally; it has not been published to the previous cloud site. Keep source and its generated `dist` together when backing up or publishing. Historic baseline IDs in earlier phase documents describe the former cloud repository, not commits available in this folder. User preferences on the cloud site's browser origin do not automatically transfer to localhost. Phase 10 imports earlier Studio and appearance exports; its exports require Phase 9 or a later compatible installation.

## Portable appearance and board styles

Open **Appearance** and enable **Color notes by interval**, then expand **Design tokens → Interval colors** to customize the twelve relative semitone colors. Explicit layer colors take priority, followed by emphasized roots, interval colors and existing scale/chord role colors. Each layer uses its own root. Labels and root outlines remain available. Fretboard tokens separately color normal and marked fret numbers without changing application text.

Expand **Theme marker and inlay defaults** to customize marker shape/style, size, label size, opacity, border, glow, animation, custom-label fallback and inlay style. These defaults travel with named themes, appearance exports and Studio theme presets. **Use token sizes** and **Token shape** follow the theme's size/radius tokens. Appearance files use version 3 and still import versions 1 and 2.

In **View**, **Use theme marker defaults** controls marker inheritance; the inlay selector has a separate **Theme default** choice. New boards inherit. Editing a marker control copies the effective style into a board override, which theme changes preserve. Null sizes and Token shape still follow their tokens. Old saved views retain their explicit marker/inlay choices. **Use theme defaults on this board** resets only style ownership; **Copy board style to theme** saves the effective board style into defaults. Both support undo and preserve range, labels, instrument and layers. Scenes retain defaults and ownership together. Theme presets change only appearance.

## Composing reusable theory maps

Open **Layers**. **Add whole pattern** copies the root/formula without the active study filters. **Add 3rd / 7th targets** creates an editable chord layer with those formula degrees selected (minor seventh is the starting chord when exploring scales). Change its root/chord without reselecting pitches. Missing degrees stay selected but produce no notes until a formula includes them. Formula-degree buttons group repeated degrees in symmetric scales. Selected string filters and first/last bounds intersect.

**Add CAGED map** creates an independent E minor map. Choose its root, shape quality, C/A/G/E/D toggles, occurrence and scale/shape/arpeggio/root components. Each layer retains its own color, opacity, priority, labels and bounds. The chosen occurrence follows root transposition. Complete shapes are calculated on the instrument before clipping the visible range; unsupported tuning/capo produces a visible explanation and preserves the recipe.

Expand **Capture the current study map**. **Save filtered map** retains editable degree/string/range filters or CAGED settings. Displayed triads, voicings, 3NPS and comparison maps use fixed-position capture. **Freeze positions** always saves the study map's visible physical positions and labels; unrelated user layers are excluded. Fixed positions stay at the same frets after tuning changes, and their captured custom labels stay unchanged until you choose another label mode. Use a complete Scene when you want to retain the original instrument too.

For the original advanced example, select A Dorian; add a whole pattern and change its type to chord/Am7; add third/seventh targets; add a CAGED E minor map and choose its first occurrence. Set the visible fret range in View, then save a Scene. Each map can be edited, reordered, hidden, duplicated or soloed independently.

Solfège follows the spelled scale/chord degree: raised fourth **Fi**, raised fifth **Si**, lowered fifth **Se**, lowered sixth **Le**. Compound extensions use the corresponding simple degree. Rare alterations without a standard syllable retain an accidental before the base syllable; chromatic/all-note maps retain the chromatic fallback.

## Playback and live input

Open **Audio settings** in Playback or search **Open playback and sound**. Direction applies to scales, arpeggios and progression arpeggios; chords retain written order. Note duration ranges from 0.1 to 3 seconds and can overlap the next beat. The classic synth remains the default; the modeled voice uses a plucked-string delay model with deterministic excitation. No recorded guitar library is bundled. Modeled playback can fall back to classic synthesis if initialization fails.

For a local recording, expand **Use your own guitar recording**, set the recorded note's MIDI pitch, then import audio. The browser decodes and transposes it in memory; it is never uploaded or saved in scenes. Limits are 16 MB, mono/stereo, 0.05–30 seconds and a non-silent signal. Wide transpositions alter timbre, and short recordings end early. Clear or reload removes it. Ear training uses the persistent classic/modeled preference through its separate channel; recordings only affect exploratory playback.

Open **Live Input**, choose MIDI or microphone/audio interface, then click **Connect input**. MIDI handles polyphonic note events, channels, velocity-zero releases, panic messages, device selection and hotplug. It visualizes note-on/off directly; sustain-pedal emulation and MIDI output are not implemented. A pitch-to-MIDI guitar/interface works when it exposes a browser MIDI input. An audio interface works when exposed as a microphone device.

Microphone estimation is experimental and monophonic, with an intended B0–C7 range. It gates quiet signals, requires stable frames and releases on silence. Chords, noise, attacks and strong harmonics can cause missed pitches or octave errors. Confidence measures periodicity rather than proven correctness. Test signals validate the algorithm; no physical guitar or interface accuracy claim is made. Headphones reduce pickup of playback from speakers.

Live pitches show a **LIVE** marker on every matching visible fret, plus pitch/octave, frequency and source; microphone events also show estimated cents and confidence. Pitch alone cannot identify a string/fret. Input never generates speaker playback or grades quizzes. Source changes, disconnection, hidden pages and practice start clear input and release capture. Opening controls never requests permission, and reload never reconnects. Use localhost or HTTPS for browser device APIs; capability and permissions depend on the browser. Chromium/Edge are the tested browser family.
