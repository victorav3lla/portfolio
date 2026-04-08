const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
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
