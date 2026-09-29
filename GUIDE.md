# VoiceIt guide

How to design and test a product's behaviour with VoiceIt. For installation, see the [README](README.md#getting-started).

## What VoiceIt is for

VoiceIt is a rapid prototyping tool for physical products that listen and speak. Smart speakers are the typical example: a small object on a table or a shelf that listens, answers, and often has a light and a small screen.

![Three smart speakers on a table: a Google Home, a Google Nest Hub with a screen, and a Google Home Mini](https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Google_Home_with_Home_Hub_and_Home_Mini_on_table.jpg/960px-Google_Home_with_Home_Hub_and_Home_Mini_on_table.jpg)

*Photo: Y2kcrazyjoker4, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Google_Home_with_Home_Hub_and_Home_Mini_on_table.jpg).*

You design such a product by defining how it behaves when people are around it: what it says, when, to whom, what it shows on its screen, what its light does. You describe that behaviour in your own words; your AI agent turns the description into a **behaviour script**; VoiceIt plays the script back, with synthetic voices, screen content, light and sound, so that you can see and hear the behaviour, judge it, and change it. Repeating this cycle many times, quickly, is the point: you explore alternatives before anything is built.

## Terms

| Term | Meaning |
| --- | --- |
| **Product** | What you design: a physical product that listens and speaks, such as a smart speaker. In the brief, a bedside smart speaker with a small screen and a light. |
| **Form** | The physical shape of the product: one image in `design/forms/`. |
| **Behaviour script** | How the product behaves in one scene, written in VoiceIt's notation: who says what, when, and what the product shows, lights and sounds. One file in `design/behaviours/`. "Script" for short. |
| **Character** | Who the product is: what comes across when a form and a behaviour script are played together. A script names the character it explores (`character: Rex`); you judge the character. |
| **Agent** | Claude Code or Codex, in a session on your `voiceit` folder. It writes and checks behaviour scripts for you. |
| **VoiceIt** | The page in your browser that plays behaviour scripts (started with `node system/bin/preview`). |

A form and a behaviour script together are one design. Any script can be played with any form.

## The screen

![The VoiceIt screen, with numbered areas](voiceit-screen.png)

1. **Behaviour scripts.** Your scripts, newest first, then the examples. Each row shows the character's name, the script's note (if it has one), the approximate length, and a strip with the rhythm of the script (blue: the product speaks; grey: people speak). Click a row to select it. New scripts appear here by themselves within a few seconds.
2. **Form.** The image of the product currently shown.
3. **Form images.** All forms in `design/forms/` and the examples. Click one to play the selected script with that form.
4. **Screen.** What the product shows on its screen at this moment.
5. **Light.** The product's light: its colour, and whether it pulses or is dimmed.
6. **Controls.** *Play* and *Pause*, *Step* (one line at a time), *Restart*, sound on and off, and the time.
7. **Watch.** Form, screen and light fill the window, as an audience would see them. *Escape* brings you back. In Watch, *Space* plays and pauses and the arrow keys step through the lines.
8. **Timeline.** The whole script over time: a lane for what happens (the action), one lane per person, one for the product (blue), and lanes for screen, light and sound. Click anywhere to jump there.
9. **Script.** The text of the selected script. The line being played is highlighted; click a line to jump there. Problems are marked on their line.
10. **Tabs.** *Play* (this screen), *About* (background and the vocabulary), *Literature*, and *Setup* (installation steps and a test of the voices).

## Defining a behaviour

To define a behaviour is to decide how the product acts, moment by moment, in a scene with people: in the brief, visiting hour on ward 4. A useful description says:

- **who the product is**: a name, and its manner in a few words;
- **what it does at the key moments**: what it says or shows when something happens (*"when Daan asks about the blood results, it…"*);
- **whom it addresses**, when several people are present;
- **what it says aloud and what it only shows** on the screen or with its light;
- **which voice**: low or high, calm or brisk.

Describe actions, not only adjectives. *"Friendly"* can be written in a hundred ways; *"greets Lotte by name and asks her what she is drawing"* is one.

### Three examples

Short, leaving much to the agent:

> New behaviour script: Juno, visiting hour. Warm and attentive, apologises a lot, talks mostly to Anna and is chatty with Lotte. Warm voice.

With key moments:

> New behaviour script: Pip, visiting hour. Discreet. When Daan asks about the blood results, it shows them on the screen for Anna only and says nothing aloud. It stays silent while the doctor talks. After the doctor leaves, it quietly offers Anna a written summary. Calm, mid voice.

Mostly through light, hardly any speech:

