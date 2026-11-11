/* ================= HELPERS ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const safe=fn=>{try{return fn()}catch(e){}};
const EMAIL='surakshaka.poojari25@gmail.com';
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMac=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent);
$('#kbdHint').textContent=$('#kbdFoot').textContent=isMac?'⌘ K':'Ctrl K';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

let toastT;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200)}
function copy(text,msg){
  const done=()=>toast(msg||'Copied to clipboard');
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(done,fallback)}else fallback();
  function fallback(){const a=document.createElement('textarea');a.value=text;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();safe(()=>document.execCommand('copy'));a.remove();done()}
}
function go(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}

/* ================= THEME ================= */
let RGB='101,231,242';
function setTheme(t){
  root.dataset.theme=t;safe(()=>localStorage.setItem('sp-theme',t));
  $('meta[name=theme-color]').content=t==='light'?'#f4f7fb':'#070a11';
  RGB=getComputedStyle(root).getPropertyValue('--cyan-rgb').trim()||RGB;
}
setTheme(safe(()=>localStorage.getItem('sp-theme'))||'dark');
const toggleTheme=ev=>{
  const next=root.dataset.theme==='light'?'dark':'light';
  if(!document.startViewTransition||reduce){setTheme(next);return}
  const x=ev&&ev.clientX!=null?ev.clientX:innerWidth-60,y=ev&&ev.clientY!=null?ev.clientY:30;
  const r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  document.startViewTransition(()=>setTheme(next)).ready.then(()=>{
    root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},
      {duration:650,easing:'ease-in-out',pseudoElement:'::view-transition-new(root)'});
  }).catch(()=>{});
};
$('#themeBtn').addEventListener('click',toggleTheme);

/* ================= NAV ================= */
const burger=$('#burger'),mm=$('#mobileMenu');
burger.addEventListener('click',()=>{const o=mm.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
$$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');burger.setAttribute('aria-expanded',false)}));
const cssScroll=!!(window.CSS&&CSS.supports&&CSS.supports('animation-timeline','scroll()'));
addEventListener('scroll',()=>{
  const h=document.documentElement;
  if(!cssScroll){ // fallback only: modern browsers drive this from CSS
    const p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);
    $('#progress').style.width=(p*100)+'%';
  }
  $('#toTop').classList.toggle('show',h.scrollTop>700);
},{passive:true});
const navMap=Object.fromEntries($$('#navlinks a').map(a=>[a.getAttribute('href').slice(1),a]));
const secObs=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){$$('#navlinks a').forEach(a=>a.classList.remove('active'));const a=navMap[e.target.id];if(a)a.classList.add('active')}
}),{rootMargin:'-45% 0px -50% 0px'});
Object.keys(navMap).forEach(id=>{const el=document.getElementById(id);if(el)secObs.observe(el)});

/* ================= TYPED ROLES ================= */
(function(){
  const el=$('#typed'),phrases=['Conversational AI Engineer','Voice Bot Engineer','Agentic AI Builder','API Integration Engineer','Dialog & NLU Designer'];
  if(reduce)return;
  let pi=0,ci=0,del=false;
  (function tick(){
    const p=phrases[pi];ci+=del?-1:1;el.textContent=p.slice(0,ci);
    let d=del?32:68;
    if(!del&&ci===p.length){del=true;d=1500}else if(del&&ci===0){del=false;pi=(pi+1)%phrases.length;d=350}
    setTimeout(tick,d);
  })();
})();

/* ================= PARTICLES ================= */
(function(){
  const c=$('#particles'),x=c.getContext('2d');let w,h,pts=[];
  function resize(){w=c.width=innerWidth;h=c.height=innerHeight;pts=Array.from({length:Math.min(70,Math.floor(w/18))},()=>({x:Math.random()*w,y:Math.random()*h,v:(Math.random()-.5)*.22,r:Math.random()*1.4+.3}))}
  function draw(){
    x.clearRect(0,0,w,h);
    for(let i=0;i<pts.length;i++){const p=pts[i];p.y+=p.v+.08;p.x+=Math.sin(p.y*.003)*.12;if(p.y>h)p.y=0;
      x.fillStyle=`rgba(${RGB},.55)`;x.fillRect(p.x,p.y,p.r,p.r);
      for(let j=i+1;j<pts.length;j++){const q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<105){x.strokeStyle=`rgba(${RGB},${.1*(1-d/105)})`;x.lineWidth=.6;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}}
    if(!reduce)requestAnimationFrame(draw);
  }
  addEventListener('resize',resize);resize();draw();
})();

/* ================= REVEAL + COUNTERS ================= */
const revObs=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('visible');revObs.unobserve(e.target);
  $$('[data-count]',e.target).forEach(counter);
}),{threshold:.12});
$$('.reveal').forEach(el=>revObs.observe(el));
function counter(el){
  const end=+el.dataset.count,suf=el.dataset.suffix||'';
  if(reduce){el.textContent=end+suf;return}
  const t0=performance.now(),dur=1100;
  (function step(t){const p=Math.min(1,(t-t0)/dur);el.textContent=Math.round(end*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step)})(t0);
}

