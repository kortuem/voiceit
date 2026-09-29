# Procedure: write a behaviour

**Purpose:** turn the group's description of their product into a script VoiceIt can play.
**Reads:** the group's plan or description; `system/SCREENPLAY.md`; `system/VOCABULARY.md`; the worked examples in `examples/behaviours/` for tone and density (the ward 4 scripts; the timer is only a notation sample).
**Writes:** one file in `design/behaviours/`, named after the character and a few words (`rex - visiting hour.md`).

The group writes and directs; you write the script down. There is no separate character document: the group judges the product's character from its form and its behaviour in the scripts.

## Steps

1. **Start from the group's plan.** Groups usually bring a plan made on paper: the people, the events in order, key lines, and what the product does at each event. The plan leads: keep its people, its events and their order, and do not add events; if something the script needs is missing, ask. Without a plan, listen for three things: who the product is (its character, in their words), the scene (where it is and who is there), and how the product should behave; if the scene is unclear, ask them to describe it in a sentence or two.
2. **Read back before writing.** In a few lines: the character's name, the scene, the voice you propose from the catalogue (described by its sound), and the events in the order you will write them ("when Daan asks about the results, the product shows them on the screen instead of saying them"). If an ambiguity would change the behaviour, ask one short question; otherwise make the smallest reasonable decision and mention it. Do not write the file yet.
3. **Write the script** when the group agrees (or says "fine", "go"):
   - front matter `character` and `voice` (both required), `note` (a few words shown in VoiceIt's list, such as `Visiting hour on ward 4`), and `people` with each person's role and voice (`Anna (patient, voice high), Daan (her son, voice low)`: `voice low` or `voice high` to match who the person is, or a voice from the catalogue by name); then `#` comment lines describing the scene;
   - only the components, light colours, modifiers, sounds and voices in `VOCABULARY.md`;
   - cues before the line they belong to; silence written as `(beat)` and `(pause n)`;
   - every TOUCH picks an option that is on the screen at that moment;
   - include every event the group specified, and let the people react to the product's behaviour as the group described it;
   - pacing: the product answers promptly, with no pause before its reply unless hesitating is part of its character; a `(beat)` where people need a moment to take in what was said or shown; waiting kept short (`(pause 3)` can stand for minutes), so the scene never stands still for long;
   - as long as the plan needs; without a plan, about a minute when played.
4. **Write only from the group's plan or description of this script.** Do not read the character's other behaviours unless the group asks you to: noticing whether the character stays the same is their work. When the group refers to another product's script for the shared scene ("the same plan as Juno"), read that script for its people and events only, not for its behaviour. If they ask for a coherence check afterwards, compare the scripts and say where they differ.
5. **Check before overwriting.** If a file with that name exists, overwrite it only if the group has just asked for it to be written again and it has not changed since you wrote it in this conversation. Otherwise, show what is there and ask.
6. **Run** `node system/bin/check "design/behaviours/<file>.md"` (with the quotes: file names contain spaces) and fix all errors. Read the warnings and fix them unless they are intended. A warning that people share a voice is the group's decision: do not drop people or change the product's voice on your own; name it in the report with the two options the warning gives.
7. **Report** in two or three sentences: the check result and the playing time, the moment that most clearly expresses the intended character, and any decisions you made that the group did not specify, including anything you added to their plan or left out. Remind them that the script appears at the top of VoiceIt's list within a few seconds, to click it and press Play (`node system/bin/preview` if VoiceIt is not running).

## Never

- Write before the group has heard the read-back.
- Use anything that is not in `VOCABULARY.md`, or invent notation.
- Change a form image, `system/` or another group's files.
- Report back before the check passes without errors.
