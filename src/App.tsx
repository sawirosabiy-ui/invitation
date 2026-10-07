import {useEffect,useState} from 'react';
import {Envelope} from './Envelope';import {REGISTRY} from './Scenes';import {pick} from './invitations';
const inv=pick();
export default function App(){
 const [opened,setOpened]=useState(false);
 useEffect(()=>{document.documentElement.dataset.theme=inv.theme;document.title=`${inv.couple.a.name} & ${inv.couple.b.name}`;document.body.style.overflow=opened?'':'hidden';if(opened)scrollTo(0,0)},[opened]);
 return <main className="stage">{inv.scenes.map(s=>{const C=REGISTRY[s];return C?<C key={s} inv={inv}/>:null})}
  <Envelope mono={inv.couple.monogram} onOpened={()=>setOpened(true)}/></main>;
}
