# VoiceIt

Prototyping things that listen and respond.

A lamp, a bedside unit, a car: any object can now be given an ear and a voice. How it should behave is hard to judge on paper; it has to be seen and heard, in time, among people. VoiceIt stages it before the thing exists.

- **Form**: what the thing looks like. You sketch it on paper and have it rendered. One image in `design/forms/`.
- **Behaviour**: how it acts in one situation. You say it in your own words; your AI agent writes it as a script. One file in `design/behaviours/`.
- **Character**: what comes across when a form and a behaviour are played together. It is not written down; it is what you judge. Does the behaviour fit the form? Is it the same character from one situation to the next?

## What you need

- The **Claude desktop app** (its **Code** tab) or the **Codex** app, signed in. Both work the same way here; this guide calls them "your agent".
- **Git**, to get VoiceIt from GitHub. Check with `git --version` in a terminal. On a Mac the first `git` command offers to install it; on Windows install [Git for Windows](https://git-scm.com/download/win).
- **Node.js 18 or newer**, to run VoiceIt: the LTS installer from [nodejs.org](https://nodejs.org). Check with `node --version`.
- ChatGPT or Gemini, for rendering forms (see `system/FORM.md`).

## Getting started

1. **Make a folder for your course work** on your laptop, for example `Documents/IDEM307`.
2. **Get VoiceIt from GitHub into that folder.** Open your agent with a new session on that folder (Claude: *Code* → new session → choose the folder; Codex: open the folder) and type:

   > Clone https://github.com/kortuem/voiceit.git into this folder.

   This makes a folder `voiceit` inside it. (In a terminal instead: go to the folder and type `git clone https://github.com/kortuem/voiceit.git`.)
3. **Start a new session on the `voiceit` folder itself.** This matters: the agent only knows how VoiceIt works when it is working in this folder. (Claude: *Code* → new session → choose `voiceit`; Codex: open `voiceit`.)
4. **Paste this as your first message:**

   > We are working with VoiceIt in this folder. Read AGENTS.md and follow it. Write every behaviour into design/behaviours/, and check every script after writing or changing it.

5. **Start VoiceIt.** Open a terminal in the `voiceit` folder and type:

   ```
   node system/bin/preview
   ```

   (Mac: open Terminal, type `cd ` with a space, drag the `voiceit` folder onto the window, press Return. Windows: open the `voiceit` folder in File Explorer, click the address bar, type `cmd`, press Enter.) Your browser opens VoiceIt. Leave the terminal open while you work; `Ctrl+C` stops it.
6. **Play the example**, then open VoiceIt's **Setup** tab and play the six voices.

## Working with VoiceIt

- **Say how your thing behaves.** Tell your agent who the thing is and how it should behave in a situation: *"Our first character is Rex: confident, a know-it-all, speaks first, talks to Daan and the doctor rather than to Anna. Deep voice."* It reads back what it understood, and writes the script when you say go.
- **Play it.** Switch to the browser: the new behaviour appears at the top of the list. Pick a form under the stage; press **Watch** to see it large.
- **Give notes.** *"It talks too much when the doctor is there."* The agent says whether that changes this moment or the character, and revises.
- **Check.** *"Check our scripts."* The agent runs the check and explains every mistake, with its line, also after you edited a script yourself. VoiceIt marks problems in the script beside the stage too.
- **Forms.** Sketch on paper, render (see `system/FORM.md`), and save the image in `design/forms/`.

## Git while you work

Git keeps versions of your folder, on your laptop; you do not need a GitHub account. Your agent can do each step for you when you ask.

- **Save a version:** *"Commit our work: first version of Rex."* The first time, Git asks for your name and e-mail.
- **See what changed:** *"What changed since our last commit?"*
- **Get course updates:** *"Pull the latest VoiceIt."* (In a terminal: `git pull --no-rebase`.) This brings in changes to `system/` and the brief. It usually goes smoothly as long as you have not changed `system/` or `examples/`.
- **Share with your group (needs a GitHub account):** fork the repository on GitHub, clone your fork, and push your commits there; teammates clone the same fork.

## Folders

- `system/` is the tool: notation, vocabulary, procedures, VoiceIt itself and its scripts. Do not edit it.
- `examples/` holds the worked example. Leave it as it is; to start from an example, copy it into `design/` first.
- `design/` is yours: forms, behaviours and your notes.

## Without Node

Open `system/voiceit.html` in your browser (double-click it) and choose the `voiceit` folder with **Open folder** in the Setup tab. Everything plays, but VoiceIt does not notice new files by itself (open the folder again after a change), and your agent cannot run the check.

## Licence

MIT (see `LICENSE`). Visual style after Vlak (vlak.dev) by Renn, Noord.
