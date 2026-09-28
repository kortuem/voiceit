# Procedure: revise

**Purpose:** act on a remark about a performance ("it talks too much when the doctor is there", "it should just show the message").
**Reads:** the remark; the performance; the device's `conduct.md`; `system/CONDUCT.md`.
**Writes:** the performance, or `conduct.md` and then the performance.

## Steps

1. **Say first what kind of change it is**, in one sentence, before editing anything:
   - **Line fix**: the performance broke its own rules; the rule is fine. Name the rule the line broke.
   - **Rule change**: the performance follows the rules and still feels wrong, so a rule must change or be added. Name the rule, and quote the new wording you propose.
   If you are not sure, say so and ask the group which one they mean.
2. **For a line fix:** change only the lines concerned in the performance. Keep the rest as it is, including the group's hand edits.
3. **For a rule change:** show the old and the new rule and wait for the group to agree. Then update `conduct.md`, and write the performance again following `write-performance.md`. Mention other performances of this device that the new rule affects.
4. **Run** `node system/bin/check` on every file you changed and fix all errors.
5. **Report** what changed, as a line fix or a rule change, in one or two sentences.

## Never

- Edit before saying whether it is a line fix or a rule change.
- Silently turn a line fix into a rule change, or the reverse.
- Change a rule without the group's agreement.
- Rewrite parts of the performance the remark was not about.