/* ================= NLU ENGINE (rule-based demo) ================= */
const DEFAULT_CHIPS=['What do you build?','Tell me about agentic AI','Voice bot experience','How do you integrate APIs?','Contact'];
const L=(...a)=>a; // keyword list helper: [term, weight]
const KB=[
 {id:'greeting',state:'GREET',kw:[['hi',1.2],['hello',1.2],['hey',1.2],['namaste',1.2],['good morning',1.2],['good evening',1.2]],
  reply:`Hi! I'm a small rule-based assistant built to show how I think about conversation design. Ask about Surakshaka's <b>experience</b>, <b>voice bots</b>, <b>agentic AI</b>, <b>skills</b> or how to get in touch.`},
 {id:'about_me',kw:[['who',1],['about',.8],['introduce',1.3],['yourself',.8],['surakshaka',1.3],['what do you build',2],['what do you do',2],['summary',1.2],['profile',1]],
  reply:`<b>Surakshaka Poojari</b> is a Cognitive Implementation Engineer II at SoundHound AI in Bengaluru, with 4+ years designing and deploying enterprise voice bots, chatbots and Agentic AI solutions on the Amelia platform.`},
 {id:'experience',kw:[['experience',1.4],['career',1.2],['work history',1.5],['roles',1],['job',.9],['soundhound',1.3],['ipsoft',1.3],['company',.8],['years',1.1],['worked',1]],
  reply:`<b>Jan 2024 – now:</b> Cognitive Implementation Engineer II, SoundHound AI, leading implementation and deployment of Conversational and Agentic AI.<br><b>Jun 2022 – Nov 2023:</b> Cognitive Implementation Engineer, Amelia (an IPsoft company), building chatbot and voice bot logic and custom modules.`},
 {id:'voice',kw:[['voice',1.5],['speech',1.1],['call',.7],['ivr',1.3],['asr',1.2],['tts',1.2],['phone',.8]],
  reply:`Voice is a big part of my work. I independently led an enterprise <b>voice AI project for a financial services client</b> and delivered a <b>voice solution for a credit score organization</b>, covering flows, intents, entities, dialog management and backend integrations.`,chips:['How do you integrate APIs?','Agentic AI','Testing approach','Contact']},
 {id:'chatbot',kw:[['chatbot',1.6],['chat',1],['airline',1.5],['french',1.4],['multilingual',1.3],['language support',1.2]],
  reply:`On the chat side I developed a <b>chatbot for a leading airline</b> and delivered a <b>French-language conversational AI project</b>, both alongside other concurrent work, with strong QA and UAT results.`},
 {id:'agentic',kw:[['agentic',1.8],['agent',1.3],['agents',1.3],['orchestration',1.4],['tool calling',1.6],['tools',.7],['itsm',1.3],['it support',1.4],['workflow automation',1.4],['autonomous',1]],
  reply:`I build Agentic AI on Amelia: <b>AI agents, tool calling, agent orchestration and multi-step workflow automation</b>. I contributed to an <b>internal IT support bot</b> that integrates corporate IT use cases, covering ITSM automation and employee self-service. Try the “Agentic bot” trace in the Conversation Lab.`,chips:['Voice bot experience','How do you integrate APIs?','Skills']},
 {id:'integration',kw:[['api',1.4],['apis',1.4],['rest',1.3],['json',1.2],['groovy',1.4],['integrate',1.3],['integration',1.4],['integrations',1.4],['backend',1.2],['postman',1.2],['third party',1],['webhook',1]],
  reply:`I build custom integrations with <b>REST APIs, JSON and Groovy scripting</b>, plus third-party services, for data exchange and process automation. I debug with Postman, and after each project I review structural changes and APIs with R&amp;D to find candidates for standardization.`},
 {id:'skills',kw:[['skills',1.5],['skill',1.4],['stack',1.3],['tech',1.1],['technologies',1.3],['tools',.9],['java',1],['sql',1],['spring',1],['git',.9],['languages',.5]],
  reply:`<b>Platforms:</b> SoundHound AI, Amelia.<br><b>Conversational:</b> NLU/NLP, intents, entities, dialog management.<br><b>Agentic:</b> agents, orchestration, tool calling, evaluation.<br><b>Dev:</b> Groovy, Java, SQL, REST, JSON, Spring Boot, HTML/CSS.<br><b>Tools:</b> Postman, Eclipse, Jira, Git, Bitbucket.`},
 {id:'projects',kw:[['project',1.4],['projects',1.5],['portfolio',1.2],['delivered',1.1],['built',1],['achievements',1.3],['accomplishments',1.3]],
  reply:`Highlights: a <b>financial services voice AI</b> I led end to end, a <b>credit score voice assistant</b>, an <b>agentic IT support bot</b>, an <b>airline chatbot</b>, a <b>French-language project</b>, and an <b>AI prototype with the Paris team</b> that won client approval. Open the Work section for details.`,chips:['Voice bot experience','Tell me about agentic AI','Paris prototype']},
 {id:'paris',kw:[['paris',1.8],['prototype',1.6],['approval',1.2],['lead',.8],['leadership',1.1]],
  reply:`I led an <b>AI prototype with the Paris team</b> and secured client approval for the project, a good example of working across regions and translating ideas into something a client could say yes to.`},
 {id:'testing',kw:[['test',1.3],['testing',1.5],['qa',1.4],['uat',1.5],['debug',1.3],['debugging',1.3],['quality',1],['production support',1.5],['deploy',1]],
  reply:`I test every module until it performs as expected, debug defects to keep builds stable, run QA and UAT, and provide <b>post-production support</b> after go-live. I've delivered multiple projects at once with strong QA and UAT results.`},
 {id:'education',kw:[['education',1.5],['degree',1.4],['college',1.2],['university',1.2],['vemana',1.5],['mechanical',1.5],['cgpa',1.4],['studied',1.2],['engineering background',1.2]],
  reply:`<b>B.E. Mechanical Engineering</b>, Vemana Institute of Technology, Bengaluru (2017–2021), CGPA 8.85. I moved into conversational AI in 2022 and have been building in it since.`},
 {id:'certs',kw:[['certification',1.6],['certifications',1.6],['certificate',1.4],['courses',1.2],['cognigy',1.5],['google',.9],['jspiders',1.4]],
  reply:`Certifications include <b>Cognigy.AI</b> (AI Developer and Conversational Design), <b>Java Full Stack</b> (JSpiders), Google's <b>Elements of AI</b> and <b>AI-Powered Performance Ads</b>, plus JPMorgan Excel, TCS Career Edge and NITK Virtual Labs.`},
 {id:'languages',kw:[['speak',.9],['kannada',1.5],['hindi',1.5],['english',1.2],['spoken',1.2]],
  reply:`Languages: <b>English, Kannada and Hindi</b>. I've also delivered a French-language conversational AI project.`},
 {id:'location',kw:[['where',.9],['location',1.5],['bengaluru',1.5],['bangalore',1.5],['india',1.2],['based',1.2],['remote',1.1],['relocate',1.2]],
  reply:`I'm based in <b>Bengaluru, Karnataka, India</b> and I'm used to collaborating with distributed teams, including the Paris team.`},
 {id:'contact',state:'HANDOFF',kw:[['contact',1.6],['email',1.6],['hire',1.6],['reach',1.3],['linkedin',1.4],['connect',1.2],['resume',1.2],['cv',1.2],['opportunity',1.2],['available',1],['talk',.8]],
  reply:`Best way to reach Surakshaka: <a href="mailto:${EMAIL}">${EMAIL}</a>. You can also use the contact form below, press <b>Save résumé as PDF</b> at the top, or find the LinkedIn link in the Contact section.`,chips:['Copy email','What do you build?']},
 {id:'meta',kw:[['how does this work',2],['how do you work',2],['this demo',1.6],['rule based',1.6],['nlu',1.3],['intent',1.2],['confidence',1.2],['inspector',1.4],['are you ai',1.6],['are you real',1.4],['are you a bot',1.6],['bot',.6]],
  reply:`Good question, this demo is intentionally simple: <b>keyword-weighted intent scoring</b>, a few entity extractors, a <b>confidence threshold</b> that routes low scores to a fallback, and a counter that <b>escalates to a human channel</b> after two misses. The inspector under the chat shows each decision. It's not an LLM.`},
 {id:'thanks',kw:[['thanks',1.5],['thank you',1.6],['great',.9],['awesome',1.1],['nice',.9],['cool',.9]],reply:`Happy to help! Anything else you'd like to know?`},
 {id:'bye',kw:[['bye',1.6],['goodbye',1.6],['see you',1.4],['later',.8]],reply:`Thanks for stopping by! If you'd like to talk, the contact section is a scroll away.`}
];
const ENT=[
 ['channel',/\b(voice|speech|ivr|call)\b/i,'voice'],['channel',/\b(chat|chatbot|message)\b/i,'chat'],['channel',/\bagent(ic|s)?\b/i,'agentic'],
 ['industry',/\bairline|aviation\b/i,'aviation'],['industry',/\bbank|financ(e|ial)\b/i,'financial services'],['industry',/\bcredit\b/i,'credit scoring'],['industry',/\b(it support|itsm|helpdesk)\b/i,'internal IT'],
 ['tech',/\brest\b/i,'REST'],['tech',/\bjson\b/i,'JSON'],['tech',/\bgroovy\b/i,'Groovy'],['tech',/\bjava\b/i,'Java'],['tech',/\bsql\b/i,'SQL'],['tech',/\bpostman\b/i,'Postman'],
 ['language',/\bfrench\b/i,'French'],['language',/\bkannada\b/i,'Kannada'],['language',/\bhindi\b/i,'Hindi'],['language',/\benglish\b/i,'English'],
 ['location',/\b(bengaluru|bangalore|paris|india)\b/i,null]
];
function nlu(text){
  const t0=performance.now();
  const norm=text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const toks=norm.split(' ');
  const scored=KB.map(it=>{
    let s=0;
    for(const [k,w] of it.kw){
      const hit=k.includes(' ')?(' '+norm+' ').includes(' '+k+' '):toks.some(tk=>tk===k||(k.length>=5&&tk.startsWith(k)));
      if(hit)s+=w;
    }
    return {it,s,conf:s?1-Math.exp(-s*.85):0};
  }).sort((a,b)=>b.s-a.s);
  const top=scored[0];
  const ents=[];
  for(const [type,re,val] of ENT){const m=text.match(re);if(m)ents.push({type,val:val||m[0]})}
  const ok=top.conf>=.5;
  return {id:ok?top.it.id:'fallback',it:ok?top.it:null,conf:top.conf,cands:scored.filter(x=>x.s>0).slice(0,3).map(x=>({id:x.it.id,conf:x.conf})),ents,ms:performance.now()-t0};
}

