// ================================
//   CIE CLOUKS — EXPLOSIONS & JS
//   (propulsé par l'énergie Zidane)
// ================================

const canvas = document.getElementById('explosionCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ---- PARTICULES ----
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 18;
    this.vy = (Math.random() - 0.5) * 18 - Math.random() * 6;
    this.alpha = 1;
    this.color = color;
    this.radius = Math.random() * 6 + 2;
    this.gravity = 0.35;
    this.decay = Math.random() * 0.02 + 0.012;
    this.trail = [];
  }
  update() {
    this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
    if (this.trail.length > 6) this.trail.shift();
    this.vx *= 0.97;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    this.radius *= 0.98;
  }
  draw() {
    // traînée
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.radius * (i / this.trail.length) * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('1)', `${t.alpha * 0.3})`);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace('1)', `${this.alpha})`);
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class Spark {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.length = Math.random() * 20 + 10;
    this.decay = Math.random() * 0.03 + 0.02;
    this.color = `rgba(255, ${Math.floor(Math.random() * 150 + 100)}, 0, 1)`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.vy += 0.2;
    this.alpha -= this.decay;
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3);
    ctx.strokeStyle = this.color.replace('1)', `${this.alpha})`);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

let particles = [];
let sparks = [];

function explode(x, y, intensity = 1) {
  const colors = [
    'rgba(255, 80, 0, 1)',
    'rgba(255, 200, 0, 1)',
    'rgba(255, 50, 50, 1)',
    'rgba(255, 160, 0, 1)',
    'rgba(255, 255, 100, 1)',
    'rgba(200, 50, 0, 1)',
  ];

  // flash de lumière
  const flash = document.createElement('div');
  flash.className = 'explosion-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 300);

  // cercle d'onde de choc
  const shockwave = { x, y, r: 0, maxR: 120 * intensity, alpha: 0.8 };
  shockwaves.push(shockwave);

  const count = Math.floor(60 * intensity);
  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, color));
  }
  for (let i = 0; i < 30 * intensity; i++) {
    sparks.push(new Spark(x, y));
  }
}

let shockwaves = [];

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // shockwaves
  shockwaves = shockwaves.filter(s => s.alpha > 0);
  shockwaves.forEach(s => {
    s.r += 8;
    s.alpha -= 0.04;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 150, 0, ${s.alpha})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  particles = particles.filter(p => p.alpha > 0);
  sparks = sparks.filter(s => s.alpha > 0);

  particles.forEach(p => { p.update(); p.draw(); });
  sparks.forEach(s => { s.update(); s.draw(); });

  requestAnimationFrame(animate);
}
animate();

// ---- EXPLOSION AU CLIC SUR BOUTONS ----
function attachExplosions() {
  document.querySelectorAll('.explode-trigger, .btn-hero, .btn-submit').forEach(el => {
    el.addEventListener('click', function (e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      explode(cx, cy, 1.5);
    });
  });
}
attachExplosions();

// explosion sur le Zidane flottant
document.getElementById('zidaneFloat').addEventListener('click', function (e) {
  explode(e.clientX, e.clientY, 2);
  // petit message
  const msg = document.createElement('div');
  msg.textContent = 'ZIDANE 💥';
  msg.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY - 40}px;
    transform: translateX(-50%);
    color: #d4a84b;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    pointer-events: none;
    z-index: 9999;
    animation: floatMsg 1.2s ease forwards;
  `;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1200);
});

// Ajouter le style de l'animation de message
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes floatMsg {
    from { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
    to { opacity: 0; transform: translateX(-50%) translateY(-60px) scale(1.4); }
  }
`;
document.head.appendChild(styleEl);

// ---- EXPLOSION AUTOMATIQUE à l'arrivée sur le site ----
window.addEventListener('load', () => {
  setTimeout(() => {
    explode(window.innerWidth / 2, window.innerHeight / 2, 2.5);
    setTimeout(() => explode(window.innerWidth * 0.2, window.innerHeight * 0.3, 1.2), 200);
    setTimeout(() => explode(window.innerWidth * 0.8, window.innerHeight * 0.4, 1.2), 350);
    setTimeout(() => explode(window.innerWidth * 0.5, window.innerHeight * 0.7, 1.0), 500);
  }, 800);
});

// ---- EXPLOSION AU SCROLL (transitions de section) ----
let lastSection = '';
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.id !== lastSection) {
      lastSection = entry.target.id;
      const rect = entry.target.getBoundingClientRect();
      // explosion discrète sur le côté au changement de section
      setTimeout(() => {
        explode(Math.random() * window.innerWidth, window.innerHeight * 0.5, 0.8);
      }, 100);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- REVEAL AU SCROLL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.compagnie-text, .membre-card, .zidane-card, .spectacle-content, .spectacle-visuel, .contact-text, .contact-form').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ---- FORMULAIRE ----
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  // explosion de célébration
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      explode(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        1.2
      );
    }, i * 150);
  }
  // feedback utilisateur
  const btn = this.querySelector('.btn-submit');
  btn.textContent = 'Message envoyé ! Zidane est informé. 💥';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Envoyer 💥';
    btn.disabled = false;
    this.reset();
  }, 4000);
});

// ---- EASTER EGG : KONAMI CODE = ZIDANE MASSIF ----
let konamiSequence = [];
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', (e) => {
  konamiSequence.push(e.key);
  konamiSequence = konamiSequence.slice(-10);
  if (konamiSequence.join(',') === konamiCode.join(',')) {
    // MÉGA EXPLOSION ZIDANE
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        explode(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 2);
      }, i * 80);
    }
    alert('⚽ ZIDANE MODE ACTIVÉ ⚽\nMerci d\'avoir trouvé le code secret de la Cie Clouks.');
  }
});
