import * as THREE from 'three';
import './style.css';

const projects = [
  {n:'01', title:'Eventify', subtitle:'Event Management System', desc:'A role-based event platform focused on event discovery, bookings, authentication and API-driven workflows.', tags:['PHP','MySQL','PDO','REST API'], kind:'event', label:'BACKEND / WEB'},
  {n:'02', title:'AWS Infrastructure', subtitle:'Cloud Deployment Project', desc:'An academic cloud deployment exploring static hosting and repeatable infrastructure provisioning with AWS tools.', tags:['AWS','CloudFormation','S3','CLI'], kind:'cloud', label:'CLOUD / DEVOPS'},
  {n:'03', title:'Everest Arctic', subtitle:'Immersive Trekking Experience', desc:'A concept for a mountain experience combining visual storytelling, mapping and interactive 3D.', tags:['JavaScript','Maps','3D','Visuals'], kind:'everest', label:'INTERACTIVE / WEB'}
];
const grid = document.querySelector('#projectGrid');
grid.innerHTML = projects.map(p => `<article class="project-card" tabindex="0" style="--card-index:${p.n}">
  <div class="project-art art-${p.kind}"><span class="art-label">PROJECT / ${p.n}</span><span class="art-status">${p.label}</span><div class="art-scan"></div></div>
  <div class="project-body"><div class="project-title-row"><div><p class="project-subtitle">${p.subtitle}</p><h3>${p.title}</h3></div><span class="project-arrow">↗</span></div><p class="project-desc">${p.desc}</p><div class="tag-row">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div></div>
</article>`).join('');
document.querySelector('#year').textContent = new Date().getFullYear();

