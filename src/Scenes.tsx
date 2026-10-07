import {useEffect,useRef,useState,ReactNode} from 'react';
import type {Invitation} from './types';
import {Sprig,Seal,Torn,VenueArt,MapArt,Rose} from './art';
import {ScratchCard} from './Scratch';
import {dateParts,epochFor,useCountdown,useScrollProgress,useReveal,icsUrl,mapsUrl,useReduced} from './lib';

const Scene=({id,children,cls=''}:{id:string;children:ReactNode;cls?:string})=>{const r=useReveal();return <section id={id} ref={r} className={`scene rv ${cls}`}>{id!=='cover'&&<Torn/>}{children}</section>};
type P={inv:Invitation};
const names=(i:Invitation)=>[i.couple.a.name,i.couple.b.name];

function Cover({inv}:P){const [a,b]=names(inv),{day,month,year}=dateParts(inv.date.iso);
 return <Scene id="cover" cls="cover"><div className="arch" aria-hidden="true"><svg viewBox="0 0 300 520" preserveAspectRatio="none"><path d="M12 520V170C12 80 80 14 150 14S288 80 288 170V520M28 520V176C28 92 90 30 150 30S272 92 272 176V520" fill="none" stroke="var(--rose)" strokeWidth="1.2"/></svg></div>
  <Sprig className="sp bl"/><Sprig className="sp br" flip/>
  <p className="kick">{inv.copy.kicker}</p><p className="cdate">{day}.{month.slice(0,3)}.{year}</p>
  <h1 className="names"><span>{a}</span><i>&amp;</i><span>{b}</span></h1>
  <a className="scroll" href="#invite">Scroll down<b/></a></Scene>}
function Invite({inv}:P){const [a,b]=names(inv),f=[inv.couple.a,inv.couple.b].filter(p=>p.family?.length);
 return <Scene id="invite" cls="alt"><h2 className="script">{a} &amp; {b}</h2>
  <p className="body">{inv.copy.invite}</p>
  {f.length>0&&<p className="fam">{f.map(p=>`${p.name} ${p.family!.join(' ')}`).join(' · ')}</p>}</Scene>}
function DateReveal({inv}:P){const d=dateParts(inv.date.iso),[o,setO]=useState([false,false,false]),all=o.every(Boolean),rm=useReduced();
 useEffect(()=>{if(all&&!rm){const t=setTimeout(()=>document.getElementById('countdown')?.scrollIntoView({behavior:'smooth',block:'center'}),2200);return()=>clearTimeout(t)}},[all]);
 const op=(i:number)=>()=>setO(x=>x.map((v,j)=>j===i||v));
 return <Scene id="date"><h2 className="script">Save the date</h2><p className="body soft">Gently scratch each card to reveal when.</p>
  <div className="cards">{[['Day',d.day],['Month',d.month],['Year',d.year]].map(([l,v],i)=><ScratchCard key={l} label={l} value={v} open={o[i]} onOpen={op(i)}/>)}</div>
  {!all?<button className="link" onClick={()=>setO([true,true,true])}>Reveal all</button>:
  <div className="reveal-line" aria-live="polite"><p className="full">{d.day} · {d.month} · {d.year}</p><a className="btn" href={icsUrl(inv)} download={`${inv.slug}.ics`}>Add to calendar</a></div>}</Scene>}
function Countdown({inv}:P){const c=useCountdown(epochFor(inv.date.iso,inv.date.timezone));
 return <Scene id="countdown" cls="alt"><h2 className="script">The celebration begins in</h2>
  <div className="cd" role="timer" aria-label={`${c.Days} days ${c.Hours} hours ${c.Minutes} minutes ${c.Seconds} seconds`}>{(['Days','Hours','Minutes','Seconds'] as const).map(k=><div key={k}><b>{String(c[k]).padStart(2,'0')}</b><small>{k}</small></div>)}</div></Scene>}
function Schedule({inv}:P){const ref=useRef<HTMLOListElement>(null),p=useScrollProgress(ref),n=inv.schedule.length;
 const pos=n>1?((0.5+p*(n-1))/n)*100:50;
 return <Scene id="schedule"><h2 className="script">Schedule of events</h2>
  <ol className="tl" ref={ref}><span className="line" aria-hidden="true"/><svg className="rose-m" style={{top:`${pos}%`}} viewBox="-16 -22 32 32" aria-hidden="true"><g style={{color:'var(--burgundy)'}}><Rose s={.9}/></g></svg>
   {inv.schedule.map((s,i)=><li key={i} className={p>=i/(n-1||1)-0.1?'lit':''}><time>{s.time}</time><i aria-hidden="true"/><span>{s.title}</span></li>)}</ol></Scene>}
