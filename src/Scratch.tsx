import {useEffect,useRef} from 'react';
import {useReduced} from './lib';
interface P{label:string;value:string;open:boolean;onOpen:()=>void}
/** Rose-gold foil card. Real value always in the DOM; canvas is decoration + input. */
export function ScratchCard({label,value,open,onOpen}:P){
 const cv=useRef<HTMLCanvasElement>(null),down=useRef(false),last=useRef(0),rm=useReduced();
 useEffect(()=>{
  const c=cv.current!,r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);c.width=r.width*d;c.height=r.height*d;
  const x=c.getContext('2d')!,g=x.createLinearGradient(0,0,c.width,c.height);
  g.addColorStop(0,'#E8BE9A');g.addColorStop(.45,'#C98F6B');g.addColorStop(.7,'#DDAA85');g.addColorStop(1,'#B27B58');
  x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
  x.strokeStyle='rgba(255,240,225,.28)';x.lineWidth=1;for(let i=-c.height;i<c.width;i+=7*d){x.beginPath();x.moveTo(i,0);x.lineTo(i+c.height,c.height);x.stroke()}
  x.strokeStyle='rgba(74,20,32,.45)';x.lineWidth=1.2*d;x.strokeRect(8*d,8*d,c.width-16*d,c.height-16*d);
  x.fillStyle='rgba(74,20,32,.7)';x.font=`${12*d}px Cormorant Garamond, Georgia, serif`;x.textAlign='center';x.fillText(label.split('').join(' '),c.width/2,c.height/2+4*d);
 },[]);
 const cleared=()=>{const c=cv.current!,x=c.getContext('2d')!,a=x.getImageData(0,0,c.width,c.height).data;let t=0,n=0;for(let i=3;i<a.length;i+=16){n++;if(a[i]<40)t++}return t/n};
 const scratch=(e:React.PointerEvent)=>{
  if(!down.current||open)return;const c=cv.current!,r=c.getBoundingClientRect(),k=c.width/r.width,x=c.getContext('2d')!;
  x.globalCompositeOperation='destination-out';x.beginPath();x.arc((e.clientX-r.left)*k,(e.clientY-r.top)*k,16*k,0,7);x.fill();
  const n=performance.now();if(n-last.current>120){last.current=n;if(cleared()>.55)onOpen()}
 };
 const key=(e:React.KeyboardEvent)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onOpen()}};
 return <div className={'card'+(open?' open':'')} role="button" tabIndex={0} aria-label={`${label}: ${value}. Press Enter to reveal.`} onKeyDown={key}
  onPointerDown={e=>{down.current=true;(e.target as Element).setPointerCapture?.(e.pointerId);if(rm)onOpen();else scratch(e)}} onPointerMove={scratch} onPointerUp={()=>down.current=false} onPointerCancel={()=>down.current=false}>
  <span className="v">{value}</span><canvas ref={cv} aria-hidden="true"/>
 </div>;
}
