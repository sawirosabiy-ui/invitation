import {useEffect,useRef,useState,RefObject} from 'react';
import type {Invitation} from './types';
export const useReduced=()=>typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Epoch ms of a wall-clock ISO time in an IANA timezone. */
export function epochFor(iso:string,tz:string){
 const m=iso.match(/\d+/g)!.map(Number);const u=Date.UTC(m[0],m[1]-1,m[2],m[3]||0,m[4]||0,m[5]||0);
 const off=(t:number)=>{const p:any=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).formatToParts(new Date(t)).map(x=>[x.type,+x.value]));return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-t};
 let t=u-off(u);t=u-off(t);return t;
}
export function dateParts(iso:string){
 const [y,mo,d]=iso.match(/\d+/g)!.map(Number);
 return {day:String(d),month:new Date(Date.UTC(y,mo-1,d)).toLocaleString('en-US',{month:'long',timeZone:'UTC'}),year:String(y)};
}
export function useCountdown(target:number){
 const calc=()=>Math.max(0,target-Date.now());const [ms,set]=useState(calc);
 useEffect(()=>{const tick=()=>{if(!document.hidden)set(calc())};const id=setInterval(tick,1000);document.addEventListener('visibilitychange',tick);tick();return()=>{clearInterval(id);document.removeEventListener('visibilitychange',tick)}},[target]);
 const s=Math.floor(ms/1000);return {Days:Math.floor(s/86400),Hours:Math.floor(s/3600)%24,Minutes:Math.floor(s/60)%60,Seconds:s%60,done:ms===0};
}
export function useScrollProgress(ref:RefObject<HTMLElement|null>){
 const [p,set]=useState(0);
 useEffect(()=>{let raf=0;const f=()=>{raf=0;const r=ref.current?.getBoundingClientRect();if(!r)return;const v=(innerHeight*.55-r.top)/r.height;set(Math.round(Math.min(1,Math.max(0,v))*1000)/1000)};
  const on=()=>{if(!raf)raf=requestAnimationFrame(f)};addEventListener('scroll',on,{passive:true});addEventListener('resize',on);f();return()=>{removeEventListener('scroll',on);removeEventListener('resize',on)}},[]);
 return p;
}
export const mapsUrl=(i:Invitation)=>`https://www.google.com/maps/search/?api=1&query=${i.venue.lat},${i.venue.lng}`;
export function icsUrl(i:Invitation){
 const m=i.date.iso.match(/\d+/g)!;const s=`${m[0]}${m[1]}${m[2]}T${m[3]||'00'}${m[4]||'00'}00`;
 const e=`${m[0]}${m[1]}${m[2]}T${String(Math.min(23,+(m[3]||0)+4)).padStart(2,'0')}${m[4]||'00'}00`;
 const t=`DTSTART;TZID=${i.date.timezone}:${s}`;
 const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//invitation//EN','BEGIN:VEVENT',`UID:${i.slug}@invitation`,`DTSTAMP:${s}`,t,`DTEND;TZID=${i.date.timezone}:${e}`,`SUMMARY:${i.couple.a.name} & ${i.couple.b.name}`,`LOCATION:${i.venue.name}\\, ${i.venue.address}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
 return 'data:text/calendar;charset=utf8,'+encodeURIComponent(body);
}
export function useReveal(){
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('in');io.disconnect()}},{threshold:.15});io.observe(el);return()=>io.disconnect()},[]);
 return ref;
}
