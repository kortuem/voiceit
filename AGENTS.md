# Instructions for the agent

You are helping a group of design students prototype a physical product that listens and speaks (a smart speaker, for example), with VoiceIt. The group sketches the product's form and says how the product should behave; you write that behaviour as a behaviour script, which VoiceIt plays. The group then judges the product's character from the form and the behaviour together.

## Three rules

1. **Read the VoiceIt instructions before you write a script.** For every behaviour script, read `system/SCREENPLAY.md` and `system/VOCABULARY.md`, and the procedure in `system/operations/` for the task at hand. You do not need to read VoiceIt's code.
2. **Write only in `design/`.** Never change `system/` (VoiceIt, its tools and these procedures) or `examples/` unless the group explicitly asks you to.
3. **Run the check after every behaviour you write or change**, and fix all errors before you report back:

   ```
   node system/bin/check
   ```

## Repository map

- `BRIEF.md`: the current assignment: the setting, the people and what to make.
- `system/SCREENPLAY.md`: the notation. `system/VOCABULARY.md`: the available screen components, lights, sounds and voices. `system/FORM.md`: from sketch to rendered form. `system/BOUNDARIES.md`: the limits.
- `system/operations/`: the procedures you follow. The group need not name them; pick the one that fits.
  - `write-behaviour.md`: the group describes how their product should behave.
  - `revise.md`: the group wants a script changed after playing it ("it talks too much", "it should wait").
  - `check.md`: the group asks whether their scripts are correct, or has edited a script by hand.
- `design/forms/`: the form images, one per form.
- `design/behaviours/`: the group's behaviour scripts, one file each.
- `examples/`: the worked examples, numbered simplest first (a kitchen timer; Lumo calling the nurse; the Night light and the Host in the same night; the Night light at visiting hour; as forms, a hand sketch and a rendering made from it). Never change these files. To start from an example, copy it into `design/behaviours/` (or `design/forms/`) and change the copy.
- `design/notes.md`: the group's observations.

## Student requests

The tutorial (`TUTORIAL.md`) teaches the group three phrases. Recognise them, and the same requests in other words:

- **"New behaviour script: …"**: follow `write-behaviour.md`. Read back first; write nothing yet.
- **"Go"** (or "fine", "yes") after a read-back: write the script, check it, report.
- **"Check our scripts"** or **"Check <name>"**: follow `check.md`.

The group phrases everything else in their own words:

- A remark about a script after playing it ("it talks too much", "it should wait for the doctor"): follow `revise.md`.
- Starting from an example: copy the file from `examples/` into `design/behaviours/` (or `design/forms/`), unchanged, and say where it is.
- Comparing a character's scripts: say where the product's manner differs from one script to the next. Change nothing.
- Saving a version, or getting a course update: see Git below.

## Git

The folder is a Git repository. The group may be new to Git; explain briefly what you do.

- Commit only when the group asks, with a short message that says what changed in their design. If Git asks for a name and e-mail, ask the group for them.
- Pull updates only when asked, with `git pull --no-rebase` (it merges the course update with the group's commits). If a pull runs into a conflict, stop, explain it in plain words, and ask before resolving anything.
- Never push, force, reset, rebase or delete branches unless the group explicitly asks for that exact step.

## Playing

`node system/bin/preview` starts VoiceIt on this laptop and opens it in the browser. If it is already running, VoiceIt shows new and changed scripts and forms within a few seconds.

If the group cannot run Node, they use VoiceIt online (https://kortuem.github.io/voiceit/) and open their folder there. Then you cannot run the check: read each script carefully against `SCREENPLAY.md` and `VOCABULARY.md`, say so, and ask the group to read you the problems VoiceIt marks in the script column.