/* ================= CHAT UI ================= */
const log=$('#chatLog'),chipsEl=$('#chips'),form=$('#chatForm'),input=$('#chatInput');
const S={turns:0,fallbacks:0,consec:0,voice:false,busy:false};
function addMsg(content,who,html){
  const d=document.createElement('div');d.className='msg '+who;
  if(html)d.innerHTML=content;else d.textContent=content;
  log.appendChild(d);log.scrollTop=log.scrollHeight;return d;
}
function setChips(list){
  chipsEl.innerHTML='';
  list.forEach(t=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.addEventListener('click',()=>send(t));chipsEl.appendChild(b)});
}
function inspect(res,dstate){
  $('#iIntent').textContent=res.id;
  $('#iState').textContent=dstate;
  const pct=Math.round(res.conf*100);
  $('#iConfTxt').textContent=pct?`· ${pct}%`:'· 0%';
  const bar=$('#iBar');bar.style.width=pct+'%';bar.classList.toggle('low',res.id==='fallback');
  $('#iEnt').innerHTML=res.ents.length?res.ents.map(e=>`<span class="ent">${esc(e.type)}: ${esc(e.val)}</span>`).join(''):'—';
  $('#iCand').innerHTML=res.cands.length?res.cands.map(c=>`<div class="cand"><span>${c.id}</span><span>${Math.round(c.conf*100)}%</span></div>`).join(''):'—';
  $('#iTime').textContent=res.ms.toFixed(2)+' ms';
  $('#iTurns').textContent=`${S.turns} · ${S.fallbacks}`;
}
function respond(res){
  S.turns++;
  if(res.id==='fallback'){
    S.fallbacks++;S.consec++;
    if(S.consec>=2){S.consec=0;return {html:`I'm still not getting that, and a good bot knows when to hand off. Best route: <a href="mailto:${EMAIL}">email Surakshaka</a>, or pick one of the topics below.`,chips:DEFAULT_CHIPS,state:'ESCALATE'}}
    return {html:`I didn't quite catch that. I can talk about <b>experience, voice bots, agentic AI, integrations, skills, projects</b> or <b>contact</b>. Which one?`,chips:DEFAULT_CHIPS,state:'REPROMPT'};
  }
  S.consec=0;
  return {html:res.it.reply,chips:res.it.chips||DEFAULT_CHIPS,state:res.it.state||'ANSWER'};
}
function send(text){
  text=(text||'').trim();
  if(!text||S.busy)return;
  if(text==='Copy email'){addMsg(text,'user');copy(EMAIL,'Email copied');addMsg(`Copied <b>${EMAIL}</b> to your clipboard.`,'bot',true);input.value='';return}
  if(text==='Paris prototype')text='Tell me about the Paris prototype';
  S.busy=true;addMsg(text,'user');input.value='';
  const res=nlu(text);
  const ty=document.createElement('div');ty.className='msg bot typing';ty.innerHTML='<i></i><i></i><i></i>';log.appendChild(ty);log.scrollTop=log.scrollHeight;
  setTimeout(()=>{
    ty.remove();
    const r=respond(res);
    addMsg(r.html,'bot',true);setChips(r.chips);inspect(res,r.state);speak(r.html);
    S.busy=false;
  },reduce?0:450+Math.random()*400);
}
form.addEventListener('submit',e=>{e.preventDefault();send(input.value)});

