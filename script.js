// Smooth scroll + history handling between `#home` and `#projects`
document.addEventListener('DOMContentLoaded', ()=>{
  const container = document.querySelector('.viewport');
  const panels = Array.from(document.querySelectorAll('.card'));
  const links = document.querySelectorAll('[data-link]');

  // Detect base path (for GitHub Pages subdirectory support)
const basePath = window.location.pathname.replace(/\/(projects)?\/?$/, '');
    ? '/web' 
    : '';

  function scrollToPanel(index, push=true){
    const panel = panels[index];
    if(!panel) return;
    const left = panel.offsetLeft;
    container.scrollTo({left, behavior:'smooth'});
    if(push){
      const url = index === 0 ? basePath + '/' : basePath + '/projects';
      history.pushState({page:index===0?'home':'projects'}, '', url);
    }
  }

  // link clicks (data-link attributes should contain 'home' or 'projects')
  links.forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const name = a.dataset.link;
      const idx = name === 'projects' ? 1 : 0;
      scrollToPanel(idx);
    });
  });

  // handle popstate
  window.addEventListener('popstate', (e)=>{
    const pathname = location.pathname;
    const isProjects = pathname.includes('/projects');
    const state = (e.state && e.state.page) || (isProjects ? 'projects' : 'home');
    const idx = state === 'projects' ? 1 : 0;
    const panel = panels[idx] || panels[0];
    container.scrollTo({left: panel.offsetLeft, behavior:'smooth'});
  });

  // keyboard navigation: left/right
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight'){
      const visibleIndex = Math.round(container.scrollLeft / container.clientWidth);
      const next = Math.min(visibleIndex+1, panels.length-1);
      scrollToPanel(next);
    } else if(e.key === 'ArrowLeft'){
      const visibleIndex = Math.round(container.scrollLeft / container.clientWidth);
      const prev = Math.max(visibleIndex-1, 0);
      scrollToPanel(prev);
    }
  });

  // mouse wheel horizontal navigation
let wheelTimeout;

container.addEventListener('wheel', (e) => {
  e.preventDefault();
  container.scrollLeft += e.deltaY;

  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    const visibleIndex = Math.round(container.scrollLeft / container.clientWidth);
    scrollToPanel(visibleIndex);
  }, 120);
}, { passive: false });

  // On load: set initial state according to path
  if(location.pathname.includes('/projects')){
    history.replaceState({page:'projects'}, '', basePath + '/projects');
    container.scrollTo({left: panels[1].offsetLeft, behavior:'auto'});
  } else {
    history.replaceState({page:'home'}, '', basePath + '/web');
    container.scrollTo({left: panels[0].offsetLeft, behavior:'auto'});
  }
});
