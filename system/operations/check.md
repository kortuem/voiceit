# Procedure: check

**Purpose:** find out whether the group's scripts are correct, and explain every problem so they can understand and fix it. Use it after writing a behaviour, after the group edited a script by hand, and whenever they ask ("check our scripts", "why doesn't this play?").
**Reads:** the output of `node system/bin/check`; the scripts it names; `system/SCREENPLAY.md` and `system/VOCABULARY.md`.
**Writes:** nothing, unless the group asks you to fix something.

## Steps

1. **Run the check**: `node system/bin/check` for everything, or `node system/bin/check "design/behaviours/<file>.md"` for one script.
2. **If it is clean**, say so in one line, with the playing time.
3. **Otherwise, go through every problem**, errors first:
   - which file and line, and the line itself, quoted;
   - what is wrong, in plain words (not the checker's wording alone);
   - how it could be written instead, using only `SCREENPLAY.md` and `VOCABULARY.md`.
   Errors stop a line from playing as intended; warnings are worth reading but may be intended.
4. **Ask before fixing.** If the group says yes, change only the lines concerned, keep everything else as they wrote it (including their own edits), and run the check again.
5. **Mention what the check cannot see**, if you notice it, but label it as an observation, not an error: a screen or light cue placed after the line it belongs to, something from the situation that never happens, a person who speaks but has no role in the `people` line.

## Never

- Rewrite a whole script to fix a few lines.
- Change anything the group did not agree to.
- Say a script is correct without having run the check.
