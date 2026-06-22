import * as THREE from "three";

(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Renderer ---- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* ---- Scene & Camera ---- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
  camera.position.set(0, 5, 18);
  camera.lookAt(0, 0, 0);

  /* ---- Particle Grid ---- */
  const cols = 50;
  const rows = 50;
  const spacing = 0.55;
  const count = cols * rows;

  const positions = new Float32Array(count * 3);
  const baseY = new Float32Array(count);
  const scales = new Float32Array(count);

  const colors = new Float32Array(count * 3);

  for (let ix = 0; ix < cols; ix++) {
    for (let iz = 0; iz < rows; iz++) {
      const i = ix * rows + iz;
      const x = (ix - cols / 2) * spacing;
      const z = (iz - rows / 2) * spacing;

      positions[i * 3] = x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = z;
      baseY[i] = 0;

      scales[i] = Math.random() < 0.08 ? 2.5 : 1.0;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  function updateThemeColors(isLight) {
    const accentColor = new THREE.Color(isLight ? 0x4f46e5 : 0x646cff);
    const fadedColor = new THREE.Color(isLight ? 0xbac0cc : 0x2a2a3e);

    for (let ix = 0; ix < cols; ix++) {
      for (let iz = 0; iz < rows; iz++) {
        const i = ix * rows + iz;
        const x = (ix - cols / 2) * spacing;
        const z = (iz - rows / 2) * spacing;
        const dist = Math.sqrt(x * x + z * z);
        const maxDist = (cols / 2) * spacing;
        const t = Math.min(dist / maxDist, 1);
        const col = accentColor.clone().lerp(fadedColor, t * t);
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }
    }
    geo.attributes.color.needsUpdate = true;
  }

  // Initial color set
  updateThemeColors(document.documentElement.getAttribute("data-theme") === "light");

  /* ---- Shader Material ---- */
  const vertexShader = `
    attribute float aScale;
    varying vec3 vColor;
    varying float vAlpha;

    uniform float uTime;
    uniform vec2 uMouse;

    void main() {
      vColor = color;
      vec3 pos = position;

      // Wave displacement
      float d = length(pos.xz);
      pos.y = sin(d * 0.35 - uTime * 1.2) * 1.2
             + sin(pos.x * 0.4 + uTime * 0.8) * 0.4
             + cos(pos.z * 0.3 + uTime * 0.6) * 0.3;

      // Mouse proximity lift
      float mouseDist = length(pos.xz - uMouse * 8.0);
      pos.y += exp(-mouseDist * 0.15) * 2.0;

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aScale * (220.0 / -mv.z);
      gl_Position = projectionMatrix * mv;

      // Fade with depth
      vAlpha = smoothstep(60.0, 5.0, -mv.z);
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float r = dot(c, c);
      if (r > 0.25) discard;

      float glow = exp(-r * 8.0);
      gl_FragColor = vec4(vColor * (0.6 + glow * 0.8), vAlpha * glow);
    }
  `;

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const particles = new THREE.Points(geo, mat);
  particles.rotation.x = -0.35;
  scene.add(particles);

  /* ---- Floating accent meshes ---- */
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x646cff,
    transparent: true,
    opacity: 0.06,
  });

  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(4, 0.02, 16, 100),
    glowMat
  );
  ring1.position.set(0, 0, -2);
  ring1.rotation.x = Math.PI / 2.5;
  scene.add(ring1);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(6, 0.015, 16, 120),
    glowMat.clone()
  );
  ring2.material.opacity = 0.03;
  ring2.position.set(0, 0, -3);
  ring2.rotation.x = Math.PI / 3;
  scene.add(ring2);

  /* ---- Mouse tracking ---- */
  let mouseX = 0;
  let mouseY = 0;
  let targetMX = 0;
  let targetMY = 0;

  window.addEventListener("pointermove", (e) => {
    targetMX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  /* ---- Resize ---- */
  function resize() {
    const hero = document.querySelector(".hero");
    const w = window.innerWidth;
    const h = hero ? hero.clientHeight : window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---- Render Loop ---- */
  const clock = new THREE.Clock();

  function tick() {
    const t = clock.getElapsedTime();

    if (motionOk) {
      mat.uniforms.uTime.value = t;

      // Smooth mouse
      mouseX += (targetMX - mouseX) * 0.04;
      mouseY += (targetMY - mouseY) * 0.04;
      mat.uniforms.uMouse.value.set(mouseX, mouseY);

      // Gentle camera sway
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 1.5 + 5 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      // Rotate rings
      ring1.rotation.z = t * 0.1;
      ring2.rotation.z = -t * 0.07;
      ring1.rotation.y = Math.sin(t * 0.2) * 0.2;
      ring2.rotation.y = Math.cos(t * 0.15) * 0.15;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  
  window.addEventListener("themeChanged", (e) => {
    const isLight = e.detail.isLight;
    updateThemeColors(isLight);
    mat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    mat.needsUpdate = true;
    glowMat.color.set(isLight ? 0x222222 : 0x646cff);
    glowMat.opacity = isLight ? 0.04 : 0.06;
  });
  tick();
})();
