// Smooth scroll + history handling between `#home` and `#projects`
document.addEventListener('DOMContentLoaded', ()=>{
  const container = document.querySelector('.viewport');
  const panels = Array.from(document.querySelectorAll('.card'));
  const links = document.querySelectorAll('[data-link]');

  // Detect base path (for GitHub Pages subdirectory support)
  const basePath = window.location.pathname.includes('/web') ? '/web' : '';

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
      scrollToPanel(idx, true);
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

  // Touch/swipe navigation for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      const visibleIndex = Math.round(container.scrollLeft / container.clientWidth);
      if (diff > 0) {
        // Swiped left - go right
        const next = Math.min(visibleIndex + 1, panels.length - 1);
        scrollToPanel(next, true);
      } else {
        // Swiped right - go left
        const prev = Math.max(visibleIndex - 1, 0);
        scrollToPanel(prev, true);
      }
    }
  }, false);

  // mouse wheel horizontal navigation
  let wheelTimeout;
  let accumulatedScroll = 0;

  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    accumulatedScroll += e.deltaY;
    
    // Change page if accumulated scroll exceeds threshold
    if (Math.abs(accumulatedScroll) > 150) {
      const visibleIndex = Math.round(container.scrollLeft / container.clientWidth);
      if (accumulatedScroll > 0) {
        const next = Math.min(visibleIndex + 1, panels.length - 1);
        scrollToPanel(next, true);
      } else {
        const prev = Math.max(visibleIndex - 1, 0);
        scrollToPanel(prev, true);
      }
      accumulatedScroll = 0;
    }
  }, { passive: false });

  // On load: set initial state according to path
  if(location.pathname.includes('/projects')){
    history.replaceState({page:'projects'}, '', basePath + '/projects');
    container.scrollTo({left: panels[1].offsetLeft, behavior:'auto'});
  } else {
    history.replaceState({page:'home'}, '', basePath + '/');
    container.scrollTo({left: panels[0].offsetLeft, behavior:'auto'});
  }
});
