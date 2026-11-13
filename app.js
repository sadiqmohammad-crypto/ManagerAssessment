(function(){
'use strict';
/* ---------- content (no answer key in this file: the key is stored where only the owner can read it) ---------- */
const CONTENT = __CONTENT__;
const ITEMS = CONTENT.items, SURVEY = CONTENT.survey, SENIOR = CONTENT.senior || [];
const NOTE_MAX = 600;
const ITEM_BY_ID = {}; ITEMS.forEach(function(i){ ITEM_BY_ID[i.id] = i; });
const OPT_IDS = ['a','b','c','d'];
const DIMS = [
  {n:1, name:'Direction and goals'}, {n:2, name:'Accountability and performance'}, {n:3, name:'Decisions and problem solving'},
  {n:4, name:'Coaching and feedback'}, {n:5, name:'Delegation and empowerment'}, {n:6, name:'Support and recognition'},
  {n:7, name:'Fairness and integrity'}, {n:8, name:'Team climate'}, {n:9, name:'Change and cross-team work'}
];
const PATS = {
  A:{name:'Sidesteps', about:'Waits, delays, or passes the problem to someone else.', cls:'pa', lean:'waiting, or passing the issue to someone else', advice:'Pick one conversation you have been postponing and hold it this week.', module:'Raising problems early, setting expectations and deciding in time. Practise with rehearsed difficult conversations.'},
  D:{name:'Takes over', about:'Decides or acts alone when asking or involving others would work better.', cls:'pd', lean:'deciding or correcting on your own where a question would work better', advice:'Before you give an instruction, ask one question about how the other person sees it.', module:'Asking before telling, delegating outcomes and inviting dissent. Practise coaching in threes.'},
  P:{name:'Keeps the peace', about:'Protects harmony or feelings at the cost of the standard.', cls:'pp', lean:'protecting harmony at the cost of the standard', advice:'State the standard first, then offer your support for meeting it.', module:'Holding a standard with care, saying no and letting people own their work. Practise role-plays that end in a clear commitment.'},
  R:{name:'Cuts corners', about:'Makes an exception to the rules or leaves out the full facts.', cls:'pr', lean:'making an exception to the stated rule or to the full facts', advice:'Say your criteria out loud before you decide, and apply them the same way each time.', module:'Fair process, transparency and owning mistakes. Discuss real dilemmas with a senior leader.'},
  X:{name:'Stops short', about:'Takes a reasonable first step but does not go far enough.', cls:'px', lean:'stopping at a reasonable first step', advice:'Ask what would make the response complete.', module:'Moving from a reasonable first step to the complete response.'}
};
const PAT_ORDER = ['A','D','P','R'];
const LEVELS = {5:'The Mentor', 4:'The Anchor', 3:'The Builder', 2:'The Apprentice', 1:'The Explorer'};
const LEVEL_ABOUT = {5:'Reads situations well and could coach others.', 4:'Makes sound, steady calls in most situations.', 3:'Has good foundations; consistency is still growing.', 2:'Is learning the craft, with clear areas to practise.', 1:'Is new to many of these situations and has the most to gain from training.'};
const PERSONA_YOU = {5:'You read situations well and could coach other managers.', 4:'You make sound, steady calls in most situations.', 3:'You have good foundations, and your consistency is still growing.', 2:'You are learning the craft, with clear areas to practise.', 1:'Many of these situations are new to you, so you have the most to gain from training.'};
const CUT_NAME = function(l){ return LEVELS[l].replace(/^The /,''); };
/* Persona portraits: flat SVG characters, one per persona. The background uses the persona colour (--lv1..--lv5),
   so both themes apply; `.fine` details (eyes, brows, cheeks) are hidden on small badges. */
const PERSONA_ART = (function(){
  const INK = '#1d1c1a';
  const body = '<path d="M8.76 54C11 43.2 20.8 39 32 39S53 43.2 55.24 54A32 32 0 0 1 8.76 54Z" fill="#000" fill-opacity=".2"/>';
  const face = function(y){ return '<circle cx="32" cy="' + y + '" r="11.6" fill="#fff" fill-opacity=".94"/>'; };
  const cheeks = function(y){ return '<g class="fine" fill="#ff7a6b" fill-opacity=".28"><circle cx="25.4" cy="' + y + '" r="2.1"/><circle cx="38.6" cy="' + y + '" r="2.1"/></g>'; };
  const eyes = function(y){ return '<g class="fine" fill="' + INK + '"><circle cx="27.8" cy="' + y + '" r="1.55"/><circle cx="36.2" cy="' + y + '" r="1.55"/></g>'; };
  const brows = function(d){ return '<path class="fine" d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="1.3" stroke-linecap="round"/>'; };
  const smile = function(y, open){ return open
    ? '<path class="fine" d="M28.4 ' + y + 'H35.6Q35.2 ' + (y + 3.6) + ' 32 ' + (y + 3.6) + 'T28.4 ' + y + 'Z" fill="' + INK + '"/>'
    : '<path class="fine" d="M28.6 ' + y + 'Q32 ' + (y + 2.6) + ' 35.4 ' + y + '" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round"/>'; };
  const art = {
    // 1 The Explorer: bush hat and a compass
    1: body + face(28) + cheeks(31.4) + eyes(28.6) + brows('M25.8 25.2Q27.8 23.6 29.8 24.6M34.4 25.4H38.2') + smile(32.2) +
       '<ellipse cx="32" cy="20.6" rx="17.5" ry="3.7" fill="#ead9a8" stroke="' + INK + '" stroke-width="1.3"/>' +
       '<path d="M22.6 20.4C22.6 13.6 26.8 10.6 32 10.6S41.4 13.6 41.4 20.4Z" fill="#ead9a8" stroke="' + INK + '" stroke-width="1.3"/>' +
       '<rect x="22.8" y="16.4" width="18.4" height="3.2" fill="' + INK + '"/>' +
       '<circle cx="45" cy="49" r="6.4" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>' +
       '<path d="M45 44.4L46.6 49H43.4Z" fill="#d03b3b"/><path d="M45 53.6L46.6 49H43.4Z" fill="' + INK + '"/>',
    // 2 The Apprentice: pencil behind the ear, sprout pin
    2: '<g transform="rotate(32 46 18)"><rect x="43.8" y="5" width="4.6" height="21" rx="1.1" fill="#fff" stroke="' + INK + '" stroke-width="1.3"/><rect x="43.8" y="5" width="4.6" height="3.6" rx="1.1" fill="' + INK + '"/><path d="M43.8 26L46.1 30.8 48.4 26Z" fill="#fff" stroke="' + INK + '" stroke-width="1.3" stroke-linejoin="round"/><path d="M45.3 29.1L46.1 30.8 46.9 29.1Z" fill="' + INK + '"/></g>' +
       body + face(27) + cheeks(30.4) + eyes(27.6) + smile(30.6, true) +
       '<path d="M20.5 25.6C20.8 18.4 25.6 15.2 32 15.2S43.2 18.4 43.5 25.6C40.2 22.2 36.2 21.2 32 21.6 27.8 21.2 23.8 22.2 20.5 25.6Z" fill="' + INK + '"/>' +
       '<path d="M22 51.5V45.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
       '<path d="M22 46.6C22 43.4 19.6 42 17.2 42.4 17.4 45.2 19.4 46.8 22 46.6Z" fill="#fff"/>' +
       '<path d="M22 45.2C22 42 24.4 40.6 26.8 41 26.6 43.8 24.6 45.4 22 45.2Z" fill="#fff"/>',
    // 3 The Builder: hard hat and a high-visibility vest
    3: body +
       '<path d="M22.5 41.2L25.6 54.6M41.5 41.2L38.4 54.6" stroke="#fff" stroke-opacity=".85" stroke-width="2.6"/>' +
       face(28.4) + cheeks(31.8) + eyes(29) + brows('M25.8 26.4H29.6M34.4 26.4H38.2') + smile(32.6) +
       '<path d="M19.2 23.4C19.2 15 24.8 10.8 32 10.8S44.8 15 44.8 23.4Z" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>' +
       '<rect x="29.9" y="10.9" width="4.2" height="12.4" rx="1.6" fill="' + INK + '"/>' +
       '<rect x="15.6" y="22.6" width="32.8" height="3.6" rx="1.8" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>',
    // 4 The Anchor: captain's cap with an anchor badge
    4: body +
       '<g fill="#fff" fill-opacity=".85"><circle cx="32" cy="46" r="1.3"/><circle cx="32" cy="51" r="1.3"/></g>' +
       face(28.6) + cheeks(32) + eyes(29.2) + smile(32.8) +
       '<path d="M19.4 20.8C19.4 14.2 25 10.6 32 10.6S44.6 14.2 44.6 20.8Z" fill="#fff" stroke="' + INK + '" stroke-width="1.4"/>' +
       '<rect x="19.4" y="19.4" width="25.2" height="3.8" fill="' + INK + '"/>' +
       '<path d="M18.6 22.6Q32 29.4 45.4 22.6Q32 25.6 18.6 22.6Z" fill="' + INK + '"/>' +
       '<g fill="none" stroke="' + INK + '" stroke-width="1.3" stroke-linecap="round"><circle cx="32" cy="12.9" r="1.1"/><path d="M32 14V18.2M29.9 15.2H34.1M29.2 16.6Q32 19.4 34.8 16.6"/></g>',
    // 5 The Mentor: silver hair, glasses and a speech bubble
    5: body + face(28) + cheeks(32) + smile(32.8) +
       '<path d="M20.4 27C20.4 19 25.4 15.6 32 15.6S43.6 19 43.6 27C42.4 22.8 39 21.4 35.4 21.6 33.6 20.2 30.6 20.2 28.6 21.4 25 21.4 21.8 23 20.4 27Z" fill="#e3e0d8" stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round"/>' +
       brows('M24.6 23.6Q27.4 22.6 30 23.4M34 23.4Q36.6 22.6 39.4 23.6') +
       '<g fill="none" stroke="' + INK + '" stroke-width="1.6"><circle cx="27.4" cy="28.2" r="3.7"/><circle cx="36.6" cy="28.2" r="3.7"/><path d="M31.1 28.2H32.9M23.7 27.6L20.8 26.6M40.3 27.6L43.2 26.6"/></g>' +
       '<g class="fine" fill="' + INK + '"><circle cx="27.4" cy="28.4" r="1.2"/><circle cx="36.6" cy="28.4" r="1.2"/></g>' +
       '<path d="M41.6 6.6H56.4A3.2 3.2 0 0 1 59.6 9.8V16.2A3.2 3.2 0 0 1 56.4 19.4H48.4L44.6 23V19.4H41.6A3.2 3.2 0 0 1 38.4 16.2V9.8A3.2 3.2 0 0 1 41.6 6.6Z" fill="#fff" stroke="' + INK + '" stroke-width="1.3" stroke-linejoin="round"/>' +
       '<g fill="' + INK + '"><circle cx="44.6" cy="13" r="1.25"/><circle cx="49" cy="13" r="1.25"/><circle cx="53.4" cy="13" r="1.25"/></g>'
  };
  return function(l){ return '<circle cx="32" cy="32" r="32" fill="var(--lv' + l + ')"/>' + art[l]; };
})();
const QUADS = {KD:'Role model', Kd:'Knows it, team does not see it', kD:'Does it, scores low on test', kd:'Priority development'};
const QUAD_HELP = {KD:'Use as a mentor and panel expert.', Kd:'Coaching and accountability. More classroom training will not fix it.', kD:'Check reading load first, then add frameworks.', kd:'Foundations plus close coaching.'};
const SCALE = ['Never','Rarely','Sometimes','Often','Always'];
const BG_LEGACY = {level:{'First-line manager':'Team lead', 'Manager of managers':'Manager', 'Senior leader':'Directors & Above'}};
function bgValue(r, id){ const v=(r.bg && r.bg[id]) || ''; return (BG_LEGACY[id] && BG_LEGACY[id][v]) || v; }
const BG_FIELDS = [
  {id:'level', label:'Your level', opts:['Team lead','Manager','Directors & Above']},
  {id:'years', label:'Years managing people', opts:['Under 1','1 to 3','4 to 7','8 or more']},
  {id:'team', label:'People reporting to you', opts:['1 to 4','5 to 9','10 to 19','20 or more']},
  {id:'func', label:'Function', opts:['Operations or delivery','Sales or account management','Technology or product','Finance, HR or administration','Other']},
  {id:'english', label:'Is English your first language?', opts:['Yes','No']},
  {id:'training', label:'Management training so far', opts:['None','A short course','Several courses or a programme']},
  {id:'gender', label:'Gender', opts:['Woman','Man','Another identity']}
];
const STRENGTH = [
  'You set clear priorities and explain the reason behind a goal.',
  'You deal with performance issues early, directly and on the evidence.',
  'You decide in time and involve the people the situation calls for.',
  'You give specific, task-focused feedback and look for ways to develop people.',
  'You hand over real ownership and stay available without taking the work back.',
  'You respond to people\'s circumstances and give credit where it was earned.',
  'You apply one standard to everyone and stay honest when it costs you.',
  'You make it safe to disagree or admit a mistake, and you step in on conflict.',
  'You explain change honestly and work across teams to remove obstacles.'
];
const DEVELOP = [
  'Practise turning a new priority into a clear goal: what changes, what stops, and who does what by when.',
  'Practise raising a performance concern in the week you notice it, with examples and an agreed review date.',
  'Practise matching the decision style to the situation: when to consult, when to decide, when to let the team choose.',
  'Practise feedback that names the task and the next step, and avoids verdicts on the person.',
  'Practise agreeing the outcome and leaving the method to the person, with a check-in they can count on.',
  'Practise asking what would help before you decide, and naming individual contributions in public.',
  'Practise stating your criteria before a decision and applying the same rule to your strongest performer.',
  'Practise answering dissent with a question, and addressing conflict in the first week it appears.',
  'Practise explaining the reason for a change and what will get harder, and taking cross-team problems to your counterpart first.'
];
const FORM = 'A-0.2';
const isCurrentForm = function(x){ return ((x && x.form) || 'A-0.1')===FORM; };
const CFG_DEFAULT = {open:true, timeLimitMin:45, minRaters:5, form:FORM};
const SET_DEFAULT = {proficient:27, minimum:14, semMode:'auto', semManual:4, rfLower:4, rfFloor:7, surveyThreshold:3.75};

/* ---------- small utilities ---------- */
const $ = function(q, r){ return (r||document).querySelector(q); };
const clone = function(o){ return JSON.parse(JSON.stringify(o)); };
const nowISO = function(){ return new Date().toISOString(); };
const mean = function(a){ return a.length ? a.reduce(function(x,y){ return x+y; },0)/a.length : NaN; };
const variance = function(a){ if(a.length<2) return NaN; const m=mean(a); return a.reduce(function(s,x){ return s+(x-m)*(x-m); },0)/(a.length-1); };
const sd = function(a){ return Math.sqrt(variance(a)); };
const sumBy = function(arr, f){ let s=0; for(let i=0;i<arr.length;i++) s+=f(arr[i]); return s; };
const median = function(a){ if(!a.length) return NaN; const b=a.slice().sort(function(x,y){ return x-y; }); const m=Math.floor(b.length/2); return b.length%2 ? b[m] : (b[m-1]+b[m])/2; };
const pct = function(n,d){ return d ? Math.round(100*n/d) : 0; };
const signed = function(n){ return (n>0?'+':'')+n; };
const f1 = function(n){ return isFinite(n) ? (Math.round(n*10)/10).toFixed(1) : 'n/a'; };
const f2 = function(n){ return isFinite(n) ? (Math.round(n*100)/100).toFixed(2) : 'n/a'; };
function pearson(x,y){ const n=x.length; if(n<3) return NaN; const mx=mean(x), my=mean(y); let sxy=0,sxx=0,syy=0; for(let i=0;i<n;i++){ const dx=x[i]-mx, dy=y[i]-my; sxy+=dx*dy; sxx+=dx*dx; syy+=dy*dy; } return (sxx>0&&syy>0) ? sxy/Math.sqrt(sxx*syy) : NaN; }
function corrCI(r,n){ if(!(n>3) || !isFinite(r) || Math.abs(r)>=1) return null; const z=Math.atanh(r), se=1/Math.sqrt(n-3); return [Math.tanh(z-1.96*se), Math.tanh(z+1.96*se)]; }
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function shuffled(arr, rnd){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function mmss(sec){ const m=Math.floor(sec/60), s=Math.floor(sec%60); return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }
function dateShort(iso){ if(!iso) return ''; const d=new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}); }
function timeShort(d){ return d ? d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'}) : ''; }
const complete = function(a){ return !!(a && a.m && a.l && a.m!==a.l); };
function h(tag, props){
  const el=document.createElement(tag);
  if(props) for(const k in props){
    const v=props[k];
    if(v==null || v===false) continue;
    if(k==='class') el.className=v;
    else if(k.slice(0,2)==='on' && typeof v==='function') el.addEventListener(k.slice(2), v);
    else if(k==='style' && typeof v==='object') Object.assign(el.style, v);
    else if(v===true) el.setAttribute(k,'');
    else el.setAttribute(k, v);
  }
  const kids=Array.prototype.slice.call(arguments,2).flat(Infinity);
  for(let i=0;i<kids.length;i++){ const c=kids[i]; if(c==null || c===false) continue; el.appendChild(c instanceof Node ? c : document.createTextNode(String(c))); }
  return el;
}
function put(parent){
  const kids=Array.prototype.slice.call(arguments,1).flat(Infinity);
  for(let i=0;i<kids.length;i++){ const c=kids[i]; if(c==null || c===false || c==='') continue; parent.appendChild(c instanceof Node ? c : document.createTextNode(String(c))); }
  return parent;
}
function S(tag, attrs){
  const el=document.createElementNS('http://www.w3.org/2000/svg', tag);
  if(attrs) for(const k in attrs){ const v=attrs[k]; if(v==null || v===false) continue; if(k.slice(0,2)==='on' && typeof v==='function') el.addEventListener(k.slice(2), v); else el.setAttribute(k, v); }
  const kids=Array.prototype.slice.call(arguments,2).flat(Infinity);
  for(let i=0;i<kids.length;i++){ const c=kids[i]; if(c==null || c===false) continue; el.appendChild(c instanceof Node ? c : document.createTextNode(String(c))); }
  return el;
}

/* ---------- scoring and statistics (pure functions) ---------- */
function scoreResponse(ans, key){
  let total=0, rf=0, missBest=0, rejBest=0;
  const dim=new Array(9).fill(0), items={}, pat={A:0,D:0,P:0,R:0,X:0}, dimPat=[], flags=[];
  for(let d=0;d<9;d++) dimPat.push({A:0,D:0,P:0,R:0,X:0});
  for(const it of ITEMS){
    const k=key.items[it.id]; const a=(ans && ans[it.id]) || {}; let s=0;
    if(a.m && a.m===k.best) s+=1; else if(a.m && a.m===k.worst) s-=1;
    if(a.l && a.l===k.worst) s+=1; else if(a.l && a.l===k.best) s-=1;
    total+=s; dim[it.dim-1]+=s; items[it.id]=s;
    if(a.m && a.m!==k.best){ const t=PATS[k.tags[a.m]] ? k.tags[a.m] : 'X'; pat[t]++; dimPat[it.dim-1][t]++; missBest++; }
    if(a.m && a.m===k.worst){ rf++; flags.push(it.id); }
    if(a.l && a.l===k.best) rejBest++;
  }
  return {total:total, dim:dim, items:items, pat:pat, dimPat:dimPat, rf:rf, flags:flags, missBest:missBest, rejBest:rejBest};
}
function opportunities(key){
  const o={A:0,D:0,P:0,R:0,X:0};
  for(const it of ITEMS){ const k=key.items[it.id]; const seen={}; for(const oid of OPT_IDS){ if(oid!==k.best) seen[PATS[k.tags[oid]] ? k.tags[oid] : 'X']=1; } for(const t in seen) o[t]++; }
  return o;
}
function levelOf(total, dim, rf, std){
  let base;
  if(total > std.P + std.sem) base=5; else if(total >= std.P) base=4; else if(total >= std.M) base=3; else if(total >= std.M - std.sem) base=2; else base=1;
  let level=base; const notes=[];
  if(level===5 && (Math.min.apply(null,dim) < 0 || rf > 1)){ level=4; notes.push(rf>1 ? 'Shown as '+LEVELS[4]+' rather than '+LEVELS[5]+': more than one red flag.' : 'Shown as '+LEVELS[4]+' rather than '+LEVELS[5]+': one dimension score is below zero.'); }
  if(rf >= std.rfFloor){ if(level!==1) notes.push('Shown as '+LEVELS[1]+': '+rf+' red flags, as many as random guessing produces.'); level=1; }
  else if(rf >= std.rfLower){ const cap=Math.max(1, base-1); if(cap<level){ level=cap; notes.push('Moved down one persona: '+rf+' red flags.'); } }
  return {base:base, level:level, notes:notes};
}
function splitHalves(){
  const A=[], B=[];
  for(let d=1;d<=9;d++){ const ids=ITEMS.filter(function(i){ return i.dim===d; }).map(function(i){ return i.id; }); const odd=d%2===1; ids.forEach(function(id,ix){ const first=(ix%2===0); ((first===odd)?A:B).push(id); }); }
  return {A:A, B:B};
}
function aggregateSurvey(surveys){
  const by={}; let responses=0;
  for(const s of surveys){
    const about=(s && s.about) || {};
    for(const mid in about){
      const arr=(about[mid] && about[mid].a) || []; if(!Array.isArray(arr)) continue;
      const dimVals=[];
      for(let d=1;d<=9;d++){ const vals=[]; SURVEY.forEach(function(q,ix){ if(q.dim===d){ const v=arr[ix]; if(typeof v==='number' && v>=1 && v<=5) vals.push(v); } }); dimVals.push(vals.length ? mean(vals) : null); }
      if(dimVals.every(function(v){ return v===null; })) continue;
      (by[mid]=by[mid]||[]).push({dim:dimVals, items:arr}); responses++;
    }
  }
  const out={};
  for(const mid in by){
    const R=by[mid]; const dim=[];
    for(let d=0;d<9;d++){ const vals=R.map(function(r){ return r.dim[d]; }).filter(function(v){ return v!==null; }); dim.push(vals.length ? mean(vals) : null); }
    const have=dim.filter(function(v){ return v!==null; });
    const items=SURVEY.map(function(q,ix){ const vals=R.map(function(r){ return r.items[ix]; }).filter(function(v){ return typeof v==='number' && v>=1 && v<=5; }); return vals.length ? mean(vals) : null; });
    out[mid]={n:R.length, dim:dim, overall: have.length ? mean(have) : null, items:items};
  }
  return {by:out, responses:responses};
}
function aggregateSenior(seniors){
  const by={}; let responses=0;
  for(const s of seniors){
    const about=(s && s.about) || {};
    for(const mid in about){
      const e=about[mid] || {}; const arr=Array.isArray(e.a) ? e.a : [];
      const dimVals=[];
      for(let d=1;d<=9;d++){ const vals=[]; SENIOR.forEach(function(q,ix){ if(q.dim===d){ const v=arr[ix]; if(typeof v==='number' && v>=1 && v<=5) vals.push(v); } }); dimVals.push(vals.length ? mean(vals) : null); }
      const good=String(e.good||'').trim(), grow=String(e.grow||'').trim();
      if(dimVals.every(function(v){ return v===null; }) && !good && !grow) continue;
      (by[mid]=by[mid]||[]).push({by:s.uid, at:e.at||null, dim:dimVals, items:arr, good:good, grow:grow}); responses++;
    }
  }
  const out={};
  for(const mid in by){
    const R=by[mid].sort(function(a,b){ return String(a.at||'')<String(b.at||'') ? -1 : 1; }); const dim=[];
    for(let d=0;d<9;d++){ const vals=R.map(function(r){ return r.dim[d]; }).filter(function(v){ return v!==null; }); dim.push(vals.length ? mean(vals) : null); }
    const have=dim.filter(function(v){ return v!==null; });
    out[mid]={n:R.length, dim:dim, overall: have.length ? mean(have) : null, raters:R};
  }
  return {by:out, responses:responses};
}
function devSummarySeniorPart(row, L){
  if(!row.srOk) return;
  const sv=row.sr.dim.map(function(v,ix){ return {ix:ix, v:v}; }).filter(function(x){ return x.v!==null; });
  if(sv.length<2) return;
  const sh=sv.slice().sort(function(a,b){ return (b.v-a.v) || (a.ix-b.ix); }).slice(0,2), shIx=sh.map(function(x){ return x.ix; });
  const sl=sv.slice().sort(function(a,b){ return (a.v-b.v) || (a.ix-b.ix); }).filter(function(x){ return shIx.indexOf(x.ix)<0; }).slice(0,2);
  L.push('What your own manager sees', (row.sr.n>1 ? row.sr.n+' people you report to' : 'Your own manager')+' answered a short survey about you. Only the areas are shown here, not their answers.', '- Rated highest: '+sh.map(function(x){ return DIMS[x.ix].name; }).join('; '));
  if(sl.length) L.push('- Rated lowest: '+sl.map(function(x){ return DIMS[x.ix].name; }).join('; '));
  L.push('');
}
function canon(ans){ const o={}; ITEMS.forEach(function(it){ const a=(ans && ans[it.id]) || {}; o[it.id]=[a.m||'', a.l||'']; }); return JSON.stringify(o); }
function buildModel(src, key, S0, cfg){
  const opp=opportunities(key); const rows=[];
  for(const r of src.responses){
    const locked=src.vault && src.vault[r.uid];
    const ans=locked ? (locked.answers||{}) : (r.answers||{});
    const row={uid:r.uid, status:(r.status==='submitted'?'submitted':'in_progress'), submittedAt:r.submittedAt||null, startedAt:r.startedAt||null, activeSec:r.activeSec||0, bg:r.bg||{}, label:r.typedName||'', locked:!!locked,
      changed:!!(locked && canon(locked.answers)!==canon(r.answers)), answers:ans, answered:ITEMS.filter(function(it){ return complete(ans[it.id]); }).length};
    if(row.status==='submitted') Object.assign(row, scoreResponse(ans, key));
    rows.push(row);
  }
  const sub=rows.filter(function(r){ return r.status==='submitted'; }); const totals=sub.map(function(r){ return r.total; });
  const stats={n:sub.length, inProgress:rows.length-sub.length, mean:mean(totals), sd:sd(totals), min:totals.length?Math.min.apply(null,totals):NaN, max:totals.length?Math.max.apply(null,totals):NaN, median:median(totals)};
  const hv=splitHalves();
  const hA=sub.map(function(r){ return sumBy(hv.A,function(id){ return r.items[id]; }); }), hB=sub.map(function(r){ return sumBy(hv.B,function(id){ return r.items[id]; }); });
  const vT=variance(totals);
  stats.rel=(sub.length>=3 && vT>0) ? 2*(1-(variance(hA)+variance(hB))/vT) : NaN;
  stats.alpha=(sub.length>=3 && vT>0) ? (ITEMS.length/(ITEMS.length-1))*(1-sumBy(ITEMS,function(it){ return variance(sub.map(function(r){ return r.items[it.id]; })); })/vT) : NaN;
  const auto=S0.semMode==='auto' && sub.length>=30 && stats.rel>0 && stats.rel<1 && isFinite(stats.sd);
  stats.sem=auto ? stats.sd*Math.sqrt(1-stats.rel) : Number(S0.semManual); stats.semAuto=auto;
  const std={P:Number(S0.proficient), M:Number(S0.minimum), sem:stats.sem, rfLower:Number(S0.rfLower), rfFloor:Number(S0.rfFloor)};
  sub.forEach(function(r){ Object.assign(r, levelOf(r.total, r.dim, r.rf, std)); });
  const agg=aggregateSurvey(src.surveys||[]); const sv=agg.by;
  const sagg=aggregateSenior(src.seniors||[]); const srBy=sagg.by;
  rows.forEach(function(r){ const x=srBy[r.uid]||null; r.sr=x; r.srOk=!!(x && x.overall!==null); });
  rows.forEach(function(r){ const s=sv[r.uid]||null; r.sv=s; r.svOk=!!(s && s.n>=cfg.minRaters && s.overall!==null);
    r.quad=(r.status==='submitted' && r.svOk) ? ((r.level>=4?'K':'k')+(s.overall>=Number(S0.surveyThreshold)?'D':'d')) : null; });
  const levels={1:0,2:0,3:0,4:0,5:0}; sub.forEach(function(r){ levels[r.level]++; });
  const items=ITEMS.map(function(it){
    const k=key.items[it.id]; const dm={a:0,b:0,c:0,d:0}, dl={a:0,b:0,c:0,d:0}; let nb=0,nw=0,nrf=0; const sc=[], rest=[];
    sub.forEach(function(r){ const a=r.answers[it.id]||{}; if(a.m && dm[a.m]!==undefined) dm[a.m]++; if(a.l && dl[a.l]!==undefined) dl[a.l]++; if(a.m===k.best) nb++; if(a.l===k.worst) nw++; if(a.m===k.worst) nrf++; sc.push(r.items[it.id]); rest.push(r.total-r.items[it.id]); });
    const n=sub.length; const top=OPT_IDS.slice().sort(function(x,y){ return dm[y]-dm[x]; })[0];
    return {id:it.id, num:it.num, dim:it.dim, n:n, pBest:n?nb/n:NaN, pWorst:n?nw/n:NaN, pRf:n?nrf/n:NaN, mean:mean(sc), rRest:pearson(sc,rest), dm:dm, dl:dl, topMost:top};
  });
  const dimStd=std.P/9;
  const dims=DIMS.map(function(D,ix){
    const vals=sub.map(function(r){ return r.dim[ix]; }); const pc={A:0,D:0,P:0,R:0,X:0};
    sub.forEach(function(r){ for(const t in pc) pc[t]+=r.dimPat[ix][t]; });
    const wrong=pc.A+pc.D+pc.P+pc.R+pc.X; let dom=null; PAT_ORDER.concat(['X']).forEach(function(t){ if(pc[t]>0 && (dom===null || pc[t]>pc[dom])) dom=t; });
    const tv=rows.filter(function(r){ return r.svOk && r.sv.dim[ix]!==null; }).map(function(r){ return r.sv.dim[ix]; });
    const tsr=rows.filter(function(r){ return r.srOk && r.sr.dim[ix]!==null; }).map(function(r){ return r.sr.dim[ix]; });
    return {n:D.n, name:D.name, mean:mean(vals), below:vals.length ? vals.filter(function(v){ return v<dimStd; }).length/vals.length : NaN, pat:pc, wrong:wrong, dom:dom, domShare:(wrong && dom) ? pc[dom]/wrong : 0, svMean:tv.length ? mean(tv) : null, srMean:tsr.length ? mean(tsr) : null};
  });
  const priority=dims.slice().sort(function(a,b){ return (b.below-a.below) || (a.mean-b.mean) || (a.n-b.n); });
  const patTotal={A:0,D:0,P:0,R:0,X:0}; sub.forEach(function(r){ for(const t in patTotal) patTotal[t]+=r.pat[t]; });
  const pairs=sub.filter(function(r){ return r.svOk; }); const vr=pearson(pairs.map(function(r){ return r.total; }), pairs.map(function(r){ return r.sv.overall; }));
  const validity={n:pairs.length, r:vr, ci:corrCI(vr, pairs.length)};
  const fairness=BG_FIELDS.map(function(f){ const g={}; sub.forEach(function(r){ const v=bgValue(r, f.id); (g[v]=g[v]||[]).push(r.total); });
    return {id:f.id, label:f.label, groups:Object.keys(g).map(function(v){ return {value:v||'Not stated', n:g[v].length, mean:mean(g[v]), sd:sd(g[v])}; }).sort(function(a,b){ return b.n-a.n; })}; });
  return {rows:rows, sub:sub, stats:stats, std:std, opp:opp, sv:sv, svResponses:agg.responses, srResponses:sagg.responses, levels:levels, items:items, dims:dims, priority:priority, patTotal:patTotal, validity:validity, fairness:fairness, dimStd:dimStd, S:S0, cfg:cfg};
}
function devSummary(row, name){
  const order=row.dim.map(function(v,ix){ return {ix:ix, v:v, t:(row.svOk && row.sv.dim[ix]!==null) ? row.sv.dim[ix] : null}; });
  const hi=order.slice().sort(function(a,b){ return (b.v-a.v) || ((b.t||0)-(a.t||0)) || (a.ix-b.ix); }).slice(0,2);
  const hiIx=hi.map(function(x){ return x.ix; });
  const lo=order.slice().sort(function(a,b){ return (a.v-b.v) || ((a.t===null?9:a.t)-(b.t===null?9:b.t)) || (a.ix-b.ix); }).filter(function(x){ return hiIx.indexOf(x.ix)<0; }).slice(0,2);
  let dom=null; PAT_ORDER.forEach(function(t){ if(row.pat[t]>=3 && (dom===null || row.pat[t]>row.pat[dom])) dom=t; });
  const L=[];
  L.push('Development summary for '+name, 'Leadership Style Assessment (Form A)', '');
  L.push('What this is', 'You responded to 27 management situations. This summary shows where your judgment was strongest and where practice will help most. It carries no score or ranking and is used only to plan your development.', '');
  L.push('Strongest areas'); hi.forEach(function(x){ L.push('- '+DIMS[x.ix].name+': '+STRENGTH[x.ix]); }); L.push('');
  L.push('Areas to develop'); lo.forEach(function(x){ L.push('- '+DIMS[x.ix].name+': '+DEVELOP[x.ix]); }); L.push('');
  if(dom){ L.push('A pattern to watch', 'In several situations you leaned towards '+PATS[dom].lean+'. '+PATS[dom].advice, ''); }
  if(row.svOk){
    const tv=order.filter(function(x){ return x.t!==null; });
    const th=tv.slice().sort(function(a,b){ return (b.t-a.t) || (a.ix-b.ix); }).slice(0,2), tl=tv.slice().sort(function(a,b){ return (a.t-b.t) || (a.ix-b.ix); }).slice(0,2);
    L.push('What your team sees', row.sv.n+' people on your team answered a confidential survey. Only averages are shown.', '- Rated highest: '+th.map(function(x){ return DIMS[x.ix].name; }).join('; '), '- Rated lowest: '+tl.map(function(x){ return DIMS[x.ix].name; }).join('; '), '');
  }
  devSummarySeniorPart(row, L);
  L.push('Next step', 'Pick one area to develop. Agree with your own manager one situation in the next month where you will practise it, and a date to review how it went.');
  return L.join('\n');
}
function wpick(arr, w, rnd){ const t=w.reduce(function(a,b){ return a+b; },0); let x=rnd()*t; for(let i=0;i<arr.length;i++){ x-=w[i]; if(x<=0) return arr[i]; } return arr[arr.length-1]; }
function makeSample(key){
  const rnd=mulberry32(20261112);
  const gauss=function(){ let u=0,v=0; while(u===0) u=rnd(); while(v===0) v=rnd(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
  const pickOne=function(arr){ return arr[Math.floor(rnd()*arr.length)]; };
  const N=48, responses=[], surveys=[], names={}, behs=[];
  for(let i=0;i<N;i++){
    const uid='sample-'+String(i+1).padStart(2,'0'); names[uid]='Sample manager '+String(i+1).padStart(2,'0');
    const th=gauss(); const lean=pickOne(['A','D','P','A','D','P','R']); const answers={};
    ITEMS.forEach(function(it){
      const k=key.items[it.id]; const others=OPT_IDS.filter(function(o){ return o!==k.best; });
      const pB=Math.min(.93, Math.max(.12, .56+.17*th)); let m;
      if(rnd()<pB) m=k.best; else m=wpick(others, others.map(function(o){ return (o===k.worst?.7:1)*(k.tags[o]===lean?2.4:1); }), rnd);
      const rest=OPT_IDS.filter(function(o){ return o!==m; }); const pW=Math.min(.9, Math.max(.1, .5+.16*th)); let l;
      if(m!==k.worst && rnd()<pW) l=k.worst; else l=wpick(rest, rest.map(function(o){ return o===k.best ? .25 : 1; }), rnd);
      answers[it.id]={m:m, l:l};
    });
    const submitted=i<44; const day=String(3+(i%8)).padStart(2,'0');
    if(!submitted){ const keep=6+Math.floor(rnd()*14); ITEMS.forEach(function(it,ix){ if(ix>=keep) delete answers[it.id]; }); }
    const bg={}; BG_FIELDS.forEach(function(f){ bg[f.id]=rnd()<.12 ? '' : pickOne(f.opts.slice(0, f.id==='gender'?2:f.opts.length)); });
    responses.push({uid:uid, form:FORM, status:submitted?'submitted':'in_progress', startedAt:'2026-11-'+day+'T09:00:00.000Z', submittedAt:submitted?'2026-11-'+day+'T09:41:00.000Z':null, bg:bg, answers:answers, activeSec:Math.round((27+rnd()*20)*60)});
    const nr=submitted ? (rnd()<.8 ? 4+Math.floor(rnd()*6) : Math.floor(rnd()*4)) : 0; const beh=.6*th+.8*gauss(); behs.push(submitted ? beh : null);
    for(let j=0;j<nr;j++){ const a=SURVEY.map(function(){ if(rnd()<.04) return 0; return Math.max(1, Math.min(5, Math.round(3.6+.5*beh+.75*gauss()))); }); const o={uid:'sample-r-'+i+'-'+j, about:{}}; o.about[uid]={a:a, at:'2026-11-10T10:00:00.000Z'}; surveys.push(o); }
  }
  const rs=mulberry32(20261113); const gs=function(){ let u=0,v=0; while(u===0) u=rs(); while(v===0) v=rs(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); };
  const GOOD=['Stays calm under pressure and keeps the team focused.', 'Gives clear, honest updates, including bad news.', 'Builds strong working relationships with other teams.', 'Takes ownership when something goes wrong.', 'Coaches new joiners patiently.'];
  const GROW=['Hand more decisions to the team instead of stepping in.', 'Raise performance problems earlier.', 'Explain the reasons behind changes, not only the changes.', 'Push back on unrealistic deadlines, with data.', 'Protect time for one-to-ones.'];
  const sdocs={};
  for(let i=0;i<N;i++){
    const b=behs[i]; if(b===null || rs()<.3) continue;
    const uid='sample-'+String(i+1).padStart(2,'0'), sid='sample-s-'+String(Math.floor(i/4)+1).padStart(2,'0'); names[sid]='Sample senior manager '+String(Math.floor(i/4)+1).padStart(2,'0');
    const a=SENIOR.map(function(){ if(rs()<.06) return 0; return Math.max(1, Math.min(5, Math.round(3.5+.55*b+.7*gs()))); });
    (sdocs[sid]=sdocs[sid]||{uid:sid, about:{}}).about[uid]={a:a, good:rs()<.7 ? GOOD[Math.floor(rs()*GOOD.length)] : '', grow:rs()<.7 ? GROW[Math.floor(rs()*GROW.length)] : '', at:'2026-11-11T10:00:00.000Z'};
  }
  return {responses:responses, surveys:surveys, seniors:Object.keys(sdocs).map(function(k){ return sdocs[k]; }), vault:{}, names:names};
}
function csv(rows){ return rows.map(function(r){ return r.map(function(c){ const s=(c==null?'':String(c)); return /[",\n\r]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; }).join(','); }).join('\r\n'); }
const safeText = function(s){ s=String(s||''); return /^[=+\-@]/.test(s) ? "'"+s : s; };
window.__mja = {scoreResponse:scoreResponse, opportunities:opportunities, levelOf:levelOf, splitHalves:splitHalves, aggregateSurvey:aggregateSurvey, aggregateSenior:aggregateSenior, buildModel:buildModel, devSummary:devSummary, makeSample:makeSample, ITEMS:ITEMS, SURVEY:SURVEY, SENIOR:SENIOR, LEVELS:LEVELS, SET_DEFAULT:SET_DEFAULT, CFG_DEFAULT:CFG_DEFAULT};

/* ---------- state ---------- */
const st = {
  ready:false, meLoaded:false, preview:false, db:null, user:null, dl:null, me:{id:null, name:'', isOwner:false}, cfg:Object.assign({}, CFG_DEFAULT), route:'home', names:{},
  a:{loaded:false, loading:false, doc:null, result:null, step:'intro', idx:0, order:[], optOrder:{}, bg:{}, consent:false, typedName:'', busy:false, error:'', confirm:false},
  f:{loaded:false, loading:false, doc:null, step:'intro', roster:[], hits:[], q:'', mid:null, midName:'', ans:{}, prevAt:null, busy:false, error:''},
  s:{loaded:false, loading:false, doc:null, step:'intro', roster:[], hits:[], q:'', mid:null, midName:'', ans:{}, good:'', grow:'', prevAt:null, busy:false, error:''},
  c:{loaded:false, loading:false, tab:'overview', old:[], oldVault:[], key:null, settings:Object.assign({}, SET_DEFAULT), responses:[], surveys:[], seniors:[], results:{}, vault:{}, sample:false, sampleOff:false, sampleData:null, model:null, sel:null, sort:{k:'total', dir:-1}, openItem:null, msg:'', error:'', exportText:'', confirmDelete:null, busy:false, loadedAt:null}
};
const saver = {pending:null, timer:0, chain:Promise.resolve(), state:'saved', msg:''};

function writeError(e){
  const code=e && e.code;
  if(code==='invalid_argument') return 'Your account has view-only access to this page, so nothing can be saved. Ask the administrator to share it with you as a Contributor.';
  if(code==='quota_exceeded') return 'The storage for this assessment is full. Tell the administrator.';
  if(code==='revoked' || code==='not_granted') return 'Access to this page changed while it was open. Reload the page and try again.';
  return 'Could not save. Check your connection and try again.';
}
async function retry(fn){
  try{ return await fn(); }
  catch(e){ if(e && e.code==='unavailable'){ await new Promise(function(r){ setTimeout(r, 500+Math.random()*700); }); return await fn(); } throw e; }
}
function accessProblem(){
  if(st.preview) return 'This is a preview copy of the page, so answers cannot be saved here. Open the published page to take part.';
  if(!st.db || !st.me.id) return 'Sign in to your organisation\'s Claude account to take part. If you are signed in and still see this, ask the administrator to share this page with you as a Contributor.';
  return '';
}
function openToAll(){ const c=window.MJA_CONFIG||{}; return !c.allowedDomain || !!c.openFeedback; }
function feedbackDenied(){
  const dom=String((window.MJA_CONFIG||{}).allowedDomain||'').replace(/^@/,'');
  if(openToAll() || !dom) return 'Your account could not open this form. Sign out, sign in again and reload the page. If it still fails, tell the administrator.';
  return 'Feedback is only open to @'+dom+' accounts. You can still take the test from the Start page.';
}
function nameOf(uid, label){
  if(st.c.sample && st.c.sampleData && st.c.sampleData.names[uid]) return st.c.sampleData.names[uid];
  return st.names[uid] || label || 'Name unavailable';
}
async function resolveNames(ids){
  ids=(ids||[]).filter(Boolean); if(!st.user || !ids.length) return;
  try{ const ps=await st.user.profiles(ids); for(const id in ps){ if(ps[id] && ps[id].name) st.names[id]=ps[id].name; } }catch(e){}
}
function loading(text){ return h('div',{class:'loading', role:'status'}, text); }

/* ---------- boot and routing ---------- */
function onHash(){
  const hsh=(location.hash||'').replace(/^#/,'');
  st.route=['assessment','feedback','senior','console'].indexOf(hsh)>=0 ? hsh : 'home';
  if(st.ready){ render(); window.scrollTo(0,0); }
}
async function boot(){
  window.addEventListener('hashchange', onHash); onHash(); render();
  const cl=window.claude;
  if(!cl || typeof cl.use!=='function'){ st.preview=true; st.ready=true; st.meLoaded=true; render(); return; }
  const use=function(n){ try{ return Promise.resolve(cl.use(n)).catch(function(){ return null; }); }catch(e){ return Promise.resolve(null); } };
  const got=await Promise.all([use('db'), use('user'), use('downloads')]);
  st.db=got[0]; st.user=got[1]; st.dl=got[2];
  st.ready=true; render();
  if(st.user){ try{ const me=await st.user.me(); st.me={id:me.id||null, name:me.name||'', isOwner:!!me.isOwner}; if(st.me.id && st.me.name) st.names[st.me.id]=st.me.name; }catch(e){} }
  st.meLoaded=true; render();
  if(st.db){ try{ const s=await st.db.doc('public/config').get(); if(s.exists){ Object.assign(st.cfg, s.data()); st.cfg.form=FORM; render(); } }catch(e){} }
}
function renderNav(){
  const nav=$('#nav'); if(!nav) return; nav.replaceChildren();
  const link=function(r, label){ return h('a',{href:'#'+r, 'aria-current':(st.route===(r||'home')?'page':null)}, label); };
  nav.append(link('', 'Start'));
  if(st.me.isOwner) nav.append(link('console', 'Console'));
}
function render(){
  const act=document.activeElement; const fid=act && act.dataset ? act.dataset.fid : null;
  const v=$('#view'); v.replaceChildren(); v.className='wrap narrow';
  renderNav();
  if(!st.ready){ put(v, loading('Loading')); return; }
  if(st.route==='assessment') viewAssessment(v);
  else if(st.route==='feedback') viewFeedback(v);
  else if(st.route==='senior') viewSenior(v);
  else if(st.route==='console') viewConsole(v);
  else viewHome(v);
  if(fid){ const el=v.querySelector('[data-fid="'+fid+'"]'); if(el && !el.disabled) el.focus({preventScroll:true}); }
}

/* ---------- home ---------- */
function viewHome(v){
  const choice=function(route, who, what, how){ return h('a',{class:'choice', href:'#'+route, id:'go-'+route}, h('span',{class:'who'}, who), h('span',{class:'what'}, what), h('span',{class:'how'}, how), h('span',{class:'go'}, 'Open')); };
  put(v, 
    h('div',{class:'hero'}, h('p',{class:'eyebrow'}, 'Form A · 27 situations · Team and senior feedback'), h('h1',null,'Leadership Style Assessment'),
      h('p',{class:'lede'}, 'How managers handle everyday situations, paired with feedback from their teams and from their own managers. The results are used to plan management training.')),
    h('div',{class:'choices'},
      choice('assessment', 'I manage people', 'Take the manager assessment', '27 situations. About 40 minutes, in one sitting.'),
      choice('feedback', 'I report to a manager', 'Give feedback on your manager', '18 questions. About 5 minutes. Confidential.'),
      choice('senior', 'A manager reports to me', 'Give feedback on a manager who reports to you', '18 questions and two optional comments. About 6 minutes.'),
      st.me.isOwner && choice('console', 'Administrator', 'Open the console', 'Results, personas and training needs. Visible only to you.'))
  );
  const prob=st.meLoaded ? accessProblem() : ''; if(prob) put(v, h('div',{class:'notice warn'}, prob));
  put(v, h('div',{class:'notice'}, h('strong',null,'No scores are shown on this page. '), 'Managers see their persona here once the administrator shares it, and receive a development summary. Team feedback is reported only as averages. Feedback from a manager\'s own manager goes to the administrator.'));
}

/* ---------- manager assessment ---------- */
async function loadA(){
  const A=st.a; A.loading=true;
  try{ const got=await Promise.all([st.db.doc('responses/'+st.me.id).get(), st.db.doc('results/'+st.me.id).get()]); const s=got[0]; A.result=got[1].exists ? clone(got[1].data()) : null; A.doc=s.exists ? clone(s.data()) : null; if(A.doc){ A.doc.answers=A.doc.answers||{}; setupA(); } }
  catch(e){ A.error='Could not load your assessment. Reload the page to try again.'; }
  A.loaded=true; A.loading=false; render();
}
function setupA(){
  const A=st.a, d=A.doc;
  A.order=shuffled(ITEMS.map(function(i){ return i.id; }), mulberry32(d.seed>>>0));
  A.optOrder={}; ITEMS.forEach(function(it,ix){ A.optOrder[it.id]=shuffled(OPT_IDS, mulberry32((d.seed+7919*(ix+1))>>>0)); });
  const firstOpen=A.order.findIndex(function(id){ return !complete(d.answers[id]); });
  A.idx=firstOpen<0 ? A.order.length : firstOpen;
}
async function startA(){
  const A=st.a; if(A.busy) return; A.busy=true; A.error=''; render();
  const seed=(window.crypto && crypto.getRandomValues) ? crypto.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random()*4294967295);
  const t=nowISO();
  const doc={uid:st.me.id, form:st.cfg.form, status:'in_progress', consentAt:t, startedAt:t, submittedAt:null, seed:seed>>>0, bg:clone(A.bg), typedName:(A.typedName||'').trim().slice(0,80), answers:{}, activeSec:0, updatedAt:t};
  try{
    await retry(function(){ return st.db.doc('responses/'+st.me.id).set(doc); });
    try{ await st.db.doc('roster/'+st.me.id).set({uid:st.me.id, joinedAt:t, label:doc.typedName}); }catch(e){}
    A.doc=doc; setupA();
  }catch(e){ A.error=writeError(e); }
  A.busy=false; render(); window.scrollTo(0,0);
}
function mergePatch(a,b){ const o=Object.assign({}, a, b); if((a&&a.answers) || (b&&b.answers)) o.answers=Object.assign({}, a&&a.answers, b&&b.answers); return o; }
function setSave(state, msg){ saver.state=state; saver.msg=msg||''; const el=$('#a-save'); if(el){ el.textContent=saveText(); el.className='save'+(state==='error'?' err':''); } }
function saveText(){ return saver.state==='saving' || saver.state==='pending' ? 'Saving' : saver.state==='error' ? ('Not saved. '+saver.msg) : 'All answers saved'; }
function queueSave(patch){ saver.pending=mergePatch(saver.pending||{}, patch); setSave('pending'); clearTimeout(saver.timer); saver.timer=setTimeout(flushSave, 800); }
function flushSave(){
  clearTimeout(saver.timer);
  saver.chain=saver.chain.then(async function(){
    if(!saver.pending || !st.a.doc) return;
    const patch=saver.pending; saver.pending=null;
    patch.activeSec=st.a.doc.activeSec||0; patch.updatedAt=nowISO();
    setSave('saving');
    try{ await retry(function(){ return st.db.doc('responses/'+st.me.id).update(patch); }); if(!saver.pending) setSave('saved'); }
    catch(e){ saver.pending=mergePatch(patch, saver.pending||{}); setSave('error', writeError(e)); }
  });
  return saver.chain;
}
function pick(id, kind, oid){
  const d=st.a.doc; const a=Object.assign({m:null, l:null}, d.answers[id]);
  if(kind==='m'){ a.m=(a.m===oid ? null : oid); if(a.m && a.l===a.m) a.l=null; }
  else { a.l=(a.l===oid ? null : oid); if(a.l && a.m===a.l) a.m=null; }
  d.answers[id]=a; const p={answers:{}}; p.answers[id]=a; queueSave(p); render();
}
function goQ(ix){ flushSave(); st.a.confirm=false; st.a.idx=Math.max(0, Math.min(st.a.order.length, ix)); render(); window.scrollTo(0,0); }
async function submitA(){
  const A=st.a; if(A.busy) return; A.busy=true; A.error=''; render();
  if(saver.pending) await flushSave(); else await saver.chain;
  if(saver.state==='error'){ A.busy=false; A.error='Some answers are not saved yet. '+saver.msg; render(); return; }
  try{ const t=nowISO(); await retry(function(){ return st.db.doc('responses/'+st.me.id).update({status:'submitted', submittedAt:t, activeSec:A.doc.activeSec||0, updatedAt:t}); }); A.doc.status='submitted'; A.doc.submittedAt=t; }
  catch(e){ A.error=writeError(e); }
  A.busy=false; render(); window.scrollTo(0,0);
}
function timerText(){ const d=st.a.doc, lim=st.cfg.timeLimitMin*60, used=d.activeSec||0; return 'Time used '+mmss(used)+' of '+mmss(lim)+(used>lim ? ' · over the guide' : ''); }
setInterval(function(){
  const A=st.a;
  if(st.route!=='assessment' || !A.doc || A.doc.status!=='in_progress' || document.visibilityState!=='visible' || A.idx>=A.order.length) return;
  A.doc.activeSec=(A.doc.activeSec||0)+1; const el=$('#a-timer'); if(el) el.textContent=timerText();
  if(A.doc.activeSec%60===0) queueSave({});
}, 1000);
function viewAssessment(v){
  const A=st.a;
  put(v, h('p',{class:'eyebrow'}, 'Manager assessment · Form A'));
  if(!st.meLoaded){ put(v, loading('Loading')); return; }
  const prob=accessProblem();
  if(prob){ put(v, h('h1',null,'Manager assessment'), h('div',{class:'notice warn'}, prob)); return; }
  if(!A.loaded){ if(!A.loading) loadA(); put(v, loading('Loading your assessment')); return; }
  if(A.doc && !isCurrentForm(A.doc)){ aUpdated(v); return; }
  if(A.doc && A.doc.status==='submitted'){ aDone(v); return; }
  if(A.doc){ if(A.idx>=A.order.length) aReview(v); else aQuestion(v); return; }
    if(!st.cfg.open){ put(v, h('h1',null,'The assessment window is closed'), h('p',{class:'lede'}, 'New assessments cannot be started right now. Contact the assessment administrator if you were expecting to take part.')); return; }
  if(A.step==='bg') aBackground(v); else aIntro(v);
}
function aUpdated(v){
  const A=st.a;
  put(v, h('h1',{id:'a-updated'}, 'The questions have been updated'),
    h('p',{class:'lede'}, 'The situations in this assessment were revised after you last opened it, so your earlier answers no longer apply. Please take the new version. It takes about 40 minutes.'),
    h('div',{class:'row'}, h('button',{class:'btn primary', id:'a-new-version', onclick:function(){ A.doc=null; A.step='intro'; A.consent=false; A.error=''; render(); window.scrollTo(0,0); }}, 'Take the new version')));
}
function aIntro(v){
  const A=st.a;
  put(v, h('h1',null,'Before you start'),
    h('p',{class:'lede'}, 'This assessment looks at how you would handle 27 everyday management situations.'),
    h('div',{class:'card'}, h('dl',{class:'facts'},
      h('dt',null,'What you do'), h('dd',null,'For each situation you read four possible responses. You choose the one you think is most effective and the one you think is least effective. Often more than one response will look sensible. Think about what each one would lead to, and pick the one you judge best.'),
      h('dt',null,'Why'), h('dd',null,'The results are used to plan management training. They are not used for pay, promotion or appraisal, and there is no pass or fail.'),
      h('dt',null,'Who sees your answers'), h('dd',null,'Only the assessment administrator. You will not see a score. Once the administrator shares results, this page shows your persona, and you receive a short development summary.'),
      h('dt',null,'Time'), h('dd',null,'About 40 minutes. A '+st.cfg.timeLimitMin+'-minute guide is shown as you go. Please finish in one sitting.'),
      h('dt',null,'Working alone'), h('dd',null,'Answer on your own, without colleagues, notes or AI tools. The summary is only useful to you if the answers are yours.'),
      h('dt',null,'Your data'), h('dd',null,'Your answers are stored against your account for this assessment cycle. Ask the administrator if you want them deleted.'))),
    A.error && h('div',{class:'notice crit'}, A.error),
    h('label',{class:'check'}, h('input',{type:'checkbox', id:'a-consent', 'data-fid':'a-consent', checked:A.consent, onchange:function(e){ A.consent=e.target.checked; render(); }}), h('span',null,'I have read this and I want to take part.')),
    h('div',{class:'row'}, h('button',{class:'btn primary', id:'a-continue', 'data-fid':'a-continue', disabled:!A.consent, onclick:function(){ A.step='bg'; render(); window.scrollTo(0,0); }}, 'Continue')));
}
function aBackground(v){
  const A=st.a;
  const sel=function(f){ const s=h('select',{id:'bg-'+f.id, onchange:function(e){ A.bg[f.id]=e.target.value; }}, h('option',{value:''}, 'Prefer not to say'), f.opts.map(function(o){ return h('option',{value:o}, o); })); s.value=A.bg[f.id]||''; return s; };
  put(v, h('h1',null,'A few questions about you'),
    h('p',{class:'muted'}, 'These are optional. They are used to check that the assessment is fair to different groups, never to score you.'),
    h('div',{class:'card'}, h('div',{class:'fields'},
      (!st.me.name) && h('div',{class:'field'}, h('label',{for:'a-name'}, 'Your full name'), h('input',{type:'text', id:'a-name', maxlength:'80', value:A.typedName||'', oninput:function(e){ A.typedName=e.target.value; }}), h('span',{class:'hint'}, 'So the administrator can address your development summary.')),
      BG_FIELDS.map(function(f){ return h('div',{class:'field'}, h('label',{for:'bg-'+f.id}, f.label), sel(f)); }))),
    A.error && h('div',{class:'notice crit'}, A.error),
    h('div',{class:'row'}, h('button',{class:'btn', onclick:function(){ A.step='intro'; render(); }}, 'Back'), h('button',{class:'btn primary', id:'a-start', disabled:A.busy, onclick:startA}, A.busy ? 'Starting' : 'Start the assessment')));
}
function aQuestion(v){
  const A=st.a, d=A.doc, id=A.order[A.idx], it=ITEM_BY_ID[id], a=d.answers[id]||{}, n=A.order.length;
  const done=A.order.filter(function(x){ return complete(d.answers[x]); }).length;
  put(v, 
    h('div',{class:'q-head'}, h('span',{id:'a-count'}, 'Question '+(A.idx+1)+' of '+n), h('span',{id:'a-timer'}, timerText())),
    h('div',{class:'progress', role:'progressbar', 'aria-valuemin':'0', 'aria-valuemax':String(n), 'aria-valuenow':String(done), 'aria-label':'Questions answered'}, h('i',{style:{width:(100*done/n)+'%'}})),
    h('p',{class:'scenario', id:'a-scenario'}, it.text),
    h('p',{class:'instr'}, 'Choose the most effective response and the least effective response. More than one may look sensible.'),
    h('div',{class:'opts'}, A.optOrder[id].map(function(oid,ix){
      const o=it.options.find(function(x){ return x.id===oid; }), letter='ABCD'[ix];
      return h('div',{class:'opt'+(a.m===oid?' is-most':'')+(a.l===oid?' is-least':''), 'data-oid':oid},
        h('div',{class:'opt-letter', 'aria-hidden':'true'}, letter),
        h('div',{class:'opt-text'}, o.text),
        h('div',{class:'opt-picks'},
          h('button',{class:'pick most', type:'button', 'aria-pressed':String(a.m===oid), 'aria-label':'Response '+letter+': most effective', 'data-fid':'m-'+ix, onclick:function(){ pick(id,'m',oid); }}, 'Most effective'),
          h('button',{class:'pick least', type:'button', 'aria-pressed':String(a.l===oid), 'aria-label':'Response '+letter+': least effective', 'data-fid':'l-'+ix, onclick:function(){ pick(id,'l',oid); }}, 'Least effective')));
    })),
    h('div',{class:'row between'},
      h('div',{class:'row'}, h('button',{class:'btn', disabled:A.idx===0, 'data-fid':'a-back', onclick:function(){ goQ(A.idx-1); }}, 'Back'), h('button',{class:'btn primary', id:'a-next', 'data-fid':'a-next', onclick:function(){ goQ(A.idx+1); }}, A.idx===n-1 ? 'Review answers' : 'Next')),
      h('span',{class:'save'+(saver.state==='error'?' err':''), id:'a-save', role:'status'}, saveText())),
    h('details',{class:'fold'}, h('summary',null,'All questions'), h('div',{class:'dots'}, A.order.map(function(x,ix){ return h('button',{class:'dot'+(complete(d.answers[x])?' done':'')+(ix===A.idx?' cur':''), type:'button', 'aria-label':'Go to question '+(ix+1), onclick:function(){ goQ(ix); }}, String(ix+1)); }))));
}
function aReview(v){
  const A=st.a, d=A.doc; const open=A.order.map(function(x,ix){ return {x:x, ix:ix}; }).filter(function(o){ return !complete(d.answers[o.x]); });
  put(v, h('h1',null, open.length ? 'A few questions still need an answer' : 'Ready to submit'),
    open.length ? h('div',{class:'stack'}, h('p',{class:'muted'}, 'Each question needs one most effective and one least effective response. These are still open:'), h('div',{class:'dots'}, open.map(function(o){ return h('button',{class:'dot', type:'button', 'aria-label':'Go to question '+(o.ix+1), onclick:function(){ goQ(o.ix); }}, String(o.ix+1)); })))
      : h('p',{class:'lede'}, 'You have answered all '+A.order.length+' questions. Once you submit, your answers cannot be changed.'),
    A.error && h('div',{class:'notice crit'}, A.error),
    h('div',{class:'row'}, h('button',{class:'btn', onclick:function(){ goQ(A.order.length-1); }}, 'Back to questions'),
      !open.length && (A.confirm ? h('button',{class:'btn primary', id:'a-submit-confirm', disabled:A.busy, onclick:submitA}, A.busy ? 'Submitting' : 'Confirm and submit') : h('button',{class:'btn primary', id:'a-submit', onclick:function(){ A.confirm=true; render(); }}, 'Submit answers'))),
    h('span',{class:'save'+(saver.state==='error'?' err':''), id:'a-save', role:'status'}, saveText()));
}
function personaReveal(){
  const A=st.a, x=A.result, l=(x && isCurrentForm(x)) ? Number(x.level) : 0;
  if(!LEVELS[l]) return h('div',{class:'card', id:'a-persona-wait'},
    h('h3',null,'Your persona'),
    h('p',{class:'muted'}, 'Your persona will appear here once the administrator shares results. Come back to this page later.'),
    h('div',{class:'row'}, h('button',{class:'btn sm', id:'a-persona-check', onclick:function(){ A.loaded=false; render(); }}, 'Check again')));
  return h('div',{class:'card persona-reveal ps'+l, id:'a-persona'},
    h('div',{class:'persona-reveal-head'}, personaIcon(l, 96),
      h('div',{class:'stack tight'}, h('span',{class:'small muted'}, 'Your persona'), h('h2',{id:'a-persona-name'}, LEVELS[l]), h('p',null, PERSONA_YOU[l]))),
    h('p',{class:'small muted'}, 'Your persona describes how you handled the 27 situations in this assessment. It is a starting point for your development, not a verdict on you. Your development summary shows where to focus.'));
}
function aDone(v){
  put(v, h('h1',{id:'a-done'}, 'Thank you. Your answers are recorded.'),
    h('p',{class:'lede'}, 'You do not need to do anything else. The administrator will send you a short development summary.'),
    personaReveal(),
    h('div',{class:'notice'}, 'Submitted on '+dateShort(st.a.doc.submittedAt)+'. No score is shown here, by design.'),
    h('div',{class:'row'}, h('a',{class:'btn', href:'#feedback'}, 'Give feedback on your own manager')));
}

/* ---------- team feedback ---------- */
async function loadF(){
  const F=st.f; F.loading=true;
  try{
    const got=await Promise.all([st.db.doc('survey/'+st.me.id).get(), st.db.collection('roster').limit(1000).get()]);
    F.doc=got[0].exists ? clone(got[0].data()) : null;
    F.roster=got[1].docs.map(function(d){ return {uid:d.id, label:(d.data()||{}).label||''}; }).filter(function(r){ return r.uid!==st.me.id; });
    await resolveNames(F.roster.map(function(r){ return r.uid; }));
  }catch(e){ F.error=(e && e.firebaseCode==='permission-denied') ? feedbackDenied() : 'Could not load the list of managers. Reload the page to try again.'; }
  F.loaded=true; F.loading=false; render();
}
function viewFeedback(v){
  const F=st.f;
  put(v, h('p',{class:'eyebrow'}, 'Team feedback · 18 questions'));
  if(!st.meLoaded){ put(v, loading('Loading')); return; }
  const prob=accessProblem();
  if(prob){ put(v, h('h1',null,'Feedback on your manager'), h('div',{class:'notice warn'}, prob)); return; }
  if(!F.loaded){ if(!F.loading) loadF(); put(v, loading('Loading')); return; }
  if(F.step==='done') fDone(v); else if(F.step==='form') fForm(v); else if(F.step==='pick') fPick(v); else fIntro(v);
}
function fIntro(v){
  const F=st.f;
  put(v, h('h1',null,'Feedback on your manager'),
    h('p',{class:'lede'}, 'Eighteen short questions about what your manager does day to day.'),
    h('div',{class:'card'}, h('dl',{class:'facts'},
      h('dt',null,'What you do'), h('dd',null,'For each statement, say how often your manager does it. It takes about five minutes.'),
      h('dt',null,'Who sees your answers'), h('dd',null,'Your manager never sees individual answers. The administrator sees only averages, and only once at least '+st.cfg.minRaters+' people have answered about the same manager.'),
      h('dt',null,'Is it anonymous?'), h('dd',null,'It is confidential. Your answers are stored against an internal account ID so that each person answers once. Reports never show who said what.'),
      h('dt',null,'Why'), h('dd',null,'The averages help decide which management training is offered. They are not used for pay, promotion or appraisal.'))),
    F.error && h('div',{class:'notice crit'}, F.error),
    !st.cfg.open && h('div',{class:'notice warn'}, 'The feedback window is closed. New feedback cannot be given right now.'),
    h('div',{class:'row'}, h('button',{class:'btn primary', id:'f-begin', disabled:!st.cfg.open, onclick:function(){ F.step='pick'; render(); window.scrollTo(0,0); }}, 'Continue')));
}
function fPick(v){
  const F=st.f; const list=h('div',{class:'people', id:'f-people'});
  const btn=h('button',{class:'btn primary', id:'f-continue', disabled:!F.mid, onclick:function(){ prefillF(); F.step='form'; render(); window.scrollTo(0,0); }}, 'Continue');
  const fill=function(){
    list.replaceChildren(); const q=(F.q||'').trim().toLowerCase(); const seen={};
    const ros=F.roster.map(function(r){ return {uid:r.uid, name:nameOf(r.uid, r.label), tag:'Taking part'}; }).filter(function(p){ return !q || p.name.toLowerCase().indexOf(q)>=0; });
    ros.forEach(function(p){ seen[p.uid]=1; });
    const hits=(F.hits||[]).filter(function(p){ return !seen[p.uid] && p.uid!==st.me.id && p.name; }).map(function(p){ return {uid:p.uid, name:p.name, tag:'From the directory'}; });
    const all=ros.concat(hits);
    if(!all.length) list.append(h('div',{class:'person', style:{cursor:'default'}}, h('span',{class:'muted'}, q ? 'No one matches that name.' : 'No managers are listed yet. Type a name to search the directory.')));
    all.forEach(function(p){ list.append(h('button',{class:'person', type:'button', 'aria-pressed':String(F.mid===p.uid), 'data-uid':p.uid, onclick:function(){ F.mid=p.uid; F.midName=p.name; btn.disabled=false; fill(); }}, h('span',null,p.name), h('span',{class:'tag'}, p.tag))); });
  };
  let tmr=0;
  const input=h('input',{type:'search', id:'f-search', placeholder:'Type a name', value:F.q||'', autocomplete:'off', oninput:function(e){
    F.q=e.target.value; fill(); clearTimeout(tmr); const q=F.q.trim();
    if(st.user && typeof st.user.search==='function' && q.length>=2){ tmr=setTimeout(async function(){ try{ const res=await st.user.search(q); if(F.q.trim()!==q) return; F.hits=(res||[]).map(function(p){ return {uid:p.id, name:p.name||''}; }); F.hits.forEach(function(p){ if(p.name) st.names[p.uid]=p.name; }); fill(); }catch(err){} }, 250); }
    else F.hits=[];
  }});
  fill();
  put(v, h('h1',null,'Who is your manager?'), h('p',{class:'muted'}, 'Pick the person you report to.'),
    h('div',{class:'field'}, h('label',{for:'f-search'}, 'Find your manager'), input), list,
    h('div',{class:'row'}, h('button',{class:'btn', onclick:function(){ F.step='intro'; render(); }}, 'Back'), btn));
}
function prefillF(){
  const F=st.f; F.ans={}; const prev=F.doc && F.doc.about && F.doc.about[F.mid];
  if(prev && Array.isArray(prev.a)) SURVEY.forEach(function(q,ix){ if(typeof prev.a[ix]==='number') F.ans[q.id]=prev.a[ix]; });
  F.prevAt=prev ? prev.at : null;
}
function fForm(v){
  const F=st.f; const answered=SURVEY.filter(function(q){ return typeof F.ans[q.id]==='number'; }).length;
  put(v, h('h1',null,'About '+(F.midName||'your manager')),
    h('p',{class:'muted'}, 'How often does your manager do each of these? Answer from your own experience over the last six months.'),
    F.prevAt && h('div',{class:'notice'}, 'You answered about this manager on '+dateShort(F.prevAt)+'. Submitting again replaces those answers.'),
    h('div',{class:'card'}, SURVEY.map(function(q,ix){
      return h('div',{class:'sq'}, h('p',{id:'sq-'+q.id}, (ix+1)+'. '+q.text),
        h('div',{class:'scale', role:'group', 'aria-labelledby':'sq-'+q.id},
          SCALE.map(function(lab,i){ return h('button',{type:'button', 'aria-pressed':String(F.ans[q.id]===i+1), 'data-fid':q.id+'-'+(i+1), onclick:function(){ F.ans[q.id]=i+1; render(); }}, lab); }),
          h('button',{type:'button', class:'cs', 'aria-pressed':String(F.ans[q.id]===0), 'data-fid':q.id+'-0', onclick:function(){ F.ans[q.id]=0; render(); }}, 'Cannot say')));
    })),
    F.error && h('div',{class:'notice crit'}, F.error),
    h('div',{class:'row between'},
      h('div',{class:'row'}, h('button',{class:'btn', onclick:function(){ F.step='pick'; render(); }}, 'Back'), h('button',{class:'btn primary', id:'f-submit', disabled:answered<SURVEY.length || F.busy, onclick:submitF}, F.busy ? 'Sending' : 'Submit feedback')),
      h('span',{class:'save', id:'f-count'}, answered+' of '+SURVEY.length+' answered')));
}
async function submitF(){
  const F=st.f; if(F.busy) return; F.busy=true; F.error=''; render();
  const entry={a:SURVEY.map(function(q){ return F.ans[q.id]; }), at:nowISO()}; const ref=st.db.doc('survey/'+st.me.id);
  try{
    if(F.doc){ const p={about:{}, updatedAt:entry.at}; p.about[F.mid]=entry; await retry(function(){ return ref.update(p); }); F.doc.about=F.doc.about||{}; F.doc.about[F.mid]=entry; }
    else { const doc={uid:st.me.id, about:{}, updatedAt:entry.at}; doc.about[F.mid]=entry; await retry(function(){ return ref.set(doc); }); F.doc=doc; }
    F.step='done';
  }catch(e){ F.error=writeError(e); }
  F.busy=false; render(); window.scrollTo(0,0);
}
function fDone(v){
  const F=st.f;
  put(v, h('h1',{id:'f-done'}, 'Thank you. Your feedback is recorded.'),
    h('p',{class:'lede'}, 'It will be combined with other people\'s answers and shown only as averages.'),
    h('div',{class:'row'}, h('button',{class:'btn', onclick:function(){ F.mid=null; F.midName=''; F.ans={}; F.q=''; F.hits=[]; F.step='pick'; render(); }}, 'Give feedback on another manager'), h('a',{class:'btn quiet', href:'#'}, 'Back to start')));
}

/* ---------- feedback from a manager's own manager ---------- */
async function loadS(){
  const S=st.s; S.loading=true;
  try{
    const got=await Promise.all([st.db.doc('senior/'+st.me.id).get(), st.db.collection('roster').limit(1000).get()]);
    S.doc=got[0].exists ? clone(got[0].data()) : null;
    S.roster=got[1].docs.map(function(d){ return {uid:d.id, label:(d.data()||{}).label||''}; }).filter(function(r){ return r.uid!==st.me.id; });
    await resolveNames(S.roster.map(function(r){ return r.uid; }));
  }catch(e){ S.error=(e && e.firebaseCode==='permission-denied') ? feedbackDenied() : 'Could not load the list of managers. Reload the page to try again.'; }
  S.loaded=true; S.loading=false; render();
}
function viewSenior(v){
  const S=st.s;
  put(v, h('p',{class:'eyebrow'}, 'Senior feedback · 18 questions'));
  if(!st.meLoaded){ put(v, loading('Loading')); return; }
  const prob=accessProblem();
  if(prob){ put(v, h('h1',null,'Feedback on a manager who reports to you'), h('div',{class:'notice warn'}, prob)); return; }
  if(!S.loaded){ if(!S.loading) loadS(); put(v, loading('Loading')); return; }
  if(S.step==='done') sDone(v); else if(S.step==='form') sForm(v); else if(S.step==='pick') sPick(v); else sIntro(v);
}
function sIntro(v){
  const S=st.s;
  put(v, h('h1',null,'Feedback on a manager who reports to you'),
    h('p',{class:'lede'}, 'Eighteen short questions about what you see this manager do, and two optional comments.'),
    h('div',{class:'card'}, h('dl',{class:'facts'},
      h('dt',null,'What you do'), h('dd',null,'Pick a manager who reports to you. For each statement, say how often they do it. It takes about six minutes, and you can give feedback on more than one manager.'),
      h('dt',null,'Who sees your answers'), h('dd',null,'The administrator sees your answers and comments, with your name. The manager\'s development summary names the two areas you rated highest and lowest, without numbers, and does not quote your comments.'),
      h('dt',null,'Why'), h('dd',null,'Your view adds what the test and the team survey cannot show. It helps decide which management training is offered. It is not used for pay, promotion or appraisal.'))),
    S.error && h('div',{class:'notice crit'}, S.error),
    !st.cfg.open && h('div',{class:'notice warn'}, 'The feedback window is closed. New feedback cannot be given right now.'),
    h('div',{class:'row'}, h('button',{class:'btn primary', id:'sr-begin', disabled:!st.cfg.open || !!S.error, onclick:function(){ S.step='pick'; render(); window.scrollTo(0,0); }}, 'Continue')));
}
function sPick(v){
  const S=st.s; const list=h('div',{class:'people', id:'sr-people'});
  const btn=h('button',{class:'btn primary', id:'sr-continue', disabled:!S.mid, onclick:function(){ prefillS(); S.step='form'; render(); window.scrollTo(0,0); }}, 'Continue');
  const fill=function(){
    list.replaceChildren(); const q=(S.q||'').trim().toLowerCase(); const seen={};
    const ros=S.roster.map(function(r){ return {uid:r.uid, name:nameOf(r.uid, r.label), tag:'Taking part'}; }).filter(function(p){ return !q || p.name.toLowerCase().indexOf(q)>=0; });
    ros.forEach(function(p){ seen[p.uid]=1; });
    const hits=(S.hits||[]).filter(function(p){ return !seen[p.uid] && p.uid!==st.me.id && p.name; }).map(function(p){ return {uid:p.uid, name:p.name, tag:'From the directory'}; });
    const all=ros.concat(hits);
    if(!all.length) list.append(h('div',{class:'person', style:{cursor:'default'}}, h('span',{class:'muted'}, q ? 'No one matches that name.' : 'No managers are listed yet. Type a name to search the directory.')));
    all.forEach(function(p){ const done=!!(S.doc && S.doc.about && S.doc.about[p.uid]); list.append(h('button',{class:'person', type:'button', 'aria-pressed':String(S.mid===p.uid), 'data-uid':p.uid, onclick:function(){ S.mid=p.uid; S.midName=p.name; btn.disabled=false; fill(); }}, h('span',null,p.name), h('span',{class:'tag'}, done ? 'Answered' : p.tag))); });
  };
  let tmr=0;
  const input=h('input',{type:'search', id:'sr-search', placeholder:'Type a name', value:S.q||'', autocomplete:'off', oninput:function(e){
    S.q=e.target.value; fill(); clearTimeout(tmr); const q=S.q.trim();
    if(st.user && typeof st.user.search==='function' && q.length>=2){ tmr=setTimeout(async function(){ try{ const res=await st.user.search(q); if(S.q.trim()!==q) return; S.hits=(res||[]).map(function(p){ return {uid:p.id, name:p.name||''}; }); S.hits.forEach(function(p){ if(p.name) st.names[p.uid]=p.name; }); fill(); }catch(err){} }, 250); }
    else S.hits=[];
  }});
  fill();
  put(v, h('h1',null,'Who reports to you?'), h('p',{class:'muted'}, 'Pick one manager who reports to you directly. You can give feedback on others afterwards.'),
    h('div',{class:'field'}, h('label',{for:'sr-search'}, 'Find the manager'), input), list,
    h('div',{class:'row'}, h('button',{class:'btn', onclick:function(){ S.step='intro'; render(); }}, 'Back'), btn));
}
function prefillS(){
  const S=st.s; S.ans={}; S.good=''; S.grow=''; const prev=S.doc && S.doc.about && S.doc.about[S.mid];
  if(prev && Array.isArray(prev.a)) SENIOR.forEach(function(q,ix){ if(typeof prev.a[ix]==='number') S.ans[q.id]=prev.a[ix]; });
  if(prev){ S.good=String(prev.good||''); S.grow=String(prev.grow||''); }
  S.prevAt=prev ? prev.at : null;
}
function sForm(v){
  const S=st.s; const answered=SENIOR.filter(function(q){ return typeof S.ans[q.id]==='number'; }).length;
  const note=function(id, label, key){ const ta=h('textarea',{id:id, class:'comment', rows:'3', maxlength:String(NOTE_MAX), 'data-fid':id, oninput:function(e){ S[key]=e.target.value; }}); ta.value=S[key]||''; return h('div',{class:'field'}, h('label',{for:id}, label), ta); };
  put(v, h('h1',null,'About '+(S.midName||'this manager')),
    h('p',{class:'muted'}, 'How often does this manager do each of these? Answer from what you have seen over the last six months. Choose Cannot say where you have not seen enough to judge.'),
    S.prevAt && h('div',{class:'notice'}, 'You answered about this manager on '+dateShort(S.prevAt)+'. Submitting again replaces those answers.'),
    h('div',{class:'card'}, SENIOR.map(function(q,ix){
      return h('div',{class:'sq'}, h('p',{id:'sq-'+q.id}, (ix+1)+'. '+q.text),
        h('div',{class:'scale', role:'group', 'aria-labelledby':'sq-'+q.id},
          SCALE.map(function(lab,i){ return h('button',{type:'button', 'aria-pressed':String(S.ans[q.id]===i+1), 'data-fid':q.id+'-'+(i+1), onclick:function(){ S.ans[q.id]=i+1; render(); }}, lab); }),
          h('button',{type:'button', class:'cs', 'aria-pressed':String(S.ans[q.id]===0), 'data-fid':q.id+'-0', onclick:function(){ S.ans[q.id]=0; render(); }}, 'Cannot say')));
    })),
    h('div',{class:'card'}, h('div',{class:'stack tight'}, h('h3',null,'Comments'), h('p',{class:'small muted'}, 'Optional. Only the administrator reads them. Describe what the manager does rather than what they are like.')),
      note('sr-good', 'One strength you would like them to keep using', 'good'),
      note('sr-grow', 'One change that would make the biggest difference', 'grow')),
    S.error && h('div',{class:'notice crit'}, S.error),
    h('div',{class:'row between'},
      h('div',{class:'row'}, h('button',{class:'btn', onclick:function(){ S.step='pick'; render(); }}, 'Back'), h('button',{class:'btn primary', id:'sr-submit', disabled:answered<SENIOR.length || S.busy, onclick:submitS}, S.busy ? 'Sending' : 'Submit feedback')),
      h('span',{class:'save', id:'sr-count'}, answered+' of '+SENIOR.length+' answered')));
}
async function submitS(){
  const S=st.s; if(S.busy) return; S.busy=true; S.error=''; render();
  const entry={a:SENIOR.map(function(q){ return S.ans[q.id]; }), good:String(S.good||'').trim().slice(0,NOTE_MAX), grow:String(S.grow||'').trim().slice(0,NOTE_MAX), at:nowISO()}; const ref=st.db.doc('senior/'+st.me.id);
  try{
    if(S.doc){ const p={about:{}, updatedAt:entry.at}; p.about[S.mid]=entry; await retry(function(){ return ref.update(p); }); S.doc.about=S.doc.about||{}; S.doc.about[S.mid]=entry; }
    else { const doc={uid:st.me.id, about:{}, updatedAt:entry.at}; doc.about[S.mid]=entry; await retry(function(){ return ref.set(doc); }); S.doc=doc; }
    S.step='done';
  }catch(e){ S.error=writeError(e); }
  S.busy=false; render(); window.scrollTo(0,0);
}
function sDone(v){
  const S=st.s;
  put(v, h('h1',{id:'sr-done'}, 'Thank you. Your feedback is recorded.'),
    h('p',{class:'lede'}, 'The administrator will read it alongside the test and the team survey.'),
    h('div',{class:'row'}, h('button',{class:'btn', id:'sr-another', onclick:function(){ S.mid=null; S.midName=''; S.ans={}; S.good=''; S.grow=''; S.q=''; S.hits=[]; S.prevAt=null; S.step='pick'; render(); }}, 'Give feedback on another manager'), h('a',{class:'btn quiet', href:'#'}, 'Back to start')));
}

/* ---------- administrator console ---------- */
async function fetchAll(path){
  const out=[]; let last=null;
  for(let page=0; page<60; page++){
    let q=st.db.collection(path);
    if(last!==null) q=q.where('uid','>',last);
    const snap=await q.orderBy('uid').limit(500).get();
    snap.docs.forEach(function(d){ const x=clone(d.data()||{}); if(!x.uid) x.uid=d.id; out.push(x); });
    if(snap.docs.length<500) break;
    last=out[out.length-1].uid;
  }
  return out;
}
async function loadC(){
  const C=st.c; C.loading=true; C.error='';
  try{
    const got=await Promise.all([st.db.doc('admin/key').get(), st.db.doc('admin/settings').get(), fetchAll('responses'), fetchAll('survey'), fetchAll('admin/vault/r'), fetchAll('senior'), fetchAll('results')]);
    C.key=(got[0].exists && got[0].data() && got[0].data().items) ? clone(got[0].data()) : null;
    C.settings=Object.assign({}, SET_DEFAULT, got[1].exists ? got[1].data() : {});
    C.old=got[2].filter(function(r){ return !isCurrentForm(r); }); C.responses=got[2].filter(isCurrentForm); C.surveys=got[3]; C.seniors=got[5]; C.results={}; got[6].forEach(function(x){ C.results[x.uid]=x; }); C.vault={}; C.oldVault=[]; got[4].forEach(function(x){ if(isCurrentForm(x)) C.vault[x.uid]=x; else C.oldVault.push(x.uid); });
    C.loadedAt=new Date();
    C.sample=!!C.key && !C.sampleOff && !C.responses.some(function(r){ return r.status==='submitted'; });
    if(C.sample && !C.sampleData) C.sampleData=makeSample(C.key);
    await resolveNames(C.responses.map(function(r){ return r.uid; }).concat(C.seniors.map(function(s){ return s.uid; })));
  }catch(e){ C.error='Could not load the results. Reload the page to try again.'; }
  C.loaded=true; C.loading=false; computeAll(); render();
}
function computeAll(){
  const C=st.c; if(!C.key){ C.model=null; return; }
  const src=C.sample ? C.sampleData : {responses:C.responses, surveys:C.surveys, seniors:C.seniors, vault:C.vault};
  C.model=buildModel(src, C.key, C.settings, st.cfg);
  if(C.sel && !C.model.rows.some(function(r){ return r.uid===C.sel; })) C.sel=null;
}
function viewConsole(v){
  v.className='wrap wide'; const C=st.c;
  put(v, h('p',{class:'eyebrow'}, 'Administrator console'));
  if(!st.meLoaded){ put(v, loading('Loading')); return; }
  if(st.preview){ put(v, h('h1',null,'Console'), h('div',{class:'notice warn'}, 'This is a preview copy of the page. Open the published page to see results.')); return; }
  if(!st.me.isOwner || !st.db){ put(v, h('h1',null,'Administrator only'), h('p',{class:'lede'}, 'Results are visible only to the owner of this page.')); return; }
  if(!C.loaded){ if(!C.loading) loadC(); put(v, loading('Loading results')); return; }
  put(v, h('div',{class:'row between'}, h('h1',null,'Results'), h('div',{class:'row'}, h('span',{class:'small muted'}, 'Updated '+timeShort(C.loadedAt)), h('button',{class:'btn sm', id:'c-refresh', onclick:function(){ C.loaded=false; render(); }}, 'Refresh'))));
  if(C.error) put(v, h('div',{class:'notice crit'}, C.error));
  if(!C.key || !C.model){ put(v, h('div',{class:'notice crit', id:'c-nokey'}, h('div',{class:'stack'}, h('span',null, h('strong',null,'The answer key is not loaded. '), 'Scores cannot be calculated until the key is stored where only you can read it. Load the answer key file you were given (a .json file). It is stored with the results, where only administrators can read it.'), keyImport()))); return; }
  if(C.sample) put(v, h('div',{class:'notice warn', id:'c-sample'}, h('div',{class:'row between'}, h('span',{class:'grow'}, h('strong',null,'Sample data. '), 'These 48 managers are invented so you can see how the console works. Nothing here is real or saved.'), h('button',{class:'btn sm', id:'c-sample-off', onclick:function(){ C.sample=false; C.sampleOff=true; C.sel=null; computeAll(); render(); }}, 'Hide sample data'))));
  else if(!C.model.stats.n) put(v, h('div',{class:'notice', id:'c-empty'}, h('div',{class:'row between'}, h('span',{class:'grow'}, 'No one has submitted yet. Results appear here as managers finish.'), h('button',{class:'btn sm', id:'c-sample-on', onclick:function(){ C.sample=true; C.sampleOff=false; C.sampleData=C.sampleData||makeSample(C.key); C.sel=null; computeAll(); render(); }}, 'Show sample data'))));
  const nOld=(C.old||[]).length;
  if(nOld || (C.oldVault||[]).length) put(v, h('div',{class:'notice', id:'c-old'}, h('div',{class:'stack tight'},
    h('span',null, h('strong',null,'Earlier version. '), nOld ? (nOld+(nOld===1?' response was':' responses were')+' given on the previous version of the questions and '+(nOld===1?'is':'are')+' not scored. Anyone who opens the assessment link again is asked to take the new version.') : 'Locked copies from the previous version of the questions are still stored. They are not used.'),
    C.confirmDelete==='OLD'
      ? h('div',{class:'row'}, h('span',{class:'small'}, 'Delete the earlier-version answers? Team feedback is kept.'), h('button',{class:'btn sm', onclick:function(){ C.confirmDelete=null; render(); }}, 'Keep them'), h('button',{class:'btn sm danger', id:'c-old-go', disabled:C.busy, onclick:deleteOld}, C.busy ? 'Deleting' : 'Delete'))
      : h('div',{class:'row'}, h('button',{class:'btn sm', id:'c-old-del', onclick:function(){ C.confirmDelete='OLD'; render(); }}, 'Delete earlier-version answers')))));
  const T=[['overview','Overview'],['managers','Managers'],['needs','Training needs'],['questions','Questions'],['settings','Settings']];
  put(v, h('div',{class:'tabs', role:'tablist'}, T.map(function(t){ return h('button',{class:'tab', role:'tab', id:'tab-'+t[0], 'aria-selected':String(C.tab===t[0]), 'data-fid':'tab-'+t[0], onclick:function(){ C.tab=t[0]; C.msg=''; render(); }}, t[1]); })));
  ({overview:cOverview, managers:cManagers, needs:cNeeds, questions:cQuestions, settings:cSettings}[C.tab] || cOverview)(v);
}
function cardW(full){ const el=$('#view'); const w=el ? el.clientWidth : 1000; const inner=(full || w<896) ? w-42 : (w-16)/2-42; return Math.max(280, Math.min(1140, Math.floor(inner))); }
let lastW=0, rsT=0;
window.addEventListener('resize', function(){ clearTimeout(rsT); rsT=setTimeout(function(){ const el=$('#view'); const w=el ? el.clientWidth : 0; if(st.ready && st.route==='console' && Math.abs(w-lastW)>8){ lastW=w; render(); } }, 160); });
function levelChip(l){ return h('span',{class:'chip persona ps'+l, title:LEVEL_ABOUT[l]}, personaIcon(l, 20), LEVELS[l]); }
function patChip(t, extra){ return h('span',{class:'chip'}, h('span',{class:'sw '+PATS[t].cls}), PATS[t].name+(extra||'')); }
function personaIcon(l, size){
  const s=S('svg',{class:'pav'+(size<32 ? ' sm' : ''), viewBox:'0 0 64 64', width:String(size), height:String(size), 'aria-hidden':'true', focusable:'false'});
  s.innerHTML=PERSONA_ART(l);
  return s;
}
function personaGallery(M){
  return h('div',{class:'personas'}, [5,4,3,2,1].map(function(l){
    const n=M.levels[l], p=pct(n, M.stats.n);
    return h('div',{class:'persona-tile ps'+l, id:'persona-'+l},
      h('div',{class:'persona-id'}, personaIcon(l, 52), h('div',{class:'stack tight'}, h('strong',null, LEVELS[l]), h('span',{class:'small muted'}, LEVEL_ABOUT[l]))),
      h('div',{class:'persona-count'}, h('span',{class:'persona-n'}, String(n)), h('span',{class:'small muted'}, (n===1 ? 'manager' : 'managers')+' · '+p+'%')),
      h('div',{class:'track', tabindex:'0', 'data-tip':LEVELS[l]+': '+n+' of '+M.stats.n+' managers'}, h('i',{style:{left:'0', width:p+'%', background:'var(--lv'+l+')'}})));
  }));
}
function kpi(k, val, sub){ return h('div',{class:'kpi'}, h('span',{class:'k'}, k), h('span',{class:'v'}, val), sub && h('span',{class:'s'}, sub)); }
function rulerSvg(M, W){
  const L=30, R=30, x=function(val){ return L+(val+54)/108*(W-L-R); };
  const counts={}; let maxStack=1;
  const pts=M.sub.map(function(r){ const k=counts[r.total]=(counts[r.total]||0)+1; if(k>maxStack) maxStack=k; return {r:r, k:k}; });
  const step=maxStack>9 ? Math.max(4, 90/maxStack) : 10, top=30, plotH=Math.max(34, maxStack*step+8), y0=top+plotH, H=y0+36; const g=[];
  [-54,-36,-18,0,18,36,54].forEach(function(t){ g.push(S('line',{x1:x(t), x2:x(t), y1:top-4, y2:y0, stroke:'var(--grid)', 'stroke-width':1}), S('text',{x:x(t), y:y0+16, 'text-anchor':'middle', 'font-size':11, fill:'var(--ink-3)'}, signed(t))); });
  g.push(S('line',{x1:L, x2:W-R, y1:y0, y2:y0, stroke:'var(--axis)', 'stroke-width':1}));
  [[LEVELS[3]+' from', M.std.M, 'end'], [LEVELS[4]+' from', M.std.P, 'start']].forEach(function(c){ g.push(S('line',{x1:x(c[1]), x2:x(c[1]), y1:top-4, y2:y0, stroke:'var(--ink-2)', 'stroke-width':1.25, 'stroke-dasharray':'4 3'}), S('text',{x:x(c[1])+(c[2]==='end'?-5:5), y:top-10, 'text-anchor':c[2], 'font-size':11, fill:'var(--ink-2)'}, c[0]+' '+signed(c[1]))); });
  pts.forEach(function(p){ g.push(S('circle',{cx:x(p.r.total), cy:y0-7-(p.k-1)*step, r:4.5, fill:'var(--lv'+p.r.level+')', stroke:'var(--surface)', 'stroke-width':2, tabindex:0, style:'cursor:pointer', 'data-tip':nameOf(p.r.uid,p.r.label)+'\nScore '+signed(p.r.total)+' · '+LEVELS[p.r.level], onclick:function(){ st.c.sel=p.r.uid; st.c.tab='managers'; render(); }})); });
  g.push(S('text',{x:W-R, y:H-3, 'text-anchor':'end', 'font-size':11, fill:'var(--ink-3)'}, 'Total score, -54 to +54'));
  return S('svg',{viewBox:'0 0 '+W+' '+H, width:'100%', role:'img', 'aria-label':'Each dot is one manager, placed by total score, with the persona cut-offs marked'}, g);
}
function cOverview(v){
  const C=st.c, M=C.model, s=M.stats, svOk=M.rows.filter(function(r){ return r.svOk; }).length;
  put(v, h('div',{class:'kpis'},
    kpi('Managers submitted', String(s.n), s.inProgress+' in progress'),
    kpi('Team survey responses', String(M.svResponses), svOk+' managers have '+st.cfg.minRaters+' or more'),
    kpi('Average score', s.n ? signed(Math.round(s.mean*10)/10) : 'n/a', s.n>1 ? 'SD '+f1(s.sd)+' · range '+signed(s.min)+' to '+signed(s.max) : 'of a possible +54'),
    kpi('Margin of error', f1(s.sem), s.semAuto ? 'from your data · reliability '+f2(s.rel) : 'provisional until 30 managers submit'),
    kpi('Persona cut-offs', signed(M.std.P)+' / '+signed(M.std.M), 'Where '+LEVELS[4]+' / '+LEVELS[3]+' start · provisional'),
    kpi('Senior feedback', String(M.srResponses), M.rows.filter(function(r){ return r.srOk; }).length+' managers covered')));
  put(v, h('div',{class:'card'}, h('div',{class:'row between'}, h('h3',null,'Where each manager scored'), h('div',{class:'legend'}, [1,2,3,4,5].map(function(l){ return h('span',null, personaIcon(l, 18), LEVELS[l]); }))),
    s.n ? rulerSvg(M, cardW(true)) : h('p',{class:'muted'}, 'Scores appear once managers submit.')));
  put(v, h('div',{class:'card', id:'c-personas'}, h('div',{class:'row between'}, h('h3',null,'Managers by persona'), h('span',{class:'small muted'}, 'Personas describe judgment on this test. They are a training signal, never a verdict on a person.')),
    s.n ? personaGallery(M) : h('p',{class:'muted'}, 'Personas appear once managers submit.')));
  const val=M.validity;
  const unlocked=C.sample ? 0 : C.responses.filter(function(r){ return r.status==='submitted' && !C.vault[r.uid]; }).length;
  put(v, h('div',{class:'grid2'},
    h('div',{class:'card'}, h('h3',null,'Evidence so far'),
      h('dl',{class:'facts'},
        h('dt',null,'Test against team survey'), h('dd',null, val.n>=10 && isFinite(val.r) ? 'r = '+f2(val.r)+' across '+val.n+' managers'+(val.ci ? ' (95% range '+f2(val.ci[0])+' to '+f2(val.ci[1])+')' : '')+'.' : 'Needs at least 10 managers with enough team responses. So far: '+val.n+'.'),
        h('dt',null,'Split-half reliability'), h('dd',null, s.n>=30 ? f2(s.rel)+' (aim for .70 or more). Cronbach\'s alpha '+f2(s.alpha)+'.' : 'Shown once 30 managers have submitted. So far: '+s.n+'.'),
        h('dt',null,'Answer key'), h('dd',null, (C.key.version||'Loaded')+'. '+(C.key.note||''))))));
  put(v, h('div',{class:'card'}, h('h3',null,'Running the assessment'),
      h('dl',{class:'facts'},
        h('dt',null,'Window'), h('dd',null, st.cfg.open ? 'Open. Managers and teams can take part.' : 'Closed. New starts are blocked; managers already in progress can finish.'),
        h('dt',null,'Sharing'), h('dd',null, 'Share this page from the Share menu as Contributor. Viewers cannot save answers. Do not make anyone an Editor: editors can change this page.'),
        h('dt',null,'Links'), h('dd',null, 'Add #assessment to the page link for managers, and #feedback for their teams.'),
        h('dt',null,'Locked submissions'), h('dd',null, C.sample ? 'Not available with sample data.' : (unlocked ? unlocked+' submitted and not yet locked. Locking keeps a copy only you can change, so later edits by a participant are detected.' : 'All submitted answers are locked.')),
        h('dt',null,'Personas'), h('dd',null, personaShareText(M))),
      (!C.sample && unlocked>0) && h('div',{class:'row'}, h('button',{class:'btn sm', id:'c-lock', disabled:C.busy, onclick:lockNew}, C.busy ? 'Locking' : 'Lock '+unlocked+' new submission'+(unlocked===1?'':'s'))),
      personaShareButton(M)));
}
function pendingShares(M){
  const C=st.c; if(C.sample || !M) return [];
  return M.sub.filter(function(r){ const x=C.results[r.uid]; return !x || !isCurrentForm(x) || x.level!==r.level; });
}
function personaShareText(M){
  const C=st.c; if(C.sample) return 'Not available with sample data.';
  const n=M.sub.length, shared=M.sub.filter(function(r){ const x=C.results[r.uid]; return x && isCurrentForm(x); }).length, pend=pendingShares(M).length;
  if(!n) return 'Each manager sees their own persona on their assessment page once you share it. Nobody sees anyone else\'s.';
  return shared+' of '+n+' submitted manager'+(n===1?'':'s')+' can see their persona on their assessment page.'+(pend ? ' '+pend+(pend===1?' is':' are')+' new or changed since you last shared.' : '')+' Nobody sees anyone else\'s.';
}
function personaShareButton(M){
  const C=st.c, pend=pendingShares(M);
  if(C.sample || !pend.length) return null;
  return h('div',{class:'row'}, h('button',{class:'btn sm', id:'c-share', disabled:C.busy, onclick:sharePersonas}, C.busy ? 'Sharing' : 'Share personas with '+pend.length+' manager'+(pend.length===1?'':'s')));
}
function sharedNote(row){
  const x=st.c.results[row.uid];
  if(!x || !isCurrentForm(x)) return 'Not shared with them yet.';
  if(x.level!==row.level) return 'They currently see '+LEVELS[x.level]+' (shared '+dateShort(x.sharedAt)+'). Share personas again to update it.';
  return 'They can see this persona (shared '+dateShort(x.sharedAt)+').';
}
async function sharePersonas(){
  const C=st.c; if(C.busy || C.sample || !C.model) return; C.busy=true; C.error=''; render();
  const todo=pendingShares(C.model);
  try{ for(const r of todo){ const rec={uid:r.uid, form:FORM, level:r.level, sharedAt:nowISO()}; await retry(function(){ return st.db.doc('results/'+r.uid).set(rec); }); C.results[r.uid]=rec; } }
  catch(e){ C.error=(e && e.code==='invalid_argument') ? 'Could not share personas. Publish the current firestore.rules in Firebase (it adds the results collection), then try again.' : 'Could not share every persona. Check your connection and try again.'; }
  C.busy=false; render();
}
async function lockNew(){
  const C=st.c; if(C.busy) return; C.busy=true; render();
  const todo=C.responses.filter(function(r){ return r.status==='submitted' && !C.vault[r.uid]; });
  try{ for(const r of todo){ const rec={uid:r.uid, form:FORM, lockedAt:nowISO(), submittedAt:r.submittedAt||null, answers:r.answers||{}}; await retry(function(){ return st.db.doc('admin/vault/r/'+r.uid).set(rec); }); C.vault[r.uid]=rec; } }
  catch(e){ C.error='Could not lock every submission. Try again.'; }
  C.busy=false; computeAll(); render();
}
function sortVal(r, k){
  if(k==='name') return nameOf(r.uid, r.label).toLowerCase();
  if(k==='status') return r.status==='submitted' ? 1 : 0;
  if(r.status!=='submitted' && k!=='sv' && k!=='sr') return -Infinity;
  if(k==='total') return r.total; if(k==='level') return r.level*1000+r.total; if(k==='rf') return r.rf;
  if(k==='pat') return Math.max(r.pat.A, r.pat.D, r.pat.P, r.pat.R);
  if(k==='sv') return r.svOk ? r.sv.overall : -1;
  if(k==='sr') return r.srOk ? r.sr.overall : -1;
  if(k==='quad') return r.quad ? ['kd','kD','Kd','KD'].indexOf(r.quad) : -1;
  return 0;
}
function mainPat(r){ let dom=null; PAT_ORDER.forEach(function(t){ if(r.pat[t]>0 && (dom===null || r.pat[t]>r.pat[dom])) dom=t; }); return dom; }
function cManagers(v){
  const C=st.c, M=C.model; const cols=[['name','Manager'],['status','Status'],['total','Score'],['level','Persona'],['rf','Red flags'],['pat','Main error pattern'],['sv','Team survey'],['sr','Senior view'],['quad','Knows and does']];
  const rows=M.rows.slice().sort(function(a,b){ const x=sortVal(a,C.sort.k), y=sortVal(b,C.sort.k); return (x<y?-1:x>y?1:0)*C.sort.dir || (a.uid<b.uid?-1:1); });
  const table=h('table',{class:'data', id:'c-managers'},
    h('thead',null, h('tr',null, cols.map(function(c){ return h('th',{class:(c[0]==='total'||c[0]==='rf')?'n':null, 'aria-sort':C.sort.k===c[0] ? (C.sort.dir>0?'ascending':'descending') : null}, h('button',{type:'button', 'data-fid':'sort-'+c[0], onclick:function(){ C.sort=(C.sort.k===c[0]) ? {k:c[0], dir:-C.sort.dir} : {k:c[0], dir:(c[0]==='name'?1:-1)}; render(); }}, c[1]+(C.sort.k===c[0] ? (C.sort.dir>0?' ↑':' ↓') : ''))); }))),
    h('tbody',null, rows.map(function(r){
      const sub=r.status==='submitted', dom=sub ? mainPat(r) : null;
      return h('tr',{class:'click'+(C.sel===r.uid?' sel':''), tabindex:'0', 'data-uid':r.uid, onclick:function(){ C.sel=(C.sel===r.uid?null:r.uid); C.confirmDelete=null; render(); }, onkeydown:function(e){ if(e.key==='Enter'){ C.sel=(C.sel===r.uid?null:r.uid); render(); } }},
        h('td',null, nameOf(r.uid, r.label), r.changed && h('span',{class:'chip flag', style:{marginLeft:'8px'}}, 'Changed after lock')),
        h('td',null, sub ? 'Submitted '+dateShort(r.submittedAt) : 'In progress · '+r.answered+' of 27'),
        h('td',{class:'n'}, sub ? signed(r.total)+' ± '+f1(M.std.sem) : ''),
        h('td',null, sub ? levelChip(r.level) : ''),
        h('td',{class:'n'}, sub ? (r.rf>=M.std.rfLower ? h('span',{class:'chip flag'}, String(r.rf)) : String(r.rf)) : ''),
        h('td',null, dom ? patChip(dom, ' · '+r.pat[dom]) : (sub ? 'None' : '')),
        h('td',null, r.svOk ? f2(r.sv.overall)+' of 5 · '+r.sv.n+' people' : (r.sv ? r.sv.n+' so far, needs '+st.cfg.minRaters : 'No responses')),
        h('td',null, r.srOk ? f2(r.sr.overall)+' of 5'+(r.sr.n>1 ? ' · '+r.sr.n+' people' : '') : 'No response'),
        h('td',null, r.quad ? QUADS[r.quad] : ''));
    })));
  put(v, h('div',{class:'card flush'}, h('div',{class:'scroll-x'}, table)));
  if(!rows.length) put(v, h('p',{class:'muted'}, 'No managers have started yet.'));
  const row=C.sel && M.rows.find(function(r){ return r.uid===C.sel; });
  if(row) managerDetail(v, row, M); else if(rows.length) put(v, h('p',{class:'small muted'}, 'Select a manager to see the full profile and a development summary.'));
}
function managerDetail(v, row, M){
  const C=st.c, name=nameOf(row.uid, row.label), sub=row.status==='submitted';
  const head=h('div',{class:'row between'}, h('div',{class:'row persona-head'}, sub && personaIcon(row.level, 56), h('div',{class:'stack tight'}, h('h2',{id:'c-detail-name'}, name), h('span',{class:'small muted'}, sub ? 'Submitted '+dateShort(row.submittedAt)+' · '+Math.round(row.activeSec/60)+' minutes'+(row.activeSec>st.cfg.timeLimitMin*60 ? ' (over the '+st.cfg.timeLimitMin+'-minute guide)' : '') : 'In progress · '+row.answered+' of 27 answered'), sub && h('span',{class:'small'}, h('strong',null, LEVELS[row.level]+'. '), h('span',{class:'muted'}, LEVEL_ABOUT[row.level])), sub && !C.sample && h('span',{class:'small muted', id:'c-shared'}, sharedNote(row)))),
    sub && h('div',{class:'row'}, h('span',{class:'chip num'}, signed(row.total)+' ± '+f1(M.std.sem)), row.quad && h('span',{class:'chip'}, QUADS[row.quad])));
  const card=h('div',{class:'card', id:'c-detail'}, head);
  if(!sub){ put(card, h('p',{class:'muted'}, 'Scores appear once this manager submits.'), seniorBlock(row), deleteControls(row, name)); put(v, card); return; }
  if(row.notes.length) put(card, h('div',{class:'notice'}, row.notes.join(' ')));
  if(row.changed) put(card, h('div',{class:'notice crit'}, 'The answers stored now differ from the locked copy. The locked copy is used for scoring.'));
  // score band against the two standards
  const W=cardW(true), L=30, R=30, x=function(val){ return L+(val+54)/108*(W-L-R); };
  put(card, S('svg',{viewBox:'0 0 '+W+' 64', width:'100%', role:'img', 'aria-label':'Score '+signed(row.total)+' with its margin of error against the persona cut-offs'},
    S('line',{x1:L, x2:W-R, y1:36, y2:36, stroke:'var(--axis)', 'stroke-width':1}),
    [-54,-27,0,27,54].map(function(t){ return S('text',{x:x(t), y:56, 'text-anchor':'middle', 'font-size':11, fill:'var(--ink-3)'}, signed(t)); }),
    [[LEVELS[3]+' from '+signed(M.std.M), M.std.M, 'end'], [LEVELS[4]+' from '+signed(M.std.P), M.std.P, 'start']].map(function(c){ return [S('line',{x1:x(c[1]), x2:x(c[1]), y1:16, y2:42, stroke:'var(--ink-2)', 'stroke-width':1.25, 'stroke-dasharray':'4 3'}), S('text',{x:x(c[1])+(c[2]==='end'?-5:5), y:12, 'text-anchor':c[2], 'font-size':11, fill:'var(--ink-2)'}, c[0])]; }),
    S('rect',{x:x(Math.max(-54,row.total-M.std.sem)), y:30, width:Math.max(2, x(Math.min(54,row.total+M.std.sem))-x(Math.max(-54,row.total-M.std.sem))), height:12, rx:6, fill:'var(--lv'+row.level+')', 'fill-opacity':.3}),
    S('circle',{cx:x(row.total), cy:36, r:6, fill:'var(--lv'+row.level+')', stroke:'var(--surface)', 'stroke-width':2})));
  const dimGrid=h('div',{class:'bars', style:{gridTemplateColumns:'minmax(140px,max-content) 1fr max-content max-content'}}, DIMS.map(function(D,ix){
    const val=row.dim[ix], w=Math.abs(val)/6*50, t=(row.svOk && row.sv.dim[ix]!==null) ? f1(row.sv.dim[ix]) : '';
    return [h('span',{class:'lab'}, D.n+'. '+D.name),
      h('div',{class:'track', tabindex:'0', 'data-tip':D.name+'\nTest: '+signed(val)+' of 6'+(t ? '\nTeam survey: '+t+' of 5' : '')}, h('i',{style:{left:(val>=0?50:50-w)+'%', width:w+'%', background:(val>=0?'var(--accent)':'var(--neg)')}}), h('span',{class:'zero', style:{left:'50%'}}), h('span',{class:'mark', style:{left:(50+M.dimStd/6*50)+'%'}})),
      h('span',{class:'val'}, signed(val)), h('span',{class:'val'}, t ? 'team '+t : '')]; }));
  const patGrid=h('div',{class:'bars'}, PAT_ORDER.map(function(t){ const n=row.pat[t], o=M.opp[t]; return [h('span',{class:'lab'}, h('span',{class:'sw '+PATS[t].cls}), ' '+PATS[t].name), h('div',{class:'track', tabindex:'0', 'data-tip':PATS[t].name+': chosen as most effective in '+n+' of the '+o+' situations that offer it'}, h('i',{style:{left:'0', width:(o?100*n/o:0)+'%', background:'var(--pat-'+t.toLowerCase()+')'}})), h('span',{class:'val'}, n+' of '+o)]; }));
  put(card, h('div',{class:'grid2'},
    h('div',{class:'stack'}, h('h3',null,'Dimension profile'), dimGrid, h('p',{class:'small muted'}, 'Bars run from -6 to +6. The dark tick marks where '+LEVELS[4]+' starts, for one dimension. Three situations per dimension are a pointer, not a firm result.')),
    h('div',{class:'stack'}, h('h3',null,'How this manager tends to err'), patGrid, h('p',{class:'small muted'}, 'Counted over the situations where the best response was missed ('+row.missBest+' of 27).'),
      h('h3',null,'Red flags'), row.flags.length ? h('div',{class:'stack tight'}, row.flags.map(function(id){ const it=ITEM_BY_ID[id], k=C.key.items[id], o=it.options.find(function(x){ return x.id===row.answers[id].m; }); return h('div',{class:'notice crit'}, h('strong',null, it.num+' · '+DIMS[it.dim-1].name+'. '), 'Chose as most effective: "'+o.text+'" ', h('span',{class:'muted'}, k.why||'')); })) : h('p',{class:'muted'}, 'None. This manager never chose the least effective response as the most effective.'))));
  if(row.svOk) put(card, h('div',{class:'notice'}, h('strong',null,'Team survey: '+f2(row.sv.overall)+' of 5 from '+row.sv.n+' people. '), row.quad ? QUADS[row.quad]+'. '+QUAD_HELP[row.quad] : ''));
  else put(card, h('p',{class:'small muted'}, row.sv ? 'Team survey: '+row.sv.n+' response'+(row.sv.n===1?'':'s')+' so far. Averages are shown once '+st.cfg.minRaters+' people have answered.' : 'No team survey responses yet for this manager.'));
  put(card, seniorBlock(row));
  const text=devSummary(row, name);
  put(card, h('div',{class:'stack'}, h('h3',null,'Development summary to send'), h('pre',{class:'summary', id:'c-summary'}, text),
    h('div',{class:'row'}, h('button',{class:'btn sm', id:'c-copy', onclick:function(e){ copyText(text, e.target); }}, 'Copy'), st.dl && h('button',{class:'btn sm', onclick:function(){ saveFile('development-summary.txt', text); }}, 'Download'), h('span',{class:'small muted'}, 'Contains no score, level or ranking.'))));
  put(card, h('details',{class:'fold'}, h('summary',null,'All 27 answers'), h('div',{class:'scroll-x'}, h('table',{class:'data'},
    h('thead',null, h('tr',null, ['Situation','Dimension','Most effective','Least effective','Points'].map(function(t,i){ return h('th',{class:i===4?'n':null}, t); }))),
    h('tbody',null, ITEMS.map(function(it){ const a=row.answers[it.id]||{}, k=C.key.items[it.id]; const lab=function(oid){ if(!oid) return ''; return oid.toUpperCase()+(oid===k.best?' (keyed best)':oid===k.worst?' (keyed worst)':''); };
      return h('tr',null, h('td',null,it.num), h('td',null,DIMS[it.dim-1].name), h('td',null,lab(a.m)), h('td',null,lab(a.l)), h('td',{class:'n'}, signed(row.items[it.id]))); }))))));
  put(card, deleteControls(row, name));
  put(v, card);
}
function seniorBlock(row){
  const x=row.sr;
  if(!x) return h('p',{class:'small muted', id:'c-senior-none'}, 'No feedback yet from this manager\'s own manager.');
  const tOk=function(ix){ return row.svOk && row.sv.dim[ix]!==null; };
  const bars=h('div',{class:'bars'}, DIMS.map(function(D,ix){ const val=x.dim[ix];
    return [h('span',{class:'lab'}, D.n+'. '+D.name),
      h('div',{class:'track', tabindex:'0', 'data-tip':D.name+'\nSenior view: '+(val!==null ? f1(val)+' of 5' : 'cannot say')+(tOk(ix) ? '\nTeam survey: '+f1(row.sv.dim[ix])+' of 5' : '')}, val!==null && h('i',{style:{left:'0', width:(100*(val-1)/4)+'%', background:'var(--accent)'}}), tOk(ix) && h('span',{class:'mark', style:{left:(100*(row.sv.dim[ix]-1)/4)+'%'}})),
      h('span',{class:'val'}, val!==null ? f1(val) : 'n/a')]; }));
  const who=x.raters.map(function(r){ return nameOf(r.by, '')+(r.at ? ' on '+dateShort(r.at) : ''); }).join(', ');
  const notes=x.raters.filter(function(r){ return r.good || r.grow; });
  return h('div',{class:'stack', id:'c-senior'}, h('h3',null,'Their own manager\'s view'),
    h('p',{class:'small muted'}, (x.overall!==null ? f2(x.overall)+' of 5 on average. ' : '')+'From '+who+'. Bars run from 1 (never) to 5 (always)'+(row.svOk ? '; the dark tick is the team survey average.' : '.')),
    bars,
    notes.length ? h('div',{class:'stack tight'}, notes.map(function(r){ return h('div',{class:'notice'}, h('div',{class:'stack tight'}, x.raters.length>1 && h('strong',null, nameOf(r.by, '')), r.good && h('span',null, h('strong',null,'Strength to keep: '), r.good), r.grow && h('span',null, h('strong',null,'Biggest difference: '), r.grow))); })) : h('p',{class:'small muted'}, 'No comments were added.'));
}
function deleteControls(row, name){
  const C=st.c; if(C.sample) return null;
  if(C.confirmDelete===row.uid) return h('div',{class:'notice crit'}, h('div',{class:'row between'}, h('span',{class:'grow'}, 'Delete every answer stored for '+name+', and the feedback given about them? This cannot be undone.'), h('div',{class:'row'}, h('button',{class:'btn sm', onclick:function(){ C.confirmDelete=null; render(); }}, 'Keep'), h('button',{class:'btn sm danger', id:'c-delete-confirm', disabled:C.busy, onclick:function(){ deleteManager(row.uid); }}, C.busy ? 'Deleting' : 'Delete'))));
  return h('div',{class:'row'}, h('button',{class:'btn sm quiet', id:'c-delete', onclick:function(){ C.confirmDelete=row.uid; render(); }}, 'Delete this manager\'s data'));
}
function validateKey(k){
  if(!k || typeof k!=='object' || !k.items) return 'it has no answer items.';
  if(k.form && k.form!==FORM) return 'it is for form '+k.form+', but this page uses form '+FORM+'.';
  for(const it of ITEMS){ const x=k.items[it.id];
    if(!x) return 'situation '+it.num+' is missing.';
    if(OPT_IDS.indexOf(x.best)<0 || OPT_IDS.indexOf(x.worst)<0 || x.best===x.worst) return 'situation '+it.num+' has an invalid best or worst answer.';
    if(!x.tags || typeof x.tags!=='object') return 'situation '+it.num+' has no error patterns.'; }
  return '';
}
function keyImport(){
  const C=st.c;
  return h('div',{class:'field', style:{maxWidth:'420px'}}, h('label',{for:'c-keyfile'}, 'Answer key file'),
    h('input',{type:'file', id:'c-keyfile', accept:'.json,application/json', disabled:C.busy, onchange:async function(e){
      const f=e.target.files && e.target.files[0]; if(!f) return;
      C.busy=true; C.error='';
      try{ const k=JSON.parse(await f.text()); const bad=validateKey(k); if(bad) throw new Error(bad);
        await retry(function(){ return st.db.doc('admin/key').set(k); }); C.msg='Answer key loaded.'; C.msgBad=false; C.loaded=false; }
      catch(err){ C.error='That file could not be used as the answer key: '+((err && err.code) ? writeError(err) : (err && err.message) || 'it is not valid JSON.'); }
      C.busy=false; render(); }}));
}
async function deleteOld(){
  const C=st.c; if(C.busy) return; C.busy=true; render();
  try{
    for(const r of (C.old||[])) await st.db.doc('responses/'+r.uid).delete();
    for(const uid of (C.oldVault||[])) await st.db.doc('admin/vault/r/'+uid).delete();
  }catch(e){ C.error='Could not delete everything. Refresh and try again.'; }
  C.busy=false; C.confirmDelete=null; C.loaded=false; render();
}
async function deleteManager(uid){
  const C=st.c; if(C.busy) return; C.busy=true; render();
  try{
    await st.db.doc('responses/'+uid).delete(); await st.db.doc('roster/'+uid).delete(); await st.db.doc('admin/vault/r/'+uid).delete(); try{ await st.db.doc('results/'+uid).delete(); }catch(e){}
    for(const s of C.surveys){ if(s.about && s.about[uid]){ const about=Object.assign({}, s.about); delete about[uid]; await st.db.doc('survey/'+s.uid).set(Object.assign({}, s, {about:about})); } }
    for(const s of (C.seniors||[])){ if(s.about && s.about[uid]){ const about=Object.assign({}, s.about); delete about[uid]; await st.db.doc('senior/'+s.uid).set(Object.assign({}, s, {about:about})); } }
  }catch(e){ C.error='Could not delete everything. Refresh and try again.'; }
  C.busy=false; C.confirmDelete=null; C.sel=null; C.loaded=false; render();
}
async function copyText(text, btn){
  try{ await navigator.clipboard.writeText(text); if(btn){ const t=btn.textContent; btn.textContent='Copied'; setTimeout(function(){ btn.textContent=t; }, 1500); } }
  catch(e){ const pre=$('#c-summary'); if(pre){ const r=document.createRange(); r.selectNodeContents(pre); const s=window.getSelection(); s.removeAllRanges(); s.addRange(r); } }
}
async function saveFile(filename, data){
  const C=st.c;
  if(!st.dl){ C.exportText=data; render(); return; }
  try{ await st.dl.save({filename:filename, data:data}); }
  catch(e){ if(e && (e.code==='declined' || e.code==='rate_limited')) return; C.exportText=data; render(); }
}
function scatterSvg(M, W){
  const H=Math.round(Math.max(300, Math.min(420, W*0.68))), L=52, R=16, T=18, B=46, thr=Number(M.S.surveyThreshold), P=M.std.P;
  const x=function(val){ return L+(val-1)/4*(W-L-R); }, y=function(val){ return T+(54-val)/108*(H-T-B); }; const g=[];
  g.push(S('rect',{x:L, y:T, width:x(thr)-L, height:y(P)-T, fill:'var(--tint)'}), S('rect',{x:x(thr), y:y(P), width:W-R-x(thr), height:H-B-y(P), fill:'var(--tint)'}));
  [1,2,3,4,5].forEach(function(t){ g.push(S('line',{x1:x(t), x2:x(t), y1:T, y2:H-B, stroke:'var(--grid)', 'stroke-width':1}), S('text',{x:x(t), y:H-B+16, 'text-anchor':'middle', 'font-size':11, fill:'var(--ink-3)'}, String(t))); });
  [-54,-27,0,27,54].forEach(function(t){ g.push(S('line',{x1:L, x2:W-R, y1:y(t), y2:y(t), stroke:'var(--grid)', 'stroke-width':1}), S('text',{x:L-8, y:y(t)+4, 'text-anchor':'end', 'font-size':11, fill:'var(--ink-3)'}, signed(t))); });
  g.push(S('line',{x1:x(thr), x2:x(thr), y1:T, y2:H-B, stroke:'var(--ink-2)', 'stroke-width':1.25, 'stroke-dasharray':'4 3'}), S('line',{x1:L, x2:W-R, y1:y(P), y2:y(P), stroke:'var(--ink-2)', 'stroke-width':1.25, 'stroke-dasharray':'4 3'}));
  [['Knows it, team does not see it', L+8, T+16, 'start'], ['Role model', W-R-8, T+16, 'end'], ['Priority development', L+8, H-B-8, 'start'], ['Does it, scores low on test', W-R-8, H-B-(W<430?26:8), 'end']].forEach(function(q){ g.push(S('text',{x:q[1], y:q[2], 'text-anchor':q[3], 'font-size':11.5, 'font-weight':600, fill:'var(--ink-2)'}, q[0])); });
  M.sub.filter(function(r){ return r.svOk; }).forEach(function(r){ g.push(S('circle',{cx:x(r.sv.overall), cy:y(r.total), r:5, fill:'var(--lv'+r.level+')', stroke:'var(--surface)', 'stroke-width':2, tabindex:0, style:'cursor:pointer', 'data-tip':nameOf(r.uid,r.label)+'\nTest '+signed(r.total)+' · team '+f2(r.sv.overall)+'\n'+QUADS[r.quad], onclick:function(){ st.c.sel=r.uid; st.c.tab='managers'; render(); }})); });
  g.push(S('text',{x:(L+W-R)/2, y:H-6, 'text-anchor':'middle', 'font-size':11.5, fill:'var(--ink-2)'}, 'Team rating, 1 to 5 (what the team sees)'), S('text',{x:14, y:(T+H-B)/2, 'text-anchor':'middle', 'font-size':11.5, fill:'var(--ink-2)', transform:'rotate(-90 14 '+((T+H-B)/2)+')'}, 'Test score (what the manager knows)'));
  return S('svg',{viewBox:'0 0 '+W+' '+H, width:'100%', role:'img', 'aria-label':'Managers placed by test score and team survey average, in four quadrants'}, g);
}
function cNeeds(v){
  const C=st.c, M=C.model;
  if(!M.stats.n){ put(v, h('p',{class:'muted'}, 'Training needs appear once managers submit.')); return; }
  const top=M.priority.slice(0,3);
  put(v, h('div',{class:'card'}, h('h3',null,'Teach these first'),
    h('div',{class:'stack'}, top.map(function(d,i){ return h('div',{class:'row', style:{alignItems:'flex-start'}}, h('span',{class:'chip num'}, String(i+1)), h('div',{class:'grow stack tight'}, h('strong',null, d.name+' · '+pct(d.below*100,100)+'% of managers below the '+CUT_NAME(4)+' line'), h('span',{class:'muted'}, d.dom ? 'Most common error: '+PATS[d.dom].name+' ('+pct(d.domShare*100,100)+'% of missed picks). '+PATS[d.dom].module : 'No common error pattern yet.'))); })),
    h('p',{class:'small muted'}, 'Group results like these are far more reliable than any one manager\'s dimension score.')));
  const tbl=h('table',{class:'data', id:'c-needs'},
    h('thead',null, h('tr',null, ['Dimension','Average, -6 to +6','Below the '+CUT_NAME(4)+' line','Main error pattern','Team survey','Senior view'].map(function(t,i){ return h('th',null,t); }))),
    h('tbody',null, M.priority.map(function(d){ const w=Math.abs(d.mean)/6*50;
      return h('tr',null, h('td',null, d.n+'. '+d.name),
        h('td',null, h('div',{class:'row', style:{flexWrap:'nowrap'}}, h('div',{class:'track grow', tabindex:'0', 'data-tip':d.name+'\nAverage '+f1(d.mean)+' of 6'}, h('i',{style:{left:(d.mean>=0?50:50-w)+'%', width:w+'%', background:(d.mean>=0?'var(--accent)':'var(--neg)')}}), h('span',{class:'zero', style:{left:'50%'}}), h('span',{class:'mark', style:{left:(50+M.dimStd/6*50)+'%'}})), h('span',{class:'num small'}, f1(d.mean)))),
        h('td',null, h('div',{class:'row', style:{flexWrap:'nowrap'}}, h('div',{class:'track grow', tabindex:'0', 'data-tip':pct(d.below*100,100)+'% of managers scored below '+f1(M.dimStd)+' on this dimension'}, h('i',{style:{left:'0', width:(100*d.below)+'%', background:'var(--ink-2)'}})), h('span',{class:'num small'}, pct(d.below*100,100)+'%'))),
        h('td',null, d.dom ? patChip(d.dom, ' · '+pct(d.domShare*100,100)+'%') : ''),
        h('td',{class:'num'}, d.svMean!==null ? f2(d.svMean) : ''), h('td',{class:'num'}, d.srMean!==null ? f2(d.srMean) : '')); })));
  put(v, h('div',{class:'card flush'}, h('div',{class:'scroll-x'}, tbl)));
  const wrong=M.patTotal.A+M.patTotal.D+M.patTotal.P+M.patTotal.R+M.patTotal.X;
  const hasPairs=M.sub.some(function(r){ return r.svOk; });
  put(v, h('div',{class:'grid2'},
    h('div',{class:'card'}, h('h3',null,'When managers missed the best answer, what did they choose instead?'),
      h('div',{class:'bars'}, PAT_ORDER.concat(['X']).map(function(t){ const n=M.patTotal[t]; return [h('span',{class:'lab'}, h('span',{class:'sw '+PATS[t].cls}), ' '+PATS[t].name), h('div',{class:'track', tabindex:'0', 'data-tip':PATS[t].name+': '+n+' of '+wrong+' missed picks'}, h('i',{style:{left:'0', width:(wrong?100*n/wrong:0)+'%', background:'var(--pat-'+t.toLowerCase()+')'}})), h('span',{class:'val'}, pct(n,wrong)+'%')]; })),
      h('p',{class:'small muted'}, 'The bars add up to 100% of the picks that were not the best response. "Cuts corners" is offered in fewer situations than the others, so its share is naturally smaller.'), h('div',{class:'small muted', style:{marginTop:'8px'}}, PAT_ORDER.concat(['X']).map(function(t){ return h('div',null, h('strong',null,PATS[t].name+': '), PATS[t].about); }))),
    h('div',{class:'card'}, h('h3',null,'Does what managers know show up for their team?'), hasPairs ? scatterSvg(M, cardW(false)) : h('p',{class:'muted'}, 'Appears once a manager has submitted and '+st.cfg.minRaters+' or more people have answered the team survey about them.'),
      hasPairs && h('p',{class:'small muted'}, 'Each dot is one manager, shown once '+st.cfg.minRaters+' or more of their team have answered the survey. Higher means a better test score (what they know). Further right means a better team rating (what the team sees). The dashed lines are where '+LEVELS[4]+' starts and the team survey threshold, both set in Settings. Shaded boxes are where the test and the team disagree, so each needs a different kind of help.'))));
  put(v, h('div',{class:'card'}, h('h3',null,'Fairness check'), h('p',{class:'small muted'}, 'Average score by group. Groups with fewer than five people are hidden. A gap is a prompt to review the questions, not a finding about the group.'),
    h('div',{class:'scroll-x'}, h('table',{class:'data', id:'c-fair'}, h('thead',null, h('tr',null, ['Group','Managers','Average score','SD'].map(function(t,i){ return h('th',{class:i?'n':null}, t); }))),
      h('tbody',null, M.fairness.map(function(f){ if(!f.groups.some(function(g){ return g.value!=='Not stated'; })) return h('tr',null, h('td',{colspan:'4'}, h('strong',null,f.label), h('span',{class:'muted small'}, '  ·  not answered'))); const shown=f.groups.filter(function(g){ return g.n>=5; }); return [h('tr',null, h('td',{colspan:'4'}, h('strong',null,f.label), shown.length<f.groups.length ? h('span',{class:'muted small'}, '  ·  '+(f.groups.length-shown.length)+' smaller group'+((f.groups.length-shown.length)===1?'':'s')+' hidden') : null)), shown.map(function(g){ return h('tr',null, h('td',null,g.value), h('td',{class:'n'}, String(g.n)), h('td',{class:'n'}, f1(g.mean)), h('td',{class:'n'}, f1(g.sd))); })]; }))))));
}
function itemFlags(it, key){
  const out=[]; if(it.n<10) return out;
  if(it.topMost!==key.items[it.id].best) out.push('Check the key');
  if(isFinite(it.rRest) && it.rRest<0.10) out.push('Does not separate strong from weak');
  if(it.pBest>0.9) out.push('Very easy'); else if(it.pBest<0.25) out.push('Very hard');
  return out;
}
function cQuestions(v){
  const C=st.c, M=C.model;
  put(v, h('p',{class:'muted'}, 'Use this after the pilot to decide which situations to keep, rewrite or drop. Checks appear once 10 managers have submitted.'));
  const tbl=h('table',{class:'data', id:'c-items'},
    h('thead',null, h('tr',null, ['Situation','Dimension','Best picked as most','Worst picked as least','Red flags','Average, -2 to +2','Link to rest of test','Check',''].map(function(t,i){ return h('th',{class:(i>=2&&i<=6)?'n':null}, t); }))),
    h('tbody',null, M.items.map(function(it){ const flags=itemFlags(it, C.key), open=C.openItem===it.id, src=ITEM_BY_ID[it.id], k=C.key.items[it.id];
      const main=h('tr',null, h('td',null,it.num), h('td',null,DIMS[it.dim-1].name), h('td',{class:'n'}, it.n?pct(it.pBest*100,100)+'%':''), h('td',{class:'n'}, it.n?pct(it.pWorst*100,100)+'%':''), h('td',{class:'n'}, it.n?pct(it.pRf*100,100)+'%':''), h('td',{class:'n'}, it.n?f2(it.mean):''), h('td',{class:'n'}, isFinite(it.rRest)?f2(it.rRest):''),
        h('td',null, flags.map(function(f){ return h('span',{class:'chip flag', style:{marginRight:'4px'}}, f); })), h('td',null, h('button',{class:'btn sm quiet', type:'button', 'data-fid':'item-'+it.id, 'aria-expanded':String(open), onclick:function(){ C.openItem=open?null:it.id; render(); }}, open?'Hide':'View')));
      if(!open) return main;
      const detail=h('tr',null, h('td',{colspan:'9', style:{background:'var(--surface-2)'}}, h('div',{class:'stack'}, h('p',{style:{fontFamily:'var(--font-read)', fontSize:'15px', maxWidth:'80ch'}}, src.text),
        h('table',{class:'data'}, h('thead',null, h('tr',null, ['Response','Key','Picked as most','Picked as least'].map(function(t,i){ return h('th',{class:i>=2?'n':null}, t); }))),
          h('tbody',null, src.options.map(function(o){ return h('tr',null, h('td',null, o.id.toUpperCase()+'. '+o.text), h('td',null, o.id===k.best ? h('span',{class:'chip ok'}, 'Best') : [o.id===k.worst && h('span',{class:'chip flag', style:{marginRight:'4px'}}, 'Worst'), PATS[k.tags[o.id]] && patChip(k.tags[o.id])]), h('td',{class:'n'}, it.n?pct(it.dm[o.id],it.n)+'%':''), h('td',{class:'n'}, it.n?pct(it.dl[o.id],it.n)+'%':'')); }))),
        h('p',{class:'small muted'}, k.why||''))));
      return [main, detail]; })));
  put(v, h('div',{class:'card flush'}, h('div',{class:'scroll-x'}, tbl)));
}
function cSettings(v){
  const C=st.c, S0=C.settings, M=C.model;
  const num=function(id, label, val, hint, step){ return h('div',{class:'field'}, h('label',{for:id}, label), h('input',{type:'number', id:id, value:String(val), step:step||'1'}), hint && h('span',{class:'hint'}, hint)); };
  const selMode=h('select',{id:'s-semmode'}, h('option',{value:'auto'}, 'From the data, once 30 managers submit'), h('option',{value:'manual'}, 'Always use the value below')); selMode.value=S0.semMode;
  const selOpen=h('select',{id:'c-open'}, h('option',{value:'open'}, 'Open'), h('option',{value:'closed'}, 'Closed')); selOpen.value=st.cfg.open ? 'open' : 'closed';
  put(v, h('div',{class:'card'}, h('h3',null,'Persona cut-offs and rules'),
    h('div',{class:'notice warn'}, h('strong',null,'These cut-offs are provisional. '), LEVELS[4]+' starts at half of the maximum score and '+LEVELS[3]+' at a quarter, as placeholders. Replace them with the cut scores your expert panel sets.'),
    h('div',{class:'fields'},
      num('s-prof','Where '+LEVELS[4]+' starts', S0.proficient, 'Score of a manager who just qualifies as managing well. -54 to +54.'),
      num('s-min','Where '+LEVELS[3]+' starts', S0.minimum, 'Score of a manager who just has the foundations in place.'),
      h('div',{class:'field'}, h('label',{for:'s-semmode'}, 'Margin of error'), selMode, h('span',{class:'hint'}, 'Now in use: '+f1(M.std.sem)+' points'+(M.stats.semAuto?', from your data.':', the value below.'))),
      num('s-sem','Margin of error, manual value', S0.semManual, 'Used until 30 managers submit, or always if you choose so.', '0.1'),
      num('s-rfl','Red flags that move a manager down one persona', S0.rfLower, 'This many or more moves the manager down one persona.'),
      num('s-rff','Red flags that set '+LEVELS[1], S0.rfFloor, 'Random guessing produces about 7.'),
      num('s-svthr','Team survey threshold', S0.surveyThreshold, 'Average, 1 to 5, at which the team is taken to see effective managing.', '0.05')),
    h('h3',null,'Running the assessment'),
    h('div',{class:'fields'},
      h('div',{class:'field'}, h('label',{for:'c-open'}, 'Assessment window'), selOpen, h('span',{class:'hint'}, 'Closing blocks new starts and new feedback.')),
      num('c-time','Time guide, minutes', st.cfg.timeLimitMin, 'Shown to managers. Overruns are reported, not blocked.'),
      num('c-minr','Team responses needed', st.cfg.minRaters, 'Averages are hidden below this number. Five is recommended; never fewer than three.')),
    C.msg && h('div',{class:'notice'+(C.msgBad?' crit':' good'), id:'c-msg', role:'status'}, C.msg),
    h('div',{class:'row'}, h('button',{class:'btn primary', id:'s-save', disabled:C.busy, onclick:saveSettings}, C.busy ? 'Saving' : 'Save settings'))));
  // answer key editor
  const tagSel=function(id, val){ const s=h('select',{id:id, 'aria-label':'Pattern'}, ['A','D','P','R','X'].map(function(t){ return h('option',{value:t}, PATS[t].name); })); s.value=PATS[val] ? val : 'X'; return s; };
  const optSel=function(id, val, lab){ const s=h('select',{id:id, 'aria-label':lab}, OPT_IDS.map(function(o){ return h('option',{value:o}, o.toUpperCase()); })); s.value=val; return s; };
  put(v, h('div',{class:'card'}, h('h3',null,'Answer key'), h('p',{class:'muted'}, (C.key.version||'')+'. Stored where only you can read it. Change it here after your expert panel has rated the responses.'),
    h('details',{class:'fold', id:'k-fold'}, h('summary',null,'Edit the key'),
      h('div',{class:'scroll-x'}, h('table',{class:'data'}, h('thead',null, h('tr',null, ['Situation','Best','Worst','Pattern of A','Pattern of B','Pattern of C','Pattern of D'].map(function(t){ return h('th',null,t); }))),
        h('tbody',null, ITEMS.map(function(it){ const k=C.key.items[it.id]; return h('tr',null, h('td',null, it.num+' · '+DIMS[it.dim-1].name), h('td',null, optSel('k-'+it.id+'-best', k.best, 'Best response for '+it.num)), h('td',null, optSel('k-'+it.id+'-worst', k.worst, 'Worst response for '+it.num)), OPT_IDS.map(function(o){ return h('td',null, tagSel('k-'+it.id+'-tag-'+o, k.tags[o])); })); })))),
      h('p',{class:'small muted'}, 'The pattern chosen for the best response is ignored.'),
      h('div',{class:'row'}, h('button',{class:'btn', id:'k-save', disabled:C.busy, onclick:saveKey}, 'Save the key')))));
  put(v, h('div',{class:'card'}, h('h3',null,'Export'), h('p',{class:'muted'}, C.sample ? 'Exports are switched off while sample data is showing.' : 'Files contain names and results. Store them where only the administrators can reach them.'),
    h('div',{class:'row'}, h('button',{class:'btn sm', id:'x-managers', disabled:C.sample, onclick:function(){ saveFile('manager-results.csv', exportManagers()); }}, 'Manager results (CSV)'), h('button',{class:'btn sm', id:'x-answers', disabled:C.sample, onclick:function(){ saveFile('manager-answers.csv', exportAnswers()); }}, 'Every answer (CSV)'), h('button',{class:'btn sm', id:'x-items', disabled:C.sample, onclick:function(){ saveFile('question-statistics.csv', exportItems()); }}, 'Question statistics (CSV)')),
    C.exportText && h('div',{class:'stack'}, h('p',{class:'small muted'}, 'Downloads are not available in this view. Copy the text below into a file.'), h('textarea',{id:'x-text', rows:'8', readonly:true}, C.exportText))));
  if(!C.sample) put(v, h('div',{class:'card'}, h('h3',null,'End of cycle'), h('p',{class:'muted'}, 'Delete every answer, all team and senior feedback, and every locked copy. The answer key and settings are kept. This cannot be undone.'),
    C.confirmDelete==='ALL' ? h('div',{class:'row'}, h('div',{class:'field', style:{maxWidth:'220px'}}, h('label',{for:'wipe-word'}, 'Type DELETE to confirm'), h('input',{type:'text', id:'wipe-word', autocomplete:'off'})), h('button',{class:'btn sm', onclick:function(){ C.confirmDelete=null; render(); }}, 'Keep the data'), h('button',{class:'btn sm danger', id:'wipe-go', disabled:C.busy, onclick:wipeAll}, C.busy ? 'Deleting' : 'Delete all participant data'))
      : h('div',{class:'row'}, h('button',{class:'btn sm danger', id:'wipe', onclick:function(){ C.confirmDelete='ALL'; render(); }}, 'Delete all participant data'))));
}
async function saveSettings(){
  const C=st.c; const num=function(id){ return Number($('#'+id).value); };
  const S2={proficient:num('s-prof'), minimum:num('s-min'), semMode:$('#s-semmode').value, semManual:num('s-sem'), rfLower:num('s-rfl'), rfFloor:num('s-rff'), surveyThreshold:num('s-svthr')};
  const cfg2={open:$('#c-open').value==='open', timeLimitMin:num('c-time'), minRaters:num('c-minr'), form:FORM};
  let bad='';
  if(!(S2.proficient>S2.minimum)) bad='Where '+LEVELS[4]+' starts must be higher than where '+LEVELS[3]+' starts.';
  else if(S2.proficient>54 || S2.minimum<-54) bad='Cut-offs must lie between -54 and +54.';
  else if(!(S2.semManual>0 && S2.semManual<=20)) bad='The margin of error must be between 0 and 20.';
  else if(!(S2.rfLower>=1 && S2.rfFloor>S2.rfLower && S2.rfFloor<=27)) bad='The red-flag numbers must rise: the '+LEVELS[1]+' number has to be higher than the move-down number.';
  else if(!(S2.surveyThreshold>=1 && S2.surveyThreshold<=5)) bad='The team survey threshold must be between 1 and 5.';
  else if(!(cfg2.minRaters>=3 && cfg2.minRaters<=50 && Number.isInteger(cfg2.minRaters))) bad='Team responses needed must be a whole number of at least 3.';
  else if(!(cfg2.timeLimitMin>=10 && cfg2.timeLimitMin<=180)) bad='The time guide must be between 10 and 180 minutes.';
  if(bad){ C.msg=bad; C.msgBad=true; render(); return; }
  C.busy=true; render();
  try{
    await retry(function(){ return st.db.doc('admin/settings').set(Object.assign({uid:'settings', updatedAt:nowISO()}, S2)); });
    await retry(function(){ return st.db.doc('public/config').set(Object.assign({updatedAt:nowISO()}, cfg2)); });
    C.settings=S2; Object.assign(st.cfg, cfg2); C.msg='Settings saved.'; C.msgBad=false;
  }catch(e){ C.msg='Could not save the settings. Try again.'; C.msgBad=true; }
  C.busy=false; computeAll(); render();
}
async function saveKey(){
  const C=st.c; const items={}; let bad='';
  ITEMS.forEach(function(it){ const best=$('#k-'+it.id+'-best').value, worst=$('#k-'+it.id+'-worst').value; if(best===worst) bad='Situation '+it.num+': the best and worst response cannot be the same.'; const tags={}; OPT_IDS.forEach(function(o){ tags[o]=(o===best) ? '' : $('#k-'+it.id+'-tag-'+o).value; }); items[it.id]={best:best, worst:worst, tags:tags, why:(C.key.items[it.id]||{}).why||''}; });
  if(bad){ C.msg=bad; C.msgBad=true; render(); return; }
  C.busy=true; render();
  const doc={uid:'key', version:'A-0.1 edited '+dateShort(nowISO()), note:'Edited in the console.', items:items, updatedAt:nowISO()};
  try{ await retry(function(){ return st.db.doc('admin/key').set(doc); }); C.key=doc; if(C.sampleData) C.sampleData=makeSample(C.key); C.msg='Answer key saved. Scores have been recalculated.'; C.msgBad=false; }
  catch(e){ C.msg='Could not save the key. Try again.'; C.msgBad=true; }
  C.busy=false; computeAll(); render();
}
function exportManagers(){
  const M=st.c.model; const head=['name','status','submitted','minutes','score','margin_of_error','level','persona','red_flags','missed_best'].concat(DIMS.map(function(d){ return 'dim'+d.n; }), ['avoids','dominates','appeases','bends_rules','partial','team_responses','team_average','knows_and_does'], DIMS.map(function(d){ return 'team_dim'+d.n; }), ['senior_responses','senior_average'], DIMS.map(function(d){ return 'senior_dim'+d.n; }), ['senior_strength','senior_change'], BG_FIELDS.map(function(f){ return f.id; }));
  const rows=M.rows.map(function(r){ const sub=r.status==='submitted'; return [safeText(nameOf(r.uid,r.label)), r.status, r.submittedAt||'', Math.round(r.activeSec/60), sub?r.total:'', sub?f1(M.std.sem):'', sub?r.level:'', sub?LEVELS[r.level]:'', sub?r.rf:'', sub?r.missBest:''].concat(DIMS.map(function(d,ix){ return sub?r.dim[ix]:''; }), sub?[r.pat.A,r.pat.D,r.pat.P,r.pat.R,r.pat.X]:['','','','',''], [r.sv?r.sv.n:0, r.svOk?f2(r.sv.overall):'', r.quad?QUADS[r.quad]:''], DIMS.map(function(d,ix){ return (r.svOk && r.sv.dim[ix]!==null) ? f2(r.sv.dim[ix]) : ''; }), [r.sr?r.sr.n:0, r.srOk?f2(r.sr.overall):''], DIMS.map(function(d,ix){ return (r.srOk && r.sr.dim[ix]!==null) ? f2(r.sr.dim[ix]) : ''; }), [safeText(r.sr ? r.sr.raters.map(function(x){ return x.good; }).filter(Boolean).join(' | ') : ''), safeText(r.sr ? r.sr.raters.map(function(x){ return x.grow; }).filter(Boolean).join(' | ') : '')], BG_FIELDS.map(function(f){ return safeText(bgValue(r, f.id)); })); });
  return csv([head].concat(rows));
}
function exportAnswers(){
  const M=st.c.model; const head=['name']; ITEMS.forEach(function(it){ head.push(it.num+'_most', it.num+'_least', it.num+'_points'); });
  return csv([head].concat(M.sub.map(function(r){ const row=[safeText(nameOf(r.uid,r.label))]; ITEMS.forEach(function(it){ const a=r.answers[it.id]||{}; row.push((a.m||'').toUpperCase(), (a.l||'').toUpperCase(), r.items[it.id]); }); return row; })));
}
function exportItems(){
  const M=st.c.model, key=st.c.key; const head=['situation','dimension','managers','best_picked_as_most','worst_picked_as_least','red_flag_rate','average_points','link_to_rest','most_A','most_B','most_C','most_D','least_A','least_B','least_C','least_D','checks'];
  return csv([head].concat(M.items.map(function(it){ return [it.num, DIMS[it.dim-1].name, it.n, f2(it.pBest), f2(it.pWorst), f2(it.pRf), f2(it.mean), isFinite(it.rRest)?f2(it.rRest):'', it.dm.a, it.dm.b, it.dm.c, it.dm.d, it.dl.a, it.dl.b, it.dl.c, it.dl.d, itemFlags(it,key).join('; ')]; })));
}
async function wipeAll(){
  const C=st.c; const w=$('#wipe-word'); if(!w || w.value.trim()!=='DELETE'){ C.error='Type DELETE in capitals to confirm.'; render(); return; }
  if(C.busy) return; C.busy=true; C.error=''; render();
  try{
    const ros=await st.db.collection('roster').limit(1000).get();
    for(const r of C.responses) await st.db.doc('responses/'+r.uid).delete();
    for(const d of ros.docs) await st.db.doc('roster/'+d.id).delete();
    for(const s of C.surveys) await st.db.doc('survey/'+s.uid).delete();
    for(const s of (C.seniors||[])) await st.db.doc('senior/'+s.uid).delete();
    for(const uid in C.vault) await st.db.doc('admin/vault/r/'+uid).delete();
    for(const uid in (C.results||{})) await st.db.doc('results/'+uid).delete();
  }catch(e){ C.error='Could not delete everything. Refresh and try again.'; }
  C.busy=false; C.confirmDelete=null; C.sel=null; C.loaded=false; render();
}

/* ---------- hover and focus notes on chart marks ---------- */
function showTip(text, x, y){ const t=$('#tip'); if(!t) return; t.textContent=text; t.hidden=false; placeTip(x,y); }
function placeTip(x, y){ const t=$('#tip'); if(!t || t.hidden) return; const w=t.offsetWidth, hh=t.offsetHeight; let left=x+14, top=y+14; if(left+w>window.innerWidth-8) left=Math.max(8, x-w-14); if(top+hh>window.innerHeight-8) top=Math.max(8, y-hh-14); t.style.left=left+'px'; t.style.top=top+'px'; }
function hideTip(){ const t=$('#tip'); if(t) t.hidden=true; }
document.addEventListener('mouseover', function(e){ const t=e.target && e.target.closest ? e.target.closest('[data-tip]') : null; if(t) showTip(t.getAttribute('data-tip'), e.clientX, e.clientY); else hideTip(); });
document.addEventListener('mousemove', function(e){ placeTip(e.clientX, e.clientY); });
document.addEventListener('focusin', function(e){ const t=e.target && e.target.closest ? e.target.closest('[data-tip]') : null; if(t){ const r=t.getBoundingClientRect(); showTip(t.getAttribute('data-tip'), r.left+r.width/2, r.bottom); } });
document.addEventListener('focusout', hideTip);

boot();
})();