function Venue({inv}:P){const v=inv.venue,d=(m=>new Intl.DateTimeFormat('en-US',{dateStyle:'full',timeZone:'UTC'}).format(new Date(Date.UTC(m[0],m[1]-1,m[2]))))(inv.date.iso.match(/\d+/g)!.map(Number));
 const t=inv.date.iso.match(/T(\d\d):(\d\d)/)!;
 return <Scene id="venue" cls="alt"><h2 className="script">Location</h2><p className="vname">{v.name}</p><p className="body">{d} · {t[1]}:{t[2]}</p><p className="body soft">{v.address}</p>
  <VenueArt/><div className="map"><MapArt label={`Map showing ${v.name}`}/><a className="btn ghost" href={mapsUrl(inv)} target="_blank" rel="noopener">Open in Maps</a></div></Scene>}
function Rsvp({inv}:P){const [open,setOpen]=useState(false),[done,setDone]=useState<null|{name:string;yes:boolean}>(null),[note,setNote]=useState(false),[g,setG]=useState(1),[err,setErr]=useState(''),nm=useRef<HTMLInputElement>(null);
 useEffect(()=>{if(open)nm.current?.focus();const k=(e:KeyboardEvent)=>e.key==='Escape'&&setOpen(false);addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[open]);
 async function send(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget),body={slug:inv.slug,name:String(f.get('name')).trim(),attending:f.get('att')==='yes',guests:g,message:f.get('msg')||'',dietary:f.get('diet')||''};
  if(!body.name){setErr('Please tell us your name.');return}
  try{if(inv.rsvp.endpoint){const r=await fetch(inv.rsvp.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw 0}
   else localStorage.setItem('rsvp:'+inv.slug+':'+Date.now(),JSON.stringify(body));
   setOpen(false);setDone({name:body.name,yes:body.attending})}catch{setErr('Something went wrong. Your answer is still here — please try again.')}}
 return <Scene id="rsvp" cls="alt rsvp"><Sprig className="sp bl"/><Sprig className="sp br" flip/>
  {!done?<><h2 className="script">Confirm your attendance</h2><p className="body">{inv.copy.rsvpPrompt}</p>
   <button className="seal-btn rsvp-seal" onClick={()=>setOpen(true)} aria-haspopup="dialog" aria-label="RSVP — open the reply card"><Seal text="RSVP" tone="red" size={120}/></button><p className="hint dark">Click to open</p></>:
  <div aria-live="polite"><div className="stamp"><Seal text={inv.couple.monogram} tone="red" size={110}/></div>
   <h2 className="script">{done.yes?`Thank you, ${done.name}.`:`We will miss you, ${done.name}.`}</h2><p className="body">{done.yes?'Your reply has been received. We cannot wait to celebrate with you.':'Thank you for letting us know. You will be in our hearts.'}</p>
   <div className="actions"><a className="btn" href={icsUrl(inv)} download={`${inv.slug}.ics`}>Add to calendar</a><a className="btn ghost" href={mapsUrl(inv)} target="_blank" rel="noopener">Get directions</a></div></div>}
  <p className="script close">{inv.copy.closing}</p><p className="script small">{names(inv).join(' & ')}</p>
  {open&&<div className="back" onClick={()=>setOpen(false)}><form className="reply" role="dialog" aria-modal="true" aria-label="Reply card" onClick={e=>e.stopPropagation()} onSubmit={send}>
   <h3 className="script">Reply card</h3><label>Your name<input ref={nm} name="name" autoComplete="name" required/></label>
   <fieldset><legend>Will you be attending?</legend><label className="ch"><input type="radio" name="att" value="yes" defaultChecked/><span>Joyfully accepts</span></label><label className="ch"><input type="radio" name="att" value="no"/><span>Regretfully declines</span></label></fieldset>
   <div className="step"><span>Guests</span><button type="button" aria-label="Fewer guests" onClick={()=>setG(Math.max(1,g-1))}>−</button><output>{g}</output><button type="button" aria-label="More guests" onClick={()=>setG(Math.min(inv.rsvp.maxGuests,g+1))}>+</button></div>
   {!note?<button type="button" className="link" onClick={()=>setNote(true)}>Add a note or dietary information</button>:<><label>A note for the couple<textarea name="msg" rows={2}/></label><label>Dietary information<input name="diet"/></label></>}
   {err&&<p className="err" role="alert">{err}</p>}<button className="btn" type="submit">Send reply</button></form></div>}
 </Scene>}
export const REGISTRY:Record<string,(p:P)=>ReactNode>={cover:Cover,invite:Invite,date:DateReveal,countdown:Countdown,schedule:Schedule,venue:Venue,rsvp:Rsvp};
