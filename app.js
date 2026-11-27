/* ITIL Foundation (Version 5) mock exam – app logic.
   Question files in questions/ register sections with QB.add(); flashcards.js defines window.FC. */
(function(){
'use strict';

/* ---------- constants & helpers ---------- */
const PASS = 0.65, KEY = 'itil5quiz.v1', PROGRESS_KEY = 'itil5quiz.progress';
const EXAM_SECS_PER_Q = 90;                       // 60 minutes for 40 questions
const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const isList = o => /^\d and \d$/.test(o);
const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const FLAG = `<svg class="fi" viewBox="0 0 24 24" aria-hidden="true"><path class="pole" d="M5 21V4"/><path class="cloth" d="M5 4h11l-2.2 4L16 12H5"/></svg>`;

function load(k, d){ try { return JSON.parse(localStorage.getItem(k)) || d; } catch(e){ return d; } }
function saveKey(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
function removeKey(k){ try { localStorage.removeItem(k); } catch(e){} }

let store = load(KEY, {});
store.sec = store.sec || {}; store.q = store.q || {}; store.hist = store.hist || []; store.fc = store.fc || {};
let prefs = Object.assign({shuffleQ: true, feedback: true}, store.prefs || {});
store.prefs = prefs;
const save = () => saveKey(KEY, store);

let state = null, tick = null;

/* ---------- syllabus topics ---------- */
const CATS = {1: 'Key ITIL terms and definitions', 2: 'The Four Dimensions', 3: 'Product and Service Lifecycle', 4: 'The ITIL Value System',
  5: 'Value streams', 6: 'ITIL and AI', 7: 'ITIL and other frameworks'};
const TOPICS = {
  '1.1': 'Products, services and DPSM', '1.2': 'Service offerings', '1.3': 'Value co-creation', '1.4': 'Service relationships',
  '2.1': 'The Four Dimensions', '2.2': 'External factors (PESTLE)',
  '3.1': 'Lifecycle overview', '3.2': 'Lifecycle activity purposes',
  '4.1': 'ITIL Value System', '4.2': 'Guiding principles', '4.3': 'Governance', '4.4': 'Value chain', '4.5': 'Management practices', '4.6': 'Continual Improvement Model',
  '5.1': 'Value stream concepts', '5.2': 'Workflows and complexity', '5.3': 'Value stream mapping and management',
  '6.1': 'Introduction to AI', '6.2': 'AI governance and capability model',
  '7.1': 'ITIL and DevOps', '7.2': 'ITIL and PRINCE2'};
// Sample-paper questions map to these assessment criteria (from the official answer keys).
const SP = {'1-1':'1.2','1-2':'1.2','1-3':'1.2','1-4':'1.3','1-5':'1.4','1-6':'2.2','1-7':'2.2','1-8':'2.2','1-9':'2.2','1-10':'4.2','1-11':'4.2','1-12':'4.2','1-13':'4.2','1-14':'4.2','1-15':'4.3','1-16':'4.4','1-17':'1.1','1-18':'4.4','1-19':'4.4','1-20':'4.5','1-21':'4.5','1-22':'4.6','1-23':'5.3','1-24':'1.1','1-25':'4.4','1-26':'1.1','1-27':'1.4','1-28':'1.4','1-29':'1.4','1-30':'3.2','1-31':'3.2','1-32':'3.2','1-33':'3.2','1-34':'4.4','1-35':'4.4','1-36':'7.1','1-37':'6.2','1-38':'1.4','1-39':'4.1','1-40':'5.1',
  '2-1':'1.1','2-2':'1.1','2-3':'1.1','2-4':'1.2','2-5':'1.2','2-6':'1.3','2-7':'1.4','2-8':'1.3','2-9':'1.4','2-10':'1.4','2-11':'1.4','2-12':'1.4','2-13':'2.2','2-14':'2.2','2-15':'2.2','2-16':'2.2','2-17':'4.1','2-18':'4.2','2-19':'4.2','2-20':'4.2','2-21':'4.2','2-22':'4.2','2-23':'4.3','2-24':'3.2','2-25':'3.2','2-26':'3.2','2-27':'3.2','2-28':'4.4','2-29':'4.4','2-30':'4.4','2-31':'4.4','2-32':'4.4','2-33':'4.4','2-34':'4.4','2-35':'4.4','2-36':'4.5','2-37':'4.5','2-38':'4.6','2-39':'5.1','2-40':'5.3'};
const SEC_TOPIC = {1:'1.1',2:'1.3',3:'1.4',4:'2.1',5:'3.2',6:'4.2',7:'4.2',8:'4.4',9:'4.5',10:'4.6',11:'5.3',12:'6.1',13:'1.4',14:'3.2',15:'4.2',16:'5.1',17:'4.5',18:'1.4',19:'4.2',20:'4.3',21:'4.6',22:'3.2',23:'1.3'};
function topicOf(src, sec){
  const m = String(src).match(/Syllabus (\d)\.(\d)\.\d/) || String(src).match(/(\d)\.(\d)\.\d/);
  if (m && TOPICS[m[1] + '.' + m[2]]) return m[1] + '.' + m[2];
  const p = String(src).match(/Sample Paper (\d), Q(\d+)/);
  if (p && SP[p[1] + '-' + p[2]]) return SP[p[1] + '-' + p[2]];
  return SEC_TOPIC[sec] || '1.1';
}

/* Flat index of every question: {id, sec, i, it, topic} */
const ALL = [];
QB.sections.forEach(s => s && s.items.forEach((it, i) => ALL.push({id: s.n + '-' + i, sec: s.n, i, it, topic: topicOf(it[4], s.n)})));
const BY_ID = Object.fromEntries(ALL.map(e => [e.id, e]));

/* ---------- tracking ---------- */
function recordAttempt(){
  state.qs.forEach((q, i) => {
    const ok = state.sel[i] === q.ans, flagged = state.flag[i];
    const st = store.q[q.id] || {n: 0, c: 0, s: 0};
    st.n++; if (ok) st.c++;
    st.s = ok ? st.s + 1 : 0;
    if (!ok || flagged) { st.r = 1; if (flagged) st.s = 0; }
    else if (st.r && st.s >= 2) delete st.r;            // cleared after two correct answers in a row
    store.q[q.id] = st;
  });
  const score = state.picks.filter(p => p.ok).length;
  store.hist.push({t: Date.now(), title: state.title, mode: state.mode, score, total: state.qs.length});
  if (store.hist.length > 300) store.hist = store.hist.slice(-300);
  if (state.mode === 'sec' && !state.partial) {
    const st = store.sec[state.n] || {};
    st.attempts = (st.attempts || 0) + 1; st.last = score; st.best = Math.max(st.best || 0, score);
    store.sec[state.n] = st;
  }
  save();
}
function topicStats(){
  const t = {};
  Object.keys(TOPICS).forEach(k => t[k] = {k, name: TOPICS[k], n: 0, c: 0, total: 0});
  ALL.forEach(e => { t[e.topic].total++; const s = store.q[e.id]; if (s) { t[e.topic].n += s.n; t[e.topic].c += s.c; } });
  return Object.values(t);
}
const reviewIds = () => ALL.filter(e => store.q[e.id] && store.q[e.id].r).map(e => e.id);

/* ---------- building exams ---------- */
function build(entries){
  return entries.map(e => {
    const [q, right, wrongs, exp, src] = e.it;
    let opts = [right].concat(wrongs);
    opts = opts.every(isList) ? opts.slice().sort() : shuffle(opts);
    return {id: e.id, sec: e.sec, orig: e.i, topic: e.topic, q, opts, ans: opts.indexOf(right), exp, src};
  });
}
function launch(entries, info){
  if (prefs.shuffleQ || info.forceShuffle) entries = shuffle(entries);
  state = Object.assign({kind: 'exam', qs: build(entries)}, info);
  examIntro();
}
function startExam(n, onlyIdx){
  const s = QB.sections[n - 1];
  let entries = ALL.filter(e => e.sec === n);
  if (onlyIdx) entries = entries.filter(e => onlyIdx.includes(e.i));
  launch(entries, {mode: 'sec', n, title: onlyIdx ? `Section ${n}: ${s.title} (missed questions)` : `Section ${n}: ${s.title}`, partial: !!onlyIdx});
}
function startMock(){ launch(shuffle(ALL).slice(0, 40), {mode: 'mock', title: 'Full mock exam (all topics)'}); }
function startReview(){
  const ids = reviewIds(); if (!ids.length) return;
  launch(shuffle(ids.map(id => BY_ID[id])).slice(0, 40), {mode: 'review', title: 'Review exam (missed and flagged questions)', forceShuffle: true});
}
function startTopic(t){
  launch(shuffle(ALL.filter(e => e.topic === t)).slice(0, 40), {mode: 'topic', topic: t, title: `Topic ${t}: ${TOPICS[t]}`, forceShuffle: true});
}
function retake(){
  if (state.mode === 'mock') startMock();
  else if (state.mode === 'review') reviewIds().length ? startReview() : home();
  else if (state.mode === 'topic') startTopic(state.topic);
  else startExam(state.n);
}

/* ---------- home / dashboard ---------- */
function home(){
  stopTimer(); closeModal();
  document.body.classList.remove('exam');
  const secs = QB.sections.filter(Boolean);
  const passed = secs.filter(s => store.sec[s.n] && store.sec[s.n].best >= PASS * s.items.length).length;
  const prog = load(PROGRESS_KEY, null);
  const ts = topicStats().filter(t => t.n >= 3).map(t => Object.assign(t, {p: t.c / t.n})).sort((a, b) => a.p - b.p);
  const rq = reviewIds().length;
  let html = `<header class="mast"><div>
    <div class="eyebrow">ITIL® Foundation · Version 5</div>
    <h1>Exam Practice Studio</h1>
    <p>Each section is a timed exam simulation in the style of the live online exam: 90 seconds per question (60 minutes for a 40-question section), a question menu with flags, and your result at the end, followed by a full review with explanations. Pass mark 65% (26 of 40).</p>
    <hr class="rule"></div>
    <div class="figs">
      <div class="fig"><b>${secs.length}</b><span>Sections</span></div>
      <div class="fig"><b>${ALL.length}</b><span>Questions</span></div>
      <div class="fig"><b>${passed}<small>/${secs.length}</small></b><span>Passed</span></div>
    </div></header>
  <div class="notice" role="note"><b>For practice only.</b> Every question here is an original sample question written for revision. None are taken from, or represent, the official ITIL® Foundation (Version 5) exam.</div>
  ${prog ? `<div class="resume card"><div><div class="eyebrow">Exam in progress</div><b>${esc(prog.title)}</b>
      <span>${prog.sel.filter(v => v >= 0).length} of ${prog.qs.length} answered · ${fmt(prog.left)} left · timer paused</span></div>
      <div class="row"><button id="discard">Discard</button><button class="primary" id="resume">Resume exam →</button></div></div>` : ''}
  <form class="searchbar" id="sform" role="search"><input type="search" id="sq" placeholder="Search ${ALL.length} questions…" aria-label="Search questions"><button class="primary">Search</button></form>
  <div class="dash">
    <div class="card dcard"><div class="dhead"><h3>Weakest topics</h3><button class="ghost" id="alltopics">All topics →</button></div>
      ${ts.length ? `<div class="tlist">${ts.slice(0, 5).map(t => topicRow(t)).join('')}</div>`
        : '<p class="empty">Take an exam to see your accuracy by syllabus topic. Topics appear here once you have answered at least 3 questions in them.</p>'}</div>
    <div class="card dcard"><div class="dhead"><h3>Review queue</h3></div>
      <div class="rq"><b>${rq}</b><span>question${rq === 1 ? '' : 's'} to review</span></div>
      <p class="empty">Questions you got wrong or flagged. Each leaves the queue after you answer it correctly twice in a row.</p>
      <button class="primary wide" id="review" ${rq ? '' : 'disabled'}>Start review exam →</button></div>
    <div class="card dcard"><div class="dhead"><h3>Score history</h3><button class="ghost" id="hist">All attempts →</button></div>
      ${store.hist.length ? chart(store.hist.slice(-20)) : '<p class="empty">Your exam scores will be charted here, with the 65% pass line.</p>'}</div>
  </div>
  <div class="toolbar">
    <label class="tog"><input type="checkbox" id="pShuf" ${prefs.shuffleQ ? 'checked' : ''}> Shuffle question order</label>
    <label class="tog"><input type="checkbox" id="pFb" ${prefs.feedback ? 'checked' : ''}> Show correct answer after each question</label>
    <span class="spacer"></span>
    <button id="cards">Flashcards</button>
    <button id="mock" class="primary">Full mock exam →</button>
  </div><h2 class="gridtitle">Sections</h2><div class="grid">`;
  secs.forEach(s => {
    const st = store.sec[s.n] || {};
    const best = st.best != null ? `<span class="pill ${st.best >= PASS * s.items.length ? 'pass' : 'fail'}">Best ${st.best}/${s.items.length}</span>` : '<span class="pill quiet">Not yet attempted</span>';
    const last = st.last != null ? `<span class="pill">Last ${st.last}/${s.items.length}</span>` : '';
    const att = st.attempts ? `<span class="pill">${st.attempts} attempt${st.attempts > 1 ? 's' : ''}</span>` : '';
    html += `<div class="card sec"><div class="head"><div class="num">${String(s.n).padStart(2, '0')}</div><div class="tag">${s.items.length} questions</div></div>
      <h3>${esc(s.title)}</h3>
      <div class="refs">${esc(s.refs)}</div><div class="stats">${best}${last}${att}</div>
      <div class="row"><button class="primary" data-exam="${s.n}">Start exam</button><button data-study="${s.n}">Study</button></div></div>`;
  });
  html += `</div><p class="hint">In the exam: 1–4 or A–D to answer, ← → to move between questions, F to flag. Your progress is saved in this browser only. ·
  <button id="reset" class="ghost linkish">Reset all progress</button></p>
  <p class="hint" style="margin-top:6px">Sample questions for practice only; none are from the official exam. Not affiliated with or endorsed by PeopleCert. ITIL® is a registered trademark of PeopleCert.</p>`;
  app.innerHTML = html;
  app.querySelectorAll('[data-exam]').forEach(b => b.onclick = () => startExam(+b.dataset.exam));
  app.querySelectorAll('[data-study]').forEach(b => b.onclick = () => study(+b.dataset.study));
  app.querySelectorAll('[data-topic]').forEach(b => b.onclick = () => startTopic(b.dataset.topic));
  on('mock', startMock); on('cards', () => flashcards()); on('review', startReview);
  on('alltopics', topicsView); on('hist', historyView);
  on('resume', resumeExam); on('discard', () => modal('Discard exam in progress?', '<p>Your answers in that exam will be lost and no result will be recorded.</p>', [{label: 'Keep it'}, {label: 'Discard', danger: true, fn: () => { removeKey(PROGRESS_KEY); home(); }}]));
  document.getElementById('sform').onsubmit = e => { e.preventDefault(); search(document.getElementById('sq').value); };
  document.getElementById('pShuf').onchange = e => { prefs.shuffleQ = e.target.checked; save(); };
  document.getElementById('pFb').onchange = e => { prefs.feedback = e.target.checked; save(); };
  on('reset', () => modal('Reset all progress?', '<p>This clears your scores, topic statistics, review queue, score history, flashcard progress and any saved unfinished exam. It cannot be undone.</p>',
    [{label: 'Cancel'}, {label: 'Reset everything', danger: true, fn: () => { store = {prefs, sec: {}, q: {}, hist: [], fc: {}}; save(); removeKey(PROGRESS_KEY); home(); }}]));
  bindChart();
  window.scrollTo(0, 0);
}
function on(id, fn){ const el = document.getElementById(id); if (el) el.onclick = fn; }

function topicRow(t){
  const pct = t.n ? Math.round(t.c / t.n * 100) : null;
  return `<div class="trow"><div class="tname"><span class="tid">${t.k}</span>${esc(t.name)}</div>
    <div class="tbar" title="${pct == null ? 'Not attempted' : pct + '% correct'}"><div class="tfill ${pct != null && pct < 65 ? 'low' : ''}" style="width:${pct || 0}%"></div><i class="tpass"></i></div>
    <div class="tpct">${pct == null ? '–' : pct + '%'}</div>
    <button class="tgo" data-topic="${t.k}" title="Take a topic exam on ${esc(t.name)}">Practise</button></div>`;
}

/* Single-series line chart: score % per attempt, with a dashed 65% pass line. */
function chart(h){
  const W = 320, H = 200, L = 40, R = 10, T = 16, B = 26;
  const x = i => L + (h.length === 1 ? (W - L - R) / 2 : i * (W - L - R) / (h.length - 1));
  const y = p => T + (1 - p / 100) * (H - T - B);
  const pts = h.map((a, i) => ({x: x(i), y: y(a.score / a.total * 100), a}));
  const grid = [0, 50, 100].map(v => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="cg"/><text x="${L - 6}" y="${y(v) + 3}" class="cl" text-anchor="end">${v}%</text>`).join('');
  return `<div class="chartwrap"><svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Score history: last ${h.length} attempts, latest ${Math.round(h[h.length - 1].score / h[h.length - 1].total * 100)}%">
    ${grid}<line x1="${L}" x2="${W - R}" y1="${y(65)}" y2="${y(65)}" class="cpass"/><text x="${W - R}" y="${y(65) - 4}" class="cl" text-anchor="end">Pass 65%</text>
    ${pts.length > 1 ? `<polyline points="${pts.map(p => p.x + ',' + p.y).join(' ')}" class="cline"/>` : ''}
    ${pts.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="5" class="cdot"/><circle cx="${p.x}" cy="${p.y}" r="12" class="chit" data-i="${i}"/>`).join('')}
    <text x="${L}" y="${H - 6}" class="cl">Oldest</text><text x="${W - R}" y="${H - 6}" class="cl" text-anchor="end">Latest</text>
  </svg><div class="ctip" id="ctip" hidden></div></div>`
  .replace('<svg', `<svg data-h="${esc(JSON.stringify(h.map(a => [a.title, a.score, a.total, a.t]))).replace(/'/g, '&#39;')}"`);
}
function bindChart(){
  const svg = app.querySelector('svg.chart'); if (!svg) return;
  const data = JSON.parse(svg.dataset.h), tip = document.getElementById('ctip');
  const show = el => {
    const [title, s, t, ts] = data[+el.dataset.i], r = el.getBoundingClientRect(), w = svg.parentNode.getBoundingClientRect();
    tip.innerHTML = `<b>${Math.round(s / t * 100)}%</b> · ${s}/${t}<br>${esc(title)}<br><span>${new Date(ts).toLocaleDateString()}</span>`;
    tip.hidden = false;
    tip.style.left = Math.min(Math.max(r.left - w.left + r.width / 2, 70), w.width - 70) + 'px';
    tip.style.top = (r.top - w.top) + 'px';
  };
  svg.querySelectorAll('.chit').forEach(c => { c.onmouseenter = () => show(c); c.onclick = () => show(c); c.onmouseleave = () => tip.hidden = true; });
}

function topicsView(){
  const ts = topicStats();
  let html = `<div class="topbar"><button class="ghost" id="home">← Home</button></div>
  <div class="eyebrow">Your progress</div><h2 style="margin-top:6px">Accuracy by syllabus topic</h2>
  <p class="sub">Based on every exam you have taken. The tick on each bar marks the 65% pass level. Click “Practise” for a timed exam of up to 40 questions on that topic.</p>`;
  Object.keys(CATS).forEach(c => {
    html += `<div class="card tcat"><h3>${c}. ${esc(CATS[c])}</h3><div class="tlist">${ts.filter(t => t.k[0] === c).map(t => topicRow(t) + `<div class="tmeta">${t.n} answered · ${t.total} questions in bank</div>`).join('')}</div></div>`;
  });
  app.innerHTML = html;
  on('home', home);
  app.querySelectorAll('[data-topic]').forEach(b => b.onclick = () => startTopic(b.dataset.topic));
  window.scrollTo(0, 0);
}

function historyView(){
  const h = store.hist.slice().reverse();
  app.innerHTML = `<div class="topbar"><button class="ghost" id="home">← Home</button></div>
  <div class="eyebrow">Your progress</div><h2 style="margin-top:6px">Score history</h2>
  <p class="sub">${h.length} attempt${h.length === 1 ? '' : 's'} recorded in this browser.</p>
  ${h.length ? `<div class="card" style="margin-bottom:18px">${chart(store.hist.slice(-40))}</div>
  <div class="card tablecard"><table class="htable"><thead><tr><th>Date</th><th>Exam</th><th>Score</th><th>Result</th></tr></thead><tbody>
  ${h.map(a => { const p = Math.round(a.score / a.total * 100), ok = a.score >= Math.ceil(PASS * a.total);
    return `<tr><td>${new Date(a.t).toLocaleString()}</td><td>${esc(a.title)}</td><td>${a.score}/${a.total} (${p}%)</td><td><span class="pill ${ok ? 'pass' : 'fail'}">${ok ? 'Pass' : 'Fail'}</span></td></tr>`; }).join('')}
  </tbody></table></div>` : '<div class="card"><p class="empty">No attempts yet.</p></div>'}`;
  on('home', home); bindChart();
  window.scrollTo(0, 0);
}

/* ---------- exam ---------- */
function examIntro(){
  stopTimer();
  document.body.classList.remove('exam');
  const n = state.qs.length, mins = Math.round(n * EXAM_SECS_PER_Q / 60), need = Math.ceil(PASS * n);
  app.innerHTML = `<div class="topbar"><button class="ghost" id="back">← Home</button></div>
  <div class="intro"><div class="eyebrow">Exam information</div>
  <h2 style="margin:8px 0 14px">ITIL® Foundation (Version 5) – Practice Exam</h2>
  <div class="card" style="padding:22px 26px">
    <table>
      <tr><td>Paper</td><td>${esc(state.title)}</td></tr>
      <tr><td>Number of questions</td><td>${n} multiple choice, 1 mark each</td></tr>
      <tr><td>Duration</td><td>${mins} minutes</td></tr>
      <tr><td>Pass mark</td><td>${need} of ${n} (65%)</td></tr>
      <tr><td>Materials allowed</td><td>None (closed book)</td></tr>
      <tr><td>Negative marking</td><td>No</td></tr>
    </table>
    <label class="tog optbox"><input type="checkbox" id="iFb" ${prefs.feedback ? 'checked' : ''}>
      <span><b>Show the correct answer and explanation after each question.</b> Untick this for a strict simulation where answers are only revealed at the end, like the real exam.</span></label>
    <b style="font-size:.92rem">How the exam screen works</b>
    <ol>
      <li>The menu on the left lists the question numbers. Click a number, or use <b>Next</b> and <b>Previous</b>, to move between questions. The current question is highlighted.</li>
      <li>Click the letter of an answer to choose it. With answer feedback on, your answer is locked and the correct answer and explanation appear straight away. With it off, you can change your answer at any time before ending the exam.</li>
      <li>Click the flag icon next to a question number (or “Flag for review” above the question) to mark it to come back to. Flagged questions are also added to your review queue.</li>
      <li>The countdown timer is in the top right. A reminder appears when 15 minutes are left, and the exam ends automatically when time runs out.</li>
      <li>Click <b>End Exam</b> (bottom left) to see a review screen of answered, unanswered and flagged questions before you submit. Unanswered questions are marked as incorrect.</li>
      <li>If you close the page, your exam is saved with the timer paused, and you can resume it from the home page.</li>
    </ol>
  </div>
  <p class="notice" style="margin:16px 0">This is a practice simulation. All questions are original sample questions and none are from the official exam.</p>
  <div class="row endrow"><button id="back2">Cancel</button><button class="primary" id="go">Start exam →</button></div></div>`;
  on('back', home); on('back2', home);
  on('go', () => load(PROGRESS_KEY, null)
    ? modal('Replace your saved exam?', '<p>You have an unfinished exam saved. Starting this one will discard it.</p>', [{label: 'Cancel'}, {label: 'Discard and start', danger: true, fn: examBegin}])
    : examBegin());
  document.getElementById('iFb').onchange = e => { prefs.feedback = e.target.checked; save(); };
  window.scrollTo(0, 0);
}

function examBegin(){
  const n = state.qs.length;
  Object.assign(state, {i: 0, sel: Array(n).fill(-1), flag: Array(n).fill(false), left: n * EXAM_SECS_PER_Q, warned: false, over: false, fb: !!prefs.feedback, reviewing: false});
  removeKey(PROGRESS_KEY);
  enterExam();
}
function enterExam(){
  document.body.classList.add('exam');
  examRender();
  stopTimer();
  tick = setInterval(examTick, 1000);
}
function resumeExam(){
  const p = load(PROGRESS_KEY, null); if (!p) return home();
  state = p; state.over = false;
  enterExam();
}
function saveProgress(){
  if (!state || state.kind !== 'exam' || state.over || !state.sel) return;
  const {kind, mode, n, topic, title, partial, qs, i, sel, flag, left, warned, fb} = state;
  saveKey(PROGRESS_KEY, {kind, mode, n, topic, title, partial, qs, i, sel, flag, left, warned, fb, reviewing: false, savedAt: Date.now()});
}

function examTick(){
  if (!state || state.over) return;
  state.left--;
  const t = document.getElementById('xt'), box = document.getElementById('xtb');
  if (t) { t.textContent = fmt(Math.max(state.left, 0)); box.classList.toggle('low', state.left <= 300); }
  if (state.left % 5 === 0) saveProgress();
  if (!state.warned && state.left === 900 && state.qs.length * EXAM_SECS_PER_Q > 900) {
    state.warned = true;
    modal('15 minutes remaining', '<p>You have 15 minutes left to complete your exam.</p>', [{label: 'Continue', primary: true}]);
  }
  if (state.left <= 0) {
    examSubmit();
    modal('Time is up', '<p>The exam time has ended and your answers have been submitted automatically.</p>', [{label: 'View result', primary: true}]);
  }
}

function examPick(k){
  if (state.over || state.reviewing) return;
  if (state.fb && state.sel[state.i] >= 0) return;   // locked once answered when feedback is on
  state.sel[state.i] = k; examRender();
  if (state.fb) { const f = document.getElementById('xfb'); if (f) f.scrollIntoView({block: 'nearest', behavior: 'smooth'}); }
}
function toggleFlag(k){ state.flag[k] = !state.flag[k]; examRender(); }

function examRender(){
  const n = state.qs.length, q = state.qs[state.i], z = prefs.zoom || 1;
  const answered = state.sel.filter(v => v >= 0).length, flagged = state.flag.filter(Boolean).length;
  const mine = state.sel[state.i], locked = state.fb && mine >= 0;
  const correctSoFar = state.sel.filter((v, k) => v >= 0 && v === state.qs[k].ans).length;
  const qStatus = k => `${state.sel[k] >= 0 ? 'ans' : ''} ${state.flag[k] ? 'flag' : ''} ${state.fb && state.sel[k] >= 0 ? (state.sel[k] === state.qs[k].ans ? 'ok' : 'no') : ''}`;
  const optCls = k => !locked ? (mine === k ? 'sel' : '') : k === q.ans ? 'correct' : k === mine ? 'wrong' : 'dim';
  const fbHtml = !locked ? '' : `<div class="fb ${mine === q.ans ? 'good' : 'bad'}" id="xfb" role="status">
      <span class="t">${mine === q.ans ? 'Correct.' : `Incorrect. The correct answer is ${'ABCD'[q.ans]}.`}</span>
      <div class="why"><b>Why:</b> ${esc(q.exp)}</div><div class="src">Source · ${esc(q.src)}</div></div>`;
  const main = state.reviewing ? reviewPanel() : `
      <div class="xm-qhead"><b>Question ${state.i + 1} of ${n}</b>
        <button class="xm-flag ${state.flag[state.i] ? 'on' : ''}" id="xflag" aria-pressed="${state.flag[state.i]}">${FLAG}<span>${state.flag[state.i] ? 'Flagged for review' : 'Flag for review'}</span></button></div>
      <p class="xm-stem">${esc(q.q)}</p>
      <div class="xm-opts">${q.opts.map((o, k) => `<button class="xo ${optCls(k)}" data-k="${k}" aria-pressed="${mine === k}" ${locked ? 'aria-disabled="true"' : ''}><span class="xl">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>
      ${fbHtml}`;
  app.innerHTML = `<div class="xm" style="--z:${z}">
  <header class="xm-top">
    <div class="xm-title"><b>ITIL® Foundation (Version 5) – Practice Exam</b><small>${esc(state.title)} · Candidate: Practice candidate</small></div>
    <div class="xm-tools">
      <div class="xm-zoom" title="Text size"><button id="zm" aria-label="Smaller text">A−</button><button id="zp" aria-label="Larger text">A+</button></div>
      <div class="xm-time" id="xtb"><span>Time remaining</span><b id="xt">${fmt(Math.max(state.left, 0))}</b></div>
    </div>
  </header>
  <div class="xm-body">
    <aside class="xm-nav" id="xnav"><h4>Questions</h4>
      <div class="xm-legend"><span><i class="l-ans"></i>Answered</span><span><i></i>Unanswered</span><span class="lg-flag">${FLAG}Flagged</span></div>
      ${state.qs.map((qq, k) => `<div class="xm-q ${k === state.i && !state.reviewing ? 'cur' : ''} ${qStatus(k)}">
        <button class="flagbtn ${state.flag[k] ? 'on' : ''}" data-flag="${k}" aria-pressed="${state.flag[k]}" title="${state.flag[k] ? 'Unflag' : 'Flag'} question ${k + 1}" aria-label="Flag question ${k + 1}">${FLAG}</button>
        <button data-go="${k}" aria-label="Question ${k + 1}"><span><span class="qlbl">Question </span>${k + 1}</span><span class="st"></span></button></div>`).join('')}
    </aside>
    <main class="xm-main" id="xmain">${main}</main>
  </div>
  <footer class="xm-foot">
    <div class="grp"><button class="ghost" id="xexit">Exit</button><button class="end" id="xend">${state.reviewing ? 'Submit exam' : 'End Exam'}</button></div>
    <span class="prog">${answered} of ${n} answered${state.fb ? ` · ${correctSoFar} correct` : ''} · ${flagged} flagged</span>
    <div class="grp"><button id="xprev" ${state.i === 0 || state.reviewing ? 'disabled' : ''} aria-label="Previous question">←<span class="lbl"> Previous</span></button><button class="primary" id="xnext" ${state.i === n - 1 || state.reviewing ? 'disabled' : ''}>Next →</button></div>
  </footer></div>`;
  app.querySelectorAll('.xo').forEach(b => b.onclick = () => examPick(+b.dataset.k));
  app.querySelectorAll('[data-go]').forEach(b => b.onclick = () => examGo(+b.dataset.go));
  app.querySelectorAll('[data-flag]').forEach(c => c.onclick = () => toggleFlag(+c.dataset.flag));
  on('xflag', () => toggleFlag(state.i));
  on('xprev', () => examGo(state.i - 1));
  on('xnext', () => examGo(state.i + 1));
  on('xend', () => state.reviewing ? examEndAsk() : openReview());
  on('xexit', () => modal('Exit the exam?', '<p>Choose <b>Save and exit</b> to come back later with the timer paused, or <b>Exit without saving</b> to abandon this attempt.</p>',
    [{label: 'Return to exam'}, {label: 'Exit without saving', danger: true, fn: () => { removeKey(PROGRESS_KEY); state.over = true; home(); }}, {label: 'Save and exit', primary: true, fn: () => { saveProgress(); state.over = true; home(); }}]));
  on('zm', () => setZoom(-0.1)); on('zp', () => setZoom(0.1));
  on('rvback', () => { state.reviewing = false; examRender(); });
  on('rvend', examEndAsk);
  app.querySelectorAll('[data-rf]').forEach(b => b.onclick = () => { state.rf = b.dataset.rf; examRender(); });
  app.querySelectorAll('[data-rg]').forEach(b => b.onclick = () => { state.reviewing = false; examGo(+b.dataset.rg); });
  const cur = app.querySelector('.xm-q.cur'); if (cur) cur.scrollIntoView({block: 'nearest', inline: 'nearest'});
  saveProgress();
}

/* Review screen shown before submitting (item 6) */
function openReview(){ state.reviewing = true; state.rf = state.rf || 'all'; examRender(); const m = document.getElementById('xmain'); if (m) m.scrollTop = 0; }
function reviewPanel(){
  const n = state.qs.length, un = state.sel.filter(v => v < 0).length, fl = state.flag.filter(Boolean).length;
  const f = state.rf || 'all';
  const show = k => f === 'all' || (f === 'un' && state.sel[k] < 0) || (f === 'fl' && state.flag[k]);
  return `<div class="rv">
    <div class="xm-qhead"><b>Review your answers</b><span class="prog" style="display:inline">${n - un} answered · ${un} unanswered · ${fl} flagged</span></div>
    <p class="rvnote">Select a question to go back to it. When you are ready, choose <b>Submit exam</b>. ${un ? `<b>${un} unanswered question${un > 1 ? 's' : ''}</b> will be marked as incorrect.` : 'All questions are answered.'}</p>
    <div class="chips"><button data-rf="all" class="${f === 'all' ? 'on' : ''}">All (${n})</button><button data-rf="un" class="${f === 'un' ? 'on' : ''}">Unanswered (${un})</button><button data-rf="fl" class="${f === 'fl' ? 'on' : ''}">Flagged (${fl})</button></div>
    <div class="rvgrid">${state.qs.map((q, k) => show(k) ? `<button class="rvt ${state.sel[k] >= 0 ? 'ans' : 'un'} ${state.flag[k] ? 'fl' : ''} ${state.fb && state.sel[k] >= 0 ? (state.sel[k] === q.ans ? 'ok' : 'no') : ''}" data-rg="${k}">
      <b>${k + 1}</b><span>${state.sel[k] >= 0 ? 'Answer ' + 'ABCD'[state.sel[k]] : 'Unanswered'}</span>${state.flag[k] ? FLAG : ''}</button>` : '').join('') || '<p class="empty">No questions match this filter.</p>'}</div>
    <div class="row endrow"><button id="rvback">← Return to exam</button><button class="end" id="rvend">Submit exam</button></div></div>`;
}

function examGo(k){
  if (k < 0 || k >= state.qs.length) return;
  state.i = k; state.reviewing = false; examRender();
  const m = document.getElementById('xmain'); if (m) m.scrollTop = 0;
}
function setZoom(d){
  prefs.zoom = Math.min(1.5, Math.max(0.85, Math.round(((prefs.zoom || 1) + d) * 100) / 100));
  save(); examRender();
}
function examEndAsk(){
  const un = state.sel.filter(v => v < 0).length, fl = state.flag.filter(Boolean).length;
  let body = '';
  if (un) body += `<p><b>You have ${un} unanswered question${un > 1 ? 's' : ''}.</b> Unanswered questions will be marked as incorrect.</p>`;
  if (fl) body += `<p>You have ${fl} flagged question${fl > 1 ? 's' : ''}.</p>`;
  body += '<p>Are you sure you want to end the exam? Your answers will be submitted and you will not be able to change them.</p>';
  modal('End exam', body, [{label: 'Return to exam'}, {label: 'End exam', danger: true, fn: examSubmit}]);
}
function examSubmit(){
  if (state.over) return;
  state.over = true; stopTimer();
  removeKey(PROGRESS_KEY);
  state.used = state.qs.length * EXAM_SECS_PER_Q - Math.max(state.left, 0);
  state.picks = state.sel.map((k, i) => ({k, ok: k === state.qs[i].ans}));
  recordAttempt();
  document.body.classList.remove('exam');
  results();
}

function modal(title, body, buttons){
  closeModal();
  const bg = document.createElement('div');
  bg.className = 'modal-bg'; bg.id = 'modal';
  bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt"><h3 id="mt">${esc(title)}</h3>${body}
    <div class="btns">${buttons.map((b, i) => `<button data-i="${i}" class="${b.danger ? 'end' : b.primary ? 'primary' : ''}">${esc(b.label)}</button>`).join('')}</div></div>`;
  document.body.appendChild(bg);
  bg.querySelectorAll('[data-i]').forEach(el => el.onclick = () => { closeModal(); const f = buttons[+el.dataset.i].fn; if (f) f(); });
  const last = bg.querySelector('.btns button:last-child'); if (last) last.focus();
}
function closeModal(){ const m = document.getElementById('modal'); if (m) m.remove(); }
function stopTimer(){ if (tick) { clearInterval(tick); tick = null; } }

/* ---------- results ---------- */
function results(){
  stopTimer();
  const total = state.qs.length, score = state.picks.filter(p => p.ok).length;
  const pass = score >= Math.ceil(PASS * total), pct = Math.round(score / total * 100);
  const missed = state.qs.filter((q, i) => !state.picks[i].ok);
  const rq = reviewIds().length;
  let html = `<div class="topbar"><button class="ghost" id="home">← Home</button><span class="meta">${esc(state.title)}</span></div>
  <div class="card result-sheet">
    <div class="rs-head"><div><div class="eyebrow">Provisional result</div><b style="font-size:1.05rem">ITIL® Foundation (Version 5) – Practice Exam</b></div>
      <span class="verdict-tag ${pass ? 'pass' : 'fail'}">${pass ? 'PASS' : 'FAIL'}</span></div>
    <table>
      <tr><td>Candidate</td><td>Practice candidate</td></tr>
      <tr><td>Paper</td><td>${esc(state.title)}</td></tr>
      <tr><td>Date</td><td>${new Date().toLocaleString()}</td></tr>
      <tr><td>Score</td><td><b>${score} / ${total}</b> (${pct}%)</td></tr>
      <tr><td>Pass mark</td><td>${Math.ceil(PASS * total)} / ${total} (65%)</td></tr>
      <tr><td>Answered</td><td>${state.picks.filter(p => p.k >= 0).length} of ${total}</td></tr>
      <tr><td>Time used</td><td>${fmt(state.used || 0)} of ${fmt(total * EXAM_SECS_PER_Q)}</td></tr>
    </table></div>
  <div class="card score noprint" style="padding:24px">
  <div class="row" style="justify-content:center">
    <button class="primary" id="again">${state.mode === 'mock' ? 'New mock exam' : state.mode === 'review' ? 'Continue reviewing' : 'Retake this exam'}</button>
    ${missed.length && state.mode === 'sec' ? `<button id="missed">Retake the ${missed.length} I missed</button>` : ''}
    <button id="print">Print result</button>
  </div>
  <p class="empty" style="text-align:center;margin:14px 0 0">${missed.length} question${missed.length === 1 ? '' : 's'} added to your review queue (${rq} in total).</p>
  <div class="row" style="justify-content:center;margin-top:14px"><label class="tog"><input type="checkbox" id="onlyWrong"> Show only the questions I got wrong</label></div>
  </div><div class="card revcard" id="rev">`;
  state.qs.forEach((q, i) => {
    const p = state.picks[i];
    const yours = p.k === -1 ? 'Not answered' : `${'ABCD'[p.k]}. ${q.opts[p.k]}`;
    html += `<div class="rev ${p.ok ? 'r-ok' : 'r-no'}"><div class="q"><i>${i + 1}.</i>${esc(q.q)}</div>
      <div class="a ${p.ok ? 'ok' : 'no'}">${p.ok ? '✓' : '✗'} Your answer: ${esc(yours)}</div>
      ${p.ok ? '' : `<div class="a ok">✓ Correct answer: ${'ABCD'[q.ans]}. ${esc(q.opts[q.ans])}</div>`}
      <div class="e">${esc(q.exp)} <i>· ${esc(q.src)} · Section ${q.sec} · Topic ${q.topic}</i></div></div>`;
  });
  app.innerHTML = html + '</div>';
  on('home', home); on('again', retake); on('print', () => window.print());
  const n = state.n, idx = missed.map(q => q.orig);
  on('missed', () => startExam(n, idx));
  document.getElementById('onlyWrong').onchange = e => app.querySelectorAll('.r-ok').forEach(r => r.classList.toggle('hidden', e.target.checked));
  window.scrollTo(0, 0);
}

/* ---------- study ---------- */
function study(n){
  stopTimer();
  const s = QB.sections[n - 1];
  let html = `<div class="topbar"><button class="ghost" id="home">← Home</button><button class="primary" id="go">Start exam →</button></div>
  <div class="eyebrow">Section ${String(n).padStart(2, '0')} · Study answers</div>
  <h2 style="margin-top:8px">${esc(s.title)}</h2><p class="sub">${esc(s.refs)} · all ${s.items.length} questions with their answers</p><div class="card revcard">`;
  s.items.forEach((it, i) => {
    const [q, right, , exp, src] = it;
    html += `<div class="rev"><div class="q"><i>${i + 1}.</i>${esc(q)}</div><div class="a ok">✓ ${esc(right)}</div>
      <div class="e">${esc(exp)} <i>· ${esc(src)}</i></div></div>`;
  });
  app.innerHTML = html + '</div>';
  on('home', home); on('go', () => startExam(n));
  window.scrollTo(0, 0);
}

/* ---------- search (item 8) ---------- */
function search(term){
  stopTimer();
  app.innerHTML = `<div class="topbar"><button class="ghost" id="home">← Home</button></div>
  <div class="eyebrow">Search</div><h2 style="margin-top:6px">Find questions</h2>
  <form class="searchbar" id="sform2" role="search"><input type="search" id="sq2" value="${esc(term || '')}" placeholder="Type a term, e.g. “known error”" aria-label="Search questions" autofocus><button class="primary">Search</button></form>
  <p class="sub" id="scount"></p><div class="card revcard" id="sres"></div>`;
  on('home', home);
  const input = document.getElementById('sq2');
  let t;
  input.oninput = () => { clearTimeout(t); t = setTimeout(() => runSearch(input.value), 200); };
  document.getElementById('sform2').onsubmit = e => { e.preventDefault(); runSearch(input.value); };
  runSearch(term || '');
  input.focus();
  window.scrollTo(0, 0);
}
function runSearch(term){
  const out = document.getElementById('sres'), cnt = document.getElementById('scount');
  const words = term.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  if (!words.length) { cnt.textContent = 'Type at least two letters to search the question text, answers and explanations.'; out.innerHTML = ''; out.style.display = 'none'; return; }
  const hits = ALL.filter(e => { const hay = (e.it[0] + ' ' + e.it[1] + ' ' + e.it[3]).toLowerCase(); return words.every(w => hay.includes(w)); });
  const re = new RegExp('(' + words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
  const hl = s => esc(s).replace(re, '<mark>$1</mark>');
  cnt.textContent = `${hits.length} question${hits.length === 1 ? '' : 's'} found${hits.length > 80 ? ' – showing the first 80' : ''}.`;
  out.style.display = hits.length ? '' : 'none';
  out.innerHTML = hits.slice(0, 80).map(e => `<div class="rev"><div class="q">${hl(e.it[0])}</div>
    <div class="a ok">✓ ${hl(e.it[1])}</div><div class="e">${hl(e.it[3])} <i>· Section ${e.sec}, question ${e.i + 1} · Topic ${e.topic}</i></div></div>`).join('');
}

/* ---------- flashcards (item 7) ---------- */
let fcs = null;
function flashcards(cat){
  stopTimer();
  const cards = (window.FC || []).filter(c => !cat || c[2] === +cat);
  fcs = {cat: cat || '', queue: shuffle(cards.map((c, i) => c)), known: 0, missed: [], flipped: false, total: cards.length};
  fcRender();
}
function fcRender(){
  const cats = `<div class="chips">${['', '1', '2', '3', '4', '5', '6', '7'].map(c => `<button data-fc="${c}" class="${fcs.cat === c ? 'on' : ''}">${c ? c + '. ' + esc(CATS[c]) : 'All topics'}</button>`).join('')}</div>`;
  const card = fcs.queue[0];
  const done = !card;
  const mastered = (window.FC || []).filter(c => (store.fc[c[0]] || 0) >= 2).length;
  app.innerHTML = `<div class="topbar"><button class="ghost" id="home">← Home</button><span class="meta">${mastered} of ${(window.FC || []).length} cards mastered</span></div>
  <div class="eyebrow">Flashcards</div><h2 style="margin-top:6px">Key terms</h2>
  <p class="sub">Tap the card (or press Space) to reveal the definition, then mark whether you knew it. Cards you miss come back later in the round.</p>
  ${cats}
  ${done ? `<div class="card fcdone"><h3>Round complete</h3><p>You knew ${fcs.known} of ${fcs.total} cards${fcs.missed.length ? `, and missed ${fcs.missed.length} at least once` : ''}.</p>
      <div class="row" style="justify-content:center">${fcs.missed.length ? '<button class="primary" id="fcmiss">Practise the ones I missed</button>' : ''}<button id="fcagain">Start a new round</button></div></div>`
  : `<div class="fcprog">${fcs.total - fcs.queue.length} done · ${fcs.queue.length} left · ${fcs.known} known</div>
  <button class="fcard ${fcs.flipped ? 'flip' : ''}" id="fcard" aria-live="polite">
    <span class="fctag">${card[2]}. ${esc(CATS[card[2]])}</span>
    <span class="fcterm">${esc(card[0])}</span>
    ${fcs.flipped ? `<span class="fcdef">${esc(card[1])}</span>` : '<span class="fchint">Tap to reveal the definition</span>'}
  </button>
  <div class="fcbtns">${fcs.flipped ? '<button class="end" id="fcno">✗ Didn’t know (D)</button><button class="primary" id="fcyes">✓ Knew it (K)</button>' : '<button class="primary wide" id="fcflip">Reveal definition</button>'}</div>`}`;
  on('home', home);
  app.querySelectorAll('[data-fc]').forEach(b => b.onclick = () => flashcards(b.dataset.fc));
  on('fcard', fcFlip); on('fcflip', fcFlip); on('fcyes', () => fcMark(true)); on('fcno', () => fcMark(false));
  on('fcagain', () => flashcards(fcs.cat));
  on('fcmiss', () => { const m = fcs.missed; fcs = {cat: fcs.cat, queue: shuffle(m), known: 0, missed: [], flipped: false, total: m.length}; fcRender(); });
}
function fcFlip(){ if (fcs && fcs.queue.length) { fcs.flipped = !fcs.flipped; fcRender(); } }
function fcMark(knew){
  const c = fcs.queue.shift();
  store.fc[c[0]] = knew ? (store.fc[c[0]] || 0) + 1 : 0; save();
  if (knew) fcs.known++;
  else { if (!fcs.missed.includes(c)) fcs.missed.push(c); fcs.queue.splice(Math.min(3, fcs.queue.length), 0, c); }
  fcs.flipped = false; fcRender();
}

/* ---------- keyboard ---------- */
document.addEventListener('keydown', e => {
  if (document.getElementById('modal')) return;
  if (e.target.tagName === 'INPUT') return;
  if (document.getElementById('fcard') || document.querySelector('.fcdone')) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!fcs.flipped) fcFlip(); }
    else if (fcs && fcs.flipped && e.key.toLowerCase() === 'k') fcMark(true);
    else if (fcs && fcs.flipped && e.key.toLowerCase() === 'd') fcMark(false);
    return;
  }
  if (!state || state.kind !== 'exam' || !document.querySelector('.xm') || state.over || state.reviewing) return;
  const map = {'1':0,'2':1,'3':2,'4':3,'a':0,'b':1,'c':2,'d':3};
  const k = map[e.key.toLowerCase()];
  if (k != null) examPick(k);
  else if (e.key === 'Enter' && state.fb && state.sel[state.i] >= 0) { e.preventDefault(); examGo(state.i + 1); }
  else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') examGo(state.i + 1);
  else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') examGo(state.i - 1);
  else if (e.key.toLowerCase() === 'f') toggleFlag(state.i);
});
window.addEventListener('beforeunload', saveProgress);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveProgress(); });

/* ---------- offline / installable (item 11) ---------- */
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

home();
})();