/* ---- voice: speech synthesis + recognition + waveform ---- */
const wave={mode:'idle',t:0},wc=$('#wave'),wx=wc.getContext('2d');
function wsize(){const r=wc.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);wc.width=r.width*d;wc.height=r.height*d;wx.setTransform(d,0,0,d,0,0)}
function wdraw(){
  const W=wc.clientWidth,H=wc.clientHeight;wx.clearRect(0,0,W,H);
  wave.t+=wave.mode==='idle'?.03:.12;
  const amp=wave.mode==='idle'?.14:wave.mode==='speaking'?.78:.95,gap=6,n=Math.floor(W/gap);
  for(let i=0;i<n;i++){
    let v=Math.sin(i*.33+wave.t)*.5+Math.sin(i*.12-wave.t*1.3)*.5;
    if(wave.mode!=='idle')v+=(Math.random()-.5)*.5;
    const h=Math.max(2,(.18+Math.abs(v)*.8)*amp*H);
    wx.fillStyle=`rgba(${RGB},${wave.mode==='idle'?.35:.85})`;wx.fillRect(i*gap+W%gap/2,(H-h)/2,3,h);
  }
  if(!reduce||wave.mode!=='idle')requestAnimationFrame(wdraw);
}
addEventListener('resize',wsize);wsize();wdraw();

