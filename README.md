# Conduct prototyping

A toolkit for prototyping a smart device's **form** and **conduct** together: what it looks like, and how it speaks and behaves. You describe a device in plain words, an AI agent writes it down, and a player on your laptop performs it with voices, a screen and a light.

Three nouns are all you need:

- **Device**: a form plus a conduct. One folder in `design/devices/`.
- **Situation**: what happens around the device, written as a few beats. One file in `design/situations/`.
- **Performance**: a device in a situation, written as a screenplay and played by the player.

## What you need

- A laptop with **Codex** or **Claude Code**.
- **Node.js 18 or newer**, for the preview and the check (`node --version` tells you). Without Node you can still play: open `system/player.html` in Chrome or Edge and use **Open folder** to choose this folder.
- ChatGPT or Gemini for rendering your form (see `system/FORM.md`).

## Start

1. Download this folder, or ask your agent to clone the repository.
2. Open the folder in Codex or Claude Code.
3. Start the player:

   ```
   node system/bin/preview
   ```

   It opens the worked example in your browser: two bedside devices on a hospital ward at night. Play both, swap their forms, and drag along the timeline.
4. Read `BRIEF.md` and start talking to your agent: describe a device, a situation, or what you want to see.

## Folders

- `system/` is the rules: vocabulary, notation, procedures, player and scripts. Do not edit it. When it is updated during the course, replace this folder only.
- `design/` is yours. To keep a version of a device, copy its folder (`device-c` → `device-c-v2`).

## Checking a performance

```
node system/bin/check
```

lists every error and warning with its file and line number. Your agent runs it after every performance it writes.
