/* ============================================================
   SEASONS® V4.4 — Main JavaScript
   Playful Parallax Sliding + Horizontal Mobile Restored
   ============================================================ */

function initHero3D() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = window.innerWidth <= 768 ? 70 : 40;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const meshes = [];

  const cubeGeo = new THREE.BoxGeometry(8, 8, 8);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x85A38D, wireframe: true, transparent: true, opacity: 0.15 });
  const cube = new THREE.Mesh(cubeGeo, wireMat);
  cube.position.set(-12, 0, -5);
  cube.userData = { rx: 0.003, ry: 0.005 };
  scene.add(cube); meshes.push(cube);

  const icoGeo = new THREE.IcosahedronGeometry(5, 1);
  const ico = new THREE.Mesh(icoGeo, new THREE.MeshBasicMaterial({ color: 0xEBE7DF, wireframe: true, transparent: true, opacity: 0.1 }));
  ico.position.set(14, 5, -8);
  ico.userData = { rx: -0.004, ry: 0.003 };
  scene.add(ico); meshes.push(ico);

  const blockGeo = new THREE.BoxGeometry(4, 12, 2);
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x2B4C3E, metalness: 0.1, roughness: 0.05, transmission: 0.85, thickness: 2, transparent: true, opacity: 0.3 });
  const block = new THREE.Mesh(blockGeo, glassMat);
  block.position.set(8, -4, 5);
  block.rotation.z = 0.3;
  block.userData = { rx: 0.002, ry: -0.003 };
  scene.add(block); meshes.push(block);

  const torusGeo = new THREE.TorusGeometry(6, 0.8, 8, 32);
  const torus = new THREE.Mesh(torusGeo, new THREE.MeshBasicMaterial({ color: 0x85A38D, wireframe: true, transparent: true, opacity: 0.08 }));
  torus.position.set(-5, -8, -10);
  torus.userData = { rx: 0.002, ry: 0.004 };
  scene.add(torus); meshes.push(torus);

  const sphereGeo = new THREE.SphereGeometry(2, 16, 16);
  const sphere = new THREE.Mesh(sphereGeo, new THREE.MeshPhysicalMaterial({ color: 0xEBE7DF, metalness: 0.05, roughness: 0.02, transmission: 0.9, thickness: 3, transparent: true, opacity: 0.25 }));
  sphere.position.set(-15, 8, 0);
  sphere.userData = { rx: -0.003, ry: 0.002 };
  scene.add(sphere); meshes.push(sphere);

  const octGeo = new THREE.OctahedronGeometry(10, 0);
  const oct = new THREE.Mesh(octGeo, new THREE.MeshBasicMaterial({ color: 0x85A38D, wireframe: true, transparent: true, opacity: 0.04 }));
  oct.position.set(0, 0, -15);
  oct.userData = { rx: 0.001, ry: -0.002 };
  scene.add(oct); meshes.push(oct);

  const pCount = 200; // Reduced for performance
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) pos[i] = (Math.random() - 0.5) * 80;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x85A38D, size: 0.05, transparent: true, opacity: 0.25 }));
  scene.add(particles);

  // 0: Cube, 1: Icosahedron, 2: Glass Block, 3: Torus, 4: Sphere, 5: Octahedron
  
  // Define Target States per Section [Hero, Studio, Capabilities, Archive, Contact]
  // Positions refined to hug screen edges and gutters preventing text overlap
  const targetStates = {
    // Hero: Perimeter left and right fringes, kept off center text
    0: [
      { p: [-25, 10, -5], r: [0.003, 0.005] },  // Far top left
      { p: [25, -10, -8], r: [-0.004, 0.003] }, // Far bottom right
      { p: [-20, -15, 5], r: [0.002, -0.003] }, // Far bottom left
      { p: [20, 15, -10], r: [0.002, 0.004] },  // Far top right
      { p: [-30, 0, 0], r: [-0.003, 0.002] },   // Extreme left center
      { p: [30, 0, -15], r: [0.001, -0.002] }   // Extreme right center
    ],
    // Studio: Text is on left, Values on right bottom. Push strictly to the top right and far left gutters.
    1: [
      { p: [25, 20, 0], r: [0.01, 0.02] },      // Extreme top right
      { p: [-25, -15, -5], r: [0.02, 0.01] },   // Extreme bottom left
      { p: [35, -5, -10], r: [0.005, 0.005] },  // Hidden far right edge
      { p: [-30, 15, 5], r: [0.015, -0.01] },   // Extreme top left
      { p: [20, 25, -8], r: [-0.01, 0.02] },    // Above viewport top right
      { p: [-5, -25, -20], r: [0.002, 0.008] }  // Below viewport bottom
    ],
    // Capabilities: Boxed 2x2 grid. Frame the top right and bottom left horizontal margins.
    2: [
      { p: [-28, 20, -5], r: [0.004, 0.001] },  // Top left corner 
      { p: [28, 20, -5], r: [0.004, 0.001] },   // Top right corner
      { p: [-28, -20, -5], r: [0.004, 0.001] }, // Bottom left corner
      { p: [28, -20, -5], r: [0.004, 0.001] },  // Bottom right corner
      { p: [0, 28, -25], r: [0.001, 0.002] },   // Dead center roof
      { p: [0, -28, -10], r: [-0.002, 0.005] }  // Dead center floor
    ],
    // Archive: Large Cards grid. Explode very deeply (Z) or completely out of Y bounds.
    3: [
      { p: [-35, -20, -30], r: [-0.02, 0.03] }, // Deep far left
      { p: [35, 20, -30], r: [0.03, -0.02] },   // Deep far right
      { p: [-10, 30, -5], r: [0.01, 0.01] },    // Roof
      { p: [10, 30, -15], r: [0.02, 0.02] },    // Roof
      { p: [15, -30, 0], r: [-0.01, -0.04] },   // Floor
      { p: [-15, -30, -20], r: [0.05, 0.05] }   // Floor
    ],
    // Contact: Text Left, Form Right. Sink objects into dead space deeply negative Z
    4: [
      { p: [-20, -20, -20], r: [0.008, 0.008] }, 
      { p: [20, 25, -10], r: [-0.005, 0.01] },
      { p: [-25, 20, -20], r: [0.002, -0.01] },
      { p: [25, -25, -20], r: [0.01, 0.005] },
      { p: [0, -30, -10], r: [-0.008, -0.005] },
      { p: [0, 30, -10], r: [0.005, 0.01] }
    ]
  };

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const dLight = new THREE.DirectionalLight(0xEBE7DF, 0.6);
  dLight.position.set(10, 15, 10);
  scene.add(dLight);

  const mouse = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
  document.addEventListener('mousemove', (e) => {
    tgt.x = (e.clientX / window.innerWidth) * 2 - 1;
    tgt.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = window.innerWidth <= 768 ? 70 : 40;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    calcMax();
  });

  (function animate() {
    requestAnimationFrame(animate);
    mouse.x += (tgt.x - mouse.x) * 0.03;
    mouse.y += (tgt.y - mouse.y) * 0.03;

    // Calculate current global section based on horizontal scroll `current` variable from the outer scope
    const globalSectionExact = current / window.innerWidth;
    let baseIndex = Math.floor(globalSectionExact);
    let nextIndex = Math.ceil(globalSectionExact);
    let lerpFactor = globalSectionExact - baseIndex;
    
    // Bounds limit
    if (baseIndex < 0) baseIndex = 0; if (nextIndex < 0) nextIndex = 0;
    if (baseIndex > 4) baseIndex = 4; if (nextIndex > 4) nextIndex = 4;

    meshes.forEach((m, i) => {
      // Get base and next states for this specific mesh based on the section integers
      const state1 = targetStates[baseIndex][i];
      const state2 = targetStates[nextIndex][i];
      
      // Interpolate position
      const isMob = window.innerWidth <= 768;
      const xMult = isMob ? 0.3 : 1.0;
      const yMult = isMob ? 0.8 : 1.0;
      
      const targetPx = THREE.MathUtils.lerp(state1.p[0] * xMult, state2.p[0] * xMult, lerpFactor);
      const targetPy = THREE.MathUtils.lerp(state1.p[1] * yMult, state2.p[1] * yMult, lerpFactor);
      const targetPz = THREE.MathUtils.lerp(state1.p[2], state2.p[2], lerpFactor);

      // Interpolate rotational velocity dynamically
      const activeRx = THREE.MathUtils.lerp(state1.r[0], state2.r[0], lerpFactor);
      const activeRy = THREE.MathUtils.lerp(state1.r[1], state2.r[1], lerpFactor);

      // Smoothly drift towards calculated positions using loose inertia smoothing (0.05 lerp rate over frame loops)
      m.position.x = THREE.MathUtils.lerp(m.position.x, targetPx, 0.05);
      m.position.y = THREE.MathUtils.lerp(m.position.y, targetPy, 0.05);
      m.position.z = THREE.MathUtils.lerp(m.position.z, targetPz, 0.05);

      // Perform the continuous rotation adding calculated blended velocity
      m.rotation.x += activeRx;
      m.rotation.y += activeRy;
    });

    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
    particles.rotation.y += 0.0002;

    renderer.render(scene, camera);
  })();
}

