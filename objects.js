import * as THREE from "three";

(function () {
  const dividers = document.querySelectorAll(".interactive-divider");
  if (!dividers.length) return;

  const scenes = [];

  let isLight = document.documentElement.getAttribute("data-theme") === "light";

  /* ---- Visibility-gated rendering ---- */
  const visObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const s = scenes.find((s) => s.el === e.target);
        if (s) s.visible = e.isIntersecting;
      });
    },
    { threshold: 0 }
  );

  /* ---- Build each divider ---- */
  dividers.forEach((el) => {
    const shape = el.dataset.shape || "torus";

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const w = el.clientWidth;
    const h = el.clientHeight;
    renderer.setSize(w, h);

    const cvs = renderer.domElement;
    cvs.style.position = "absolute";
    cvs.style.top = "0";
    cvs.style.left = "0";
    cvs.style.width = "100%";
    cvs.style.height = "100%";
    cvs.style.pointerEvents = "none";
    el.appendChild(cvs);

    /* Scene & Camera */
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    cam.position.z = 5.5;

    /* Lights */
    const amb = new THREE.AmbientLight(0xffffff, isLight ? 1.2 : 0.45);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, isLight ? 1.8 : 1);
    dir.position.set(4, 6, 5);
    scene.add(dir);
    const accent = new THREE.PointLight(isLight ? 0x4338ca : 0x646cff, 2.5, 20);
    accent.position.set(-4, -3, 4);
    scene.add(accent);

    /* Geometry */
    let geo;
    switch (shape) {
      case "torus":
        geo = new THREE.TorusGeometry(1.2, 0.4, 32, 64);
        break;
      case "icosahedron":
        geo = new THREE.IcosahedronGeometry(1.4, 0);
        break;
      case "knot":
        geo = new THREE.TorusKnotGeometry(0.9, 0.3, 128, 32);
        break;
      case "octahedron":
        geo = new THREE.OctahedronGeometry(1.4, 0);
        break;
      case "cylinder":
        geo = new THREE.CylinderGeometry(0.9, 0.9, 2.2, 6);
        break;
      case "sphere":
        geo = new THREE.SphereGeometry(1.3, 64, 64);
        break;
      default:
        geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    }

    /* Material */
    const isWire = shape === "icosahedron" || shape === "octahedron";
    const mat = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0x4338ca : 0x646cff,
      emissive: isLight ? 0x3730a3 : 0x1e1b4b,
      emissiveIntensity: 0.15,
      metalness: isWire ? 0.2 : 0.7,
      roughness: isWire ? 0.6 : 0.15,
      wireframe: isWire,
      clearcoat: isWire ? 0 : 1,
      clearcoatRoughness: 0.1,
      transparent: shape === "sphere" || shape === "torus",
      opacity: shape === "sphere" || shape === "torus" ? 0.88 : 1,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    /* ---- Interaction state ---- */
    let dragging = false;
    let prevX = 0;
    let prevY = 0;
    let dragDeltaX = 0;
    let dragDeltaY = 0;

    el.addEventListener("mousedown", (e) => {
      dragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      el.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
      el.style.cursor = "grab";
    });

    el.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      dragDeltaY += (e.clientX - prevX) * 0.008;
      dragDeltaX += (e.clientY - prevY) * 0.008;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    el.addEventListener("touchstart", (e) => {
      dragging = true;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", () => { dragging = false; });

    el.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      dragDeltaY += (e.touches[0].clientX - prevX) * 0.008;
      dragDeltaX += (e.touches[0].clientY - prevY) * 0.008;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    }, { passive: true });

    scenes.push({
      el, renderer, scene, cam, mesh, mat, amb, dir, accent,
      visible: false,
      getDragging: () => dragging,
      getDelta: () => {
        const dx = dragDeltaX;
        const dy = dragDeltaY;
        // Decay the deltas so the user throw gradually stops
        dragDeltaX *= 0.95;
        dragDeltaY *= 0.95;
        return { dx, dy };
      },
    });

    visObs.observe(el);
  });

  /* ---- Resize ---- */
  window.addEventListener("resize", () => {
    scenes.forEach((s) => {
      const w = s.el.clientWidth;
      const h = s.el.clientHeight;
      s.renderer.setSize(w, h);
      s.cam.aspect = w / h;
      s.cam.updateProjectionMatrix();
    });
  });

  /* ---- Theme change ---- */
  window.addEventListener("themeChanged", (e) => {
    isLight = e.detail.isLight;
    scenes.forEach((s) => {
      s.amb.intensity = isLight ? 1.2 : 0.45;
      s.dir.intensity = isLight ? 1.8 : 1;
      s.accent.color.setHex(isLight ? 0x4338ca : 0x646cff);
      s.mat.color.setHex(isLight ? 0x4338ca : 0x646cff);
      s.mat.emissive.setHex(isLight ? 0x3730a3 : 0x1e1b4b);
      s.mat.needsUpdate = true;
    });
  });

  /* ---- Render loop ---- */
  const clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    scenes.forEach((s) => {
      if (!s.visible) return;

      const { dx, dy } = s.getDelta();

      // Constant gentle auto-rotation
      s.mesh.rotation.x += 0.003;
      s.mesh.rotation.y += 0.006;

      // Add user drag momentum (decays over time)
      s.mesh.rotation.x += dx;
      s.mesh.rotation.y += dy;

      // Subtle floating
      s.mesh.position.y = Math.sin(t * 1.5 + s.el.offsetTop * 0.001) * 0.12;

      s.renderer.render(s.scene, s.cam);
    });
  }

  tick();
})();
