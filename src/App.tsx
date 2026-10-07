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
 return <main className="stage">{inv.scenes.map(s=>{const C=REGISTRY[s];return C?<C key={s} inv={inv}/>:null})}
  {opened&&inv.music?.src&&<button type="button" className="audio-btn" onClick={toggleMusic} aria-label={playing?"Pause music":"Play background music"} title={inv.music.title||"Music"}>
   {playing?<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>:<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>}
  </button>}
  <Envelope mono={inv.couple.monogram} onOpened={()=>setOpened(true)}/></main>;
}
