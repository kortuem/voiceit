# Instructions for the agent

You are helping a designer or team prototype a physical product that listens and speaks (a smart speaker, for example), with VoiceIt. They describe the form and intended behaviour; you help write behaviour scripts, which VoiceIt plays. They judge the product's character from the form and behaviour together. These instructions apply to independent projects as well as teaching. In the procedures below, "the group" also means an individual designer.

Do not assume a course assignment, hospital setting, two-product comparison or stereotype exercise. Ask for the user's own context when needed. [CLASSROOM.md](CLASSROOM.md) holds optional teaching guidance; use it only when the user asks for that activity. An AI assistant is optional for authoring; VoiceIt playback itself is scripted, not a live AI conversation.

## Three rules

1. **Read the VoiceIt instructions before you write a script.** For every behaviour script, read `system/SCREENPLAY.md` and `system/VOCABULARY.md`, and the procedure in `system/operations/` for the task at hand. You do not need to read VoiceIt's code.
2. **Write only in `design/`.** Never change `system/` (VoiceIt, its tools and these procedures) or `examples/` unless the group explicitly asks you to.
3. **Run the check after every behaviour you write or change**, and fix all errors before you report back:

   ```
   node system/bin/check
   ```

## Repository map

- `system/SCREENPLAY.md`: the notation. `system/VOCABULARY.md`: the available screen components, lights, sounds and voices. `system/FORM.md`: from sketch to rendered form. `system/BOUNDARIES.md`: the limits.
- `system/operations/`: the procedures you follow. The group need not name them; pick the one that fits.
  - `write-behaviour.md`: the group describes how their product should behave.
  - `revise.md`: the group wants a script changed after playing it ("it talks too much", "it should wait").
  - `check.md`: the group asks whether their scripts are correct, or has edited a script by hand.
- `design/forms/`: the form images, one per form.
- `design/behaviours/`: the group's behaviour scripts, one file each.
- `examples/`: the worked examples, numbered simplest first (a kitchen timer; Lumo calling the nurse; the Night light and the Host in the same night; the Night light at visiting hour; as forms, a hand sketch and a rendering made from it). Never change these files. To start from an example, copy it into `design/behaviours/` (or `design/forms/`) and change the copy.
- `design/notes.md`: the group's observations.

## Authoring requests

The tutorial (`TUTORIAL.md`) teaches the group three phrases. Recognise them, and the same requests in other words:

- **"New behaviour script: …"**, usually with the group's paper plan: follow `write-behaviour.md`. The plan leads. Read back first; write nothing yet.
- **"Go"** (or "fine", "yes") after a read-back: write the script, check it, report.
- **"Check our scripts"** or **"Check <name>"**: follow `check.md`.

The group phrases everything else in their own words:

- A remark about a script after playing it ("it talks too much", "it should wait for the doctor"): follow `revise.md`.
- Starting from an example: copy the file from `examples/` into `design/behaviours/` (or `design/forms/`), unchanged, and say where it is.
- Comparing a character's scripts: say where the product's manner differs from one script to the next. Change nothing.
- Saving a version, or getting a tool update: see Git below.

## Changing VoiceIt itself

The group may ask you to change VoiceIt itself: a feature, or how something works. Rule 2 allows this when the group explicitly asks for a change to VoiceIt.

- Suggest committing their work first, so they can go back.
- Make the smallest change that does what they asked, and keep existing scripts and examples working.
- Afterwards run `node --test system/test/voiceit.test.js` and `node system/bin/check`, and fix what fails. Ask the group to reload VoiceIt, try the change, and play their own scripts and an example.
- Say what you changed, file by file. The change runs only in VoiceIt on this laptop (`node system/bin/preview`), not in VoiceIt online.

## Git

Check whether the folder is a Git clone or a downloaded ZIP before suggesting Git commands. A ZIP has no repository history. The user may be new to Git; explain briefly what you do. Review intended files before committing or sharing; do not include private material merely because it is in the project folder.

- Commit only when the group asks, with a short message that says what changed in their design. If Git asks for a name and e-mail, ask the group for them.
- Pull updates in a clone only when asked, with `git pull --no-rebase` (it merges the tool update with the group's commits). If a pull runs into a conflict, stop, explain it in plain words, and ask before resolving anything. For a ZIP, extract the new download separately and preserve the old folder and the user's work.
- Never push, force, reset, rebase or delete branches unless the group explicitly asks for that exact step.

## Playing

`node system/bin/preview` starts VoiceIt on this laptop and opens it in the browser. If it is already running, VoiceIt shows new and changed scripts and forms within a few seconds.

If the group cannot run Node, they use VoiceIt online (https://kortuem.github.io/voiceit/) and open their folder there. Then you cannot run the check: read each script carefully against `SCREENPLAY.md` and `VOCABULARY.md`, say so, and ask the group to read you the problems VoiceIt marks in the script column.
