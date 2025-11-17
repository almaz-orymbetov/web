// Smooth scroll + history handling between `#home` and `#projects`
document.addEventListener('DOMContentLoaded', ()=>{
  const container = document.querySelector('.viewport');
  const panels = Array.from(document.querySelectorAll('.card'));
  const links = document.querySelectorAll('[data-link]');

  function scrollToPanel(index, push=true){
    const panel = panels[index];
    if(!panel) return;
    const left = panel.offsetLeft;
    container.scrollTo({left, behavior:'smooth'});
    if(push){
      const url = index === 0 ? '/' : '/projects';
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
    const state = (e.state && e.state.page) || (location.pathname === '/projects' ? 'projects' : 'home');
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

  // On load: set initial state according to path
  if(location.pathname === '/projects'){
    history.replaceState({page:'projects'}, '', '/projects');
    container.scrollTo({left: panels[1].offsetLeft, behavior:'auto'});
  } else {
    history.replaceState({page:'home'}, '', '/');
    container.scrollTo({left: panels[0].offsetLeft, behavior:'auto'});
  }
});