> New behaviour script: Beacon, visiting hour. It communicates with its light: soft white when someone comes in, an amber pulse when there is news for Anna, off while the doctor is in the room. It speaks only once, at the end, to remind Anna of what the doctor said. Low voice.

### What happens then

1. The agent **reads back** what it understood (name, what is going on, voice, key moments) and may ask one question. Nothing is written yet.
2. You answer, or say **"Go"**. The agent writes the script into `design/behaviours/`, checks it, and tells you how long it plays and which decisions it made itself.
3. Within a few seconds the script appears at the top of the list in VoiceIt (1), marked *just now*. Click it and press **Play**.
4. Watch and listen. Then give a **note** (below), and play again.

A behaviour script looks like this (the beginning of an example):

```
---
character: Night light
note: Night on ward 4
voice: Ash
people: Joost (patient), Eva (his daughter, by voice message), Samira (night nurse), Bakker (roommate)
---
# Night on ward 4. 23:10. Joost lies awake after hip surgery; Mr Bakker sleeps in the next bed.
LIGHT: amber pulse dim
Eva's message arrives. The device makes no sound.
(pause 3)
JOOST (low): What is it?
SCREEN: word Eva
DEVICE (quietly): A message from Eva.
```

The lines between `---` are facts: the character's name, its voice, a note of your own shown in the list, and the people present. The `#` lines are comments for the reader; they are not played. Then the script: what happens, who says what (the product speaks as `DEVICE`, or under its character's name), and what the product shows (`SCREEN`), lights (`LIGHT`) and sounds (`SOUND`).

You rarely need to write this yourself, but you can read and edit it. The notation is explained in `system/SCREENPLAY.md`, the available screen components, light colours, sounds and voices in `system/VOCABULARY.md` (also in VoiceIt's About tab).

## What to say to your agent

These phrases work reliably. You can phrase things differently, but starting a request with the phrase makes clear what you want.

| Say | When | What happens |
| --- | --- | --- |
| *We are working with VoiceIt in this folder. Read AGENTS.md and follow it. Write every behaviour into design/behaviours/, and check every script after writing or changing it.* | At the start of every new session. | The agent reads VoiceIt's instructions and is ready. |
| **New behaviour script:** *name, where. How it behaves.* | To make a new script, also for a character you already have, somewhere else (*"New behaviour script: Pip, at night. …"*). | The agent reads back what it understood and waits. |
| **Go** | When the read-back is right. | The agent writes the script, checks it and reports. |
| **Note on** *name:* *remark.* | After playing, when something should change (*"Note on Rex: it talks over the doctor."*). | The agent says whether the note changes this moment or the product's whole manner, revises the script, and checks it. |
| **Check our scripts** (or **Check** *name*) | After you edited a script yourself, or when something does not play as expected. | The agent runs the check and explains every problem with its line, in plain words, and asks before fixing. |
| **Copy the** *name* **example** | To start from one of the examples instead of from scratch. | The agent copies it into `design/behaviours/`, where you can change it. |
| **Compare** *name*'s **scripts** | When a character has several scripts. | The agent compares them and says where its manner differs. It changes nothing. |
| **Commit our work:** *what changed.* | Optional: to save a version (see the README). | The agent makes a Git commit. |
| **Pull the latest VoiceIt** | When the teacher announces an update. | The agent brings in the update. |

## Forms

Sketch the product on paper, render the sketch with ChatGPT or Gemini, mark up the render and render again (prompts in `system/FORM.md`). Save the final image in `design/forms/`, for example `design/forms/juno.png`. It appears under the form in VoiceIt (3) within a few seconds. Keep sketches and earlier versions in `design/forms/process/`.

## Judging a design

- **Fit:** does this behaviour suit this form? Play it with other forms (3).
- **Contrast:** play your scripts one after another, or compare their rhythm strips in the list (1).
- **Consistency:** if a character has several scripts, does it behave like the same character in each?
- **Details:** when does it speak first, and when does it wait? How much does it say? Whom does it address? What does it keep off the loudspeaker? How does it handle not knowing something?

## When something does not work

- **A new script does not appear:** is VoiceIt still running in its terminal? Is the file in `design/behaviours/` (not somewhere else)? Ask the agent: *"Where did you save it?"*
- **A script does not play as expected:** *"Check our scripts."* Problems are also marked in the script column (9).
- **No sound:** is *Sound on* (6)? Test the voices in the Setup tab; on Windows, Edge has the best voices.
- **The agent does not seem to know VoiceIt:** is the session on the `voiceit` folder itself? Paste the starter message again.
