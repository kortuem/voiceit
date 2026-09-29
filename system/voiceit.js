/* VoiceIt: the shared code.
   The page (system/voiceit.html) and the check script (system/bin/check) both use this file,
   so what the check accepts is exactly what the page plays. The vocabulary is not written
   here: it is read from system/VOCABULARY.md, the single source. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.VoiceIt = factory();
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

// the version shown by the page and the preview; add a matching entry at the top of CHANGELOG.md
const VERSION = '0.2.3';
const RESERVED = ['DEVICE', 'SCREEN', 'LIGHT', 'SOUND', 'TOUCH'];
const KINDS = ['component', 'light', 'modifier', 'sound', 'voice', 'manner'];
const NUMERIC = ['pitch', 'rate', 'volume'];
const DEFAULT_VOICE = 'Mira';

const words = s => (String(s).trim().match(/\S+/g) || []).length;
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function orList(names){ return names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' or ' + names[names.length - 1]; }
function andList(names){ return names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]; }
function formatTime(t){ t = Math.max(0, Math.round(t)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); }

/* ---------- Vocabulary: fenced entries in VOCABULARY.md ---------- */
function parseVocabulary(md){
  md = String(md || '').replace(/\r\n/g, '\n');
  const v = {component:{}, light:{}, modifier:{}, sound:{}, voice:{}, manner:{}, problems:[]};
  const re = /^```[ \t]*([a-z]+)[ \t]*\n([\s\S]*?)\n```[ \t]*$/gm;
  let m;
  while ((m = re.exec(md))) {
    const kind = m[1];
    if (!KINDS.includes(kind)) continue;   // other fenced blocks are examples for people
    const ln = md.slice(0, m.index).split('\n').length;
    const e = {};
    m[2].split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) e[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim(); });
    if (!e.name) { v.problems.push({ln, msg:`A ${kind} entry has no name.`}); continue; }
    NUMERIC.forEach(k => {
      if (!(k in e)) return;
      const n = parseFloat(e[k]);
      if (isNaN(n)) v.problems.push({ln, msg:`${e.name}: ${k} must be a number.`}); else e[k] = n;
    });
    if (kind === 'voice' && (typeof e.pitch !== 'number' || typeof e.rate !== 'number')) v.problems.push({ln, msg:`Voice ${e.name} needs pitch and rate.`});
    if (kind === 'light' && !/^#[0-9a-f]{6}$/i.test(e.colour || '')) v.problems.push({ln, msg:`Light ${e.name} needs a colour like #FFB547.`});
    if (kind === 'manner') e.words = (e.words || e.name).split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
    const key = kind === 'voice' ? e.name : e.name.toLowerCase();
    if (v[kind][key]) v.problems.push({ln, msg:`${kind} ${e.name} is defined twice.`});
    v[kind][key] = e;
  }
  ['component', 'light', 'sound', 'voice'].forEach(k => { if (!Object.keys(v[k]).length) v.problems.push({ln:0, msg:`No ${k} entries found.`}); });
  return v;
}

/* ---------- Files ---------- */
function frontMatter(txt){
  txt = String(txt || '').replace(/\r\n/g, '\n');
  const m = txt.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(\n|$)/);
  const meta = {};
  if (!m) return {meta, body:txt, offset:0, found:false};
  m[1].split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim(); });
  return {meta, body:txt.slice(m[0].length), offset:m[0].split('\n').length - 1, found:true};
}

