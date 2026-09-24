const menu = document.querySelector('.studio-menu');
const navigation = document.querySelector('.studio-nav');
function closeMenu() { menu.setAttribute('aria-label','Open navigation'); menu.setAttribute('aria-expanded','false'); navigation.classList.remove('is-open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); navigation.classList.toggle('is-open',open); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
const projectContent = {
  living:{title:'A place to slow down.',image:'/assets/architecture-living.jpg',alt:'Light-filled contemporary living room',description:'A study in natural light, comfortable proportions, and materials that feel good to live with. Open sightlines connect everyday activities, while a considered furniture layout gives each part of the room a purpose.'},
  detail:{title:'A fresh perspective.',image:'/assets/architecture-detail.jpg',alt:'Contemporary interior with natural light',description:'An exploration of how light and material can change the way a space feels. A restrained palette lets texture and proportion lead, creating room to focus, gather, and move comfortably.'}
};
const dialog=document.querySelector('.project-dialog');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
  const project=projectContent[button.dataset.project];
  document.querySelector('#project-title').textContent=project.title;
  const image=dialog.querySelector('[data-project-image]'); image.src=project.image; image.alt=project.alt;
  dialog.querySelector('[data-project-description]').textContent=project.description;
  dialog.showModal();
}));
dialog.querySelector('.project-close').addEventListener('click',()=>dialog.close());
dialog.querySelector('[data-project-contact]').addEventListener('click',()=>dialog.close());
