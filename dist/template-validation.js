(() => {
  let sequence=0;
  const controls=form=>[...form.querySelectorAll('input,select,textarea')].filter(input=>!input.disabled&&input.type!=='hidden'&&(!['checkbox','radio'].includes(input.type)||input.required));
  const message=input=>{
    const v=input.validity;
    if(v.customError)return input.validationMessage;
    if(v.valueMissing)return 'Complete this field.';
    if(v.typeMismatch)return input.type==='email'?'Enter a valid email address.':'Check this value.';
    if(v.badInput)return 'Enter a number.';
    if(v.rangeUnderflow)return input.type==='date'?'Choose a date on or after '+input.min+'.':'Use a value of at least '+input.min+'.';
    if(v.rangeOverflow)return 'Use a value no greater than '+input.max+'.';
    if(v.stepMismatch)return input.step==='1'?'Enter a whole number.':'Check the value increment.';
    if(v.tooLong)return 'Shorten this entry.';
    if(v.patternMismatch)return 'Check the format.';
    return v.valid?'':'Check this field.';
  };
  const render=input=>{
    const text=message(input),error=document.getElementById(input.dataset.errorId);
    input.setAttribute('aria-invalid',String(Boolean(text)));
    if(error)error.textContent=text;
    return !text;
  };
  const initialize=form=>{
    if(form.dataset.validationReady)return;
    form.dataset.validationReady='true';form.noValidate=true;
    for(const input of controls(form)){
      const error=document.createElement('span');error.className='template-field-error';error.id='template-error-'+(++sequence);input.dataset.errorId=error.id;
      input.setAttribute('aria-describedby',[input.getAttribute('aria-describedby'),error.id].filter(Boolean).join(' '));
      input.closest('label')?.append(error);
      input.addEventListener('input',()=>{if(input.getAttribute('aria-invalid')==='true')render(input);});
      input.addEventListener('change',()=>{if(input.getAttribute('aria-invalid')==='true')render(input);});
    }
  };
  const validate=form=>{
    initialize(form);let first;
    for(const input of controls(form))if(!render(input)&&!first)first=input;
    if(first){first.focus();return false;}
    return true;
  };
  window.RasioTemplateForms={initialize,validate};
  document.querySelectorAll('[data-enquiry],[data-business-enquiry],[data-volume-calculator],[data-prep-builder]').forEach(initialize);
  const textareas=[...document.querySelectorAll('[data-enquiry] textarea,[data-business-enquiry] textarea,[data-prep-builder] textarea')];
  const fit=input=>{
    if(!input.scrollHeight||!input.style)return;
    const minimum=Number(input.dataset.autosizeMin)||input.offsetHeight||144;
    input.dataset.autosizeMin=String(minimum);
    const maximum=Math.max(minimum,Math.round(window.innerHeight*.65)||500);
    input.style.height='auto';
    input.style.height=Math.min(maximum,Math.max(minimum,input.scrollHeight))+'px';
    input.style.overflowY=input.scrollHeight>maximum?'auto':'hidden';
  };
  textareas.forEach(input=>input.addEventListener('input',()=>fit(input)));
  document.addEventListener('DOMContentLoaded',()=>textareas.forEach(fit));
})();
