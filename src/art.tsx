import {useMemo} from 'react';
/** Original vector ornaments: rose, sprig, wax seal, torn edge, venue drawing, schematic map. */
export const Rose=({x=0,y=0,s=1}:{x?:number;y?:number;s?:number})=>(
 <g transform={`translate(${x} ${y}) scale(${s})`} fill="currentColor" stroke="rgba(0,0,0,.25)" strokeWidth=".6">
  {[0,1,2,3,4].map(i=><ellipse key={i} cx="0" cy="-9" rx="9" ry="12" transform={`rotate(${i*72})`} opacity=".92"/>)}
  {[0,1,2].map(i=><ellipse key={'b'+i} cx="0" cy="-5" rx="6" ry="8" transform={`rotate(${i*120+30})`} opacity=".85"/>)}
  <circle r="3.2" opacity=".7"/>
 </g>);
const Leaf=({x,y,r,s=1}:{x:number;y:number;r:number;s?:number})=><path d="M0 0C7-8 17-8 24 0C17 8 7 8 0 0Z" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill="currentColor" opacity=".8"/>;
export const Sprig=({flip=false,className=''}:{flip?:boolean;className?:string})=>(
 <svg className={className} viewBox="0 0 130 230" aria-hidden="true" style={flip?{transform:'scaleX(-1)'}:undefined}>
  <path d="M20 225C30 160 70 120 62 70C58 45 70 25 88 12" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".8"/>
  <Leaf x={30} y={190} r={-30}/><Leaf x={40} y={150} r={-60} s={1.1}/><Leaf x={56} y={110} r={20}/><Leaf x={60} y={85} r={-70}/><Leaf x={70} y={42} r={-20} s={.9}/>
  <Rose x={78} y={170} s={1.5}/><Rose x={52} y={128} s={1.1}/><Rose x={84} y={30} s={.9}/>
 </svg>);
export function Seal({text,tone='cream',size=108}:{text:string;tone?:'cream'|'red';size?:number}){
 const d=useMemo(()=>Array.from({length:97},(_,i)=>{const a=i/96*Math.PI*2,r=44+2.6*Math.sin(a*11)+1.2*Math.sin(a*5);return`${i?'L':'M'}${(50+r*Math.cos(a)).toFixed(1)} ${(50+r*Math.sin(a)).toFixed(1)}`}).join('')+'Z',[]);
 const c=tone==='cream'?['#fbe9e0','#e6c3b0','#a9765a','#8a5a46']:['#a8283e','#6e1424','#3a0a14','#e9a9b2'];
 const id='g'+tone;
 return <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
  <defs><radialGradient id={id} cx=".35" cy=".3" r=".9"><stop offset="0" stopColor={c[0]}/><stop offset=".7" stopColor={c[1]}/><stop offset="1" stopColor={c[2]}/></radialGradient></defs>
  <path d={d} fill={`url(#${id})`} style={{filter:'drop-shadow(0 3px 4px rgba(0,0,0,.45))'}}/>
  <circle cx="50" cy="50" r="31" fill="none" stroke={c[3]} strokeWidth="1.2" opacity=".6"/>
  <text x="50" y="58" textAnchor="middle" fontFamily="var(--script)" fontSize={text.length>4?20:27} fill={c[3]} opacity=".85">{text}</text></svg>;
}
export function Torn(){
 const d=useMemo(()=>{let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;let p='M0 18';for(let x=0;x<=440;x+=11)p+=`L${x} ${(3+r()*11).toFixed(1)}`;return p+'L440 18Z'},[]);
 return <svg className="torn" viewBox="0 0 440 18" preserveAspectRatio="none" aria-hidden="true"><path d={d}/></svg>;
}
export const VenueArt=()=>(
 <svg viewBox="0 0 300 130" aria-hidden="true" fill="none" stroke="var(--rose)" strokeWidth="1.2" className="venue-art">
  <path d="M30 118H270M40 118V52H260V118M34 52L60 36H240L266 52M60 36V52M240 36V52"/>
  {[0,1,2,3,4,5].map(i=><path key={i} d={`M${58+i*36} 118V92a12 12 0 0 1 24 0V118M${58+i*36} 74V68a12 12 0 0 1 24 0V74`}/>)}
  <path d="M130 36V22H170V36M150 22V12"/>
  {[16,284].map(x=><g key={x}><ellipse cx={x} cy="84" rx="7" ry="30"/><path d={`M${x} 114V118`}/></g>)}
 </svg>);
export const MapArt=({label}:{label:string})=>(
 <svg viewBox="0 0 300 170" role="img" aria-label={label} className="map-art">
  <rect width="300" height="170" fill="var(--champagne)"/>
  <path d="M190 0C210 40 260 60 300 70V170H170C200 120 170 60 150 0Z" fill="#cfd8d0" opacity=".7"/>
  <g stroke="var(--rose)" opacity=".55" fill="none" strokeWidth="6"><path d="M0 110L300 40"/><path d="M110 0L150 170"/></g>
  <g stroke="var(--rose)" opacity=".35" fill="none" strokeWidth="2.5"><path d="M0 60H110M0 150H140M60 0V110M220 100V170"/></g>
  <path d="M120 78c0-13 20-13 20 0c0 10-10 20-10 20s-10-10-10-20Z" fill="var(--burgundy)"/><circle cx="130" cy="77" r="3.5" fill="var(--champagne)"/>
 </svg>);
