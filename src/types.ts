export interface Person{name:string;family?:string[]}
export interface Invitation{
 slug:string;theme:string;
 couple:{a:Person;b:Person;monogram:string};
 copy:{kicker:string;invite:string;rsvpPrompt:string;closing:string};
 date:{iso:string;timezone:string};
 schedule:{time:string;title:string}[];
 venue:{name:string;address:string;lat:number;lng:number};
 rsvp:{enabled:boolean;maxGuests:number;endpoint?:string};
 scenes:string[];
}
