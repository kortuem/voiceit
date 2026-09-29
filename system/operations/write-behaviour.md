# Procedure: write a behaviour

**Purpose:** turn what the group says about their product into a script VoiceIt can play.
**Reads:** what the group says; `BRIEF.md` for the setting and the people, if they refer to it; `system/SCREENPLAY.md`; `system/VOCABULARY.md`; the worked example in `examples/behaviours/` for tone and density.
**Writes:** one file in `design/behaviours/`, named after the character and a few words (`rex - visiting hour.md`).

The group are the script writers and directors; you are the one who writes it down. The character is not a separate document: it comes across from the scripts and the form together, and the group judges it.

## Steps

1. **Listen for three things**: who the product is (its character, in their words), where it is and who is there, and how it should behave. Use the setting and people from `BRIEF.md` if they refer to it; otherwise ask them to describe what is going on in a sentence or two.
2. **Read back before writing.** In a few lines: the character's name, what is going on, the voice you propose from the catalogue (described by its sound), and the key moments as you understood them ("when Daan asks about the results, it shows them on the screen instead of saying them"). Ask one short question about anything that is unclear. Do not write the file yet.
3. **Write the script** when the group agrees (or says "fine", "go"):
   - front matter `character` and `voice` (both required), `note` (a few words shown in VoiceIt's list, such as `Visiting hour on ward 4`), and `people` with each person's role (`Anna (patient), Daan (her son)`); then `#` comment lines on what is going on;
   - only the components, light colours, modifiers, sounds and voices in `VOCABULARY.md`;
   - cues before the line they belong to; silence written as `(beat)` and `(pause n)`;
   - every TOUCH picks an option that is on the screen at that moment;
   - everything the group described happens in the script; the product's behaviour may change how it goes;
   - roughly one to two minutes when played.
4. **Write only from what the group said for this script.** Do not read the character's other behaviours unless the group asks you to: noticing whether the character stays the same is their work. If they ask for a coherence check afterwards, compare the scripts and say where they differ.
5. **Check before overwriting.** If a file with that name exists, overwrite it only if the group has just asked for it to be written again and it has not changed since you wrote it in this conversation. Otherwise, show what is there and ask.
6. **Run** `node system/bin/check <the file>` and fix all errors. Read the warnings and fix them unless they are intended.
7. **Report** in two or three sentences: the check result and the playing time, the moment where the character shows most clearly, and anything the group did not say that you had to decide. Remind them that the script appears at the top of VoiceIt's list within a few seconds, to click it and press Play (`node system/bin/preview` if VoiceIt is not running).

## Never

- Write before the group has heard the read-back.
- Use anything that is not in `VOCABULARY.md`, or invent notation.
- Change a form image, `system/` or another group's files.
- Report back before the check passes without errors.
