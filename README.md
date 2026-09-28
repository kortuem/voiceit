# VoiceIt

Prototyping things that listen and respond.

A lamp, a bedside unit, a car: any object can now be given an ear and a voice. How it should behave is hard to judge on paper; it has to be seen and heard, in time, among people. VoiceIt stages it before the thing exists.

- **Form**: what the thing looks like. You sketch it on paper and have it rendered. One image in `design/forms/`.
- **Behaviour**: how it acts in one situation. You say it in your own words; your AI agent writes it as a script. One file in `design/behaviours/`.
- **Character**: what comes across when a form and a behaviour are played together. It is not written down; it is what you judge. Does the behaviour fit the form? Is it the same character from one situation to the next?

## What you need

- A laptop with **Codex** or **Claude Code**.
- **Node.js 18 or newer**, for VoiceIt and the check (`node --version` tells you). Without Node you can still play: open `system/voiceit.html` in your browser and use **Open folder** to choose this folder.
- ChatGPT or Gemini for rendering forms (see `system/FORM.md`).

## Start

1. Download this folder, or ask your agent to clone the repository.
2. Open the folder in Codex or Claude Code.
3. Start VoiceIt:

   ```
   node system/bin/preview
   ```

   It opens the worked example in your browser: two characters, the Host and the Night light, on a hospital ward at night. Play both, try them with the other form, and compare them in the Compare tab.
4. Read `BRIEF.md` and start talking to your agent.

## Folders

- `system/` is the tool: notation, vocabulary, procedures, VoiceIt itself and the scripts. Do not edit it. When it is updated during the course, replace this folder only.
- `design/` is yours: forms, behaviours and your notes. To keep a version, copy a file.

## Checking a behaviour

```
node system/bin/check
```

lists every error and warning with its file and line number. Your agent runs it after every behaviour it writes.