const hasTTS='speechSynthesis' in window;
$('#voiceToggle').addEventListener('click',e=>{
  if(!hasTTS){toast('Speech synthesis is not supported in this browser');return}
  S.voice=!S.voice;e.currentTarget.setAttribute('aria-pressed',S.voice);
  if(!S.voice){speechSynthesis.cancel();wave.mode='idle'}
  toast(S.voice?'Voice replies on':'Voice replies off');
});
function speak(html){
  if(!S.voice||!hasTTS)return;
  speechSynthesis.cancel();
  const d=document.createElement('div');d.innerHTML=html.replace(/<br\s*\/?>/g,'. ');
  const u=new SpeechSynthesisUtterance(d.textContent);
  u.onstart=()=>{wave.mode='speaking';requestAnimationFrame(wdraw)};u.onend=u.onerror=()=>{wave.mode='idle'};
  speechSynthesis.speak(u);
}
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
let rec=null;
if(SR){
  rec=new SR();rec.lang='en-IN';rec.interimResults=false;rec.maxAlternatives=1;
  rec.onstart=()=>{wave.mode='listening';requestAnimationFrame(wdraw);$('#micBtn').setAttribute('aria-pressed',true)};
  rec.onend=()=>{wave.mode='idle';$('#micBtn').setAttribute('aria-pressed',false)};
  rec.onresult=e=>send(e.results[0][0].transcript);
  rec.onerror=e=>toast('Mic unavailable: '+(e.error||'error'));
}
$('#micBtn').addEventListener('click',()=>{
  if(!rec){toast('Speech recognition is not supported in this browser. Try Chrome or Edge.');return}
  safe(()=>rec.start());
});

// initial greeting
addMsg(`Hi, I'm <b>SP.AI</b>, a tiny rule-based bot that answers questions about Surakshaka. Pick a topic or type your own, then open the <b>NLU inspector</b> to see how I decide.`,'bot',true);
setChips(DEFAULT_CHIPS);

