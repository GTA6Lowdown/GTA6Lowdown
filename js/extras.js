/* GTA 6 Lowdown: extras shared by every page (saved dark mode, video players, floating phone). 16 Nov 2026 */
(function(){
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

  // keep the lamp setting on pages without the lamp switch (the articles)
  if(store('lowdown-theme')==='dark')document.documentElement.setAttribute('data-theme','dark');

  // video players: a thumbnail that turns into the YouTube player on click
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('button.yt');if(!b||b.querySelector('iframe'))return;
    var f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+b.getAttribute('data-id')+'?autoplay=1&rel=0';
    f.title=b.getAttribute('data-title')||'YouTube video';
    f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';f.allowFullscreen=true;
    b.innerHTML='';b.appendChild(f);
  });

  // floating phone button: drag it anywhere, tap it to open the phone
  var REELS=['DfyVwRbJ1ir','DfyIGh1J8KU','Dfx9z_0J77I','Dfxsm4AJCZa','Dfxe3EjJo2N','DfxRKqgphYN','DfvxA_Fp5kK','DfvjQcTp98P','DfvZCASprAD','DfvH2kcp0CU','Dfu6F_6pdAJ','DfusZTjpvOD'];
  var fab=document.createElement('button');fab.type='button';fab.className='phonefab';fab.setAttribute('aria-label','Open or close the Lowdown phone: swipe through our short clips. Drag to move.');
  fab.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="1.5" width="13" height="21" rx="3.6" fill="#3db52a"/><rect x="7" y="3" width="10" height="18" rx="2.4" fill="#111"/><rect x="8" y="5.2" width="8" height="12" rx=".8" fill="#0f5d0c"/><circle cx="12" cy="19.3" r=".8" fill="#7cdc5a"/></svg><span class="dot"></span>';
  document.body.appendChild(fab);
  var BASE=/\/articles\//.test(location.pathname)?'../':'';
  var W='#fff',S='stroke="'+W+'" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  var APPS=[
    {k:'clips',l:'Clips',c:'#e28202',g:'<rect x="7" y="3" width="10" height="18" rx="2" '+S+'/><path d="M10.5 9.5v5l4-2.5z" fill="'+W+'"/>'},
    {k:'news.html',l:'News',c:'#1b8a8a',g:'<rect x="3" y="5" width="18" height="14" rx="2" '+S+'/><path d="M6 9h8M6 12h12M6 15h12" '+S+'/>'},
    {k:'tips.html',l:'Tips',c:'#d6a21a',g:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" '+S+'/>'},
    {k:'guides.html',l:'Guides',c:'#2f6fd0',g:'<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z M12 6v14" '+S+'/>'},
    {k:'leonida.html',l:'Map',c:'#7a3fb3',g:'<path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z" '+S+'/><circle cx="12" cy="10" r="2.2" fill="'+W+'"/>'},
    {k:'games.html',l:'Games',c:'#c8372d',g:'<rect x="3" y="8" width="18" height="10" rx="5" '+S+'/><path d="M8 11v4M6 13h4" '+S+'/><circle cx="15.5" cy="12" r="1.2" fill="'+W+'"/><circle cx="17.5" cy="14.5" r="1.2" fill="'+W+'"/>'},
    {k:'cheats.html',l:'Cheats',c:'#4d5458',g:'<path d="M7 4h10v16H7z" '+S+'/><path d="M9.5 8h1M13.5 8h1M9.5 11.5h1M13.5 11.5h1M9.5 15h1M13.5 15h1" '+S+'/>'},
    {k:'old-games.html',l:'Old games',c:'#8a5a2b',g:'<path d="M8 4h8v4a4 4 0 0 1-8 0zM6 5H4a3 3 0 0 0 3 4M18 5h2a3 3 0 0 1-3 4M12 12v4M9 20h6M10 16h4v4h-4z" '+S+'/>'},
    {k:'videos.html',l:'Videos',c:'#c2306f',g:'<rect x="3" y="5" width="18" height="12" rx="2" '+S+'/><path d="M10 8.5v5l4.5-2.5z" fill="'+W+'"/><path d="M8 20h8" '+S+'/>'}];
  var KEY=function(p){return '<svg viewBox="0 0 24 24">'+p+'</svg>'};
  // the phone sits beside the page (not over it), so it can stay open while people browse.
  // Its state (open or closed, Clips or Apps, which clip) is saved and restored on every page.
  var phone=document.createElement('div');phone.className='lphone';phone.hidden=true;phone.setAttribute('role','region');phone.setAttribute('aria-label','Lowdown phone');
  phone.innerHTML='<div class="lp-frame"><button type="button" class="lp-x" aria-label="Close the phone">&#10005;</button><div class="lp-face"><div class="lp-brand">gta6<span>LOWDOWN</span></div><div class="lp-screen">'+
    '<div class="lp-status"><span><span class="bat"></span><span class="day"></span></span><span class="clock"></span><span class="sig"><i style="height:4px"></i><i style="height:7px"></i><i style="height:10px"></i><i style="height:12px"></i></span></div>'+
    '<div class="lp-title"><button type="button" class="lp-back" aria-label="Back to the app menu">&#9664; Apps</button><span class="lp-name">Clips</span></div>'+
    '<div class="lp-body"><div class="lp-grid">'+APPS.map(function(a){return '<a class="lp-app" '+(a.k==='clips'?'href="#" data-clips="1"':'href="'+BASE+a.k+'"')+' style="--c:'+a.c+'"><span class="ic"><svg viewBox="0 0 24 24">'+a.g+'</svg></span>'+a.l+'</a>'}).join('')+'</div>'+
    '<div class="lp-feed" tabindex="0"></div></div>'+
    '<div class="lp-select"></div></div>'+
    '<div class="lp-keys">'+
      '<a href="'+BASE+'index.html" aria-label="Site home page">'+KEY('<path d="M4 11l8-7 8 7v9h-5v-6h-6v6H4z" fill="#fff"/>')+'</a>'+
      '<button type="button" data-key="apps" aria-label="App menu">'+KEY('<path d="M5 7h14M5 12h14M5 17h14" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>')+'</button>'+
      '<a href="'+BASE+'guides.html" aria-label="Guides">'+KEY('<circle cx="10.5" cy="10.5" r="6" stroke="#fff" stroke-width="2.4" fill="none"/><path d="M15 15l5 5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>')+'</a>'+
      '<button type="button" data-key="back" aria-label="Back">'+KEY('<path d="M20 12H5M11 6l-6 6 6 6" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')+'</button>'+
    '</div></div></div>';
  document.body.appendChild(phone);
  var feed=phone.querySelector('.lp-feed'),nameEl=phone.querySelector('.lp-name'),backBtn=phone.querySelector('.lp-back'),hint=phone.querySelector('.lp-select'),built=false;
  var st={open:false,view:'clips',clip:0};try{var s0=JSON.parse(store('lowdown-phone')||'null');if(s0)st=s0}catch(e){}
  function save(){store('lowdown-phone',JSON.stringify(st))}
  function build(){if(built)return;built=true;REELS.forEach(function(id,i){
    var s=document.createElement('div');s.className='lp-slide';
    s.innerHTML='<div class="lp-media"><iframe loading="lazy" src="https://www.instagram.com/reel/'+id+'/embed" title="GTA 6 Lowdown clip '+(i+1)+'" scrolling="no" allowfullscreen></iframe></div>';
    feed.appendChild(s);});fit()}
  // Instagram's player shows a 9:16 clip inside a 4:5 box under a 54px header: size the frame so the clip fills the screen
  function fit(){var m=feed.querySelector('.lp-media');if(!m||feed.hidden)return;var h=m.clientHeight,w=m.clientWidth,wi=Math.round(h*0.8);
    feed.querySelectorAll('.lp-media iframe').forEach(function(f){f.style.width=wi+'px';f.style.left=Math.round((w-wi)/2)+'px';f.style.height=(h+400)+'px'})}
  addEventListener('resize',fit);
  function clock(){var d=new Date();phone.querySelector('.clock').textContent=(d.getHours()<10?'0':'')+d.getHours()+':'+(d.getMinutes()<10?'0':'')+d.getMinutes();
    phone.querySelector('.day').textContent=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]}
  function label(){nameEl.textContent='Clip '+(st.clip+1)+' of '+REELS.length}
  function showApps(){st.view='apps';save();feed.hidden=true;backBtn.hidden=true;nameEl.textContent='Apps';hint.textContent='Tap an app to open it'}
  function showClips(){st.view='clips';save();build();feed.hidden=false;backBtn.hidden=false;label();hint.innerHTML='&#9664; Apps takes you to the menu';
    requestAnimationFrame(function(){fit();feed.scrollTop=st.clip*feed.clientHeight})}
  var sv;feed.addEventListener('scroll',function(){clearTimeout(sv);sv=setTimeout(function(){var i=Math.round(feed.scrollTop/Math.max(1,feed.clientHeight));if(i!==st.clip){st.clip=Math.max(0,Math.min(REELS.length-1,i));save();label()}},120)});
  function open(){clock();phone.hidden=false;st.open=true;save();fab.classList.add('on');if(st.view==='apps')showApps();else showClips()}
  function close(){phone.hidden=true;st.open=false;save();fab.classList.remove('on')}
  phone.querySelector('.lp-x').addEventListener('click',function(){close();fab.focus()});
  backBtn.addEventListener('click',showApps);
  phone.querySelector('[data-clips]').addEventListener('click',function(e){e.preventDefault();showClips()});
  phone.querySelector('[data-key="apps"]').addEventListener('click',showApps);
  phone.querySelector('[data-key="back"]').addEventListener('click',function(){if(st.view==='clips')showApps();else showClips()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!phone.hidden)close()});
  setInterval(function(){if(!phone.hidden)clock()},30000);
  if(st.open)open();

  var pos=null;try{pos=JSON.parse(store('lowdown-fab')||'null')}catch(e){}
  function place(x,y){var w=fab.offsetWidth,h=fab.offsetHeight;x=Math.max(6,Math.min(innerWidth-w-6,x));y=Math.max(70,Math.min(innerHeight-h-6,y));
    fab.style.left=x+'px';fab.style.top=y+'px';return {x:x,y:y}}
  if(pos)place(pos.x,pos.y);
  addEventListener('resize',function(){var r=fab.getBoundingClientRect();place(r.left,r.top)});
  var sx,sy,ox,oy,moved=false,down=false;
  fab.addEventListener('pointerdown',function(e){down=true;moved=false;sx=e.clientX;sy=e.clientY;var r=fab.getBoundingClientRect();ox=r.left;oy=r.top;try{fab.setPointerCapture(e.pointerId)}catch(err){}});
  fab.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx,dy=e.clientY-sy;
    if(!moved&&Math.abs(dx)+Math.abs(dy)>6){moved=true;fab.classList.add('drag')}
    if(moved)place(ox+dx,oy+dy)});
  fab.addEventListener('pointerup',function(){if(!down)return;down=false;fab.classList.remove('drag');
    if(moved){var r=fab.getBoundingClientRect();store('lowdown-fab',JSON.stringify({x:r.left,y:r.top}))}else{phone.hidden?open():close()}});
  fab.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();phone.hidden?open():close()}});
})();
