// ═══════════════════════════════════════════════
// 3D BACKGROUND — Floating Geometric Wireframes
// Uses Three.js for a premium 3D particle/mesh scene
// ═══════════════════════════════════════════════

(function() {
  const container = document.getElementById('bg-3d');
  if (!container || typeof THREE === 'undefined') return;

  // ─── SCENE SETUP ───
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030304, 0.0008);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 800;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x030304, 1);
  container.appendChild(renderer.domElement);

  // ─── MOUSE TRACKING ───
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener('mousemove', e => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ─── MATERIALS ───
  const colors = [
    new THREE.Color(0xc084fc), // lavender
    new THREE.Color(0x818cf8), // periwinkle
    new THREE.Color(0xfb7185), // rose
    new THREE.Color(0x34d399), // mint
    new THREE.Color(0x60a5fa), // sky blue
  ];

  function makeWireMat(color, opacity) {
    return new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: opacity,
    });
  }

  // ─── FLOATING SHAPES ───
  const shapes = [];
  const geometries = [
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.TorusGeometry(1, 0.3, 8, 6),
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.TorusKnotGeometry(0.8, 0.25, 32, 6),
  ];

  const shapeCount = 30;
  for (let i = 0; i < shapeCount; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const scale = 15 + Math.random() * 60;
    const opacity = 0.04 + Math.random() * 0.12;

    const mat = makeWireMat(color, opacity);
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set(
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 1400,
      (Math.random() - 0.5) * 1600
    );
    mesh.scale.setScalar(scale);
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    scene.add(mesh);
    shapes.push({
      mesh,
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.002,
      },
      floatSpeed: 0.0003 + Math.random() * 0.0006,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: mesh.position.y,
      driftX: (Math.random() - 0.5) * 0.15,
      driftZ: (Math.random() - 0.5) * 0.1,
    });
  }

  // ─── PARTICLE FIELD ───
  const particleCount = 600;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 2500;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1800;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    particleSizes[i] = 1 + Math.random() * 2;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xc084fc,
    size: 2,
    transparent: true,
    opacity: 0.25,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ─── CONNECTING LINES (subtle mesh between nearby particles) ───
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];
  const maxDist = 200;

  for (let i = 0; i < Math.min(particleCount, 200); i++) {
    for (let j = i + 1; j < Math.min(particleCount, 200); j++) {
      const dx = positions[i*3] - positions[j*3];
      const dy = positions[i*3+1] - positions[j*3+1];
      const dz = positions[i*3+2] - positions[j*3+2];
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < maxDist) {
        linePositions.push(
          positions[i*3], positions[i*3+1], positions[i*3+2],
          positions[j*3], positions[j*3+1], positions[j*3+2]
        );
      }
    }
  }

  if (linePositions.length > 0) {
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.03,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);
  }

  // ─── AMBIENT LIGHT ───
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // ─── ANIMATION LOOP ───
  function animate() {
    requestAnimationFrame(animate);

    const t = performance.now() * 0.001;

    // Smooth mouse lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.03;
    mouse.y += (mouse.targetY - mouse.y) * 0.03;

    // Rotate camera based on mouse
    camera.position.x += (mouse.x * 150 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 100 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    // Animate shapes
    shapes.forEach(s => {
      s.mesh.rotation.x += s.rotSpeed.x;
      s.mesh.rotation.y += s.rotSpeed.y;
      s.mesh.rotation.z += s.rotSpeed.z;

      // Floating bob
      s.mesh.position.y = s.baseY + Math.sin(t * s.floatSpeed * 10 + s.floatOffset) * 40;

      // Slow drift
      s.mesh.position.x += s.driftX;
      s.mesh.position.z += s.driftZ;

      // Wrap around if too far
      if (s.mesh.position.x > 1200) s.mesh.position.x = -1200;
      if (s.mesh.position.x < -1200) s.mesh.position.x = 1200;
      if (s.mesh.position.z > 1000) s.mesh.position.z = -1000;
      if (s.mesh.position.z < -1000) s.mesh.position.z = 1000;
    });

    // Slowly rotate particles
    particles.rotation.y += 0.0001;
    particles.rotation.x += 0.00005;

    renderer.render(scene, camera);
  }

  animate();

  // ─── RESIZE ───
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