/* ================= CONVERSATION LAB ================= */
const FLOWS={
 voice:{utterance:'Caller says: <b>“I’d like to check where my application stands.”</b>',steps:[
  {k:'ASR',t:'Speech → text',d:'Streaming recognition turns audio into a transcript with a confidence score. Low confidence can trigger a re-prompt before NLU ever runs.',p:{event:'asr.result',transcript:'i would like to check where my application stands',confidence:0.94,locale:'en-IN'}},
  {k:'NLU',t:'Intent & entities',d:'The transcript is mapped to an intent. Entities such as reference numbers are extracted and slots are filled.',p:{intent:'check_application_status',confidence:0.91,entities:{reference_id:null},missing_slots:['reference_id']}},
  {k:'Dialog',t:'Slot filling & confirmation',d:'The dialog manager notices a missing slot, asks for it, and confirms the value back to the caller before acting.',p:{state:'COLLECT_SLOT',prompt:'Sure. What is your reference number?',reprompt_limit:2,on_fail:'transfer_to_human'}},
  {k:'Integration',t:'Backend call',d:'A Groovy integration layer calls a REST service, handles errors and timeouts, and maps the JSON response to dialog variables.',p:{request:'GET /v1/applications/{reference_id}',timeout_ms:3000,response:{status:'IN_REVIEW',updated:'2026-01-14'}}},
  {k:'Response',t:'Spoken reply (TTS)',d:'The result is turned into a short, natural spoken reply, with a clear next step offered.',p:{say:'Your application is currently in review. Would you like a text message when it changes?',next:'OFFER_NOTIFICATION'}}]},
 chat:{utterance:'User types: <b>“Can I change my flight to Friday?”</b>',steps:[
  {k:'Message',t:'Input & normalisation',d:'Text is normalised, language is detected and the session context is loaded.',p:{event:'message.received',text:'Can I change my flight to Friday?',lang:'en',session:'a91f…'}},
  {k:'NLU',t:'Intent & entities',d:'Intent classification plus date entity extraction. Confidence below a threshold routes to clarification instead of guessing.',p:{intent:'change_booking',confidence:0.88,entities:{new_date:'Friday'},threshold:0.6}},
  {k:'Dialog',t:'Business rules',d:'Rules decide what is needed next: identify the booking, check change eligibility, then confirm.',p:{state:'VERIFY_BOOKING',required:['booking_ref'],fallback:'clarify_or_handoff'}},
  {k:'Integration',t:'API lookup',d:'The assistant calls a booking service through an integration layer, validating the response before using it.',p:{request:'POST /v1/bookings/search',body:{ref:'ABC123'},response:{eligible:true,fee:0}}},
  {k:'Reply',t:'Answer + quick replies',d:'The reply states the outcome and offers quick-reply buttons so the user can continue without typing.',p:{text:'Good news, you can change this booking at no charge.',quick_replies:['Show Friday flights','Talk to an agent']}}]},
 agent:{utterance:'Employee says: <b>“My VPN keeps disconnecting.”</b>',steps:[
  {k:'Request',t:'Goal understanding',d:'The agent identifies the user goal and the context it needs, instead of following a fixed script.',p:{goal:'resolve_vpn_issue',user:'employee',context_needed:['device','last_error']}},
  {k:'Plan',t:'Select tools',d:'The agent plans multi-step work and chooses which tools to call, in what order, and under which limits.',p:{plan:['search_knowledge_base','check_service_status','create_ticket_if_unresolved'],max_steps:5}},
  {k:'Tool call',t:'Act through APIs',d:'Tool calls go to enterprise systems such as an ITSM platform, with typed arguments and guarded permissions.',p:{tool:'search_knowledge_base',args:{query:'vpn disconnect',limit:3},permissions:'read_only'}},
  {k:'Observe',t:'Evaluate result',d:'The agent checks the tool result against the goal. If it does not help, it tries the next tool or escalates.',p:{result:'2 relevant articles',resolved:false,next_action:'check_service_status'}},
  {k:'Respond',t:'Resolve or escalate',d:'The agent answers with steps to try, or creates a ticket with full context when it cannot resolve the issue.',p:{action:'create_ticket',priority:'P3',summary:'VPN disconnects, KB steps attempted',handoff:true}}]}
};
let flowKey='voice',cur=-1,flowTimer=null;
const flowEl=$('#flowSteps');
function hl(obj){
  return esc(JSON.stringify(obj,null,2)).replace(/("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g,(m,s,colon,b,n)=>{
    if(s)return colon?`<span class="j-k">${s}</span>${colon}`:`<span class="j-s">${s}</span>`;
    if(b)return `<span class="j-b">${b}</span>`;
    return `<span class="j-n">${n}</span>`;
  });
}
function renderFlow(){
  const f=FLOWS[flowKey];
  $('#utterance').innerHTML=f.utterance;
  flowEl.innerHTML=f.steps.map((s,i)=>`<button class="node" data-i="${i}"><b>${String(i+1).padStart(2,'0')}</b><span>${s.k}</span></button>`).join('<i class="link"></i>');
  $$('.node',flowEl).forEach(n=>n.addEventListener('click',()=>{stopFlow();pick(+n.dataset.i)}));
  cur=-1;$('#stepTitle').textContent='Select a step';
  $('#stepDesc').textContent='Press “Run trace” or click any stage to inspect what happens there.';
  $('#payload').textContent='{ }';
}
function pick(i){
  const f=FLOWS[flowKey],s=f.steps[i];cur=i;
  $$('.node',flowEl).forEach((n,k)=>{n.classList.toggle('active',k===i);n.classList.toggle('done',k<i)});
  $('#stepTitle').textContent=`${String(i+1).padStart(2,'0')} · ${s.t}`;
  $('#stepDesc').textContent=s.d;
  $('#payload').innerHTML=hl(s.p);
}
function stopFlow(){clearInterval(flowTimer);flowTimer=null;$('#runFlow').textContent='▶ Run trace'}
function runFlow(){
  if(flowTimer){stopFlow();return}
  const n=FLOWS[flowKey].steps.length;let i=0;
  $('#runFlow').textContent='■ Stop';pick(0);
  flowTimer=setInterval(()=>{
    i++;
    if(i>=n){stopFlow();$$('.node',flowEl).forEach(x=>x.classList.add('done'));return}
    pick(i);
  },reduce?600:1400);
}
$('#runFlow').addEventListener('click',runFlow);
$$('#flowTabs button').forEach(b=>b.addEventListener('click',()=>{
  stopFlow();flowKey=b.dataset.flow;
  $$('#flowTabs button').forEach(x=>x.setAttribute('aria-selected',x===b));
  renderFlow();
}));
renderFlow();

