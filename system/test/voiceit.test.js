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

test('an unknown voice word in the people line stays part of the role, with a warning', () => {
  const {r} = castOf('Anna (patient, voice deep)', 'ANNA: Hi.\n');
  assert.strictEqual(lines(r), 'W4');
  assert.match(r.warnings[0].msg, /voice deep.*Anna.*read as part of the role/);
  assert.deepStrictEqual(VoiceIt.parsePeople('Eva (voice message), Mia (daughter, voice: high), Joost (voice low, patient)', vocab).map(x => [x.role, x.voice]),
    [['voice message', ''], ['daughter', 'high'], ['patient', 'low']]);
});

test('named voices are cast before low and high, which prefer the clearest voices', () => {
  const {map} = castOf('A (voice low), B (voice Theo)', 'A: Hi.\nB: Hi.\n');
  assert.strictEqual(map.get('B'), 'Theo');
  assert.strictEqual(map.get('A'), 'Rowan');
  const high = castOf('Anna (voice high)', 'ANNA: Hi.\n').map.get('ANNA');
  assert.strictEqual(high, 'Wren');
});

test('names with accents speak; times and long phrases before a colon are actions without a warning', () => {
  const r = VoiceIt.validateBehaviour(head + 'DANIËL: Hoi.\nZOË (softly): Hi.\nAt 15:00 Anna wakes.\nLater that night: the ward is quiet.\nAnna: Hello.\n', vocab);
  assert.deepStrictEqual(r.parsed.lines.map(l => l.kind), ['speech', 'speech', 'action', 'action', 'action']);
  assert.strictEqual(lines(r), 'W9');
});

test('quoted, lower-case and BOM front matter is read as meant', () => {
  const r = VoiceIt.validateBehaviour('\uFEFF---\ncharacter: "Rex"\nvoice: ash\n---\nREX: Hello.\n', vocab);
  assert.deepStrictEqual(r.errors, []);
  assert.strictEqual(r.parsed.meta.voice, 'Ash');
  assert.strictEqual(r.parsed.lines[0].who, 'DEVICE');
});

test('a manner after the colon, a pause with more on its line, and seconds written out', () => {
  const r = check('DEVICE: (quietly) Good evening.\n(pause 3) Joost waits.\n(pause 2 seconds)\n');
  assert.strictEqual(lines(r), 'E6 W5');
  assert.match(r.warnings[0].msg, /spoken aloud.*DEVICE \(quietly\): /);
  assert.strictEqual(r.parsed.lines[2].secs, 2);
});

test('the shared-voice advice names the product only when it is in the same register', () => {
  const {r} = castOf('A (voice low), B (voice low), C (voice low), D (voice low)', 'A: 1.\nB: 2.\nC: 3.\nD: 4.\n', 'Mira');
  assert.match(r.warnings[0].msg, /the catalogue has only 3 low voices for people\. Let fewer people speak/);
  assert.doesNotMatch(r.warnings[0].msg, /give the product/);
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
  assert.match(r.stdout, /Checked 5 behaviours: 0 errors, 0 warnings/);
});

test('the check fails on a file that does not exist', () => {
  const r = spawnSync(process.execPath, [path.join(root, 'system', 'bin', 'check'), 'design/behaviours/nope.md'], {cwd:root, encoding:'utf8'});
  assert.strictEqual(r.status, 1);
  assert.match(r.stdout, /No such file or folder/);
});

test('the Setup tab says the same as step 1 of the tutorial, word for word', () => {
  const md = fs.readFileSync(path.join(root, 'TUTORIAL.md'), 'utf8');
  const tutorial = md.slice(md.indexOf('## 1. Set up') + '## 1. Set up'.length, md.indexOf('## 2. '));
  const html = fs.readFileSync(path.join(root, 'system', 'voiceit.html'), 'utf8');
  const start = html.indexOf('<div id="setupSteps">'), page = html.slice(start, html.indexOf('</div>', html.lastIndexOf('</ol>', html.indexOf('<b>Next:</b>'))));
  const wordsOf = t => t.replace(/^\s*\d+\.\s/gm, ' ').replace(/\]\([^)]*\)/g, ']').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').toLowerCase().match(/[a-z0-9]+/g);
  assert.ok(start > 0, 'the Setup tab has <div id="setupSteps">');
  assert.deepStrictEqual(wordsOf(page), wordsOf(tutorial), 'copy step 1 of TUTORIAL.md into the Setup tab (system/voiceit.html), or the other way round');
});

