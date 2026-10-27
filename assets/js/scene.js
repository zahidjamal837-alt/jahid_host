// Three.js is loaded as a classic script in index.html so this scene also works
// when index.html is opened directly, without npm or a local build step.
const THREE = window.THREE;

const canvas = document.querySelector('#world');
const host = document.querySelector('.scene-wrap');
if (canvas && host && THREE) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050910, 0.055);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0, 9.2);
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const world = new THREE.Group();
  scene.add(world);
  const sculpture = new THREE.Group();
  world.add(sculpture);

  scene.add(new THREE.AmbientLight(0x789bb8, 1.35));
  const cyanLight = new THREE.PointLight(0x74fff0, 75, 18);
  cyanLight.position.set(3, 2, 3); scene.add(cyanLight);
  const blueLight = new THREE.PointLight(0x456fff, 95, 16);
  blueLight.position.set(-3, -1, 1); scene.add(blueLight);
  const whiteLight = new THREE.PointLight(0xe8f7ff, 35, 14);
  whiteLight.position.set(0, 3, -3); scene.add(whiteLight);

  const metal = new THREE.MeshPhysicalMaterial({color:0x91b9c7, metalness:.88, roughness:.2, clearcoat:1, clearcoatRoughness:.12, emissive:0x071b28, emissiveIntensity:.35});
  const glass = new THREE.MeshPhysicalMaterial({color:0x54d8e7, metalness:.35, roughness:.12, transmission:.22, transparent:true, opacity:.76, thickness:1.2, clearcoat:1, emissive:0x062f40, emissiveIntensity:.65});
  const darkMetal = new THREE.MeshStandardMaterial({color:0x172a42, metalness:.92, roughness:.24});
  const glowMat = new THREE.MeshBasicMaterial({color:0x8df7f0});

  // Faceted, layered central artifact.
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.02, 2), metal);
  sculpture.add(core);
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(.73, 1), glass);
  inner.rotation.set(.3,.4,.1); sculpture.add(inner);
  const innerWire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.17, 1)), new THREE.LineBasicMaterial({color:0x8df7f0, transparent:true, opacity:.65}));
  innerWire.rotation.set(.1,.2,.2); sculpture.add(innerWire);

  // Three orbital paths and precision tick marks.
  const orbitGroup = new THREE.Group(); sculpture.add(orbitGroup);
  const orbitDefs = [
    {r:1.62, color:0x8df7f0, rx:1.08, ry:.18, rz:.2},
    {r:2.05, color:0x648fff, rx:.38, ry:1.02, rz:-.32},
    {r:1.85, color:0xc1e8ff, rx:1.45, ry:.55, rz:.6}
  ];
  orbitDefs.forEach((d, idx) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(d.r, idx===0?.012:.008, 8, 180), new THREE.MeshBasicMaterial({color:d.color, transparent:true, opacity:idx===2?.35:.78}));
    ring.rotation.set(d.rx,d.ry,d.rz); orbitGroup.add(ring);
    const ticks = new THREE.Group();
    const points = [];
    for(let i=0;i<72;i++){
      const a=i/72*Math.PI*2, r=d.r;
      points.push(new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,0));
      if(i%3===0){points.push(new THREE.Vector3(Math.cos(a)*(r+.055),Math.sin(a)*(r+.055),0));points.push(new THREE.Vector3(Math.cos(a)*r,Math.sin(a)*r,0));}
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const marks = new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:d.color,transparent:true,opacity:.42}));
    ticks.add(marks); ticks.rotation.set(d.rx,d.ry,d.rz); orbitGroup.add(ticks);
  });

  // Floating shards orbiting the core.
  const shards = new THREE.Group(); sculpture.add(shards);
  for(let i=0;i<13;i++){
    const geometry = i%2 ? new THREE.OctahedronGeometry(.11+Math.random()*.1,0) : new THREE.TetrahedronGeometry(.12+Math.random()*.12,0);
    const shard = new THREE.Mesh(geometry, i%3===0?glass:(i%2?metal:darkMetal));
    const a=i/13*Math.PI*2, r=1.35+Math.random()*.85;
    shard.position.set(Math.cos(a)*r,(Math.random()-.5)*2.2,Math.sin(a)*r);
    shard.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);
    shards.add(shard);
  }
  // Dense, elegant particle field.
  const count = window.innerWidth < 700 ? 650 : 1400;
  const positions = new Float32Array(count*3);
  const sizes = new Float32Array(count);
  for(let i=0;i<count;i++){
    positions[i*3]=(Math.random()-.5)*10;
    positions[i*3+1]=(Math.random()-.5)*8;
    positions[i*3+2]=(Math.random()-.5)*7-1;
    sizes[i]=Math.random();
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const particleMaterial = new THREE.PointsMaterial({color:0x9adff2,size:.018,transparent:true,opacity:.72,sizeAttenuation:true,depthWrite:false});
  const particles = new THREE.Points(particleGeometry,particleMaterial);
  scene.add(particles);

  // Thin architectural frame behind the sculpture.
  const frame = new THREE.Group(); scene.add(frame);
  const frameMat = new THREE.LineBasicMaterial({color:0x37637b,transparent:true,opacity:.3});
  for(let i=0;i<9;i++){
    const x=-3.4+i*.85;
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,-2.8,-2.8),new THREE.Vector3(x,2.8,-2.8)]);
    frame.add(new THREE.Line(geo,frameMat));
  }
  for(let i=0;i<7;i++){
    const y=-2.4+i*.8;
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.4,y,-2.8),new THREE.Vector3(3.4,y,-2.8)]);
    frame.add(new THREE.Line(geo,frameMat));
  }

  // Cinematic motion: the typography stays fixed while the 3D artifact moves slowly.
  // The movement is intentionally restrained so it feels premium, not chaotic.
  const clock = new THREE.Clock();
  const initialY = new Float32Array(shards.children.length);
  shards.children.forEach((shard, i) => { initialY[i] = shard.position.y; });
  const resize=()=>{
    const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  };
  const observer=new ResizeObserver(resize); observer.observe(host); resize();
  let frameId = 0;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    core.rotation.y = t * 0.105;
    core.rotation.x = Math.sin(t * 0.16) * 0.07;
    inner.rotation.y = -t * 0.16;
    inner.rotation.x = 0.3 + Math.sin(t * 0.22) * 0.06;
    innerWire.rotation.y = t * 0.075;
    orbitGroup.rotation.y = Math.sin(t * 0.12) * 0.08;
    orbitGroup.rotation.z = t * 0.018;
    shards.children.forEach((shard, i) => {
      shard.position.y = initialY[i] + Math.sin(t * 0.55 + i * 1.7) * 0.045;
      shard.rotation.x += 0.0008 * (i % 2 ? 1 : -1);
      shard.rotation.y += 0.0012 * (i % 3 ? 1 : -1);
    });
    particles.rotation.y = t * 0.006;
    particles.position.y = Math.sin(t * 0.12) * 0.035;
    cyanLight.position.x = 3 + Math.sin(t * 0.18) * 0.35;
    blueLight.position.y = -1 + Math.cos(t * 0.14) * 0.3;
    renderer.render(scene,camera);
  };
  animate();
  window.addEventListener('beforeunload',()=>{ observer.disconnect(); cancelAnimationFrame(frameId); });
}
