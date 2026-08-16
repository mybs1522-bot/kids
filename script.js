/* ==========================================================================
   AvadaLearn Kids - Modern Funky 10/10 Interactive Logic & Evergreen Timer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global Star Counter
  let totalStars = parseInt(localStorage.getItem('kids_stars') || '0', 10);
  updateStarCounter();

  // Audio Context Initialization
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // Text to Speech
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  }

  function updateStarCounter() {
    const el = document.getElementById('star-score');
    if (el) el.textContent = '9,000+';
  }

  function addStars(count) {
    totalStars += count;
    triggerConfetti();
  }

  // ==========================================================================
  // EVERGREEN COUNTDOWN TIMER LOGIC (4 HOURS 27 MINUTES)
  // ==========================================================================
  const TIMER_DURATION_MS = (4 * 3600 + 27 * 60) * 1000; // 4 hours 27 mins in ms

  function getTimerEnd() {
    let storedEnd = parseInt(localStorage.getItem('kids_timer_end') || '0', 10);
    const now = Date.now();
    if (!storedEnd || storedEnd <= now) {
      storedEnd = now + TIMER_DURATION_MS;
      localStorage.setItem('kids_timer_end', storedEnd.toString());
    }
    return storedEnd;
  }

  let timerEnd = getTimerEnd();

  function updateEvergreenTimers() {
    const now = Date.now();
    let remainingMs = timerEnd - now;

    if (remainingMs <= 0) {
      // Reset evergreen timer back to 4h 27m
      timerEnd = now + TIMER_DURATION_MS;
      localStorage.setItem('kids_timer_end', timerEnd.toString());
      remainingMs = TIMER_DURATION_MS;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    const timerStr = `${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
    const compactStr = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

    document.querySelectorAll('.countdown-timer').forEach(el => {
      el.textContent = timerStr;
    });

    document.querySelectorAll('.inline-timer').forEach(el => {
      el.textContent = compactStr;
    });
  }

  updateEvergreenTimers();
  setInterval(updateEvergreenTimers, 1000);

  // ==========================================================================
  // Hamburger Navigation Menu Logic
  // ==========================================================================
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerToggle && navMenu) {
    hamburgerToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    // Close mobile nav menu when any nav link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `tab-${btn.dataset.tab}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // ==========================================================================
  // 26 Animal Buddy Cards Interactivity
  // ==========================================================================
  const buddyCards = document.querySelectorAll('.buddy-card');
  buddyCards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      speakText(`${name}! Ready to learn!`);
      playCheerSound();
      addStars(1);
    });
  });

  function playCheerSound() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  // ==========================================================================
  // FAQ Accordion Toggling
  // ==========================================================================
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('open');
      const span = btn.querySelector('span');
      if (span) span.textContent = item.classList.contains('open') ? '−' : '+';
    });
  });

  // ==========================================================================
  // Stripe $29 Checkout Integration & Post-Payment Success Check
  // ==========================================================================
  const checkoutModal = document.getElementById('checkout-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const buyBtns = document.querySelectorAll('.buy-btn');
  const modalPackTitle = document.getElementById('modal-pack-title');
  const modalPriceDisplay = document.getElementById('modal-price-display');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutSubmitBtn = document.getElementById('checkout-submit-btn');

  const successModal = document.getElementById('success-modal');
  const closeSuccessModalBtn = document.getElementById('close-success-modal');

  // Check URL parameters for Stripe success return
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('success') && urlParams.get('success') === 'true') {
    if (successModal) {
      const email = urlParams.get('email');
      const emailText = document.getElementById('success-email-text');
      if (email && emailText) {
        emailText.textContent = `Your instant 3.11 GB download access link has been sent to ${email}.`;
      }
      successModal.classList.remove('hidden');
      addStars(50);
      setTimeout(triggerConfetti, 500);
    }
  }

  if (closeSuccessModalBtn && successModal) {
    closeSuccessModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
    });
  }

  buyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pack = btn.dataset.pack || '9,000+ Worksheets All-In-One Bundle';
      const price = btn.dataset.price || '29';

      if (modalPackTitle) modalPackTitle.textContent = pack;
      if (modalPriceDisplay) modalPriceDisplay.textContent = `$${price}`;
      if (checkoutModal) checkoutModal.classList.remove('hidden');
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (checkoutModal) checkoutModal.classList.add('hidden');
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('checkout-name');
      const emailInput = document.getElementById('checkout-email');
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      if (checkoutSubmitBtn) {
        checkoutSubmitBtn.disabled = true;
        checkoutSubmitBtn.innerHTML = '⏳ Opening Stripe Card Checkout...';
      }

      const endpoints = [
        'api/create-checkout-session/',
        '/api/create-checkout-session/',
        'https://kids-roan-nine.vercel.app/api/create-checkout-session/'
      ];

      let sessionUrl = null;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              sessionUrl = data.url;
              break;
            }
          }
        } catch (err) {
          console.warn('Endpoint failed:', endpoint, err);
        }
      }

      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        alert('Could not initiate Stripe Checkout. Please refresh and try again.');
        if (checkoutSubmitBtn) {
          checkoutSubmitBtn.disabled = false;
          checkoutSubmitBtn.innerHTML = '💳 Pay $29 via Stripe (Cards & Apple Pay)';
        }
      }
    });
  }

  // Video Modal
  const videoModal = document.getElementById('video-modal');
  const openVideoBtn = document.getElementById('open-video-modal');
  const closeVideoBtn = document.getElementById('close-video-modal');

  if (openVideoBtn) {
    openVideoBtn.addEventListener('click', () => {
      if (videoModal) videoModal.classList.remove('hidden');
    });
  }
  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', () => {
      if (videoModal) videoModal.classList.add('hidden');
    });
  }

  // Confetti Particle Generator
  function triggerConfetti() {
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#9b59b6', '#ff78ae'];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: window.innerWidth / 2, y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.7) * 12,
        size: Math.random() * 8 + 4, color: colors[Math.floor(Math.random() * colors.length)], life: 1
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.life > 0) {
          alive = true; p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life -= 0.02;
          ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        }
      });
      if (alive) requestAnimationFrame(renderParticles);
      else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
    renderParticles();
  }
});