const progress = document.querySelector('#scrollProgress');
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max>0?scrollY/max*100:0}%`;}
addEventListener('scroll',updateProgress,{passive:true}); updateProgress();
const observer = new IntersectionObserver(entries => entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.13});
document.querySelectorAll('.reveal,.project-card').forEach(el=>observer.observe(el));

if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',`${x*100}%`);card.style.setProperty('--my',`${y*100}%`);card.style.transform=`perspective(900px) rotateX(${(0.5-y)*8}deg) rotateY(${(x-.5)*10}deg) translateY(-5px)`;});
  card.addEventListener('pointerleave',()=>card.style.transform='');
 });
}

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointer = {x:0,y:0};
addEventListener('pointermove',e=>{pointer.x=(e.clientX/innerWidth-.5)*2;pointer.y=(e.clientY/innerHeight-.5)*2;},{passive:true});
function makeRenderer(canvas){
 if(!canvas)return null;
 try {const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;return renderer;}catch(e){console.warn('WebGL unavailable for canvas',canvas.id);return null;}
}
function createScene(id,type){
 const canvas=document.getElementById(id),renderer=makeRenderer(canvas);if(!renderer)return;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(44,1,.1,100);camera.position.z=type==='hero'?13:type==='about'?9:10;
 const root=new THREE.Group();scene.add(root);
 scene.add(new THREE.HemisphereLight(0x8dcfff,0x10101f,1.35));
 const key=new THREE.PointLight(0x6bdcff,95,45);key.position.set(3,4,5);scene.add(key);
 const violet=new THREE.PointLight(0x746dff,75,38);violet.position.set(-5,-2,1);scene.add(violet);
 const warm=new THREE.PointLight(0xffad72,24,25);warm.position.set(0,-4,4);scene.add(warm);
 const animated=[];
 const add=(obj,parent=root)=>{parent.add(obj);animated.push(obj);return obj;};
 const standard=(color,extra={})=>new THREE.MeshPhysicalMaterial({color,metalness:.65,roughness:.24,clearcoat:.8,clearcoatRoughness:.2,...extra});
 const starGeometry=new THREE.BufferGeometry(),starPositions=[];
 for(let i=0;i<1800;i++){starPositions.push((Math.random()-.5)*36,(Math.random()-.5)*20,(Math.random()-.5)*22-3);}
 starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));
 const stars=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0x9bcfff,size:.025,transparent:true,opacity:.72,sizeAttenuation:true}));add(stars);
 if(type==='hero'){
   // Procedural layered mountain ridges, no static screenshot background.
   for(let row=0;row<5;row++){
    const cols=110,positions=[],indices=[],z=-row*1.25-1.5;
    for(let i=0;i<=cols;i++){const x=(i/cols-.5)*25;const peaks=Math.abs(Math.sin(i*.22+row*1.7))*Math.max(0,Math.sin(i*.071+row*.8));const peak2=Math.pow(Math.max(0,Math.sin(i*.135+row*2.3)),3);const y=-1.1-row*.35+peaks*(row===0?2.8:1.8)+peak2*(row===0?1.5:1.0);positions.push(x,y,z,x,y-2.3,z);}
    for(let i=0;i<cols;i++){let j=i*2;indices.push(j,j+1,j+2,j+1,j+3,j+2);}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();
    const mountain=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:[0x253d5d,0x172b49,0x10203a,0x0c182b,0x081321][row],metalness:.38,roughness:.55,side:THREE.DoubleSide,emissive:0x08182a,emissiveIntensity:.65,flatShading:true}));add(mountain);
    const ridgeLine=new THREE.LineSegments(new THREE.EdgesGeometry(geo,38),new THREE.LineBasicMaterial({color:0x5ca9e9,transparent:true,opacity:row===0?.22:.07}));add(ridgeLine);
   }
   const planet=add(new THREE.Mesh(new THREE.SphereGeometry(1.5,64,48),standard(0x7cbce9,{roughness:.2,emissive:0x123e80,emissiveIntensity:.75})));planet.position.set(3.4,1.6,-4.8);
   const atmosphere=add(new THREE.Mesh(new THREE.SphereGeometry(1.58,48,32),new THREE.MeshBasicMaterial({color:0x62caff,transparent:true,opacity:.12,side:THREE.BackSide})));atmosphere.position.copy(planet.position);
   const halo=add(new THREE.Mesh(new THREE.TorusGeometry(2.0,.018,12,180),new THREE.MeshBasicMaterial({color:0xb9eaff,transparent:true,opacity:.9})));halo.position.copy(planet.position);halo.rotation.set(1.1,.2,-.25);
   for(let i=0;i<7;i++){const ring=add(new THREE.Mesh(new THREE.TorusGeometry(2.1+i*.15,.008,6,160),new THREE.MeshBasicMaterial({color:i%2?0x7c8cff:0x7de7ff,transparent:true,opacity:.26})));ring.position.copy(planet.position);ring.rotation.set(.7+i*.2,.2+i*.4,i*.15);ring.userData.spin=.001*(i%2?1:-1);}
   // Floating rock shards in multiple depth planes.
   for(let i=0;i<38;i++){const shard=add(new THREE.Mesh(new THREE.IcosahedronGeometry(.06+Math.random()*.18,0),standard(i%3?0x344d6e:0x8aa8c8,{roughness:.6,flatShading:true})));shard.position.set((Math.random()-.5)*20,(Math.random()-.5)*7-1,(Math.random()-.5)*9-2);shard.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);shard.userData.spin=(Math.random()-.5)*.012;shard.userData.float=Math.random()*8;}
   // Reflective lake-like ribbon under the ridge.
   const water=new THREE.Mesh(new THREE.PlaneGeometry(30,10,90,40),new THREE.MeshPhysicalMaterial({color:0x102b4b,metalness:.82,roughness:.18,transparent:true,opacity:.72,clearcoat:1,side:THREE.DoubleSide}));water.rotation.x=-Math.PI/2;water.position.set(0,-3.2,-1);add(water);
   const glow=new THREE.Mesh(new THREE.PlaneGeometry(8,.14),new THREE.MeshBasicMaterial({color:0x8ce9ff,transparent:true,opacity:.65}));glow.position.set(0,-2.9,1);add(glow);
 }else if(type==='about'){
   const crystal=add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.35,2),standard(0x73cfff,{metalness:.78,roughness:.14,emissive:0x102f67,emissiveIntensity:.9,flatShading:true})));
   const inner=add(new THREE.Mesh(new THREE.IcosahedronGeometry(.82,1),standard(0x8b82ff,{metalness:.8,roughness:.2,wireframe:true,emissive:0x3c42b9,emissiveIntensity:.45})));
   const wire=add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.6,2),new THREE.MeshBasicMaterial({color:0x82e5ff,wireframe:true,transparent:true,opacity:.35})));
   for(let i=0;i<9;i++){const ring=add(new THREE.Mesh(new THREE.TorusGeometry(1.85+i*.13,.009,8,160),new THREE.MeshBasicMaterial({color:i%3===0?0xffb878:i%2?0x6c82ff:0x7ae6ff,transparent:true,opacity:.58-i*.045})));ring.rotation.set(i*.52,i*.37,i*.19);ring.userData.spin=.001*(i%2?1:-1);}
   for(let i=0;i<300;i++){const dot=add(new THREE.Mesh(new THREE.SphereGeometry(.012+Math.random()*.025,6,6),new THREE.MeshBasicMaterial({color:i%5===0?0xffc18c:0x8bdfff})));const a=Math.random()*Math.PI*2,rad=2.1+Math.random()*2.4;dot.position.set(Math.cos(a)*rad,(Math.random()-.5)*4,Math.sin(a)*rad);dot.userData.float=Math.random()*9;}
 }else{
   const planet=add(new THREE.Mesh(new THREE.SphereGeometry(2.05,72,54),standard(0x214b82,{roughness:.32,metalness:.4,emissive:0x081c42,emissiveIntensity:.85})));planet.position.set(2.7,-.2,-1.4);
   const wire=add(new THREE.Mesh(new THREE.SphereGeometry(2.08,36,24),new THREE.MeshBasicMaterial({color:0x71dfff,wireframe:true,transparent:true,opacity:.15})));wire.position.copy(planet.position);
   const cloud=add(new THREE.Mesh(new THREE.SphereGeometry(2.11,48,32),new THREE.MeshBasicMaterial({color:0x84cfff,transparent:true,opacity:.07,side:THREE.BackSide})));cloud.position.copy(planet.position);
   for(let i=0;i<6;i++){const ring=add(new THREE.Mesh(new THREE.TorusGeometry(2.5+i*.24,.012,8,180),new THREE.MeshBasicMaterial({color:i%2?0x7e83ff:0x7deaff,transparent:true,opacity:.65-i*.08})));ring.position.copy(planet.position);ring.rotation.set(.6+i*.4,.4+i*.55,.2+i*.3);ring.userData.spin=.001*(i%2?1:-1);}
   const moon=add(new THREE.Mesh(new THREE.IcosahedronGeometry(.28,2),standard(0xc9eaff)));moon.position.set(-.4,1.7,1.3);moon.userData.orbit=true;
   for(let i=0;i<45;i++){const shard=add(new THREE.Mesh(new THREE.IcosahedronGeometry(.035+Math.random()*.12,0),standard(i%2?0x355879:0x718cab,{flatShading:true})));shard.position.set((Math.random()-.5)*13,(Math.random()-.5)*7,(Math.random()-.5)*8);shard.userData.spin=(Math.random()-.5)*.01;}
 }
 const pointerTarget={x:0,y:0};let active=true,frame=0;
 const move=e=>{pointerTarget.x=(e.clientX/innerWidth-.5)*2;pointerTarget.y=(e.clientY/innerHeight-.5)*2;};addEventListener('pointermove',move,{passive:true});
 function resize(){const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=type==='hero'?(w<680?17:13):type==='about'?(w<680?10:9):(w<680?13:10);camera.updateProjectionMatrix();}
 addEventListener('resize',resize);resize();const vis=new IntersectionObserver(entries=>active=entries[0].isIntersecting);vis.observe(canvas);
 function animate(){requestAnimationFrame(animate);if(!active||document.hidden)return;frame++;if(!reduced){root.rotation.y+=(pointerTarget.x*.085-root.rotation.y)*.018;root.rotation.x+=(-pointerTarget.y*.035-root.rotation.x)*.018;root.position.y=Math.sin(frame*.006)*.035;animated.forEach(o=>{if(o.userData.spin){o.rotation.y+=o.userData.spin;o.rotation.x+=o.userData.spin*.37;}if(o.userData.float!==undefined)o.position.y+=Math.sin(frame*.012+o.userData.float)*.0014;if(o.userData.orbit){o.position.x=-.4+Math.cos(frame*.008)*.8;o.position.z=1.3+Math.sin(frame*.008)*.5;}});key.position.x=3+Math.sin(frame*.006)*1.8;}renderer.render(scene,camera);}
 animate();
}
createScene('heroCanvas','hero');createScene('aboutCanvas','about');createScene('contactCanvas','contact');