const journeyPath = document.getElementById('journey-path');
let journeyLength = 0;
function initJourneyLine() {
  if (!journeyPath) return;
  journeyLength = journeyPath.getTotalLength();
  journeyPath.style.strokeDasharray = journeyLength;
  journeyPath.style.strokeDashoffset = journeyLength;
}
function updateJourneyLine(scrollPercent) {
  if (!journeyPath || !journeyLength) return;
  const drawLength = journeyLength * (1 - scrollPercent);
  journeyPath.style.strokeDashoffset = drawLength;
}


const scrollContainer = document.getElementById('scroll-container');
const progressBar = document.getElementById('progress-bar');
const scrollHint = document.getElementById('scroll-hint');
const navLinks = document.querySelectorAll('.nav-links a');
const archiveInner = document.getElementById('archive-inner');
const panels = document.querySelectorAll('.panel');

let current = 0, target = 0, maxH = 0;
let archiveExtra = 0;
const ARCHIVE_INDEX = 3;
let snapTimer = null;

function snapToNearest() {
  const archiveStart = ARCHIVE_INDEX * window.innerWidth;
  
  // Allow free scrolling within the archive section
  if (target > archiveStart + 10 && target < archiveStart + archiveExtra - 10) {
    return;
  }

  const points = [];
  panels.forEach((_, i) => {
    let pStart = i * window.innerWidth;
    if (i > ARCHIVE_INDEX) pStart += archiveExtra;
    points.push(pStart);
  });

  let nearest = points[0];
  let minDiff = Infinity;
  points.forEach(p => {
    if (Math.abs(target - p) < minDiff) {
      minDiff = Math.abs(target - p);
      nearest = p;
    }
  });

  target = nearest;
}

