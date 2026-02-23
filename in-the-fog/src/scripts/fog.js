// Car animations: multiple cars, some right-to-left, some left-to-right
window.addEventListener("DOMContentLoaded", () => {
  // Car 1: right to left
  const car1 = document.getElementById("fog-car");
  // Car 2: left to right
  const car2 = document.getElementById("fog-car2");
  // Car 3: right to left
  const car3 = document.getElementById("fog-car3");
  const carWidth = 180;
  const screenW = window.innerWidth;
  // Car 1
  if (car1) {
    const startX = screenW;
    const endX = -carWidth;
    const duration = 18;
    function animateCar1(tsStart) {
      function frame(ts) {
        const elapsed = ((ts - tsStart) / 1000) % duration;
        const progress = elapsed / duration;
        const x = startX + (endX - startX) * progress;
        car1.style.left = `${x}px`;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame((ts) => animateCar1(ts));
  }
  // Car 2
  if (car2) {
    const startX = -carWidth;
    const endX = screenW;
    const duration = 22;
    function animateCar2(tsStart) {
      function frame(ts) {
        const elapsed = ((ts - tsStart) / 1000) % duration;
        const progress = elapsed / duration;
        const x = startX + (endX - startX) * progress;
        car2.style.left = `${x}px`;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame((ts) => animateCar2(ts));
  }
  // Car 3
  if (car3) {
    const startX = screenW;
    const endX = -carWidth;
    const duration = 26;
    function animateCar3(tsStart) {
      function frame(ts) {
        const elapsed = ((ts - tsStart) / 1000) % duration;
        const progress = elapsed / duration;
        const x = startX + (endX - startX) * progress;
        car3.style.left = `${x}px`;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame((ts) => animateCar3(ts));
  }
});
// Enhanced fog animation: drifting, waving, and atmospheric background
window.addEventListener("DOMContentLoaded", () => {
  const layers = document.querySelectorAll(".fog-layer");
  // Get the house SVG in the first fog layer
  const house = document.querySelector(".fog-house");
  // Each layer: speed (px/sec), blur (px), opacity, vertical wave amplitude & speed
  const fogSettings = [
    { speed: 6, blur: 24, opacity: 0.08, amp: 18, waveSpeed: 0.08, phase: 0 }, // back (already less foggy)
    { speed: 12, blur: 12, opacity: 0.35, amp: 32, waveSpeed: 0.12, phase: 1 }, // middle
    { speed: 24, blur: 1.5, opacity: 0.22, amp: 48, waveSpeed: 0.16, phase: 2 }, // front (lightest, less blur/opacity)
  ];
  const width = window.innerWidth;
  // Set initial styles
  layers.forEach((layer, i) => {
    layer.style.filter = `blur(${fogSettings[i].blur}px)`;
    // Make the back fog layer (with the house) much more transparent
    if (i === 0) {
      layer.style.opacity = 0.08;
    } else {
      layer.style.opacity = fogSettings[i].opacity;
    }
    layer.style.background = "rgba(255,255,255,1)";
    layer.style.mixBlendMode = "lighten";
  });

  // For background color shift
  const camera = document.getElementById("camera");
  const baseTop = [35, 39, 43]; // base top gray values
  const baseBot = [191, 195, 201]; // base bottom gray values
  const darkenAmount = 60; // how much darker at max

  let start = null;

  function animateFog(ts) {
    if (!start) start = ts;
    const elapsed = (ts - start) / 1000; // seconds
    layers.forEach((layer, i) => {
      // Move each layer horizontally, loop at 100vw
      const speed = fogSettings[i].speed;
      const offsetX = (elapsed * speed) % width;
      // Add vertical wave motion
      const amp = fogSettings[i].amp;
      const waveSpeed = fogSettings[i].waveSpeed;
      const phase = fogSettings[i].phase;
      const offsetY = Math.sin(elapsed * waveSpeed + phase) * amp;
      layer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      // If this is the first layer and house exists, move the house with the fog
      if (i === 0 && house) {
        house.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    });

    // Gradually darken the background over a 60s cycle
    const cycle = 60; // seconds for a full darken/brighten cycle
    const t = (Math.sin((elapsed / cycle) * Math.PI * 2) + 1) / 2; // 0 to 1
    // Interpolate top and bottom gray values
    const topGray = baseTop.map((v) => Math.round(v - t * darkenAmount));
    const botGray = baseBot.map((v) => Math.round(v - t * darkenAmount));
    camera.style.background = `linear-gradient(180deg, rgb(${topGray.join(",")}) 0%, rgb(${botGray.join(",")}) 100%)`;

    requestAnimationFrame(animateFog);
  }
  requestAnimationFrame(animateFog);
});