test('the page asks for voiceit.js by the current version (browsers may keep an old copy)', () => {
  const html = fs.readFileSync(path.join(root, 'system', 'voiceit.html'), 'utf8');
  assert.match(html, new RegExp(`<script src="voiceit\\.js\\?v=${VoiceIt.VERSION.replace(/\./g, '\\.')}"></script>`), 'set ?v= in voiceit.html to VERSION');
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

test('a pause must be a finite number of at most an hour, and all pauses together at most an hour', () => {
  assert.strictEqual(lines(check(`(pause ${'9'.repeat(310)})\nDEVICE: Hi.\n`)), 'E5');
  assert.strictEqual(lines(check('(pause 4000)\nDEVICE: Hi.\n')), 'E5');
  const many = Array.from({length: 3}, () => '(pause 1500)').join('\n') + '\n';
  const r = check(many);
  assert.ok(r.errors.some(e => /pauses add up/.test(e.msg)), 'aggregate');
  assert.ok(r.parsed.lines.every(l => l.kind !== 'pause' || Number.isFinite(l.secs)));
});

test('vocabulary names are plain words, so they cannot carry markup into the page', () => {
  const md = fs.readFileSync(path.join(root, 'system', 'VOCABULARY.md'), 'utf8');
  const bad = VoiceIt.parseVocabulary(md.replace('name: chime', 'name: x"><svg/onload=window.__voiceitqa=1>'));
  assert.ok(bad.problems.some(p => /only letters, digits, spaces and hyphens/.test(p.msg)));
  assert.ok(!Object.keys(bad.sound).some(n => /[<>"]/.test(n)));
});

test('the timeline escapes every imported field, and its ruler stays short for any length', () => {
  const html = fs.readFileSync(path.join(root, 'system', 'voiceit.html'), 'utf8');
  const lanes = html.slice(html.indexOf('function buildLanes'), html.indexOf('function ruler'));
  assert.doesNotMatch(lanes, /title="\$\{(?!esc\(|tip\})/, 'a title attribute without esc()');   // tip is built with esc() just before
  const src = html.slice(html.indexOf('function ruler'), html.indexOf('\n', html.indexOf('return r; }', html.indexOf('function ruler'))));
  const ruler = new Function('fmt', `${src}; return ruler;`)(t => String(t));
  for (const total of [30, 900, 3600 * 5, 1e7]) assert.ok((ruler(total, t => '0%').match(/class="tick"/g) || []).length <= 41, `ticks for ${total}`);
  assert.strictEqual(ruler(Infinity, () => '0%'), '');
});

test('the preview serves and lists only real paths inside the project, never through links out or to hidden files', async () => {
  const os = require('os'), http = require('http');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'voiceit-boundary-')), proj = path.join(tmp, 'voiceit'), out = path.join(tmp, 'outside');
  for (const f of ['voiceit.js', 'voiceit.html', 'VOCABULARY.md', 'bin/preview']) { fs.mkdirSync(path.dirname(path.join(proj, 'system', f)), {recursive: true}); fs.copyFileSync(path.join(root, 'system', f), path.join(proj, 'system', f)); }
  const beh = path.join(proj, 'design', 'behaviours'); fs.mkdirSync(beh, {recursive: true}); fs.mkdirSync(path.join(out, 'dir'), {recursive: true});
  const script = '---\ncharacter: X\nvoice: Ash\n---\nDEVICE: Hi.\n';
  fs.writeFileSync(path.join(beh, 'own.md'), script); fs.writeFileSync(path.join(proj, 'design', 'kept.md'), script);
  fs.writeFileSync(path.join(out, 'x.md'), script); fs.writeFileSync(path.join(out, 'secret.txt'), 'SECRET'); fs.writeFileSync(path.join(out, 'dir', 'y.md'), script);
  fs.writeFileSync(path.join(proj, '.hidden-note.txt'), 'HIDDEN');
  fs.symlinkSync(path.join(out, 'x.md'), path.join(beh, 'leak.md'));                 // an outside behaviour
  fs.symlinkSync(path.join(out, 'secret.txt'), path.join(proj, 'design', 'secret.txt')); // an outside file
  fs.symlinkSync(path.join(out, 'dir'), path.join(beh, 'outdir'));                    // an outside folder
  fs.symlinkSync(path.join(proj, '.hidden-note.txt'), path.join(proj, 'design', 'alias.txt')); // a hidden target
  fs.symlinkSync(path.join(proj, 'design', 'kept.md'), path.join(beh, 'inside.md'));  // a link that stays inside: allowed
  const port = 4600 + Math.floor(Math.random() * 300);
  const srv = require('child_process').spawn(process.execPath, [path.join(proj, 'system', 'bin', 'preview'), '--port', String(port), '--no-open'], {stdio: ['ignore', 'pipe', 'pipe']});
  try {
    // the preview moves to the next free port if this one is taken: read the one it reports
    const at = await new Promise((res, rej) => { let o = ''; srv.stdout.on('data', d => { o += d; const m = o.match(/127\.0\.0\.1:(\d+)/); if (m) res(+m[1]); }); setTimeout(() => rej(new Error('preview did not start')), 5000); });
    const get = p => new Promise((res, rej) => http.get({host: '127.0.0.1', port: at, path: p}, r => { let b = ''; r.on('data', d => b += d); r.on('end', () => res({code: r.statusCode, body: b})); }).on('error', rej));
    for (const p of ['/design/secret.txt', '/design/alias.txt', '/design/behaviours/leak.md', '/design/behaviours/outdir/y.md', '/design/..%2f..%2foutside/secret.txt', '/.hidden-note.txt'])
      assert.strictEqual((await get(p)).code, 404, p);
    assert.strictEqual((await get('/design/behaviours/own.md')).code, 200);
    assert.strictEqual((await get('/design/behaviours/inside.md')).code, 200);
    const d = JSON.parse((await get('/design.json')).body), keys = Object.keys(d.behaviours);
    assert.ok(keys.includes('own') && keys.includes('inside'), keys.join());
    assert.ok(!keys.includes('leak') && !keys.includes('y'), keys.join());
  } finally { srv.kill(); fs.rmSync(tmp, {recursive: true, force: true}); }
});
