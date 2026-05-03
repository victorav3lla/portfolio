const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    } else if (e.boundingClientRect.top > 0) {
      e.target.classList.remove('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const heroName = document.getElementById('hero-name');
const original = 'Victor Avella';
const alias = 'VaV3lCod3';
let isAlias = false;

function scrambleTo(target) {
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';
  let frame = 0;
  const totalFrames = 15;
  const interval = setInterval(() => {
    frame++;
    let result = '';
    for (let i = 0; i < target.length; i++) {
      if (frame / totalFrames > i / target.length) {
        result += target[i];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    heroName.childNodes[0].textContent = result;
    if (frame >= totalFrames) clearInterval(interval);
  }, 40);
}

setInterval(() => {
  scrambleTo(isAlias ? original : alias);
  isAlias = !isAlias;
}, 3000);

const bgLogo = document.querySelector('.bg-logo');
const heroSection = document.getElementById('hero');

window.addEventListener('scroll', () => {
  if (window.scrollY > heroSection.offsetHeight * 0.8) {
    bgLogo.classList.add('visible');
  } else {
    bgLogo.classList.remove('visible');
  }
});

document.querySelectorAll('.preview-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const preview = toggle.nextElementSibling;
    preview.classList.toggle('open');
    toggle.classList.toggle('active');
    toggle.textContent = preview.classList.contains('open')
      ? '▼ Hide screenshots'
      : '▶ View screenshots';
  });
});

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const chars = '✦✧★·◦○●◈◇△▽♩♪♫♬♯♭⟐⊹⋆⊕⊗☽☾∞Ω'.split('');
const particles = [];

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    char: chars[Math.floor(Math.random() * chars.length)],
    size: Math.random() * 14 + 8,
    speedX: (Math.random() - 2.5) * 0.4,
    speedY: (Math.random() - 1.5) * 0.3,
    opacity: Math.random() * 0.003 + 0.02,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 1.5) * 0.5
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotSpeed;

    if (p.x < -50) p.x = canvas.width + 50;
    if (p.x > canvas.width + 50) p.x = -50;
    if (p.y < -50) p.y = canvas.height + 50;
    if (p.y > canvas.height + 50) p.y = -50;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.font = `${p.size}px JetBrains Mono, monospace`;
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.fillText(p.char, 0, 0);
    ctx.restore();
  });

  requestAnimationFrame(animate);
}

animate();

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));

function setupWave(canvasId) {
  const c = document.getElementById(canvasId);
  const ctx = c.getContext('2d');

  function resize() {
    c.width = c.parentElement.offsetWidth;
    c.height = 75;
  }
  resize();
  window.addEventListener('resize', resize);

  let offset = Math.random() * 100;

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    const points1 = [];
    const points2 = [];

    for (let x = 0; x < c.width; x++) {
      const twist = Math.sin(x * 0.02 + offset * 1.7) * 8;
      const y1 = 15 + Math.sin((x * 0.02) + offset) * twist
        + Math.sin((x * 0.04) + offset * 1.3) * 2;
      const y2 = 15 - Math.sin((x * 0.03) + offset) * twist
        + Math.sin((x * 0.04) + offset * 1.3 + 2) * 2;
      points1.push({ x, y: y1 });
      points2.push({ x, y: y2 });
    }

    // Connecting bars
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < points1.length; i += 20) {
      ctx.beginPath();
      ctx.moveTo(points1[i].x, points1[i].y);
      ctx.lineTo(points2[i].x, points2[i].y);
      ctx.stroke();
    }

    // Strand 1
    ctx.beginPath();
    points1.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = 'rgba(255, 77, 77, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Strand 2
    ctx.beginPath();
    points2.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = 'rgba(77, 255, 180, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    offset += 0.02;
    requestAnimationFrame(draw);
  }

  draw();
}
setupWave('wave-canvas');
setupWave('wave-canvas-2');

let lbImages = [];
let lbIndex = 0;

function openLightbox(previewEl) {
  const lightbox = document.querySelector('.lightbox');
  const container = lightbox.querySelector('.lb-container');
  const dots = lightbox.querySelector('.lb-dots');

  lbImages = Array.from(previewEl.querySelectorAll('img')).map(img => img.src);
  lbIndex = 0;

  dots.innerHTML = lbImages.map((_, i) =>
    `<span class="lb-dot ${i === 0 ? 'active' : ''}" onclick="lbGo(${i})"></span>`
  ).join('');

  lbShow(container);
  lightbox.classList.add('active');
}

function lbShow(container) {
  if (!container) container = document.querySelector('.lb-container');
  container.innerHTML = `<img src="${lbImages[lbIndex]}" alt="Screenshot ${lbIndex + 1}">`;
  document.querySelectorAll('.lb-dot').forEach((d, i) => {
    d.classList.toggle('active', i === lbIndex);
  });
}

function lbNav(dir) {
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  lbShow();
}

function lbGo(i) {
  lbIndex = i;
  lbShow();
}

document.querySelectorAll('.preview img').forEach(img => {
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(img.closest('.preview'));
  });
});
