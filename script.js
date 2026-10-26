// Jahid Jamal portfolio — frontend-only interactions
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const progress = $('#scrollProgress');
function updateScrollProgress(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener('scroll', updateScrollProgress, {passive:true});
updateScrollProgress();

// Scroll reveal, with staggered timing for a more deliberate entrance.
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if(entry.isIntersecting){
      entry.target.style.transitionDelay = `${Math.min(index * 65, 260)}ms`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.12});
$$('.reveal').forEach(el => observer.observe(el));

// Accessible, touch-friendly mobile navigation.
const menuButton = $('#menuToggle');
const navMenu = $('.nav-links');
if (menuButton && navMenu) {
  menuButton.setAttribute('aria-controls', 'primary-navigation');
  menuButton.setAttribute('aria-expanded', 'false');
  const setMenuOpen = open => {
    navMenu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    menuButton.textContent = open ? '✕' : '☰';
  };
  menuButton.addEventListener('click', () => setMenuOpen(!navMenu.classList.contains('open')));
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('click', event => {
    if (navMenu.classList.contains('open') && !navMenu.contains(event.target) && !menuButton.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenuOpen(false); });
  window.addEventListener('resize', () => { if (innerWidth > 700) setMenuOpen(false); });
}

// Project detail modal.
const projectDetails = {
  eventify: {title:'Eventify', kicker:'WEB APPLICATION · LEARNING PROJECT', description:'An event management system concept built around event discovery and booking workflows. The planned feature set includes role-based access for admins, organizers, and attendees; event and category APIs; bookings; reviews; and a chatbot grounded in event data.', stack:['Core PHP','PDO','MySQL','REST APIs','JavaScript','Authentication']},
  service: {title:'ServiceLink', kicker:'PRODUCT CONCEPT · EXPLORATION', description:'A service marketplace concept that helps people find local professionals such as plumbers and electricians. Planned features include provider verification, map-based discovery, service requests, and indicative prices based on provider quotes.', stack:['PHP','MySQL','Maps integration','Pricing logic','Role-based access']},
  cloud: {title:'Cloud foundations', kicker:'CLOUD LEARNING · HANDS-ON PRACTICE', description:'Practical learning around deploying static websites and understanding cloud infrastructure. Topics explored include S3 hosting, EC2, VPC networking, RDS, load balancing, auto scaling, and infrastructure templates.', stack:['AWS S3','EC2','VPC','RDS','CloudFormation','Git']}
};
const modal = $('#projectModal');
function openProject(key){
  const p = projectDetails[key]; if(!p) return;
  $('#modalTitle').textContent = p.title;
  $('#modalKicker').textContent = p.kicker;
  $('#modalDescription').textContent = p.description;
  $('#modalStack').replaceChildren(...p.stack.map(s => {const span=document.createElement('span');span.textContent=s;return span;}));
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
  $('.modal-close').focus();
}
function closeProject(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');}
$$('[data-open]').forEach(btn => btn.addEventListener('click', () => openProject(btn.dataset.open)));
$$('.project-card').forEach(card => card.addEventListener('click', e => {if(!e.target.closest('button')) openProject(card.dataset.project)}));
$$('[data-close]').forEach(el => el.addEventListener('click', closeProject));
window.addEventListener('keydown', e => {if(e.key==='Escape') closeProject();});
$$('.project-card').forEach(card => card.setAttribute('tabindex','0'));

// Copy-to-clipboard is progressive enhancement; email link remains usable regardless.
$('#copyEmail').addEventListener('click', async () => {
  const email = 'hello@jahidjamal.com.np';
  try { await navigator.clipboard.writeText(email); $('#copyFeedback').textContent = 'Email copied to clipboard.'; }
  catch { $('#copyFeedback').textContent = `Email: ${email}`; }
});

// Mouse-responsive 3D objects.
const orb = $('#orb');
const orbStage = $('#orbStage');
if(orbStage && window.matchMedia('(pointer:fine)').matches){
  orbStage.addEventListener('pointermove', e => {
    const r = orbStage.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    orb.style.transform = `translate3d(${x*16}px,${y*16}px,0) rotateY(${x*18}deg) rotateX(${-y*18}deg)`;
  });
  orbStage.addEventListener('pointerleave', () => orb.style.transform = '');
}

// Three.js star field: slowly moves with the page and reacts gently to pointer movement.
(function initSpace(){
  const canvas = $('#spaceCanvas');
  if(!canvas || !window.THREE) return;
  let renderer, scene, camera, points, animationId;
  try {
    renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, 1, .1, 1000);
    camera.position.z = 95;
    const count = window.innerWidth < 700 ? 450 : 1000;
    const positions = new Float32Array(count*3);
    const sizes = new Float32Array(count);
    for(let i=0;i<count;i++){
      positions[i*3]=(Math.random()-.5)*190;
      positions[i*3+1]=(Math.random()-.5)*120;
      positions[i*3+2]=(Math.random()-.5)*150;
      sizes[i]=Math.random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const material = new THREE.PointsMaterial({color:0xc9e9a3,size:.45,transparent:true,opacity:.75,sizeAttenuation:true});
    points = new THREE.Points(geometry,material);
    scene.add(points);
    const resize = () => {
      const w=canvas.clientWidth||innerWidth, h=canvas.clientHeight||innerHeight;
      renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
    };
    resize(); window.addEventListener('resize',resize);
    let mx=0,my=0; window.addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*.8;my=(e.clientY/innerHeight-.5)*.5},{passive:true});
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const render = () => {
      animationId=requestAnimationFrame(render);
      if(!reduced){points.rotation.y += .0007;points.rotation.x += .0002;points.position.x += (mx-points.position.x)*.004;points.position.y += (-my-points.position.y)*.004;}
      renderer.render(scene,camera);
    };
    render();
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(animationId);else render();});
  } catch(err) { canvas.style.display='none'; console.warn('3D background unavailable; decorative CSS remains active.',err); }
})();

