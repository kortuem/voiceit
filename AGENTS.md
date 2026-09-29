# Instructions for the agent

You are helping a group of design students prototype a physical product that listens and speaks (a smart speaker, for example), with VoiceIt. They sketch its form and say how it should behave; you write the behaviour down as a behaviour script that VoiceIt plays. The group judges the character that comes across.

## Three rules

1. **Read `system/` before you write anything.** Start with `system/SCREENPLAY.md` and `system/VOCABULARY.md`, then the procedure for the task at hand.
2. **Write only in `design/`.** Never change `system/` (VoiceIt, its tools and these procedures) or `examples/` unless the group explicitly asks you to.
3. **Run the check after every behaviour you write or change**, and fix all errors before you report back:

   ```
   node system/bin/check
   ```

## What is where

- `BRIEF.md`: the current assignment: the setting, the people and what to make.
- `system/SCREENPLAY.md`: the notation. `system/VOCABULARY.md`: everything a product can show, light, sound and say with. `system/FORM.md`: from sketch to rendered form. `system/BOUNDARIES.md`: the limits.
- `system/operations/`: the procedures you follow. The group need not name them; pick the one that fits.
  - `write-behaviour.md`: the group says how their product should behave.
  - `revise.md`: the group wants a script changed after playing it ("it talks too much", "it should wait"). Before changing anything, say in one sentence whether the change is to this moment or to the character, then follow the procedure.
  - `check.md`: the group asks whether their scripts are correct, or edited a script by hand. Run the check and explain every problem in plain words, with its line.
- `design/forms/`: the form images, one per form.
- `design/behaviours/`: the group's behaviours, one script each.
- `examples/`: the worked example (the Host and the Night light; as forms, a hand sketch and a rendering made from it). Never change these files. To start from an example, copy it into `design/behaviours/` (or `design/forms/`) and change the copy.
- `design/notes.md`: the group's observations.

## What the group says

The tutorial (`TUTORIAL.md`) teaches the group three phrases. Recognise them, and the same requests in other words:

- **"New behaviour script: …"**: follow `write-behaviour.md`. Read back first; write nothing yet.
- **"Go"** (or "fine", "yes") after a read-back: write the script, check it, report.
- **"Check our scripts"** or **"Check <name>"**: follow `check.md`.

Everything else arrives in the group's own words:

- A remark about a script after playing it ("it talks too much", "it should wait for the doctor"): follow `revise.md`.
- Starting from an example: copy the file from `examples/` into `design/behaviours/` (or `design/forms/`), unchanged, and say where it is.
- Comparing a character's scripts: say where its manner differs from one to the other. Change nothing.
- Saving a version, or getting a course update: see Git below.

## Git

The folder is a Git repository. The group may be new to Git; explain briefly what you do.

- Commit only when the group asks, with a short message that says what changed in their design. If Git asks for a name and e-mail, ask the group for them.
- Pull updates only when asked, with `git pull --no-rebase` (it merges the course update with the group's commits). If a pull runs into a conflict, stop, explain it in plain words, and ask before resolving anything.
- Never push, force, reset, rebase or delete branches unless the group explicitly asks for that exact step.

## Playing

`node system/bin/preview` starts VoiceIt on this laptop and opens it in the browser. If it is already running, VoiceIt shows new and changed scripts and forms within a few seconds.
