// Smooth scroll + history handling between `#home` and `#projects`
document.addEventListener('DOMContentLoaded', ()=>{
  const links = document.querySelectorAll('[data-link]');
  const sections = {
    home: document.getElementById('home'),
    projects: document.getElementById('projects')
  };

  function showSection(name, push=true){
    const el = sections[name];
    if(!el) return;
    el.scrollIntoView({behavior:'smooth', block:'center'});
    if(push){
      const url = name === 'home' ? '/' : '/projects';
      history.pushState({page:name}, '', url);
    }
  }

  links.forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const name = a.dataset.link;
      showSection(name);
    });
  });

  // Handle back/forward navigation
  window.addEventListener('popstate', (e)=>{
    const state = (e.state && e.state.page) || (location.pathname === '/projects' ? 'projects' : 'home');
    const el = sections[state] || sections.home;
    el.scrollIntoView({behavior:'smooth', block:'center'});
  });

  // On load, if URL is /projects, scroll to projects
  if(location.pathname === '/projects'){
    // replace state so popstate works predictably
    history.replaceState({page:'projects'}, '', '/projects');
    sections.projects.scrollIntoView({behavior:'auto', block:'center'});
  } else {
    history.replaceState({page:'home'}, '', '/');
  }
});
