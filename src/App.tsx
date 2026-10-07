import {useEffect,useRef,useState} from 'react';
import {Envelope} from './Envelope';import {REGISTRY} from './Scenes';import {pick} from './invitations';
const inv=pick();
export default function App(){
 const [opened,setOpened]=useState(false);
 const [playing,setPlaying]=useState(false);
 const audioRef=useRef<HTMLAudioElement|null>(null);
 useEffect(()=>{document.documentElement.dataset.theme=inv.theme;document.title=`${inv.couple.a.name} & ${inv.couple.b.name}`;document.body.style.overflow=opened?'':'hidden';if(opened)scrollTo(0,0)},[opened]);
 const toggleMusic=()=>{
  if(!audioRef.current&&inv.music?.src){audioRef.current=new Audio(inv.music.src);audioRef.current.loop=true}
  if(!audioRef.current)return;
  if(playing){audioRef.current.pause();setPlaying(false)}
  else{audioRef.current.play().then(()=>setPlaying(true)).catch(()=>{})}
 };
 const PETALS=Array.from({length:14},(_,i)=>({
  id:i,
  left:`${(i*7.1+4)%94}%`,
  delay:`${(i*0.45).toFixed(2)}s`,
  duration:`${(4.5+(i%5)*0.7).toFixed(2)}s`,
  size:18+(i%4)*4
 }));
 return <main className="stage">{inv.scenes.map(s=>{const C=REGISTRY[s];return C?<C key={s} inv={inv}/>:null})}
  {opened&&<div className="petals-shower" aria-hidden="true">
   {PETALS.map(p=>(
    <svg key={p.id} className="petal" viewBox="0 0 24 32" style={{left:p.left,animationDelay:p.delay,animationDuration:p.duration,width:p.size,height:p.size*1.3}}>
     <path d="M12 0 C19 8 24 18 19 28 C14 34 2 32 1 23 C0 14 6 5 12 0 Z"/>
    </svg>
   ))}
  </div>}
  {opened&&inv.music?.src&&<button type="button" className="audio-btn" onClick={toggleMusic} aria-label={playing?"Pause music":"Play background music"} title={inv.music.title||"Music"}>
   {playing?<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>:<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>}
  </button>}
  <Envelope mono={inv.couple.monogram} onOpened={()=>setOpened(true)}/></main>;
}
