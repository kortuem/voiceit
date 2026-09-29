# Changelog

What changed from one version of VoiceIt to the next, newest first. Versions below 1.0 are early releases: things may still change between them. Each version is also a Git tag (`v0.2.0`), so any version can be looked at again on GitHub.

For maintainers: when releasing, set `VERSION` in `system/voiceit.js`, add an entry here with the same number, and tag the commit. The tests check that the two numbers match.

## 0.2.2 (29 September 2026)

- VoiceIt recognises two more Mac voices by their register: Jamie (low, about 99 Hz) and Stephanie (high, about 203 Hz), measured from their speech. With Jamie (Premium) installed, the product's low voice uses it.

## 0.2.1 (29 September 2026)

- **Better voices on a Mac.** VoiceIt no longer uses the Mac's novelty voices (Albert, Bubbles, Zarvox and others); before, the product's low voice could sound like a raspy robot. Premium and enhanced voices are used first when a laptop has them, the older robotic voices last. Tip: install a few premium English voices (System Settings > Accessibility > Spoken Content > System voice > Manage Voices) to hear the scripts much more naturally.

## 0.2.0 (29 September 2026)

The first version for testing with students, as VoiceIt.

- **Forms and behaviour scripts** are two separate pools in `design/forms/` and `design/behaviours/`: any script can be played with any form. A script names its character (`character:`), its voice, an optional `note` for the list, and the people present.
- **The VoiceIt page** has four tabs: Play, About, Literature and Setup.
  - A list of behaviour scripts, yours first and newest first, then the examples. Each row shows the character, the note, the approximate length and the rhythm of the script.
  - A stage with the form, the screen and the light side by side, and thumbnails to switch forms.
  - A timeline with a lane for each person, the product, the screen, the light and sound.
  - The script beside the stage, following playback; click a line or the timeline to jump there.
  - Play, Pause, Step and Restart, and **Watch** to fill the window for presenting.
  - New and changed files appear within a few seconds, without reloading.
- **The check** (`node system/bin/check`) reports errors and warnings with line numbers, in plain words. It uses the same code as the page, so what it accepts is exactly what plays.
- **Instructions for the AI coding assistant**: `AGENTS.md` and three procedures, for writing, revising and checking a script. The assistant reads back before writing and waits for "Go".
- **Documents**: README, a step-by-step tutorial, the brief (visiting hour on ward 4), the notation, the vocabulary, form rendering and boundaries.
- **Examples**: three scripts (the Host and the Night light at night on ward 4, and the Night light at visiting hour) and two forms (a bedside unit and a lamp).
- Tested in Chrome on macOS only.

## 0.1.0 (28 September 2026)

An internal prototype with a different structure, before the name VoiceIt. Replaced entirely by 0.2.0. Tagged `v0.1.0`.
