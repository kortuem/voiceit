# Screenplay notation

A behaviour is a script: how the product acts in one scene, one event per line, read from top to bottom. The notation borrows from film and theatre scripts.

## The file

A behaviour lives in `design/behaviours/`, one file each, named after the character and a few words of your own (`night light - visiting hour.md`). It starts with a few facts, then a few comment lines describing the scene, then the script:

```
---
character: Night light
note: Visiting hour on ward 4
voice: Ash
people: Anna (patient, voice high), Daan (her son, voice low), Lotte (her granddaughter, 8, voice Wren), De Wit (roommate, voice high), Okafor (doctor, voice high)
---
# Visiting hour on ward 4. 15:00. Anna, 74, is recovering from pneumonia in a two-bed room.
# Her son Daan and granddaughter Lotte visit. Dr Okafor comes by on her round.
15:00. Afternoon light. Anna sits up in bed.
LIGHT: white dim
…
```

- `character` (required): the character's name. The script's lines, timing, screen, light and sound define how the product behaves; people judge its character when they play the script with a form.
- `voice` (required): one name from the voice catalogue in `VOCABULARY.md` (Ash, Theo, Sam, Noor, Mira, Wren).
- `note` (optional): one line of your own, shown under the character's name in VoiceIt's list, for example the scene or the variation being tested. VoiceIt does nothing else with it.
- `people` (optional but recommended): everyone present, each with their role in brackets. The name is the one used in the script, so `Anna` speaks as `ANNA:`. VoiceIt shows the role next to the name, and gives everyone a lane on the timeline, also those who stay silent. The check warns when someone speaks who is not listed. To choose a person's voice, end the brackets with `voice low`, `voice high` or a voice from the catalogue (`voice Wren`); without it, VoiceIt picks a free voice, which may be low or high. See Voices in `VOCABULARY.md`.
- `#` lines right after the front matter are comments for the reader: the scene and who is present. VoiceIt shows them above the script; they are not played.

## Lines

Blank lines and lines starting with `#` are ignored.

| Line | Meaning |
| --- | --- |
| `JOOST: I can't sleep.` | A person speaks. Names in capitals; any name except the reserved words below. |
| `DEVICE: Good evening.` | The product speaks, in the voice named in the front matter. Its character's name works too (`REX:` in a script with `character: Rex`). |
| `DEVICE (quietly, slowly): …` | A parenthetical gives the manner. The browser voices follow the words listed under Manner in `VOCABULARY.md` and ignore the rest. |
| `JOOST: I was going to--` | An em dash (`—`) or `--` at the end: the next line cuts in with no gap. |
| `(beat)` | A pause of one second. |
| `(pause 4)` | A pause of four seconds; `(pause 1.5)` works too. It plays exactly what you write: the check reports a malformed number, `(pause 0)` and pauses over 60 seconds, but never changes them. |
| `Joost reaches for the call button.` | Any other line is an action line: shown as a stage direction, with no sound. |
| `SCREEN: statement Paracetamol at 20:00 \| next dose from 02:00` | Screen cue. It takes effect when the next line starts and stays until the next screen cue. Components are in `VOCABULARY.md`. |
| `LIGHT: amber pulse dim` | Light cue: a colour, optionally `pulse` and `dim`; or `LIGHT: off`. |
| `SOUND: chime` | Sound cue: `chime`, `alert` or `click`. |
| `TOUCH: Yes` | A person taps an option on the screen, by its label. `TOUCH: screen` taps the screen itself. |

Reserved words: `DEVICE`, `SCREEN`, `LIGHT`, `SOUND`, `TOUCH`.

## Timing

VoiceIt estimates how long each spoken line takes from its length, its voice and its manner. Cues (SCREEN, LIGHT, SOUND) take no time; they change the product at the moment the next line begins. So write a cue **before** the line it belongs to: a SCREEN cue placed after the product speaks appears only when the next person starts talking. A `TOUCH` takes about a second. Silence is written, not implied: use `(beat)` and `(pause n)`.

## An example

The same moment with two characters in *Night on ward 4*. The Night light:

```
LIGHT: amber pulse dim
Eva's message arrives. The device makes no sound.
(pause 3)
Joost notices the light and turns his head.
JOOST (low): What is it?
SCREEN: word Eva
DEVICE (quietly): A message from Eva.
```

The Host:

```
SOUND: chime
LIGHT: white
SCREEN: statement New message from Eva | received 23:08
DEVICE: Joost, you have a new voice message from Eva. I'll play it for you.
EVA (voice message, warm): Hi Dad, how are you feeling? Can I come by tomorrow at ten?
BAKKER (half asleep, low): Hm? Who's that?
```

Both scripts use the same scene and the same vocabulary. They differ in what the product says, when it speaks and what it shows, and people who play them judge two different characters.

## Checks and warnings

`node system/bin/check` reports, with line numbers:

- **errors**: missing front matter, character or voice; a voice that is not in the catalogue, also in the `people` line; a screen component, light colour or sound that is not in the vocabulary; a pause without a proper number of seconds, such as `(pause)` or `(pause 2,5)` (not played);
- **warnings**: someone who speaks but is not in the `people` line; two speakers who share a voice because the catalogue has too few (the warning says how to resolve it); a line that looks like a speaker but is not in capitals; a TOUCH on an option that is not on the screen at that moment; a choice without options; words after LIGHT that VoiceIt ignores; `(pause 0)`, a pause over 60 seconds, or `(beat)` with words in it; a script with no lines.

Errors must be fixed. Warnings are worth reading: they usually mean the behaviour will not play as intended.
