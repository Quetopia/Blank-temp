(function () {
  'use strict';
  if (typeof scene === 'undefined' || typeof THREE === 'undefined' || typeof renderer === 'undefined' || !renderer) return;

  // One deterministic surface shared by static stone meshes, not a texture per object.
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  let seed = 220907;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  ctx.fillStyle = '#777777'; ctx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 64) {
    for (let x = -128; x < 512; x += 128) {
      const left = x + (y / 64 % 2) * 64;
      const value = 100 + Math.floor(random() * 45);
      ctx.fillStyle = `rgb(${value},${value},${value})`;
      ctx.fillRect(left + 3, y + 3, 122, 58);
      ctx.strokeStyle = '#999999'; ctx.strokeRect(left + 4, y + 4, 120, 56);
    }
  }
  for (let i = 0; i < 18000; i++) {
    ctx.fillStyle = random() > .5 ? '#ffffff14' : '#00000020';
    ctx.fillRect(random() * 512, random() * 512, 1 + random() * 3, 1 + random() * 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  scene.traverse(object => {
    if (!object.isMesh || object.parent !== scene || !object.receiveShadow) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material.isMeshStandardMaterial || material.map || material.emissiveIntensity > .1) continue;
      material.bumpMap = texture;
      material.bumpScale = .065;
      material.roughness = .94;
      material.needsUpdate = true;
    }
  });

  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:30;display:flex;gap:8px';
  const effects = document.createElement('button');
  effects.type = 'button';
  effects.style.cssText = 'background:#10121dea;color:#e8d7b4;border:1px solid #877449;padding:8px 12px;font:12px Georgia;cursor:pointer';
  panel.append(effects); document.body.append(panel);
  const originals = new Map();
  let reduced = false;
  try { reduced = localStorage.getItem('quetopia-reduced-effects') === 'true'; } catch (_) {}
  function applyEffects() {
    // Change ambient presentation only; hostile telegraphs and projectiles remain intact.
    for (const id of ['q19Veil']) {
      const element = document.getElementById(id);
      if (element) element.style.display = reduced ? 'none' : '';
    }
    scene.traverse(object => {
      if (!object.isPoints || !object.material) return;
      if (!originals.has(object)) originals.set(object, object.visible);
      object.visible = reduced ? false : originals.get(object);
    });
    renderer.setPixelRatio(Math.min(reduced ? 1 : 1.25, devicePixelRatio));
    effects.textContent = reduced ? 'Ambient effects: Reduced' : 'Ambient effects: Full';
    effects.setAttribute('aria-pressed', String(reduced));
  }
  effects.onclick = () => {
    reduced = !reduced;
    try { localStorage.setItem('quetopia-reduced-effects', String(reduced)); } catch (_) {}
    applyEffects();
  };
  applyEffects();
  window.addEventListener('blur', () => {
    if (typeof lmbHeld !== 'undefined') lmbHeld = false;
    if (typeof rmbHeld !== 'undefined') rmbHeld = false;
    if (typeof mouseMoving !== 'undefined') mouseMoving = false;
    if (typeof keys !== 'undefined') for (const key of Object.keys(keys)) keys[key] = false;
  });
  console.info('[QUETOPIA] Surface detail, ambient controls and focus reset ready');
})();