function calcMax() {
  if (archiveInner) {
    archiveExtra = Math.max(0, archiveInner.scrollHeight - window.innerHeight);
  } else {
    archiveExtra = 0;
  }
  maxH = (4 * window.innerWidth) + archiveExtra;
}

function isMobile() {
  return window.innerWidth <= 768;
}

function handleWheel(e) {
  const isScrollable = e.target.closest('.glass-services-grid, .glass-cards-list, .contact-layout');
  
  if (isScrollable) {
    const canScrollX = isScrollable.scrollWidth > isScrollable.clientWidth;
    const canScrollY = isScrollable.scrollHeight > isScrollable.clientHeight;
    
    if (canScrollX && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      const isAtLeft = isScrollable.scrollLeft <= 0;
      const isAtRight = isScrollable.scrollLeft + isScrollable.clientWidth >= isScrollable.scrollWidth - 1;
      if (!((e.deltaX < 0 && isAtLeft) || (e.deltaX > 0 && isAtRight))) {
        return; // Allow native inner X scroll
      }
    }
    
    if (canScrollY && Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
      const isAtTop = isScrollable.scrollTop <= 0;
      const isAtBottom = isScrollable.scrollTop + isScrollable.clientHeight >= isScrollable.scrollHeight - 1;
      if (!((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom))) {
        return; // Allow native inner Y scroll
      }
    }
  }

  e.preventDefault();
  const delta = e.deltaX || e.deltaY;
  target = Math.max(0, Math.min(maxH, target + delta * 1.5));
  clearTimeout(snapTimer);
  snapTimer = setTimeout(snapToNearest, 250);
}

