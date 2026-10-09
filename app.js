
const DATA = {"people": {"title": "People", "hints": [{"speaker": "Diane Walsh, 67", "cost": 0, "text": "People who grew up around here know better than to keep following a trail just because it's there."}, {"speaker": "Mary Harper, 34", "cost": 0, "text": "The people who come back more than once are usually the ones who know when to turn around."}, {"speaker": "Wendy Clarke, 61", "cost": 1, "text": "If somebody out there notices you, you're better off being remembered as respectful than stubborn."}, {"speaker": "Mary Harper, 34", "cost": 1, "text": "I saw someone on one of those maintained trails once. I apologized for being there and went straight back the way I came. Nothing followed me home."}]}, "places": {"title": "Places", "hints": [{"speaker": "Diane Walsh, 67", "cost": 0, "text": "Most people stay around the old main camp. Office, infirmary, rec hall. Once you start pushing past that, you're getting into places people don't talk about as much."}, {"speaker": "Ray Fournier, 52", "cost": 0, "text": "The farther southeast you go, the fewer people I hear talking about what they found."}, {"speaker": "Wendy Clarke, 61", "cost": 1, "text": "There's supposed to be an old long-distance cabin somewhere farther southeast. People have looked for it, but I haven't heard anyone say they found it in years."}, {"speaker": "Mary Harper, 34", "cost": 1, "text": "If you're farther southeast and you find a trail that looks cleaner than the rest, don't treat that like good luck. That's where I'd turn around."}]}, "canaries-trails": {"title": "Canaries & Trails", "hints": [{"speaker": "Wendy Clarke, 61", "cost": 0, "text": "The canaries weren't meant to lead you deeper into the woods. They were there to help campers find their way back."}, {"speaker": "Wendy Clarke, 61", "cost": 0, "text": "Closed beak means it's one of the old camp birds. You can recognize it, but that doesn't mean it's still pointing where it used to."}, {"speaker": "Cal Hargreaves, 58", "cost": 1, "text": "If you find a canary with its beak open like it's singing, that isn't one of the old camp markers. Don't follow it."}, {"speaker": "Cal Hargreaves, 58", "cost": 1, "text": "The old trails should be growing over by now. If you find one that's been kept clear, somebody is still using it. I wouldn't follow that trail to find out who."}]}, "stories-lore": {"title": "Stories & Lore", "hints": [{"speaker": "Diane Walsh, 67", "cost": 0, "text": "Lots of hikers come here. I don't see them all leave."}, {"speaker": "Marge Bell, 74", "cost": 0, "text": "People around here have called whatever looks after that place the Custodian for years."}, {"speaker": "Marge Bell, 74", "cost": 1, "text": "The counsellor from the storm? They say he was found right on a trail, like someone had left him there. Funny thing is, he was the one who saved that little kid."}, {"speaker": "Ray Fournier, 52", "cost": 1, "text": "Some people swear somebody looks after the old camp. Keeps trails clear. Moves things around. I wouldn't go looking for them."}]}, "rules-warnings": {"title": "Rules & Warnings", "hints": [{"speaker": "Cal Hargreaves, 58", "cost": 0, "text": "If you realize you're somewhere you shouldn't be, turn around. Don't keep going just because you want to see what's there."}, {"speaker": "Cal Hargreaves, 58", "cost": 0, "text": "If something out there makes it clear you should leave, leave. Don't argue with it in its own woods."}, {"speaker": "Mary Harper, 34", "cost": 1, "text": "If you cross a line out there and realize it, apologize before you do anything else."}, {"speaker": "Ray Fournier, 52", "cost": 1, "text": "People who leave things alone, clean up after themselves, and know when to back off seem to have better luck than the ones who don't."}]}};
const KEY='campCanaryBringALocal_v11';
function getProgress(){
  const base=Object.fromEntries(Object.keys(DATA).map(k=>[k,0]));
  try{return Object.assign(base,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return base;}
}
function saveProgress(p){localStorage.setItem(KEY,JSON.stringify(p));}
function progressText(slug){
  const p=getProgress()[slug]||0;
  return `${p} of 4 heard`;
}
function renderCategory(slug){
  const box=document.getElementById('hints');
  if(!box) return;
  const p=getProgress();
  const heard=p[slug]||0;
  const hints=DATA[slug].hints;
  box.innerHTML='';
  hints.forEach((h,i)=>{
    const d=document.createElement('section');
    const revealed=i<heard, next=i===heard, locked=i>heard;
    d.className='hint '+(revealed?'revealed':locked?'locked':'');
    const tag=h.cost?'+1 Point':'Free';
    let body='';
    if(revealed){
      body=`<div class="speaker">${h.speaker}</div><div class="quote">${h.text}</div>`;
    } else if(next){
      body=`<p>${h.cost?'This local may know more, but you’ll need to investigate further.':'This local will tell you this without prompting.'}</p>
      <button class="btn" data-reveal="${i}">${h.cost?'Investigate further':'Hear this hint'}</button>
      ${h.cost?'<div class="note"><strong>Cost:</strong> +1 Investigation Point. Record it on your physical Investigation Point Tracker when you reveal this hint.</div>':''}`;
    } else {
      body='<p>Listen to the earlier hints in this category first.</p>';
    }
    d.innerHTML=`<div class="head"><strong>Hint ${i+1}</strong><span class="tag ${h.cost?'':'free'}">${tag}</span></div>${body}`;
    box.appendChild(d);
  });
  document.querySelectorAll('[data-reveal]').forEach(b=>b.addEventListener('click',()=>{
    const i=Number(b.dataset.reveal);
    if(hints[i].cost){
      const dlg=document.getElementById('confirm');
      dlg.dataset.index=i; dlg.showModal();
    } else reveal(slug,i);
  }));
  const count=document.getElementById('count');
  if(count) count.textContent=`${heard} of 4 revealed`;
}
function reveal(slug,i){
  const p=getProgress();
  if((p[slug]||0)!==i)return;
  p[slug]=Math.min(4,i+1);
  saveProgress(p);
  renderCategory(slug);
}
function initConfirm(slug){
  const dlg=document.getElementById('confirm');
  if(!dlg)return;
  document.getElementById('cancel').onclick=()=>dlg.close();
  document.getElementById('confirmReveal').onclick=()=>{
    const i=Number(dlg.dataset.index); dlg.close(); reveal(slug,i);
  };
}
function fillProgress(){
  document.querySelectorAll('[data-progress]').forEach(el=>el.textContent=progressText(el.dataset.progress));
}