// Slight scroll-linked parallax for the contact sphere.
const sphere = $('#contactSphere');
window.addEventListener('scroll', () => {
  if(!sphere) return;
  const rect=sphere.getBoundingClientRect();
  if(rect.bottom>0 && rect.top<innerHeight){
    const p=(rect.top+rect.height/2-innerHeight/2)/innerHeight;
    sphere.style.marginTop=`${-p*22}px`;
  }
},{passive:true});


// CINEMATIC 3D UPGRADE: cursor depth, tilt cards, scroll scene labels and WebGL geometry.
(function cinematicUpgrade(){
  const root = document.documentElement;
  const cursorGlow = document.getElementById('cursorGlow');
  const labelText = document.getElementById('sceneLabelText');
  const flash = document.getElementById('transitionFlash');
  const motionToggle = document.getElementById('motionToggle');
  const motionToggleText = document.getElementById('motionToggleText');
  const sections = [
    {id:'home',label:'01 / ORIGIN'},
    {id:'about',label:'02 / THE PERSON'},
    {id:'work',label:'03 / WORLDS BUILT'},
    {id:'stack',label:'04 / TOOLKIT'},
    {id:'contact',label:'05 / NEXT CHAPTER'}
  ];
  let pointerX=innerWidth*.5, pointerY=innerHeight*.5, scrollY=window.scrollY;
  let motionPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(motionPaused) document.body.classList.add('motion-paused');

  window.addEventListener('pointermove', e => {
    pointerX=e.clientX; pointerY=e.clientY;
    root.style.setProperty('--mouse-x', `${pointerX}px`);
    root.style.setProperty('--mouse-y', `${pointerY}px`);
    document.body.classList.add('pointer-active');
    if(cursorGlow && matchMedia('(pointer:fine)').matches){
      cursorGlow.style.left=`${pointerX}px`; cursorGlow.style.top=`${pointerY}px`;
    }
  }, {passive:true});
  document.addEventListener('pointerleave',()=>document.body.classList.remove('pointer-active'));

  // Scene chapter marker changes as each page section becomes dominant.
  const chapterObserver = new IntersectionObserver(entries => {
    const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(active && labelText){
      const chapter=sections.find(s=>s.id===active.target.id);
      if(chapter && labelText.textContent!==chapter.label){
        labelText.textContent=chapter.label;
        if(flash){flash.classList.remove('flash');void flash.offsetWidth;flash.classList.add('flash');}
      }
    }
  }, {threshold:[.15,.35,.6]});
  sections.forEach(s=>{const el=document.getElementById(s.id);if(el)chapterObserver.observe(el);});

  // Pointer-controlled 3D tilt on project cards.
  const cards=document.querySelectorAll('.project-card');
  if(matchMedia('(pointer:fine)').matches){
    cards.forEach(card=>{
      card.addEventListener('pointermove',e=>{
        if(motionPaused)return;
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width;
        const y=(e.clientY-r.top)/r.height;
        card.style.setProperty('--card-x',`${x*100}%`);
        card.style.setProperty('--card-y',`${y*100}%`);
        const rx=(.5-y)*5, ry=(x-.5)*7;
        card.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave',()=>{card.style.transform='';});
    });
  }

  // Scroll-linked depth: layers drift at different speeds to create parallax.
  let ticking=false;
  function parallaxFrame(){
    const y=window.scrollY;
    const vh=window.innerHeight;
    document.querySelectorAll('.depth-section').forEach(section=>{
      const r=section.getBoundingClientRect();
      if(r.bottom>0 && r.top<vh){
        const center=(r.top+r.height/2-vh/2)/vh;
        const ring=section.querySelector('.section-depth-ring');
        if(ring && !motionPaused) ring.style.translate=`0 ${center*-28}px`;
        const shape=section.querySelector('.work-depth-shape');
        if(shape && !motionPaused) shape.style.translate=`0 ${center*-35}px`;
        const cube=section.querySelector('.stack-depth-cube');
        if(cube && !motionPaused) cube.style.translate=`0 ${center*-22}px`;
      }
    });
    const hero=document.querySelector('.hero-copy');
    if(hero && !motionPaused && y<vh){
      hero.style.translate=`0 ${y*.12}px`;
      hero.style.opacity=String(Math.max(.15,1-y/(vh*1.05)));
    }
    const stage=document.getElementById('orbStage');
    if(stage && !motionPaused && y<vh){
      stage.style.marginTop=`${y*.10}px`;
      stage.style.opacity=String(Math.max(.18,1-y/(vh*1.15)));
    }
    ticking=false;
  }
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(parallaxFrame);ticking=true;}},{passive:true});
  parallaxFrame();

  if(motionToggle){
    const renderToggle=()=>{
      document.body.classList.toggle('motion-paused',motionPaused);
      motionToggle.setAttribute('aria-pressed',String(motionPaused));
      motionToggleText.textContent=motionPaused?'3D MOTION OFF':'3D MOTION ON';
    };
    renderToggle();
    motionToggle.addEventListener('click',()=>{motionPaused=!motionPaused;renderToggle();});
  }

  // Optional Three.js scene: glowing wireframe polyhedron + orbiting points.
  // If WebGL is unavailable, the rest of the CSS 3D effects still work.
  const canvas=document.getElementById('worldCanvas');
  if(!canvas || !window.THREE)return;
  let renderer,scene,camera,poly,wire,particles,ringA,ringB,raf;
  try{
    renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(48,1,.1,500);
    camera.position.set(0,0,35);
    const group=new THREE.Group();scene.add(group);
    const geo=new THREE.IcosahedronGeometry(7,2);
    const mat=new THREE.MeshBasicMaterial({color:0x9c82ff,wireframe:true,transparent:true,opacity:.17});
    wire=new THREE.Mesh(geo,mat);group.add(wire);
    const coreGeo=new THREE.IcosahedronGeometry(5.4,1);
    const coreMat=new THREE.MeshBasicMaterial({color:0xc7f36b,wireframe:true,transparent:true,opacity:.07});
    poly=new THREE.Mesh(coreGeo,coreMat);group.add(poly);
    const pCount=700, pos=new Float32Array(pCount*3);
    for(let i=0;i<pCount;i++){
      const radius=9+Math.random()*18, a=Math.random()*Math.PI*2, b=Math.acos(2*Math.random()-1);
      pos[i*3]=radius*Math.sin(b)*Math.cos(a);
      pos[i*3+1]=radius*Math.sin(b)*Math.sin(a);
      pos[i*3+2]=radius*Math.cos(b);
    }
    const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0xc7f36b,size:.12,transparent:true,opacity:.8}));
    group.add(particles);
    ringA=new THREE.Mesh(new THREE.TorusGeometry(10.5,.018,4,150),new THREE.MeshBasicMaterial({color:0xc7f36b,transparent:true,opacity:.32}));
    ringB=new THREE.Mesh(new THREE.TorusGeometry(13,.012,4,150),new THREE.MeshBasicMaterial({color:0x9c82ff,transparent:true,opacity:.34}));
    ringA.rotation.set(1.05,.2,.25);ringB.rotation.set(.5,1.1,-.35);group.add(ringA,ringB);
    const resize=()=>{
      const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;
      renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
    };
    resize();window.addEventListener('resize',resize);
    const isMobile=innerWidth<700;
    group.position.set(isMobile?0:8,isMobile?1:0,0);
    const animate=()=>{
      raf=requestAnimationFrame(animate);
      const t=performance.now()*.00025;
      if(!motionPaused){
        group.rotation.y=t*.8+((pointerX/innerWidth)-.5)*.3;
        group.rotation.x=Math.sin(t)*.13+((pointerY/innerHeight)-.5)*.2;
        wire.rotation.y=-t*1.5;poly.rotation.x=t*.6;poly.rotation.z=-t*.5;
        particles.rotation.y=-t*.18;ringA.rotation.z=t*.5;ringB.rotation.x=1.1+Math.sin(t)*.12;
        group.position.y=Math.sin(t*2)*.4;
      }
      const scrollRatio=Math.min(1,window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));
      group.scale.setScalar((isMobile?.6:1)*(1-scrollRatio*.18));
      renderer.render(scene,camera);
    };
    animate();
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else animate();});
  }catch(e){canvas.style.display='none';console.warn('Extra WebGL scene unavailable; CSS 3D enhancements remain enabled.',e);}

  // Scroll choreography: elements gain depth as each section enters the viewport.
  // Uses a single requestAnimationFrame loop for smoother scrolling on mobile.
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
  let scrollFrame = 0;
  function updateScrollDepth(){
    scrollFrame = 0;
    if (motionPaused || motionQuery.matches) return;
    const vh = window.innerHeight || 1;
    document.querySelectorAll('.depth-section, .contact').forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset = (rect.top + rect.height * .5 - vh * .5) / vh;
      section.style.setProperty('--section-progress', Math.max(0, Math.min(1, progress)).toFixed(3));
      const ring = section.querySelector('.section-depth-ring');
      if (ring) ring.style.translate = `0 ${(offset * -24).toFixed(1)}px`;
      const shape = section.querySelector('.work-depth-shape');
      if (shape) shape.style.translate = `0 ${(offset * -34).toFixed(1)}px`;
      const cube = section.querySelector('.stack-depth-cube');
      if (cube) cube.style.translate = `0 ${(offset * -20).toFixed(1)}px`;
    });
    // Tiny depth shift for project visuals as they move through the viewport.
    document.querySelectorAll('.project-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const center = (rect.top + rect.height / 2 - vh / 2) / vh;
      card.style.setProperty('--scroll-depth', `${(-center * 9).toFixed(1)}px`);
    });
  }
  function requestScrollDepth(){ if(!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollDepth); }
  window.addEventListener('scroll', requestScrollDepth, {passive:true});
  window.addEventListener('resize', requestScrollDepth, {passive:true});
  requestScrollDepth();

  // On touch screens, keep 3D card effects subtle and let native scrolling win.
  if (touchQuery.matches) {
    document.body.classList.add('touch-device');
    document.querySelectorAll('.project-card').forEach(card => card.addEventListener('touchstart', () => {
      card.classList.add('touch-active');
      window.setTimeout(() => card.classList.remove('touch-active'), 500);
    }, {passive:true}));
  }
})();
