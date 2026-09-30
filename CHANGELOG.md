# Changelog

What changed from one version of VoiceIt to the next, newest first. Versions below 1.0 are early releases: things may still change between them. Each version is also a Git tag (`v0.2.0`), so any version can be looked at again on GitHub.

For maintainers: when releasing, set `VERSION` in `system/voiceit.js` and the `?v=` of `voiceit.js` in `system/voiceit.html`, add an entry here with the same number, and tag the commit. The tests check that the three numbers match.

## 0.5.1 (30 September 2026)

Repairs from the final review of 0.5.0, each with a regression test; a simpler tutorial; the new tour video.

- **Preview file boundary:** the preview served and listed files through symbolic links, also ones pointing outside the project or at hidden files. It now follows a link only when its real target lies inside the project and is not hidden, for serving and for the file list alike.
- **Timeline markup:** a sound or light name from a vocabulary reached the timeline unescaped. Every imported field is now escaped, and vocabulary names may contain only letters, digits, spaces and hyphens (anything else is a problem in `VOCABULARY.md`).
- **Durations:** a pause is at most an hour, and all pauses together at most an hour; a pause such as 310 nines was accepted and froze the timeline. The ruler shows at most about 40 marks for any length.
- **Setup and refresh:**
  - The checks are split into *Needed to play* and *Also useful*, and the tutorial now says that the first group should say Yes; the old "all say Yes" was impossible online.
  - The note under the script says what really happens: automatic updates only where VoiceIt can follow the folder, otherwise "open the folder again".
  - VoiceIt online reminds you to open your folder again after a reload, and says so when it loses access to a followed folder.
  - A stopped preview is reported, and its return too, instead of silently showing the old state.
- **Tutorial:** eight steps; "check the fit" is now part of revising, and changing VoiceIt itself is an optional last step.
- **About:** two sentences reworded.
- **Tour video:** the new version, narration generated on a paid ElevenLabs plan (voice River), with a shared end card and credits.

## 0.5.0 (29 September 2026)

After a review of the tutorial. The repository is now about the tool only: assignments live with the course, not here.

