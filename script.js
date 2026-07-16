/* =========================================================
   1. Mobile nav toggle
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('is-open');
  navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   2. Scroll-reveal (IntersectionObserver)
   ========================================================= */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

/* =========================================================
   3. Animated traffic-monitor chart (hero visual)
   ========================================================= */
(function () {
  const W = 480, H = 200, POINTS = 40;
  const path   = document.getElementById('chartBaseline');
  const marker = document.getElementById('chartMarker');
  const foot   = document.getElementById('monitorFoot');

  if (!path) return;

  const msgs = [
    'scanning packets…',
    'baseline established.',
    '⚠ anomaly spike detected',
    'random-forest classifying…',
    '✓ flagged — mitigation applied',
    'monitoring resumed.',
  ];
  let msgIdx = 0;
  let data = Array.from({ length: POINTS }, () => H / 2 + (Math.random() - 0.5) * 30);

  function buildPath(pts) {
    return pts.map((y, x) => {
      const px = (x / (POINTS - 1)) * W;
      return (x === 0 ? 'M' : 'L') + px.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
  }

  function tick() {
    const spiked = Math.random() < 0.08;
    const newY = spiked
      ? H * 0.08 + Math.random() * H * 0.12
      : H / 2 + (Math.random() - 0.5) * 36;

    data.shift();
    data.push(newY);
    path.setAttribute('d', buildPath(data));

    marker.setAttribute('cx', W);
    marker.setAttribute('cy', data[data.length - 1]);
    marker.setAttribute('opacity', '1');

    if (spiked) {
      msgIdx = (msgIdx + 1) % msgs.length;
      foot.textContent = msgs[msgIdx];
      foot.style.color = msgIdx === 2 ? '#f2a65a' : msgIdx === 4 ? '#4fd1a5' : '#8fa89b';
    }
  }

  setInterval(tick, 160);
})();

/* =========================================================
   4. Contact form validation
   ========================================================= */
const form   = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

function showError(fieldId, msg) {
  const el = document.querySelector('[data-for="' + fieldId + '"]');
  if (el) el.textContent = msg;
}
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
}
function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrors();
  status.textContent = '';

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let valid = true;

  if (!name) { showError('name', 'Name is required.'); valid = false; }
  if (!email) { showError('email', 'Email is required.'); valid = false; }
  else if (!validateEmail(email)) { showError('email', 'Enter a valid email address.'); valid = false; }
  if (!message) { showError('message', 'Message cannot be empty.'); valid = false; }
  else if (message.length < 10) { showError('message', 'Message must be at least 10 characters.'); valid = false; }

  if (!valid) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Send message';
    status.textContent = "✓ Message sent — I'll get back to you soon.";
    form.reset();
  }, 1400);
});

/* =========================================================
   5. Active nav link on scroll
   ========================================================= */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id
            ? 'var(--text)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
