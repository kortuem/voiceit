# Procedure: capture situation

**Purpose:** turn the group's description of what happens around a device into a situation file.
**Reads:** the description; `system/SITUATION.md`.
**Writes:** `design/situations/<name>.md`.

## Steps

1. **Draft the beats**: four to seven numbered lines, each one thing that happens or one thing someone wants. Put time and place in the first beat. Describe people and events only, never what the device does.
2. **List the people** who may speak, as names in capitals.
3. **Propose a title** and a file name in lowercase with hyphens.
4. **Read back before writing.** Show the title, the people and the numbered beats. Point out any beat that describes device behaviour, and ask whether something is at stake in each beat. Do not write the file yet.
5. **Revise and confirm**, then write the file with front matter `title` and `people`, and the beats as a numbered list.
6. **Run** `node system/bin/check` and fix any error.
7. **Report** briefly and offer the next step.

## Never

- Write the file before the group has seen the beats.
- Put device behaviour into beats.
- Change a situation that already has performances without saying which performances will need to be written again.
- Change the situation given in `BRIEF.md` unless the group explicitly asks.
