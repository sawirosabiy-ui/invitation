import {useState} from 'react';
import {Sprig,Seal} from './art';
import {useReduced} from './lib';
export function Envelope({mono,onOpened,onStartOpen}:{mono:string;onOpened:()=>void;onStartOpen?:()=>void}){
 const [s,set]=useState<'idle'|'press'|'open'|'fade'|'gone'>('idle'),rm=useReduced();
 const go=()=>{if(s!=='idle')return;navigator.vibrate?.(10);onStartOpen?.();
  if(rm){set('fade');onOpened();setTimeout(()=>set('gone'),500);return}
  set('press');setTimeout(()=>set('open'),900);setTimeout(()=>{set('fade');onOpened()},3700);setTimeout(()=>set('gone'),4900)};
 if(s==='gone')return null;
 const fl=<><Sprig className="sp l"/><Sprig className="sp r" flip/><Sprig className="sp bl"/><Sprig className="sp br" flip/></>;
 return <div className="env" data-s={s} aria-label="Sealed invitation envelope">
  <div className="env-base"><div className="emb" aria-hidden="true">{fl}</div><div className="foil" aria-hidden="true">{fl}</div>
   <svg className="folds" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0L50 47L100 0M0 100L50 53L100 100" fill="none" stroke="var(--rose)" strokeWidth=".25" vectorEffect="non-scaling-stroke"/></svg></div>
  <div className="light" aria-hidden="true"/>
  <div className="flap"><div className="ff"/><div className="fb"/></div>
  <button className="seal-btn" onClick={go} aria-label="Break the seal to open the invitation"><Seal text={mono} broken={s!=='idle'}/></button>
  <p className="hint">Touch the seal</p>
 </div>;
}