/* ================= PROJECTS ================= */
const PROJECTS=[
 {id:'fin',code:'CASE / 001 · LED',title:'Financial Services Voice AI',tags:['voice','led'],chips:['Voice bot','Amelia','End-to-end ownership'],
  summary:'Independently led and delivered an enterprise voice AI project on Amelia for a financial services client.',
  role:'Project lead and implementer',did:['Owned implementation, integrations, configuration, testing and delivery','Configured conversational flows, intents, entities and dialog management','Integrated backend enterprise systems through REST/JSON and Groovy'],outcome:'Delivered end to end as the independent lead.',stack:['Amelia','REST','JSON','Groovy']},
 {id:'credit',code:'CASE / 002',title:'Credit Score Voice Assistant',tags:['voice'],chips:['Voice AI','Backend APIs','Automation'],
  summary:'Delivered a voice-based conversational AI solution for a credit score organization.',
  role:'Implementation engineer',did:['Built voice interactions on Amelia','Integrated backend systems to automate customer interactions'],outcome:'Automated customer interactions through voice and backend integrations.',stack:['Amelia','Voice','REST APIs']},
 {id:'it',code:'CASE / 003',title:'Agentic IT Support Bot',tags:['agentic','chat'],chips:['Agentic AI','ITSM','Self-service'],
  summary:'Contributed to an internal IT support bot built on Amelia Agentic AI.',
  role:'Contributor',did:['Integrated corporate IT use cases','Worked with AI agents, tool calling and orchestration for multi-step workflows'],outcome:'Streamlines employee support and automates internal workflows (ITSM automation, employee self-service).',stack:['Amelia Agentic AI','Tool calling','ITSM']},
 {id:'air',code:'CASE / 004',title:'Airline Chatbot',tags:['chat'],chips:['Chatbot','QA / UAT','Aviation'],
  summary:'Developed a chatbot for a leading airline company.',
  role:'Chatbot developer',did:['Built conversational logic and custom modules','Delivered alongside other concurrent projects'],outcome:'Strong QA and UAT performance.',stack:['Amelia','Dialog logic','APIs']},
 {id:'paris',code:'CASE / 005 · LED',title:'AI Prototype with the Paris Team',tags:['led'],chips:['Prototyping','Client approval','Cross-region'],
  summary:'Led an AI prototype in collaboration with the Paris team.',
  role:'Prototype lead',did:['Worked with the Paris team across regions','Shaped the prototype for client review'],outcome:'Secured client approval for the project.',stack:['Amelia','Prototyping']},
 {id:'fr',code:'CASE / 006',title:'French-Language Conversational AI',tags:['chat'],chips:['Multilingual','Dialog design','UAT'],
  summary:'Delivered a French-language conversational AI project while running other engagements.',
  role:'Implementation engineer',did:['Built and tested conversational modules for a French-language experience','Managed delivery concurrently with other projects'],outcome:'Strong performance in QA and UAT phases.',stack:['Amelia','Multilingual NLU']}
];
const grid=$('#projGrid');
function renderProjects(f){
  grid.innerHTML=PROJECTS.filter(p=>f==='all'||p.tags.includes(f)).map((p,i)=>`<article class="card ${p.tags.includes('led')?'featured':''}" style="--i:${i}"><div class="num">${p.code}</div><h3>${p.title}</h3><p>${p.summary}</p><div class="tags">${p.chips.map(c=>`<span class="tag">${c}</span>`).join('')}</div><button class="more" data-id="${p.id}">View details →</button></article>`).join('');
}
$$('#projFilters button').forEach(b=>b.addEventListener('click',()=>{
  $$('#projFilters button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderProjects(b.dataset.f);
}));
const dlg=$('#projDlg');
grid.addEventListener('click',e=>{
  const b=e.target.closest('.more');if(!b)return;
  const p=PROJECTS.find(x=>x.id===b.dataset.id);
  $('#projBody').innerHTML=`<div class="mono">${p.code}</div><h3>${p.title}</h3><p>${p.summary}</p>
   <h5>My role</h5><p style="margin:0">${p.role}</p>
   <h5>What I did</h5><ul>${p.did.map(d=>`<li>${d}</li>`).join('')}</ul>
   <h5>Outcome</h5><p style="margin:0">${p.outcome}</p>
   <div class="tags">${p.stack.map(s=>`<span class="tag">${s}</span>`).join('')}</div>
   <p class="note" style="margin-top:18px">Client names and confidential details are intentionally omitted.</p>`;
  dlg.showModal?dlg.showModal():dlg.setAttribute('open','');
});
$('#projClose').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
renderProjects('all');

/* ================= SKILLS ================= */
const SKILLS=[
 ['NLU & NLP','conv','Intents · Entities'],['Dialog Management','conv','Flows · Fallbacks'],['Voice Bots','conv','Amelia · SoundHound AI'],['Chatbots','conv','Enterprise assistants'],
 ['AI Agents','agent','Amelia Agentic AI'],['Agent Orchestration','agent','Multi-step workflows'],['Tool Calling','agent','Workflow automation'],['Agent Evaluation','agent','Quality validation'],
 ['REST APIs & JSON','dev','Integrations'],['Groovy','dev','Logic · Customization'],['Java','dev','Backend logic'],['SQL','dev','Data queries'],['Spring Boot','dev','Backend fundamentals'],['HTML & CSS','dev','Web fundamentals'],['ITSM Automation','dev','Employee self-service'],['Enterprise Integration','dev','EAI'],
 ['Testing & Debugging','tools','QA · UAT · Deployment'],['Postman','tools','API testing'],['Git & Bitbucket','tools','Version control'],['Jira','tools','Delivery & tracking'],['Eclipse','tools','IDE'],['SDLC & Tech Writing','tools','Documentation']
];
let skillCat='all',skillQ='';
function renderSkills(){
  const q=skillQ.toLowerCase();
  const list=SKILLS.filter(s=>(skillCat==='all'||s[1]===skillCat)&&(!q||(s[0]+' '+s[2]).toLowerCase().includes(q)));
  $('#skillGrid').innerHTML=list.length?list.map((s,i)=>`<div class="skill" style="--i:${i}"><span>${s[0]}</span><small>${s[2]}</small></div>`).join(''):'<div class="empty">No matching skills. Try “REST” or “agent”.</div>';
}
$$('#skillFilters button').forEach(b=>b.addEventListener('click',()=>{
  $$('#skillFilters button').forEach(x=>x.setAttribute('aria-pressed',x===b));skillCat=b.dataset.f;renderSkills();
}));
$('#skillSearch').addEventListener('input',e=>{skillQ=e.target.value.trim();renderSkills()});
renderSkills();

/* ================= CONTACT ================= */
const copyMail=()=>copy(EMAIL,'Email copied');
$('#copyEmail').addEventListener('click',copyMail);$('#copyEmailHero').addEventListener('click',copyMail);
$('#printBtn').addEventListener('click',()=>window.print());
$('#contactForm').addEventListener('submit',e=>{
  e.preventDefault();const f=new FormData(e.target);
  const subject=encodeURIComponent(`Portfolio enquiry from ${f.get('name')}`);
  const body=encodeURIComponent(`${f.get('msg')}\n\n— ${f.get('name')} (${f.get('email')})`);
  location.href=`mailto:${EMAIL}?subject=${subject}&body=${body}`;
  toast('Opening your mail app…');
});

/* ================= COMMAND PALETTE ================= */
const pal=$('#palette'),palIn=$('#palInput'),palList=$('#palList');
const COMMANDS=[
 {l:'Try the live assistant',h:'Demo',run:()=>{go('assistant');setTimeout(()=>input.focus({preventScroll:true}),500)}},
 {l:'Conversation Lab: pipeline trace',h:'Go to',run:()=>go('lab')},
 {l:'Selected work',h:'Go to',run:()=>go('work')},
 {l:'Experience',h:'Go to',run:()=>go('experience')},
 {l:'Skills & certifications',h:'Go to',run:()=>go('capabilities')},
 {l:'Contact',h:'Go to',run:()=>go('contact')},
 {l:'Run the agentic trace',h:'Action',run:()=>{go('lab');$$('#flowTabs button')[2].click();setTimeout(runFlow,500)}},
 {l:'Toggle light / dark theme',h:'Action',run:toggleTheme},
 {l:'Toggle voice replies',h:'Action',run:()=>$('#voiceToggle').click()},
 {l:'Copy email address',h:'Action',run:copyMail},
 {l:'Save résumé as PDF',h:'Action',run:()=>setTimeout(()=>window.print(),150)},
 {l:'Open LinkedIn',h:'Link',run:()=>window.open('https://www.linkedin.com/','_blank','noopener')}
];
let palSel=0,palItems=[];
function palRender(){
  const q=palIn.value.trim().toLowerCase();
  palItems=COMMANDS.filter(c=>!q||(c.l+' '+c.h).toLowerCase().includes(q));
  palSel=Math.min(palSel,Math.max(0,palItems.length-1));
  palList.innerHTML=palItems.length?palItems.map((c,i)=>`<li role="option" data-i="${i}" class="${i===palSel?'sel':''}"><span>${c.l}</span><small>${c.h}</small></li>`).join(''):'<li style="cursor:default">No results</li>';
}
function palOpen(){palIn.value='';palSel=0;palRender();pal.showModal?pal.showModal():pal.setAttribute('open','');palIn.focus()}
function palRun(i){const c=palItems[i];if(!c)return;pal.close();setTimeout(c.run,60)}
palIn.addEventListener('input',()=>{palSel=0;palRender()});
palIn.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();palSel=(palSel+1)%Math.max(1,palItems.length);palRender()}
  else if(e.key==='ArrowUp'){e.preventDefault();palSel=(palSel-1+palItems.length)%Math.max(1,palItems.length);palRender()}
  else if(e.key==='Enter'){e.preventDefault();palRun(palSel)}
});
palList.addEventListener('click',e=>{const li=e.target.closest('li[data-i]');if(li)palRun(+li.dataset.i)});
pal.addEventListener('click',e=>{if(e.target===pal)pal.close()});
$('#openPalette').addEventListener('click',palOpen);
addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.open?pal.close():palOpen()}
});

/* ================= POINTER EFFECTS (feed CSS custom properties) ================= */
(function(){
  const glow=$('#cursorGlow');let raf=0,mx=0,my=0;
  addEventListener('pointermove',e=>{
    if(e.pointerType==='touch')return;
    mx=e.clientX;my=e.clientY;
    if(!raf)raf=requestAnimationFrame(()=>{raf=0;glow.style.setProperty('--cx',mx+'px');glow.style.setProperty('--cy',my+'px');glow.style.opacity=1});
    const el=e.target.closest&&e.target.closest('.card,.skill,.step');
    if(!el)return;
    const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    el.style.setProperty('--mx',x+'px');el.style.setProperty('--my',y+'px');
    if(el.classList.contains('card')&&!reduce){
      el.style.setProperty('--ry',((x/r.width-.5)*7).toFixed(2)+'deg');
      el.style.setProperty('--rx',((.5-y/r.height)*7).toFixed(2)+'deg');
    }
  },{passive:true});
  document.addEventListener('pointerout',e=>{
    const c=e.target.closest&&e.target.closest('.card');
    if(c&&!c.contains(e.relatedTarget)){c.style.removeProperty('--rx');c.style.removeProperty('--ry')}
  });
})();