- **`BRIEF.md` removed**, and every reference to an assignment with it (tutorial, README, `AGENTS.md`, the agent's procedures, `BOUNDARIES.md`).
- **Tutorial**, ten steps with a short route at the top: set up → a short example (Timer, Lumo; the longer examples are optional) → the screen, tried on Lumo → bring in your product images → plan a scene on paper → let the agent write the scripts from the plan → review → revise → pair, judge and demonstrate → change the tool (commit first, ask explicitly, run the tests, play your scripts again).
- **Agent:** the group's paper plan leads (its people, events and order; nothing added without asking); the length follows the plan. New in `AGENTS.md`: how to handle a requested change to VoiceIt itself.
- **Groups work on one laptop** and commit there; the instructions to fork and clone a second copy are gone.
- VoiceIt online plays and shows scripts; changes to VoiceIt itself need Node (tutorial, README).
- **The tour video** plays in the About tab (it loads only when played, with subtitles). The preview serves video, also to Safari.

## 0.4.2 (29 September 2026)

- **One set of set-up instructions.** The Setup tab now shows step 1 of the tutorial word for word (seven steps, including the two about voices), next to the voice buttons, with a link to the tutorial for what comes next. A test keeps the two identical. Gone from the tab: the shorter, slightly different steps, "While you work", the "Without Node" paragraph and its *Open folder…* button (the browser called it an upload; the button in the list remains where it is needed).
- The checks are titled *Is this laptop ready?*

## 0.4.1 (29 September 2026)

- **VoiceIt online after an update:** the web host lets browsers keep `voiceit.js` for up to four hours, but the page for only ten minutes, so a browser could combine a new page with an old script. The page now asks for the script by version (`voiceit.js?v=0.4.1`); a test keeps that number equal to the version.

## 0.4.0 (29 September 2026)

- **Two simple examples first.** *Timer · Pasta* (twelve seconds in a kitchen: speech, a choice on the screen, a touch and the light) and *Lumo · Call the nurse* (one patient, one nurse: the product calls her, stays quiet while she is there, and answers when she asks it to note something). The example files are numbered, and VoiceIt lists them in that order, simplest first; the Timer is selected when VoiceIt opens. The three ward 4 scripts follow as before (renamed `3 night light - night on ward 4.md`, `4 host - …`, `5 night light - visiting hour.md`).
- The tutorial starts with the two new examples; README and `SCREENPLAY.md` show the Timer as a complete script.
- At the end of a script the clock shows its full length; it could stop a second short (0:11 / ≈ 0:12).
- Writing a behaviour: the agent keeps the pace. The product answers promptly, a `(beat)` gives people time to listen, and waiting is kept short.

## 0.3.2 (29 September 2026)

Fixes from an independent review of the code.

- **Names with accents speak:** `DANIËL:` or `ZOË:` used to be read, without a warning, as an action.
- **Front matter as agents often write it:** `character: "Rex"` (quoted), `voice: ash` (lower case) and files saved with a byte-order mark (older Windows Notepad) are read as meant.
- **Voices in the people line:** `voice: low` (with a colon) and a voice anywhere in the brackets now count. A role such as `voice coach` stays a role, with a warning instead of an error. Voices named by name are given out first, and `voice low` / `voice high` take the most clearly low or high voices first.
- **Fewer false warnings, more useful ones:** times (`At 15:00 Anna wakes.`) and longer phrases before a colon no longer look like speakers. New: a manner after the colon (`DEVICE: (quietly) Hello.`, which was spoken aloud) and a pause with more text on its line (which was not played). `(pause 2 seconds)` is accepted. The shared-voice advice suggests changing the product's voice only when that would help.
- **Online, following a folder:** a change to another file no longer rewinds the script you are on, and a Step is not interrupted. A page opened by double-clicking now also follows the folder it says it follows.
- **Voices** arriving after a script is shown now update the voice names in the script column.
- **Preview:** odd requests and files that cannot be read (for example cloud files not yet downloaded) no longer stop it.
- `SCREENPLAY.md` lists Rowan.

## 0.3.1 (29 September 2026)

- **When people share a voice, VoiceIt says why and what to do.** The check warns when two speakers have the same voice because the catalogue has too few (three low and four high voices, one of them the product's), and suggests letting fewer people speak or giving the product a voice of the other register. The agent reports this to the group instead of dropping people itself.
- **When a laptop has too few voices,** the script column says which people sound alike on this laptop, and the Setup tab says how many low and high voices the laptop has against the catalogue's, with where to download more.

## 0.3.0 (29 September 2026)

- **Choose a person's voice:** end the brackets in the `people` line with `voice low`, `voice high` or a voice from the catalogue: `Joost (patient, voice low), Lotte (her granddaughter, 8, voice Wren)`. Before, people got the free voices in order, so a man could get a high voice and a woman a low one. `voice low` and `voice high` never cross into the other register, also when voices run out; people who never speak use up no voice. An unknown voice there is an error in the check. The examples now give every speaker a voice.
- **A seventh voice, Rowan** (mid-low, warm), so that the product and two men can all have different low voices.
- **Voices on any laptop:** VoiceIt recognises low and high voices by name on Mac, Windows (Edge's Natural voices) and Chrome, and by *Male* or *Female* in a voice's name. Voices it does not recognise are no longer used as a guess for a register when recognised ones exist. The Setup tab says how many low and high voices it recognised, and each catalogue voice now has a menu of this laptop's voices and a ▶ button: where the guess is wrong, choose another voice. The browser remembers the choice; nothing is sent anywhere.
- The script column shows the voice of the product and of each person, with the laptop voice that plays it.

## 0.2.10 (29 September 2026)

- **Sounds play in Safari:** the chime, alert and the click of a touch were silent in Safari (reported by a tester), while the voices played. Browsers start sound only from a click or key press, and VoiceIt started its sound engine only when the first sound came up in the script. Now the first click or key press on the page starts it.
- The Setup tab has a *Play the sounds* button next to *Play the six voices*.

## 0.2.9 (29 September 2026)

- **Better sound with good voices:** Premium, Enhanced and Natural voices now keep their own pitch. VoiceIt used to lower or raise the pitch of every voice (Ash to 0.82, Wren to 1.3, "low" further), which made the best voices sound artificial; heard side by side, the unaltered voices sounded clearly better. Speed and volume still follow the catalogue and directions such as *quietly*. Basic voices are still pitch-shifted.

## 0.2.8 (29 September 2026)

- VoiceIt recognises more Mac voices as higher voices: Isha, Matilda, Joelle and Sangeeta (measured, 186–258 Hz), and Nora and Leona (female in Apple's voice catalogue). With enough Premium voices installed, all six catalogue voices now use Premium voices.

## 0.2.7 (29 September 2026)

Found by testing the online version:

- **Watch and Space:** after clicking Watch, Space pressed the Watch button (now "Back") and left Watch. The focus now leaves the button, so Space plays and pauses as the tutorial says.
- **Watch links:** a link with `w=1` pasted into an open VoiceIt tab now opens Watch too (it only worked in a new tab).
- **Step twice:** pressing Step while a line was still playing started the same line again. It now moves on to the next line.
- **Literature links:** the two ScienceDirect links are now DOIs, and the TU Delft thesis links straight to the repository (its DOI took about 45 seconds to resolve).

## 0.2.6 (29 September 2026)

- **VoiceIt online** (https://kortuem.github.io/voiceit/), a backup for laptops where Node will not run: the page is served by GitHub Pages; the examples play at once, and **Open your voiceit folder** plays the group's own scripts from their laptop (nothing is uploaded). Chrome and Edge follow the folder, so new and changed scripts appear by themselves; Safari and Firefox re-open it after a change. Without Node the agent cannot run the check; VoiceIt marks problems in the script column.
- `examples/index.json` lists the examples for the online version; a test keeps it in step with the folders. `.nojekyll` makes GitHub Pages serve the scripts as they are.

## 0.2.5 (29 September 2026)

After an outside review, and tested in a Claude Code session (write, revise, hand edit and check):

- **Shorter start:** the folder carries its own instructions (`AGENTS.md`), which Claude Code and Codex read by themselves; students start a session with just "Read AGENTS.md and follow it."
- **Agent procedures with less ritual:** the agent reads only the instructions it needs, asks a question only when an ambiguity would change the behaviour, and decides by itself whether a revision concerns one moment or the whole character (it still asks before changing other scripts).
- **Tutorial in two parts:** the eight steps, then a Reference (phrases, commands, Git, troubleshooting).
- **Character defined more sharply**, near the top of the README: the impression people form of the product from its form and behaviour together.
- **Language:** concepts no longer act ("character comes across", "the screenplay treats people"), fewer "not X but Y" sentences, headings that are statements rather than questions, and a Documentation list in the README.

## 0.2.4 (29 September 2026)

- **New example forms**: a hand sketch of an hourglass-shaped speaker and a rendering made from it replace the two line drawings. Together they show the form loop: sketch, then render.
- **A short video tour** (`media/voiceit-demo.mp4`, about 1.5 minutes, with subtitles), linked from the README and the tutorial.

## 0.2.3 (29 September 2026)

- **Better voices, optional setup**: the tutorial (step 7), the README and the Setup tab explain how to get much better voices: Premium or Enhanced voices on a Mac, Edge's natural voices on Windows.
- Edge's natural voices are preferred like premium ones.

## 0.2.2 (29 September 2026)

- VoiceIt recognises two more Mac voices by their register: Jamie (low, about 99 Hz) and Stephanie (high, about 203 Hz), measured from their speech. With Jamie (Premium) installed, the product's low voice uses it.

## 0.2.1 (29 September 2026)

- **Better voices on a Mac.** VoiceIt no longer uses the Mac's novelty voices (Albert, Bubbles, Zarvox and others); before, the product's low voice could sound like a raspy robot. Premium and enhanced voices are used first when a laptop has them, the older robotic voices last. Tip: install a few premium English voices (System Settings > Accessibility > Spoken Content > System voice > Manage Voices) to hear the scripts much more naturally.

## 0.2.0 (29 September 2026)

The first version for testing with students, as VoiceIt.

- **Forms and behaviour scripts** are two separate pools in `design/forms/` and `design/behaviours/`: any script can be played with any form. A script names its character (`character:`), its voice, an optional `note` for the list, and the people present.
- **The VoiceIt page** has four tabs: Play, About, Literature and Setup.
  - A list of behaviour scripts, yours first and newest first, then the examples. Each row shows the character, the note, the approximate length and the rhythm of the script.
  - A stage with the form, the screen and the light side by side, and thumbnails to switch forms.
  - A timeline with a lane for each person, the product, the screen, the light and sound.
  - The script beside the stage, following playback; click a line or the timeline to jump there.
  - Play, Pause, Step and Restart, and **Watch** to fill the window for presenting.
  - New and changed files appear within a few seconds, without reloading.
- **The check** (`node system/bin/check`) reports errors and warnings with line numbers, in plain words. It uses the same code as the page, so what it accepts is exactly what plays.
- **Instructions for the AI coding assistant**: `AGENTS.md` and three procedures, for writing, revising and checking a script. The assistant reads back before writing and waits for "Go".
- **Documents**: README, a step-by-step tutorial, the brief (visiting hour on ward 4), the notation, the vocabulary, form rendering and boundaries.
- **Examples**: three scripts (the Host and the Night light at night on ward 4, and the Night light at visiting hour) and two forms (a bedside unit and a lamp).
- Tested in Chrome on macOS only.

## 0.1.0 (28 September 2026)

An internal prototype with a different structure, before the name VoiceIt. Replaced entirely by 0.2.0. Tagged `v0.1.0`.
