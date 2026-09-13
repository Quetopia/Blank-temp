(function () {
  'use strict';
  if (typeof renderer === 'undefined' || !renderer || typeof scene === 'undefined') return;

  // Keep a stable shader light count even when enemies and spell effects spawn.
  // Emissive meshes still show every spell and enemy telegraph.
  const environmentLights = new Set();
  for (const child of scene.children) {
    if (child.isPointLight && environmentLights.size < 3) environmentLights.add(child);
  }
  const configured = new WeakSet();
  function budget(object) {
    if (object.isPointLight) object.visible = environmentLights.has(object);
    if (configured.has(object)) return;
    configured.add(object);
    if (object.isDirectionalLight && object.castShadow) {
      object.shadow.mapSize.set(1024, 1024);
      if (object.shadow.map) { object.shadow.map.dispose(); object.shadow.map = null; }
      object.shadow.normalBias = .035;
    }
    if (object.isMesh && object.castShadow && object.geometry) {
      // Small jewelry, particles, fur details and runes need no separate shadow draw.
      if (!object.geometry.boundingSphere) object.geometry.computeBoundingSphere();
      if (object.geometry.boundingSphere.radius * Math.max(object.scale.x, object.scale.y, object.scale.z) < .22) object.castShadow = false;
    }
  }
  scene.traverse(budget);

  // Minimap rendering is independent of combat simulation and input sampling.
  if (typeof drawMini === 'function') {
    const original = drawMini;
    let last = -Infinity;
    drawMini = function () {
      const now = performance.now();
      if (now - last < 100) return;
      last = now;
      return original.apply(this, arguments);
    };
  }
  const style = document.createElement('style');
  style.textContent = '#q19Veil{display:none!important}#q20Status,.hotbar{backdrop-filter:none!important}';
  document.head.append(style);

  const meter = document.createElement('output');
  meter.id = 'qPerformance';
  meter.style.cssText = 'position:fixed;right:18px;top:12px;z-index:100;padding:7px 10px;background:#080d12dd;color:#dfd7be;font:12px monospace;pointer-events:none';
  document.body.append(meter);
  let start = performance.now(), frames = 0, previous = start;
  const samples = [];
  const originalRender = renderer.render;
  renderer.render = function (world, camera) {
    if (world === scene) world.traverse(budget);
    const result = originalRender.call(this, world, camera);
    if (world !== scene) return result;
    const now = performance.now();
    if (!document.hidden) { samples.push(now - previous); frames++; }
    previous = now;
    if (now - start >= 1000) {
      samples.sort((a, b) => a - b);
      const p95 = samples[Math.min(samples.length - 1, Math.floor(samples.length * .95))] || 0;
      const fps = Math.round(frames * 1000 / (now - start));
      meter.textContent = `${fps} FPS · ${p95.toFixed(1)} ms p95 · ${renderer.info.render.calls} draws`;
      window.quetopiaPerformance = {fps, frameTimeP95: p95, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, geometries: renderer.info.memory.geometries};
      start = now; frames = 0; samples.length = 0;
    }
    return result;
  };
})();
