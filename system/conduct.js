/* Conduct prototyping: the shared code.
   The player (system/player.html) and the check script (system/bin/check) both use this
   file, so what the check accepts is exactly what the player plays. The vocabulary is not
   written here: it is read from system/VOCABULARY.md, the single source. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Conduct = factory();
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

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
function listItems(body){ return body.split('\n').map(l => l.trim()).filter(l => /^([-*]|\d+[.)])\s+/.test(l)).map(l => l.replace(/^([-*]|\d+[.)])\s+/, '')); }

/* ---------- Screenplay parser ---------- */
const PAUSE_RE = /^\(\s*(beat|pause\s*([\d.]+)\s*s?)\s*\)$/i;
const CUE_RE = /^(SCREEN|LIGHT|SOUND|TOUCH)\s*:\s*(.*)$/i;
const SPEECH_RE = /^([A-Z][A-Z0-9 .'’-]*?)\s*(?:\(([^)]*)\))?\s*:\s*(.+)$/;
const LOOKS_NAME_RE = /^([A-Za-z][\w .'’-]{0,30}?)\s*(?:\([^)]*\))?\s*:\s*\S/;

function parsePerformance(txt, vocab){
  const comps = Object.keys(vocab.component), lights = vocab.light, mods = Object.keys(vocab.modifier), sounds = Object.keys(vocab.sound);
  const {meta, body, offset} = frontMatter(txt);
  const lines = [], errors = [], warnings = [];
  body.split('\n').forEach((raw, i) => {
    const s = raw.trim(), ln = i + 1 + offset;
    if (!s || s.startsWith('#')) return;
    let m;
    if ((m = s.match(PAUSE_RE))) {
      const secs = m[2] ? Math.min(parseFloat(m[2]) || 1, 60) : 1;
      lines.push({kind:'pause', secs, ln, text:m[2] ? `${secs} seconds` : 'beat'}); return;
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
        if (!colour) { errors.push({ln, msg:`LIGHT needs a colour: ${Object.keys(lights).join(', ')}, or off.`}); return; }
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
      lines.push({kind:'speech', who, device:who === 'DEVICE', manner:(m[2] || '').trim(), text, cut, ln}); return;
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
// DEVICE gets the conduct's voice; people get the other catalogue voices in order of appearance.
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
const people = st => (st && st.meta.people || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

// ctx: {vocab, design, deviceDir, fileStem}
function validatePerformance(text, ctx){
  const vocab = ctx.vocab, design = ctx.design;
  const p = parsePerformance(text, vocab);
  const errors = [...p.errors], warnings = [...p.warnings];
  if (!frontMatter(text).found) {
    errors.push({ln:1, msg:'The file has no front matter. Start with ---, then device: …, situation: …, then ---.'});
  } else {
    if (!p.meta.device) errors.push({ln:1, msg:'The front matter has no device.'});
    else if (ctx.deviceDir && p.meta.device !== ctx.deviceDir) errors.push({ln:1, msg:`The front matter says device: ${p.meta.device}, but the file is in devices/${ctx.deviceDir}/.`});
    const sit = p.meta.situation;
    if (!sit) errors.push({ln:1, msg:'The front matter has no situation.'});
    else {
      if (ctx.fileStem && sit !== ctx.fileStem) warnings.push({ln:1, msg:`The front matter says situation: ${sit}, but the file is called ${ctx.fileStem}.md. Use the same name.`});
      const st = design && design.situations[sit];
      if (design && (!st || st.missing)) errors.push({ln:1, msg:`There is no situations/${sit}.md.`});
      const cast = people(st);
      if (cast.length) {
        const seen = new Set();
        p.lines.forEach(l => {
          if (l.kind !== 'speech' || l.device || cast.includes(l.who) || seen.has(l.who)) return;
          seen.add(l.who);
          warnings.push({ln:l.ln, msg:`${l.who} speaks but is not among the people of situations/${sit}.md (${cast.join(', ')}).`});
        });
      }
    }
  }
  if (!p.lines.length) warnings.push({ln:1, msg:'The performance has no lines yet.'});
  const byLine = (a, b) => a.ln - b.ln;
  return {parsed:p, errors:errors.sort(byLine), warnings:warnings.sort(byLine)};
}
function validateConduct(dev, vocab){
  const errors = [], warnings = [];
  const voices = Object.keys(vocab.voice);
  if (!dev.meta.name) warnings.push({ln:1, msg:'The front matter has no name for this device.'});
  if (!dev.meta.voice) errors.push({ln:1, msg:`The front matter has no voice. Choose one of ${orList(voices)}.`});
  else if (!vocab.voice[dev.meta.voice]) errors.push({ln:1, msg:`“${dev.meta.voice}” is not in the voice catalogue. Choose one of ${orList(voices)}.`});
  const n = dev.rules.length;
  if (n < 5 || n > 8) warnings.push({ln:0, msg:`The conduct has ${n} ${n === 1 ? 'rule' : 'rules'}; CONDUCT.md asks for five to eight, one per line starting with -.`});
  if (!dev.form) warnings.push({ln:0, file:dev.path + '/', msg:'No form image yet: save it as form.png in this folder.'});
  return {errors, warnings};
}
function validateSituation(st){
  const errors = [], warnings = [];
  if (!st.meta.title) warnings.push({ln:1, msg:'The front matter has no title.'});
  if (!people(st).length) warnings.push({ln:1, msg:'The front matter has no people (names in capitals, separated by commas).'});
  if (!st.beats.length) errors.push({ln:0, msg:'The situation has no beats. Write them as a numbered list: 1. …'});
  return {errors, warnings};
}

/* ---------- A design folder as data ---------- */
// files: [{path:'design/devices/device-a/conduct.md', text:'…'}, {path:'…/form.png', url:'…'}]
// Returns {situations, devices, vocabulary}, the object the player plays.
function buildDesign(files){
  const d = {situations:{}, devices:{}}; let vocabulary = null;
  const list = files.map(f => ({...f, p:String(f.path).split('/').filter(Boolean)}))
    .filter(f => !f.p.some(s => s.startsWith('.') || s === 'node_modules'));
  const dirOf = f => f.p.slice(0, -1).join('/');
  const stem = name => name.replace(/\.md$/i, '');
  list.forEach(f => {
    const n = f.p.length, name = f.p[n - 1];
    if (n >= 2 && f.p[n - 2] === 'system' && name === 'VOCABULARY.md') vocabulary = f.text;
    if (n >= 2 && f.p[n - 2] === 'situations' && /\.md$/i.test(name)) {
      const fm = frontMatter(f.text);
      d.situations[stem(name)] = {meta:fm.meta, beats:listItems(fm.body), path:f.path};
    }
  });
  list.forEach(f => {
    if (f.p[f.p.length - 1].toLowerCase() !== 'conduct.md') return;
    const base = dirOf(f), dir = f.p[f.p.length - 2] || 'device';
    const fm = frontMatter(f.text);
    const dev = {meta:fm.meta, rules:listItems(fm.body), performances:{}, performancePaths:{}, form:null, path:base, conductPath:f.path};
    const perfDir = base ? base + '/performances' : 'performances';
    list.forEach(o => {
      const name = o.p[o.p.length - 1];
      if (dirOf(o) === perfDir && /\.md$/i.test(name)) { dev.performances[stem(name)] = o.text; dev.performancePaths[stem(name)] = o.path; }
      if (dirOf(o) === base && /^form\.(png|jpe?g|webp|svg)$/i.test(name)) dev.form = o.url;
    });
    d.devices[dir] = dev;
  });
  // a performance may refer to a situation that is not in the folder
  Object.values(d.devices).forEach(dv => Object.keys(dv.performances).forEach(s => {
    if (!d.situations[s]) d.situations[s] = {meta:{title:s}, beats:[], missing:true};
  }));
  const sorted = o => Object.fromEntries(Object.keys(o).sort().map(k => [k, o[k]]));
  return {situations:sorted(d.situations), devices:sorted(d.devices), vocabulary};
}

return {RESERVED, DEFAULT_VOICE, parseVocabulary, frontMatter, listItems, parsePerformance, cast, manner, speechDur, schedule,
  validatePerformance, validateConduct, validateSituation, buildDesign, formatTime, words};
});
