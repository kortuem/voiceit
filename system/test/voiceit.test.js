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
    {key:'ANNA', name:'Anna', role:'patient', voice:''}, {key:'DAAN', name:'Daan', role:'her son, 45', voice:''}]);
  assert.strictEqual(lines(r), 'W7');
});

const low = n => /^(low|mid-low)$/.test(vocab.voice[n].range);
const castOf = (people, script, voice = 'Ash') => {
  const r = VoiceIt.validateBehaviour(`---\ncharacter: X\nvoice: ${voice}\npeople: ${people}\n---\n${script}`, vocab);
  return {r, map: VoiceIt.cast(r.parsed.lines, r.parsed.meta.voice, vocab, VoiceIt.parsePeople(r.parsed.meta.people))};
};

test('people: a voice at the end of the brackets is read', () => {
  assert.deepStrictEqual(VoiceIt.parsePeople('Lotte (her granddaughter, 8, voice Wren), Joost (voice low), Eva'), [
    {key:'LOTTE', name:'Lotte', role:'her granddaughter, 8', voice:'Wren'},
    {key:'JOOST', name:'Joost', role:'', voice:'low'}, {key:'EVA', name:'Eva', role:'', voice:''}]);
});

test('voice low and voice high keep to their register, also when voices run out', () => {
  const men = ['A', 'B', 'C', 'D'], women = ['E', 'F', 'G', 'H', 'I'];
  const people = men.map(n => `${n} (voice low)`).concat(women.map(n => `${n} (voice high)`)).join(', ');
  const {r, map} = castOf(people, men.concat(women).map(n => `${n}: Hello.`).join('\n') + '\n');
  assert.deepStrictEqual(r.errors, []);
  men.forEach(n => assert.ok(low(map.get(n)), `${n} got ${map.get(n)}`));
  women.forEach(n => assert.ok(!low(map.get(n)), `${n} got ${map.get(n)}`));
  // the first two men get the two free low voices, not the product's
  assert.deepStrictEqual([map.get('A'), map.get('B')].sort(), ['Rowan', 'Theo']);
});

test('a named voice is used; a silent person uses up no voice', () => {
  const {map} = castOf('Lotte (voice Wren), Mia (voice high), Bea (voice high)', 'MIA: Hi.\nLOTTE: Hi.\n');
  assert.strictEqual(map.get('LOTTE'), 'Wren');
  assert.ok(!map.has('BEA'));
  assert.ok(!low(map.get('MIA')) && map.get('MIA') !== 'Wren');
});

test('in the examples, every low or high person gets a voice of that register', () => {
  const dir = path.join(root, 'examples', 'behaviours');
  for (const f of fs.readdirSync(dir)) {
    const p = VoiceIt.parseScript(fs.readFileSync(path.join(dir, f), "utf8"), vocab);
    const people = VoiceIt.parsePeople(p.meta.people), map = VoiceIt.cast(p.lines, p.meta.voice, vocab, people);
    people.filter(x => /^(low|high)$/.test(x.voice) && map.has(x.key))
      .forEach(x => assert.strictEqual(low(map.get(x.key)), x.voice === 'low', `${f}: ${x.name} got ${map.get(x.key)}`));
  }
});

test('people who share a voice get a warning that says how to resolve it', () => {
  const three = castOf('Joost (voice low), Bakker (voice low), Piet (voice low)', 'JOOST: Hi.\nBAKKER: Hi.\nPIET: Hi.\n').r;
  assert.strictEqual(lines(three), 'W4');
  assert.match(three.warnings[0].msg, /share the voice .*only 2 low voices .*Let fewer people speak.*not low/);
  const seven = castOf('', 'A: 1.\nB: 2.\nC: 3.\nD: 4.\nE: 5.\nF: 6.\nG: 7.\n').r;
  assert.match(seven.warnings.map(w => w.msg).join(' '), /A and G share the voice .*catalogue has 7 voices/);
  const product = castOf('Lotte (voice Ash)', 'DEVICE: Hi.\nLOTTE: Hi.\n').r;
  assert.match(product.warnings[0].msg, /^The product and Lotte have the same voice, Ash.*Give Lotte another voice/);
  assert.strictEqual(lines(castOf('Joost (voice low), Bakker (voice low)', 'JOOST: Hi.\nBAKKER: Hi.\n').r), '');
});

test('an unknown voice in the people line is an error on that line', () => {
  const {r} = castOf('Anna (patient, voice deep)', 'ANNA: Hi.\n');
  assert.strictEqual(lines(r), 'E4');
  assert.match(r.errors[0].msg, /voice deep.*Anna.*voice low, voice high/);
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
    {path:'examples/forms/hourglass-rendering.jpg', url:'x'},
    {path:'design/forms/process/sketch.png', url:'y'}]);
  assert.deepStrictEqual(Object.keys(d.behaviours).sort(), ['a', 'example: a']);
  assert.strictEqual(d.behaviours['example: a'].example, true);
  assert.deepStrictEqual(Object.keys(d.forms), ['example: hourglass-rendering']);   // process/ is not listed
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

test('the version matches the newest entry in CHANGELOG.md', () => {
  const log = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
  const newest = (log.match(/^## (\d+\.\d+\.\d+)/m) || [])[1];
  assert.strictEqual(newest, VoiceIt.VERSION);
});

test('examples/index.json lists exactly the example files (VoiceIt online reads it)', () => {
  const idx = JSON.parse(fs.readFileSync(path.join(root, 'examples', 'index.json'), 'utf8'));
  const list = (dir, re) => fs.readdirSync(path.join(root, 'examples', dir)).filter(f => re.test(f)).sort();
  assert.deepStrictEqual(idx.behaviours, list('behaviours', /\.md$/i), 'update examples/index.json after adding or removing an example');
  assert.deepStrictEqual(idx.forms, list('forms', /\.(png|jpe?g|webp|svg)$/i), 'update examples/index.json after adding or removing an example form');
});
