# Screenplay notation

A performance is a screenplay: one event per line, read from top to bottom. The notation borrows from film and theatre scripts. Blank lines and lines starting with `#` are ignored, so `#` can be used for notes.

Every performance starts with front matter naming the device folder and the situation:

```
---
device: device-a
situation: night-ward
---
```

The file lives in `design/devices/<device>/performances/<situation>.md`.

## Lines

| Line | Meaning |
| --- | --- |
| `JOOST: I can't sleep.` | A person speaks. Names are in capitals and should match the `people` of the situation. Any name except the reserved words below. |
| `DEVICE: Good evening.` | The device speaks, in the voice named in its `conduct.md`. |
| `DEVICE (quietly, slowly): …` | A parenthetical gives the manner. The local player understands the words listed under Manner in `VOCABULARY.md`; the stage passes the whole direction to speech synthesis. |
| `JOOST: I was going to--` | An em dash (`—`) or `--` at the end: the next line cuts in with no gap. |
| `(beat)` | A pause of one second. |
| `(pause 4)` | A pause of four seconds. |
| `Joost reaches for the call button.` | Any other line is an action line: shown as a stage direction, with no sound. |
| `SCREEN: statement Paracetamol at 20:00 \| next dose from 02:00` | Screen cue. It takes effect when the next line starts and stays until the next screen cue. Components are in `VOCABULARY.md`. |
| `LIGHT: amber pulse dim` | Light cue: a colour, optionally `pulse` and `dim`; or `LIGHT: off`. |
| `SOUND: chime` | Sound cue: `chime`, `alert` or `click`. |
| `TOUCH: Yes` | A person taps an option on the screen, by its label. `TOUCH: screen` taps the screen itself. |

Reserved words: `DEVICE`, `SCREEN`, `LIGHT`, `SOUND`, `TOUCH`.

## Timing

The local player estimates how long each spoken line takes from its length, its voice and its manner. Cues (SCREEN, LIGHT, SOUND) take no time; they change the device at the moment the next line begins. So write a cue **before** the line it belongs to: a SCREEN cue placed after the device speaks appears only when the next person starts talking. A `TOUCH` takes about a second. Silence is written, not implied: use `(beat)` and `(pause n)`.

## An example

From `design/devices/device-b/performances/night-ward.md`, the Night light:

```
LIGHT: amber pulse dim
Eva's message arrives. The device makes no sound.
(pause 3)
Joost notices the light and turns his head.
JOOST (low): What is it?
SCREEN: word Eva
DEVICE (quietly): A message from Eva.
SCREEN: choice Eva's message | Show text | Later
TOUCH: Show text
SCREEN: statement Hi Dad, how are you feeling? | Can I come by tomorrow at ten?
```

The same moment with the Host (`device-a`):

```
SOUND: chime
LIGHT: white
SCREEN: statement New message from Eva | received 23:08
DEVICE: Joost, you have a new voice message from Eva. I'll play it for you.
EVA (voice message, warm): Hi Dad, how are you feeling? Can I come by tomorrow at ten?
BAKKER (half asleep, low): Hm? Who's that?
```

Same situation, same vocabulary; every difference is conduct.

## What the check looks for

`node system/bin/check` reports, with line numbers:

- **errors**: a screen component, light colour or sound that is not in the vocabulary; missing front matter; a device or situation that does not exist; a voice that is not in the catalogue;
- **warnings**: a line that looks like a speaker but is not in capitals; a TOUCH on an option that is not on the screen at that moment; a person who is not among the situation's people; words after LIGHT that the player ignores.

Errors must be fixed. Warnings are worth reading: they usually mean the performance will not play as intended.
