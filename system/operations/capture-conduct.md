# Procedure: capture conduct

**Purpose:** turn the group's spoken or typed description of how a device should behave into `conduct.md`.
**Reads:** the description; `system/CONDUCT.md`; the voice catalogue in `system/VOCABULARY.md`; `BRIEF.md`; `system/BOUNDARIES.md`.
**Writes:** `design/devices/<device>/conduct.md`.

## Steps

1. **Find the device.** Ask which device this is if it is not clear. A new device gets the next free folder name (`device-c`, `device-d`, …) unless the group names one.
2. **Draft five to eight rules** from what the group said, following `CONDUCT.md`: concrete, one behaviour per rule, each deciding situations the group has not described yet. Use the group's own words where you can.
3. **Check the seven dimensions** (initiative, amount, register, withholding, address, uncertainty, relationship). Note which ones the description leaves open.
4. **Propose a voice** from the catalogue that fits the description, or ask for one. Describe voices by their sound, as the catalogue does.
5. **Read back before writing.** Show the group the name, the voice and the numbered rules, and say which dimensions are still open. Ask one or two short questions about what is missing ("When the doctor is in the room, whom does it talk to?"). Do not write the file yet.
6. **Revise and confirm.** Adjust the rules to the answers. When the group agrees (or says "fine", "go"), write the file.
7. **Write** `conduct.md` with front matter `name` and `voice`, and the rules as a `-` list. Create the device folder and an empty `performances/` folder if they do not exist.
8. **Run** `node system/bin/check` and fix any error in the conduct.
9. **Report** in one or two sentences what you wrote, and offer the next step: a form (`FORM.md`) or a performance. If `BRIEF.md` asks the group to record which device is which, add a line to `design/notes.md` or remind them to.

## Never

- Write the file before the group has seen the rules.
- Invent the conduct: every rule must come from something the group said or agreed to.
- Add fields to the front matter that are not in `CONDUCT.md`.
- Write outside `design/`.
