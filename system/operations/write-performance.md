# Procedure: write a performance

**Purpose:** play one device's conduct through one situation, as a screenplay the player can perform.
**Reads:** `design/devices/<device>/conduct.md`; `design/situations/<situation>.md`; `system/SCREENPLAY.md`; `system/VOCABULARY.md`; the worked example in `design/devices/device-a` and `device-b` for tone and density.
**Writes:** `design/devices/<device>/performances/<situation>.md`.

## Steps

1. **Read the conduct and the situation in full.** If either is missing, offer to capture it first.
2. **Check before overwriting.** If the performance file already exists, write over it without asking only when *both* hold: the group has just asked for this file to be written again, and the file has not changed since you last wrote it in this conversation. Otherwise, it may contain hand edits: show what is there, and ask whether to overwrite it, revise it (`revise.md`), or save the new version under another name.
3. **Plan beat by beat.** For each beat in order, decide what this device does according to its rules: whether it speaks, what it shows, how the light changes. Every beat must happen, in order. The device may change how a beat goes, never skip it.
4. **Write the screenplay** in the notation of `SCREENPLAY.md`:
   - front matter `device: <folder name>` and `situation: <situation file name>`;
   - only the components, light colours, modifiers and sounds in `VOCABULARY.md`;
   - speakers are `DEVICE` and the names in the situation's `people`;
   - cues come before the line they belong to (a SCREEN cue after the device's line appears only during the next line);
   - silence is written: `(beat)`, `(pause n)`;
   - each TOUCH picks an option that is on the screen at that moment;
   - roughly one to two minutes when played; one event per line.
5. **Stay with the rules.** Every device line and cue should be explainable by a rule in `conduct.md`. If the situation forces a choice the rules do not cover, make the simplest choice and tell the group afterwards: that gap is a design question.
6. **Run** `node system/bin/check <the file>` and fix **all errors**. Read the warnings and fix them unless they are intended.
7. **Report**: the check result and the playing time, which beat shows the conduct most clearly, and any gap in the rules you had to fill. Remind the group that the player picks up the file when they switch back to it (`node system/bin/preview` if it is not running).

## Never

- Use a component, colour, sound or voice that is not in `VOCABULARY.md`, or invent new notation.
- Drop or reorder beats.
- Overwrite a file that may contain hand edits without asking.
- Report back before the check passes without errors.
- Change `conduct.md` or the situation while writing a performance. If one of them should change, say so and use `revise.md` or the capture procedures.
