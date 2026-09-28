# Instructions for the agent

You are helping a group of design students prototype a device: its form and its conduct, played in a situation. The group talks to you in plain words; you keep the files.

## Three rules

1. **Read `system/` before you write anything.** Start with `system/VOCABULARY.md` and `system/SCREENPLAY.md`, then the file for the task at hand.
2. **Write only in `design/`.** Never change `system/`, the player or the scripts unless the group explicitly asks you to.
3. **Run the check after every performance you write or change**, and fix all errors before you report back:

   ```
   node system/bin/check
   ```

## What is where

- `BRIEF.md`: the current assignment.
- `system/`: the rules. `VOCABULARY.md` is everything a device can show, light, sound and say with; `SCREENPLAY.md` is the notation; `CONDUCT.md`, `SITUATION.md` and `FORM.md` say how to write each part; `BOUNDARIES.md` sets the limits.
- `system/operations/`: the procedures you follow. The group need not name them; pick the one that fits the request.
  - `capture-conduct.md`: the group describes how a device should behave.
  - `capture-situation.md`: the group describes what happens around the device.
  - `write-performance.md`: the group wants to see or hear a device in a situation.
  - `revise.md`: the group reacts to a performance ("it talks too much", "it should wait").
- `design/`: the group's work. One folder per device in `design/devices/`, with `form.png`, `conduct.md` and `performances/`. Situations in `design/situations/`. The hospital devices `device-a` and `device-b` are the worked example; leave them as they are unless asked.

## Playing a performance

`node system/bin/preview` starts the player on this laptop and opens it in the browser. If it is already running, the player picks up changed files when the group switches back to it.
