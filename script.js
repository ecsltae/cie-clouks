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

// ---- DÉBRIS (morceaux solides) ----
class Debris {
  constructor(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 14 + 3;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - Math.random() * 8;
    this.gravity = 0.45;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.3;
    this.w = Math.random() * 10 + 3;
    this.h = Math.random() * 5 + 2;
    this.alpha = 1;
    this.decay = Math.random() * 0.008 + 0.005;
    // couleur : brun, gris, noir brûlé
    const r = Math.floor(Math.random() * 80 + 30);
    const g = Math.floor(Math.random() * 50 + 15);
    const b = Math.floor(Math.random() * 20);
    this.color = `rgb(${r},${g},${b})`;
  }
  update() {
    this.vx *= 0.98;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }
}

// ---- FUMÉE ----
class Smoke {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 30;
    this.y = y + (Math.random() - 0.5) * 30;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = -(Math.random() * 1.5 + 0.5);
    this.radius = Math.random() * 20 + 15;
    this.maxRadius = this.radius * (Math.random() * 3 + 3);
    this.alpha = Math.random() * 0.4 + 0.2;
    this.decay = Math.random() * 0.004 + 0.002;
    const g = Math.floor(Math.random() * 40 + 20);
    this.color = `rgb(${g},${g},${g})`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.99;
    this.radius = Math.min(this.radius + 1.2, this.maxRadius);
    this.alpha -= this.decay;
  }
  draw() {
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    grad.addColorStop(0, this.color.replace(')', `, ${this.alpha})`).replace('rgb', 'rgba'));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

// ---- BOULES DE FEU ----
class Fireball {
  constructor(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 10 + 2;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - Math.random() * 4;
    this.gravity = 0.18;
    this.radius = Math.random() * 18 + 8;
    this.alpha = 1;
    this.decay = Math.random() * 0.025 + 0.015;
    // feu : orange → rouge → noir
    this.hue = Math.random() * 30 + 5; // 5–35 (orange/rouge)
  }
  update() {
    this.vx *= 0.95;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.radius *= 0.97;
    this.alpha -= this.decay;
    this.hue = Math.max(0, this.hue - 0.5);
  }
  draw() {
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    grad.addColorStop(0,   `hsla(60, 100%, 90%, ${this.alpha})`);   // blanc chaud au centre
    grad.addColorStop(0.2, `hsla(${this.hue + 20}, 100%, 70%, ${this.alpha})`); // jaune
    grad.addColorStop(0.6, `hsla(${this.hue}, 100%, 45%, ${this.alpha * 0.8})`); // orange/rouge
    grad.addColorStop(1,   `hsla(0, 0%, 5%, 0)`);                   // bord sombre
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

// ---- ÉCLATS (sparks courts) ----
class Spark {
  constructor(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 20 + 8;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - Math.random() * 5;
    this.gravity = 0.4;
    this.alpha = 1;
    this.decay = Math.random() * 0.04 + 0.025;
    this.color = Math.random() > 0.5
      ? `rgba(255, ${Math.floor(Math.random() * 120 + 80)}, 0, 1)`
      : `rgba(255, 240, 180, 1)`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.93;
    this.vy += this.gravity;
    this.alpha -= this.decay;
  }
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 2.5, this.y - this.vy * 2.5);
    ctx.strokeStyle = this.color.replace('1)', `${this.alpha})`);
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

let fireballs = [];
let smokes = [];
let debris = [];
let sparks = [];
let shockwaves = [];

function explode(x, y, intensity = 1) {
  // 1. flash blanc/orange brutal
  const flash = document.createElement('div');
  flash.className = 'explosion-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 250);

  // 2. onde de choc (double anneau)
  shockwaves.push({ x, y, r: 0, alpha: 0.9, speed: 14, color: '255,200,80' });
  shockwaves.push({ x, y, r: 0, alpha: 0.5, speed: 7,  color: '180,100,30' });

  // 3. boules de feu
  const fbCount = Math.floor(30 * intensity);
  for (let i = 0; i < fbCount; i++) fireballs.push(new Fireball(x, y));

  // 4. fumée (beaucoup, elle persiste)
  const smCount = Math.floor(25 * intensity);
  for (let i = 0; i < smCount; i++) smokes.push(new Smoke(x, y));
  // fumée supplémentaire après un léger délai
  setTimeout(() => {
    for (let i = 0; i < Math.floor(15 * intensity); i++) smokes.push(new Smoke(x, y));
  }, 120);

  // 5. débris
  const dbCount = Math.floor(40 * intensity);
  for (let i = 0; i < dbCount; i++) debris.push(new Debris(x, y));

  // 6. éclats
  const spCount = Math.floor(20 * intensity);
  for (let i = 0; i < spCount; i++) sparks.push(new Spark(x, y));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // shockwaves
  shockwaves = shockwaves.filter(s => s.alpha > 0);
  shockwaves.forEach(s => {
    s.r += s.speed;
    s.alpha -= 0.04;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${s.color}, ${s.alpha})`;
    ctx.lineWidth = s.speed > 10 ? 4 : 2;
    ctx.stroke();
  });

  // ordre de rendu : débris → feu → fumée (par-dessus) → éclats
  debris  = debris.filter(d => d.alpha > 0);
  fireballs = fireballs.filter(f => f.alpha > 0);
  smokes  = smokes.filter(s => s.alpha > 0);
  sparks  = sparks.filter(s => s.alpha > 0);

  debris.forEach(d => { d.update(); d.draw(); });
  fireballs.forEach(f => { f.update(); f.draw(); });
  smokes.forEach(s => { s.update(); s.draw(); });
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
    setTimeout(() => explode(window.innerWidth * 0.2, window.innerHeight * 0.3, 1.5), 250);
    setTimeout(() => explode(window.innerWidth * 0.8, window.innerHeight * 0.4, 1.5), 450);
    setTimeout(() => explode(window.innerWidth * 0.5, window.innerHeight * 0.75, 1.2), 650);
  }, 800);
});

// ---- EXPLOSION AU SCROLL (transitions de section) ----
let lastSection = '';
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.id !== lastSection) {
      lastSection = entry.target.id;
      setTimeout(() => {
        explode(Math.random() * window.innerWidth, window.innerHeight * 0.5, 0.9);
      }, 100);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// ---- REVEAL AU SCROLL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.compagnie-text, .membre-card, .zidane-card, .spectacle-content, .spectacle-visuel, .contact-text, .contact-form').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ---- FORMULAIRE ----
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      explode(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 1.2);
    }, i * 180);
  }
  const btn = this.querySelector('.btn-submit');
  btn.textContent = 'Message envoyé ! Zidane est informé. 💥';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Envoyer 💥';
    btn.disabled = false;
    this.reset();
  }, 4000);
});

// ---- EASTER EGG : KONAMI CODE ----
let konamiSequence = [];
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', (e) => {
  konamiSequence.push(e.key);
  konamiSequence = konamiSequence.slice(-10);
  if (konamiSequence.join(',') === konamiCode.join(',')) {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        explode(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 2.5);
      }, i * 100);
    }
    alert('⚽ ZIDANE MODE ACTIVÉ ⚽\nMerci d\'avoir trouvé le code secret de la Cie Clouks.');
  }
});
