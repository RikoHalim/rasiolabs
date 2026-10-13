export function packageVolume(length,width,height,quantity){
 const values=[length,width,height,quantity].map(Number);
 if(values.some(v=>!Number.isFinite(v)||v<=0)||!Number.isInteger(values[3]))throw new Error('Enter positive dimensions and a whole number of packages.');
 if(values.slice(0,3).some(v=>v>1200)||values[3]>100000)throw new Error('Check the package dimensions and quantity.');
 return values[0]*values[1]*values[2]*values[3]/1000000;
}
export function enquiryDestination(number,email,subject,message){
 const digits=String(number||'').replace(/\D/g,'');
 if(/^\d{8,15}$/.test(digits))return {label:'Send via WhatsApp',href:'https://wa.me/'+digits+'?text='+encodeURIComponent(subject+'\n\n'+message)};
 if(/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email||''))return {label:'Send by email',href:'mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message)};
 return null;
}
export function validStay(arrival,departure){
 const calendarDate=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+'T00:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;};
 return calendarDate(arrival)&&calendarDate(departure)&&departure>arrival;
}
