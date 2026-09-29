# VoiceIt

A rapid prototyping tool for designing products that listen and speak.

VoiceIt supports the exploration and testing of physical products whose behaviour unfolds in spoken interaction with the people around them. Smart speakers are the typical example: a small object on a table or a shelf that listens, answers, and often has a light and a small screen. What such a product says, when, to whom, and what it keeps to itself is hard to judge on paper: it depends on timing, wording, voice and on who else is present. VoiceIt makes it perceptible early. The product's behaviour is written as a script and played back in the browser with synthetic speech, screen content, light and sound, before any working system exists.

![Three smart speakers on a table: a Google Home, a Google Nest Hub with a screen, and a Google Home Mini](https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Google_Home_with_Home_Hub_and_Home_Mini_on_table.jpg/960px-Google_Home_with_Home_Hub_and_Home_Mini_on_table.jpg)

*Smart speakers: three forms, one kind of behaviour. Photo: Y2kcrazyjoker4, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Google_Home_with_Home_Hub_and_Home_Mini_on_table.jpg).*

A prototype has two parts:

- **Form**: the physical shape of the product, as an image. It is sketched on paper and rendered with an image model. One image in `design/forms/`.
- **Behaviour**: how the product acts: what it says and when, what it shows on its screen, and what its light and sounds do. The designers describe it in their own words; an AI agent writes it as a **behaviour script** in VoiceIt's notation. One file in `design/behaviours/`.

Forms and behaviour scripts are independent: any script can be played with any form. This makes it possible to test whether a behaviour suits a form, and to compare alternative designs side by side. All interaction is scripted; nothing is live. VoiceIt is intended for exploring many variations quickly, not for building a working product.

**How to use it:** the [guide](GUIDE.md) explains the screen, how to define a behaviour, and exactly what to say to your agent.

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

The [guide](GUIDE.md) has the details. In short:

- **Say how your product behaves.** *"New behaviour script: Rex, visiting hour. Confident, a know-it-all, speaks first, talks to Daan and the doctor rather than to Anna. Deep voice."* Your agent reads back what it understood; say **Go** and it writes the script.
- **Play it.** Within a few seconds the new script appears at the top of the list in VoiceIt. Click it, pick a form, press **Play**; press **Watch** to see it large.
- **Give notes.** *"Note on Rex: it talks too much when the doctor is there."* The agent revises the script.
- **Check.** After you edited a script yourself: *"Check our scripts."* The agent explains every problem, with its line.

## Git while you work (optional)

**What Git is.** Git is a version control system: it keeps the history of a folder. You used it once already, to *clone* VoiceIt: that made your own copy of the course's repository on GitHub, history included. From then on, the copy on your laptop is yours; Git works on it without a GitHub account.

**What a commit is.** A *commit* is a saved snapshot of the whole folder at one moment, with a short message saying what changed ("first version of Rex"). Commits let you go back to an earlier version, see what changed between two versions, and try something without losing what worked. *Pull* brings new commits from the course's repository into your copy (course updates); *push* sends your commits to a repository on GitHub (only needed to share with others, and needs an account).

You do not need any of this to use VoiceIt. Your agent can do each step for you when you ask:

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