let tx = 0, ty = 0;
function tStart(e) { 
  tx = e.touches[0].clientX; ty = e.touches[0].clientY; 
}

function tMove(e) {
  const isScrollable = e.target.closest('.glass-services-grid, .glass-cards-list, .contact-layout');
  const dx = tx - e.touches[0].clientX;
  const dy = ty - e.touches[0].clientY;
  
  if (isScrollable) {
    const canScrollX = isScrollable.scrollWidth > isScrollable.clientWidth;
    const canScrollY = isScrollable.scrollHeight > isScrollable.clientHeight;
    
    if (canScrollX && Math.abs(dx) > Math.abs(dy)) {
      const isAtLeft = isScrollable.scrollLeft <= 0;
      const isAtRight = isScrollable.scrollLeft + isScrollable.clientWidth >= isScrollable.scrollWidth - 1;
      if (!((dx < 0 && isAtLeft) || (dx > 0 && isAtRight))) {
        tx = e.touches[0].clientX; ty = e.touches[0].clientY;
        return; 
      }
    }
    
    if (canScrollY && Math.abs(dy) >= Math.abs(dx)) {
      const isAtTop = isScrollable.scrollTop <= 0;
      const isAtBottom = isScrollable.scrollTop + isScrollable.clientHeight >= isScrollable.scrollHeight - 1;
      if (!((dy < 0 && isAtTop) || (dy > 0 && isAtBottom))) {
        tx = e.touches[0].clientX; ty = e.touches[0].clientY;
        return; 
      }
    }
  }
  
  e.preventDefault();
  const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
  target = Math.max(0, Math.min(maxH, target + d * 2.5));
  tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  clearTimeout(snapTimer);
  snapTimer = setTimeout(snapToNearest, 250);
}

function handleKey(e) {
  const pw = window.innerWidth;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); target = Math.min(maxH, target + pw); }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); target = Math.max(0, target - pw); }
  
  clearTimeout(snapTimer);
  snapTimer = setTimeout(snapToNearest, 250);
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pIdx = parseInt(link.dataset.panel);
    if (pIdx > ARCHIVE_INDEX) {
      target = pIdx * window.innerWidth + archiveExtra;
    } else {
      target = pIdx * window.innerWidth;
    }
    clearTimeout(snapTimer);
  });
});

const ctaBtn = document.getElementById('cta-btn');
if (ctaBtn) ctaBtn.addEventListener('click', () => { 
  target = ARCHIVE_INDEX * window.innerWidth; 
  clearTimeout(snapTimer);
});


function checkReveals() {
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.left < window.innerWidth * 0.9 && r.right > 0 && r.top < window.innerHeight * 0.95 && r.bottom > 0) {
      el.classList.add('visible');
    }
  });
}

function updateNav() {
  const nav = document.getElementById('main-nav');
  const logo = document.getElementById('nav-logo');
  
  let normCurrent = current;
  const archiveStart = ARCHIVE_INDEX * window.innerWidth;
  
  if (current > archiveStart + archiveExtra) {
    normCurrent = current - archiveExtra;
  } else if (current > archiveStart) {
    normCurrent = archiveStart;
  }
  
  const idx = Math.round(normCurrent / window.innerWidth);
  
  const isDark = idx === 0 || idx === 2 || idx === 4;
  nav.style.color = isDark ? 'var(--beige)' : 'var(--charcoal)';
  nav.style.background = isDark ? 'rgba(26,26,26,0.2)' : 'rgba(255,255,255,0.08)';
  nav.style.borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  if (logo) logo.style.filter = isDark ? 'brightness(0) invert(1)' : 'none';

  const hint = document.getElementById('scroll-hint');
  if (hint) hint.style.color = isDark ? 'var(--beige)' : 'var(--charcoal)';
  
  navLinks.forEach((a, i) => a.classList.toggle('active', i === idx));
}

