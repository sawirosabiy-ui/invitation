import a from './tsion-yonatan.json';import b from './selam-daniel.json';import type {Invitation} from '../types';
const all=[a,b] as unknown as Invitation[];
export function pick():Invitation{
 const s=new URLSearchParams(location.search).get('i')||location.pathname.split('/').filter(Boolean).pop();
 return all.find(x=>x.slug===s)||all[0];
}