/* ---------- Screenplay parser ---------- */
const PAUSE_RE = /^\(\s*(beat|pause)\b([^)]*)\)$/i;   // (beat), (pause 3); the number is checked below
const SECONDS_RE = /^\d+(\.\d+)?\s*s?$/;
const LONG_PAUSE = 60;
const CUE_RE = /^(SCREEN|LIGHT|SOUND|TOUCH)\s*:\s*(.*)$/i;
const SPEECH_RE = /^([A-Z][A-Z0-9 .'’-]*?)\s*(?:\(([^)]*)\))?\s*:\s*(.+)$/;
const LOOKS_NAME_RE = /^([A-Za-z][\w .'’-]{0,30}?)\s*(?:\([^)]*\))?\s*:\s*\S/;

function parseScript(txt, vocab){
  const comps = Object.keys(vocab.component), lights = vocab.light, mods = Object.keys(vocab.modifier), sounds = Object.keys(vocab.sound);
  const {meta, body, offset} = frontMatter(txt);
  const lines = [], errors = [], warnings = [];
  const self = (meta.character || '').trim().toUpperCase();   // the product may also speak under its character's name
  body.split('\n').forEach((raw, i) => {
    const s = raw.trim(), ln = i + 1 + offset;
    if (!s || s.startsWith('#')) return;
    let m;
    if ((m = s.match(PAUSE_RE))) {
      // a pause plays exactly what is written; anything doubtful is reported, never changed
      const kind = m[1].toLowerCase(), arg = m[2].trim();
      if (kind === 'beat') {
        if (arg) warnings.push({ln, msg:`(beat) is always one second; for “${arg}” write (pause n).`});
        lines.push({kind:'pause', secs:1, ln, text:'beat'}); return;
      }
      if (/^\d+,\d+\s*s?$/.test(arg)) { errors.push({ln, msg:`“(pause ${arg})”: write the number with a point, not a comma: (pause ${arg.replace(',', '.').replace(/\s*s$/, '')}). Not played.`}); return; }
      if (!SECONDS_RE.test(arg)) { errors.push({ln, msg:`“(pause${arg ? ' ' + arg : ''})” needs a number of seconds, like (pause 3). Not played.`}); return; }
      const secs = parseFloat(arg);
      if (secs === 0) warnings.push({ln, msg:'(pause 0) adds no silence.'});
      if (secs > LONG_PAUSE) warnings.push({ln, msg:`A pause of ${secs} seconds is very long. Is that intended?`});
      lines.push({kind:'pause', secs, ln, text:`${secs} seconds`}); return;
    }
    if ((m = s.match(CUE_RE))) {
      const key = m[1].toUpperCase(), rest = m[2].trim();
      if (key === 'SCREEN') {
        const sp = rest.match(/^(\w+)\s*(.*)$/); let comp = sp ? sp[1].toLowerCase() : ''; let parts = (sp ? sp[2] : '').split('|').map(x => x.trim());
        if (!comps.includes(comp)) { errors.push({ln, msg:`“${comp || '(empty)'}” is not a screen component. Use ${orList(comps)}. Shown as a statement.`}); parts = [rest]; comp = 'statement'; }
        if (comp === 'choice' && parts.slice(1).filter(Boolean).length < 1) warnings.push({ln, msg:'A choice needs at least one option after the question, separated by |.'});
        lines.push({kind:'screen', comp, parts, ln}); return;
      }
      if (key === 'LIGHT') {
        const toks = rest.toLowerCase().split(/[\s,]+/).filter(Boolean);
        if (toks[0] === 'off') { lines.push({kind:'light', off:true, ln}); return; }
        const colour = toks.find(t => lights[t]);
        if (!colour) { errors.push({ln, msg:(toks.length ? `“${toks[0]}” is not a light colour. ` : '') + `LIGHT needs a colour: ${Object.keys(lights).join(', ')}, or off.`}); return; }
        const extra = toks.filter(t => t !== colour && !mods.includes(t));
        if (extra.length) warnings.push({ln, msg:`LIGHT ignores “${extra.join(' ')}”. It knows a colour, then ${andList(mods)}.`});
        lines.push({kind:'light', colour, pulse:toks.includes('pulse'), dim:toks.includes('dim'), ln}); return;
      }
      if (key === 'SOUND') {
        const snd = rest.toLowerCase().split(/\s+/)[0];
        if (!sounds.includes(snd)) { errors.push({ln, msg:`“${rest || '(empty)'}” is not a sound. Use ${orList(sounds)}.`}); return; }
        lines.push({kind:'sound', sound:snd, ln}); return;
      }
      if (key === 'TOUCH') { lines.push({kind:'touch', target:rest || 'screen', ln}); return; }
    }
    if ((m = s.match(SPEECH_RE)) && !RESERVED.slice(1).includes(m[1].trim())) {
      const who = m[1].trim(); const text = m[3].trim(); const cut = /(—|--)\s*$/.test(text);
      const device = who === 'DEVICE' || (!!self && who === self);
      lines.push({kind:'speech', who:device ? 'DEVICE' : who, device, manner:(m[2] || '').trim(), text, cut, ln}); return;
    }
    if ((m = s.match(LOOKS_NAME_RE)) && !/^\d/.test(s)) {
      warnings.push({ln, msg:`“${m[1]}:” looks like a speaker. Names are written in capitals; this line is read as an action.`});
    }
    lines.push({kind:'action', text:s, ln});
  });
  // a touch must hit an option that is on the screen at that moment
  let lastScreen = null;
  lines.forEach(l => {
    if (l.kind === 'screen') lastScreen = l;
    if (l.kind === 'touch' && !/^screen$/i.test(l.target)) {
      const opts = lastScreen && lastScreen.comp === 'choice' ? lastScreen.parts.slice(1).map(x => x.toLowerCase()) : [];
      if (!opts.includes(l.target.toLowerCase())) warnings.push({ln:l.ln, msg:`TOUCH “${l.target}” is not an option on the screen at that moment.`});
    }
  });
  return {meta, lines, errors, warnings};
}

/* ---------- Casting and timing ---------- */
// DEVICE gets the behaviour's voice; people get the other catalogue voices in order of appearance.
function cast(lines, deviceVoice, vocab){
  const names = Object.keys(vocab.voice);
  const dv = vocab.voice[deviceVoice] ? deviceVoice : (vocab.voice[DEFAULT_VOICE] ? DEFAULT_VOICE : names[0]);
  const map = new Map([['DEVICE', dv]]);
  const pool = names.filter(n => n !== dv);
  lines.forEach(l => {
    if (l.kind !== 'speech' || map.has(l.who)) return;
    const used = [...map.values()];
    map.set(l.who, pool.find(n => !used.includes(n)) || pool[(map.size - 1) % pool.length]);
  });
  return map;
}
// Manner words found in a parenthetical: rates and pitches multiply, the quietest volume wins.
function manner(str, vocab){
  const s = String(str || '').toLowerCase(); const o = {volume:1, rate:1, pitch:1}; let vol = null;
  Object.values(vocab.manner).forEach(e => {
    if (!e.words.some(w => new RegExp('\\b' + escRe(w)).test(s))) return;
    if (typeof e.volume === 'number') vol = vol == null ? e.volume : Math.min(vol, e.volume);
    if (typeof e.rate === 'number') o.rate *= e.rate;
    if (typeof e.pitch === 'number') o.pitch *= e.pitch;
  });
  if (vol != null) o.volume = vol;
  return o;
}
function speechDur(l, voice, vocab){ const md = manner(l.manner, vocab); return Math.max(.9, words(l.text) * .36 / (md.rate * (voice ? voice.rate : 1)) + .35); }
function schedule(lines, castMap, vocab){
  let t = 0; const ev = [];
  lines.forEach((l, i) => {
    const e = {i, l, start:t, end:t};
    if (l.kind === 'speech') { e.end = t + speechDur(l, vocab.voice[castMap.get(l.who)], vocab); t = e.end + (l.cut ? 0 : .3); }
    else if (l.kind === 'action') { e.end = t + Math.min(6, Math.max(1.8, words(l.text) * .3)); t = e.end; }
    else if (l.kind === 'pause') { e.end = t + l.secs; t = e.end; }
    else if (l.kind === 'touch') { e.end = t + 1.2; t = e.end; }
    ev.push(e);
  });
  return {ev, total:Math.max(t, 1)};
}

/* ---------- Validation ---------- */
const REQUIRED = ['character', 'voice'];   // note and people are optional
// line number of a front matter key, so messages point at the right line
function metaLine(text, key){
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
  const i = lines.findIndex((l, k) => k > 0 && new RegExp('^\\s*' + key + '\\s*:', 'i').test(l));
  return i >= 0 ? i + 1 : 1;
}
// the # lines right after the front matter: comments on what is going on, not played
function comments(text){
  const {body} = frontMatter(text); const out = [];
  for (const raw of body.split('\n')) {
    const l = raw.trim();
    if (!l) { if (out.length) break; continue; }
    if (!l.startsWith('#')) break;
    out.push(l.replace(/^#+\s*/, ''));
  }
  return out.join(' ');
}
// people: Joost (patient), Eva (his daughter), Samira (night nurse)
// Returns [{key:'JOOST', name:'Joost', role:'patient'}]; key is the name as written in the script.
function parsePeople(str){
  const out = []; let depth = 0, buf = '';
  // split on commas that are not inside brackets, so a role may contain a comma
  for (const ch of String(str || '') + ',') {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && !depth) { const t = buf.trim(); buf = '';
      if (!t) continue;
      const m = t.match(/^([^()]+?)\s*(?:\(([^)]*)\))?$/);
      if (m) out.push({key:m[1].trim().toUpperCase(), name:m[1].trim(), role:(m[2] || '').trim()});
      continue; }
    buf += ch;
  }
  return out;
}
function validateBehaviour(text, vocab){
  const p = parseScript(text, vocab);
  const errors = [...p.errors], warnings = [...p.warnings];
  const voices = Object.keys(vocab.voice);
  if (!frontMatter(text).found) {
    errors.push({ln:1, msg:'The file has no front matter. Start with ---, then character: …, voice: …, then ---.'});
  } else {
    REQUIRED.forEach(k => { if (!p.meta[k]) errors.push({ln:1, msg:`The front matter has no ${k}.`}); });
    if (p.meta.voice && !vocab.voice[p.meta.voice]) errors.push({ln:metaLine(text, 'voice'), msg:`“${p.meta.voice}” is not in the voice catalogue. Choose one of ${orList(voices)}.`});
  }
  const people = parsePeople(p.meta.people);
  if (people.length) {
    const known = people.map(x => x.key), seen = new Set();
    p.lines.forEach(l => {
      if (l.kind !== 'speech' || l.device || known.includes(l.who) || seen.has(l.who)) return;
      seen.add(l.who);
      warnings.push({ln:l.ln, msg:`${l.who} speaks but is not in the people line (${people.map(x => x.name).join(', ')}).`});
    });
  }
  if (!p.lines.length) warnings.push({ln:1, msg:'The script has no lines yet.'});
  const byLine = (a, b) => a.ln - b.ln;
  return {parsed:p, errors:errors.sort(byLine), warnings:warnings.sort(byLine)};
}

/* ---------- The design folder as data ---------- */
// files: [{path:'design/behaviours/x.md', text:'…'}, {path:'design/forms/y.png', url:'…'}]
// Returns {forms, behaviours, vocabulary}: two pools that can be combined freely. Files under examples/
// are marked example: students copy them into design/ before changing them.
const FORM_RE = /\.(png|jpe?g|webp|svg)$/i;
const label = stem => stem.replace(/[-_]+/g, ' ').trim();
function buildDesign(files){
  const forms = {}, behaviours = {}; let vocabulary = null;
  const list = files.map(f => ({...f, p:String(f.path).split('/').filter(Boolean)}))
    .filter(f => !f.p.some(s => s.startsWith('.') || s === 'node_modules'));
  list.forEach(f => {
    const n = f.p.length, name = f.p[n - 1], dir = f.p[n - 2];
    const stem = name.replace(/\.[^.]+$/, '');
    if (dir === 'system' && name === 'VOCABULARY.md') vocabulary = f.text;
    const example = f.p.includes('examples'), key = (example ? 'example: ' : '') + stem;
    if (dir === 'forms' && FORM_RE.test(name)) forms[key] = {name:label(stem), url:f.url, path:f.path, example};
    if (dir === 'behaviours' && /\.md$/i.test(name)) {
      const {meta} = frontMatter(f.text);
      behaviours[key] = {meta, text:f.text, path:f.path, notes:comments(f.text), mtime:f.mtime || 0, example,
        character:meta.character || label(stem), note:meta.note || ''};
    }
  });
  const sorted = (o, key) => Object.fromEntries(Object.keys(o).sort((a, b) => key(o[a]).localeCompare(key(o[b]))).map(k => [k, o[k]]));
  return {forms:sorted(forms, f => f.name), behaviours:sorted(behaviours, b => b.character + ' ' + b.note), vocabulary};
}

return {VERSION, RESERVED, DEFAULT_VOICE, parseVocabulary, frontMatter, parseScript, cast, manner, speechDur, schedule,
  comments, parsePeople, validateBehaviour, buildDesign, formatTime, words, orList};
});
