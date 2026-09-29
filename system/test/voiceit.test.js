// Tests for the shared code and the check. Run from the project folder:
//   node --test system/test/voiceit.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');
const VoiceIt = require('../voiceit.js');

const root = path.resolve(__dirname, '..', '..');
const vocab = VoiceIt.parseVocabulary(fs.readFileSync(path.join(root, 'system', 'VOCABULARY.md'), 'utf8'));
const head = '---\ncharacter: Test\nvoice: Ash\n---\n';   // lines after this start at 5
const check = (text) => VoiceIt.validateBehaviour(head + text, vocab);
const lines = (r) => r.errors.map(e => 'E' + e.ln).concat(r.warnings.map(w => 'W' + w.ln)).join(' ');

test('the vocabulary itself has no problems', () => {
  assert.deepStrictEqual(vocab.problems, []);
});

test('a pause plays exactly what is written', () => {
  const r = check('(pause 3)\n(pause 1.5s)\n(beat)\n(pause 0)\n(pause 90)\n');
  assert.deepStrictEqual(r.parsed.lines.map(l => l.secs), [3, 1.5, 1, 0, 90]);
  assert.strictEqual(lines(r), 'W8 W9');   // 0 adds no silence; 90 is very long
});

test('a malformed pause is an error and is not played', () => {
  const r = check('(pause 1.2.3)\n(pause)\n(pause soon)\n');
  assert.strictEqual(r.parsed.lines.length, 0);
  assert.strictEqual(lines(r), 'E5 E6 E7 W1');   // and nothing is left to play
});

test('a decimal comma in a pause gets its own message', () => {
  const r = check('(pause 2,5)\n');
  assert.match(r.errors[0].msg, /point, not a comma: \(pause 2\.5\)/);
});

test('character and voice are required; note is not', () => {
  const r = VoiceIt.validateBehaviour('---\nnote: Somewhere\n---\nDEVICE: Hi.\n', vocab);
  assert.deepStrictEqual(r.errors.map(e => e.msg), ['The front matter has no character.', 'The front matter has no voice.']);
});

test('an unknown voice is reported on its own line', () => {
  const r = VoiceIt.validateBehaviour('---\ncharacter: X\nvoice: Barry\n---\nDEVICE: Hi.\n', vocab);
  assert.strictEqual(lines(r), 'E3');
});

test('screen, light and sound must come from the vocabulary', () => {
  const r = check('SCREEN: banner Hi\nLIGHT: pink\nLIGHT: amber blinking\nSOUND: fanfare\n');
  assert.strictEqual(lines(r), 'E5 E6 E8 W7');
});

test('a touch must hit an option on the screen', () => {
  const r = check('SCREEN: choice Call? | Yes | No\nTOUCH: Yes\nTOUCH: Maybe\n');
  assert.strictEqual(lines(r), 'W7');
});

test('people: roles are read, and unlisted speakers are reported', () => {
  const r = VoiceIt.validateBehaviour('---\ncharacter: X\nvoice: Ash\npeople: Anna (patient), Daan (her son, 45)\n---\nANNA: Hi.\nBOB: Hello.\n', vocab);
  assert.deepStrictEqual(VoiceIt.parsePeople(r.parsed.meta.people), [
    {key:'ANNA', name:'Anna', role:'patient'}, {key:'DAAN', name:'Daan', role:'her son, 45'}]);
  assert.strictEqual(lines(r), 'W7');
});

test('the product may speak under its character name', () => {
  const r = VoiceIt.validateBehaviour('---\ncharacter: Rex\nvoice: Ash\npeople: Anna (patient)\n---\nREX (low): Hello.\nANNA: Hi.\n', vocab);
  assert.deepStrictEqual(r.parsed.lines.map(l => l.device), [true, false]);
  assert.strictEqual(lines(r), '');
});

test('examples and your own behaviours are kept apart', () => {
  const d = VoiceIt.buildDesign([
    {path:'design/behaviours/a.md', text:head + 'DEVICE: One.\n'},
    {path:'examples/behaviours/a.md', text:head + 'DEVICE: Two.\n'},
    {path:'examples/forms/lamp.svg', url:'x'},
    {path:'design/forms/process/sketch.png', url:'y'}]);
  assert.deepStrictEqual(Object.keys(d.behaviours).sort(), ['a', 'example: a']);
  assert.strictEqual(d.behaviours['example: a'].example, true);
  assert.deepStrictEqual(Object.keys(d.forms), ['example: lamp']);   // process/ is not listed
});

test('the examples pass the check', () => {
  const r = spawnSync(process.execPath, [path.join(root, 'system', 'bin', 'check'), 'examples'], {cwd:root, encoding:'utf8'});
  assert.strictEqual(r.status, 0, r.stdout);
  assert.match(r.stdout, /Checked 3 behaviours: 0 errors, 0 warnings/);
});

test('the check fails on a file that does not exist', () => {
  const r = spawnSync(process.execPath, [path.join(root, 'system', 'bin', 'check'), 'design/behaviours/nope.md'], {cwd:root, encoding:'utf8'});
  assert.strictEqual(r.status, 1);
  assert.match(r.stdout, /No such file or folder/);
});