function init() {
  setTimeout(() => { calcMax(); initJourneyLine(); }, 150);

  // Use passive false where we might need to call e.preventDefault()
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', tStart, { passive: true });
  window.addEventListener('touchmove', tMove, { passive: false });
  window.addEventListener('keydown', handleKey);
  window.addEventListener('resize', () => { calcMax(); initJourneyLine(); });

  initHero3D();

  (function loop() {
    // --- DESKTOP AND MOBILE HORIZONTAL ENGINE --- //
    current += (target - current) * 0.08;
    if (Math.abs(target - current) < 0.5) current = target;

    const archiveStart = ARCHIVE_INDEX * window.innerWidth;
    let containerX = 0;
    let archiveY = 0;

    if (current < archiveStart) {
      containerX = -current;
      archiveY = 0;
    } else if (current >= archiveStart && current < archiveStart + archiveExtra) {
      containerX = -archiveStart;
      archiveY = -(current - archiveStart);
    } else {
      containerX = -(current - archiveExtra);
      archiveY = -archiveExtra;
    }

    scrollContainer.style.transform = `translateX(${containerX}px)`;
    if (archiveInner) { archiveInner.style.transform = `translateY(${archiveY}px)`; }

    // PLAYFUL PARALLAX PANEL STACKING
    panels.forEach((panel, i) => {
      let pStart = i * window.innerWidth;
      if (i > ARCHIVE_INDEX) pStart += archiveExtra;
      
      let dist = current - pStart;
      
      if (i === ARCHIVE_INDEX && dist > 0 && dist < archiveExtra) {
        dist = 0;
      } else if (i === ARCHIVE_INDEX && dist >= archiveExtra) {
        dist = dist - archiveExtra;
      }

      if (dist > 0 && dist < window.innerWidth) {
        const progress = dist / window.innerWidth;
        const parallaxX = dist * 0.4;  
        const scale = 1 - (progress * 0.1); 
        const br = progress * 60; 
        
        panel.style.transform = `translateX(${parallaxX}px) scale(${scale})`;
        panel.style.borderRadius = `${br}px`;
        panel.style.zIndex = 0;
        panel.style.opacity = 1 - (progress * 0.5); 
      } else if (dist <= 0) {
        panel.style.transform = `none`;
        panel.style.borderRadius = `0px`;
        panel.style.zIndex = 10;
        panel.style.opacity = 1;
      }
    });

    const pct = maxH > 0 ? current / maxH : 0;
    progressBar.style.width = `${pct * 100}%`;
    updateJourneyLine(pct);

    if (current > 60) scrollHint.classList.add('hidden');
    else scrollHint.classList.remove('hidden');

    updateNav();
    checkReveals();

    requestAnimationFrame(loop);
  })();

  setTimeout(checkReveals, 300);
}

/* =====================================================
   SUPABASE INTEGRATION
   ===================================================== */
const supabaseUrl = 'https://xiclgmohzenljfmmljar.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2xnbW9oemVubGpmbW1samFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDAzOTgsImV4cCI6MjA4ODk3NjM5OH0.OTef7tYgrMZitvIKrv3HW77TlT1c09Z1A985KEcpwgg';

// Ensure the SDK has loaded from CDN
if (window.supabase) {
  const sbClient = window.supabase.createClient(supabaseUrl, supabaseKey);
  
  const inquiryForm = document.getElementById('inquiry-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if(inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const brief = document.getElementById('form-brief').value;
      
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'SENDING...';
      submitBtn.disabled = true;

      try {
        const { data, error } = await sbClient
          .from('inquiries')
          .insert([{ name, email, brief }]);

        if (error) throw error;
        
        submitBtn.innerText = 'INQUIRY SENT →';
        submitBtn.style.backgroundColor = 'var(--sage)';
        submitBtn.style.color = 'var(--charcoal)';
        inquiryForm.reset();
        
      } catch (err) {
        console.error('Error submitting inquiry to Supabase:', err);
        submitBtn.innerText = 'ERROR (SEE CONSOLE)';
      } finally {
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
        }, 5000);
      }
    });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
