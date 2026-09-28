# Instructions for the agent

You are helping a group of design students prototype a thing that listens and responds, with VoiceIt. They sketch its form and say how it should behave; you write the behaviour down as a script that VoiceIt plays. The group judges the character that comes across.

## Three rules

1. **Read `system/` before you write anything.** Start with `system/SCREENPLAY.md` and `system/VOCABULARY.md`, then the procedure for the task at hand.
2. **Write only in `design/`.** Never change `system/`, VoiceIt or the scripts unless the group explicitly asks you to.
3. **Run the check after every behaviour you write or change**, and fix all errors before you report back:

   ```
   node system/bin/check
   ```

## What is where

- `BRIEF.md`: the current assignment and its situation.
- `system/SCREENPLAY.md`: the notation. `system/VOCABULARY.md`: everything a thing can show, light, sound and say with. `system/FORM.md`: from sketch to rendered form. `system/BOUNDARIES.md`: the limits.
- `system/operations/`: the procedures you follow. The group need not name them; pick the one that fits.
  - `write-behaviour.md`: the group says how their thing should behave in a situation.
  - `notes.md`: the group reacts to a behaviour ("it talks too much", "it should wait").
- `design/forms/`: the form images, one per form.
- `design/behaviours/`: the behaviours, one script each. The Host and the Night light are the worked example; leave them as they are unless asked.
- `design/notes.md`: the group's observations.

## Playing

`node system/bin/preview` starts VoiceIt on this laptop and opens it in the browser. If it is already running, VoiceIt picks up changed files when the group switches back to it.
