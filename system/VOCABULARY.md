# Vocabulary

The available screen components, lights, sounds and voices. A behaviour may use only what is listed here. VoiceIt and the check both read the entries below, so changing an entry here changes what both accept.

Each entry is one fenced block. Its first word (`component`, `light`, `modifier`, `sound`, `voice`, `manner`) names the kind of entry; the lines inside are `key: value`. Do not change entries during the session. Adding a new one is a later exercise.

## Screen components

The screen is plain: one ink colour on paper, one typeface, and emphasis only through weight and spacing. Colour is reserved for the light.

A screen cue takes effect when the next line starts and stays until the next screen cue. Parts are separated by `|`.

```component
name: word
syntax: SCREEN: word Rest
parts: one word or a short phrase
use: terse, suggestive
```

```component
name: statement
syntax: SCREEN: statement Main line | second line
parts: a main line; optionally a smaller second line
use: explaining
```

```component
name: choice
syntax: SCREEN: choice Question? | Option | Option
parts: a question, then one or more options; a person selects one with TOUCH
use: handing the decision to people
```

```component
name: image
syntax: SCREEN: image [a still lake at dusk] | caption
parts: a description in square brackets; optionally a caption
use: speaking in images; VoiceIt draws a wireframe placeholder with the description
```

```component
name: blank
syntax: SCREEN: blank
parts: none
use: withholding
```

## Light

One light, in one colour at a time. Write `LIGHT: colour`, optionally followed by modifiers, or `LIGHT: off`. Example: `LIGHT: amber pulse dim`.

```light
name: white
colour: #F4F4EF
```

```light
name: amber
colour: #FFB547
```

```light
name: blue
colour: #6E97FF
```

```light
name: green
colour: #5BD68E
```

```light
name: red
colour: #FF5F53
```

```light
name: violet
colour: #B384FF
```

```modifier
name: pulse
effect: the light breathes slowly instead of staying steady
```

```modifier
name: dim
effect: the light burns at less than half strength
```

## Sounds

Short non-verbal sounds. Write `SOUND: chime`.

```sound
name: chime
effect: two soft rising tones; something has arrived
```

```sound
name: alert
effect: three short beeps; something needs attention now
```

```sound
name: click
effect: one short tick; confirms a touch
```

## Voices

The product has one voice from this catalogue, named in the front matter of each behaviour (`voice: Ash`). People in the script get the other voices. To choose a person's voice, end the brackets in the `people` line with `voice low`, `voice high` or a voice's name: `Joost (patient, voice low), Eva (his daughter, voice high), Samira (night nurse, voice Noor)`. `voice low` takes a free voice of range low or mid-low, `voice high` one of the others; when all of them are taken, a voice is shared, but never one from the other register. People without a voice get the free voices in the order they first speak. The catalogue describes each voice by its sound; any character can use any voice.

`range` places the voice from low to high; `pitch` and `rate` are what VoiceIt uses with browser voices (1 is the browser's normal). Premium, Enhanced and Natural voices keep their own pitch, because shifting makes them sound artificial; for them only `rate` applies. `pitch` shifts only the basic voices.

```voice
name: Ash
sound: low, slow, even
range: low
pitch: 0.82
rate: 0.92
```

```voice
name: Theo
sound: mid-low, brisk
range: mid-low
pitch: 1
rate: 1.08
```

```voice
name: Rowan
sound: mid-low, warm
range: mid-low
pitch: 0.9
rate: 0.97
```

```voice
name: Sam
sound: mid-range, between registers
range: mid
pitch: 0.8
rate: 1
```

```voice
name: Noor
sound: mid, warm, unhurried
range: mid
pitch: 0.98
rate: 0.9
```

```voice
name: Mira
sound: mid-high, bright
range: mid-high
pitch: 1.1
rate: 1.03
```

```voice
name: Wren
sound: high, light
range: high
pitch: 1.3
rate: 1.05
```

## Manner

A parenthetical after a name is direction for the voice: `DEVICE (quietly, slowly): …`. Write it in plain words. VoiceIt's browser voices understand only the words below (a word also matches its longer forms: `quiet` matches `quietly`). When several apply, rates and pitches multiply and the quietest volume wins. Other words are allowed; the browser voices simply ignore them.

```manner
name: quiet
words: quiet, soft, whisper, hush
volume: 0.45
rate: 0.94
```

```manner
name: low
words: low
volume: 0.55
pitch: 0.92
```

```manner
name: loud
words: loud, shout
volume: 1
```

```manner
name: slow
words: slow
rate: 0.84
```

```manner
name: fast
words: fast, quick, brisk, hurried, hurry
rate: 1.16
```

```manner
name: high
words: high, bright
pitch: 1.08
```

```manner
name: gruff
words: gruff, grumble, grumbling
pitch: 0.9
```
