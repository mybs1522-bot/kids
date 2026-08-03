/* ==========================================================================
   AvadaLearn Kids - Modern Funky Interactive Logic
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
    if (el) el.textContent = totalStars;
    localStorage.setItem('kids_stars', totalStars);
  }

  function addStars(count) {
    totalStars += count;
    updateStarCounter();
    triggerConfetti();
  }

  // ==========================================================================
  // Currency Switcher Logic
  // ==========================================================================
  const currencySelect = document.getElementById('currency-select');
  const priceValues = document.querySelectorAll('.price-val');
  const currSymbols = document.querySelectorAll('.curr-symbol');
  const heroPrice = document.getElementById('hero-price');

  const currencySymbolsMap = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€',
    'INR': '₹',
    'AUD': 'A$'
  };

  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      const curr = e.target.value;
      const symbol = currencySymbolsMap[curr] || '£';

      currSymbols.forEach(s => s.textContent = symbol);
      priceValues.forEach(pv => {
        const key = `data-${curr.toLowerCase()}`;
        if (pv.getAttribute(key)) {
          pv.textContent = pv.getAttribute(key);
        }
      });

      if (heroPrice) {
        heroPrice.textContent = `${symbol}${curr === 'GBP' ? '6.99' : (curr === 'USD' ? '8.99' : '699')}`;
      }
    });
  }

  // ==========================================================================
  // Routine Tabs Switcher
  // ==========================================================================
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
  // Modals & Checkout Simulation
  // ==========================================================================
  const checkoutModal = document.getElementById('checkout-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const buyBtns = document.querySelectorAll('.buy-btn');
  const modalPackTitle = document.getElementById('modal-pack-title');
  const modalPriceDisplay = document.getElementById('modal-price-display');
  const checkoutForm = document.getElementById('checkout-form');

  buyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pack = btn.dataset.pack;
      const price = btn.dataset.price;
      const curr = currencySelect ? currencySelect.value : 'GBP';
      const symbol = currencySymbolsMap[curr] || '£';

      if (modalPackTitle) modalPackTitle.textContent = `Selected Pack: ${pack}`;
      if (modalPriceDisplay) modalPriceDisplay.textContent = `${symbol}${price}`;
      if (checkoutModal) checkoutModal.classList.remove('hidden');
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (checkoutModal) checkoutModal.classList.add('hidden');
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('checkout-name');
      const emailInput = document.getElementById('checkout-email');
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      const selarUrl = new URL('https://selar.com/33707a8z70');
      selarUrl.searchParams.set('currency', 'NGN');
      if (name) {
        selarUrl.searchParams.set('name', name);
        selarUrl.searchParams.set('fullname', name);
      }
      if (email) {
        selarUrl.searchParams.set('email', email);
      }

      window.location.href = selarUrl.toString();
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

  // Audio Welcome Button
  const btnSayHello = document.getElementById('btn-say-hello');
  if (btnSayHello) {
    btnSayHello.addEventListener('click', () => {
      speakText("Welcome to AvadaLearn Kids! Discover our 20-week printable master plan for fun, screen-free learning!");
    });
  }

  // ==========================================================================
  // Piano Keyboard Logic (White Keys & Black Keys)
  // ==========================================================================
  const noteFrequencies = {
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25
  };

  const keyToNoteMap = {
    'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
    'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
    'u': 'A#4', 'j': 'B4', 'k': 'C5'
  };

  function playNote(freq, duration = 0.6) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(1.0, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  const pianoKeys = document.querySelectorAll('.piano-key');
  pianoKeys.forEach(keyEl => {
    keyEl.addEventListener('click', () => {
      const note = keyEl.dataset.note;
      if (noteFrequencies[note]) {
        playNote(noteFrequencies[note]);
        keyEl.classList.add('active');
        setTimeout(() => keyEl.classList.remove('active'), 180);
      }
    });
  });

  // Physical Keyboard Shortcuts (A, S, D, F, G, H, J, K / W, E, T, Y, U)
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const key = e.key.toLowerCase();
    const note = keyToNoteMap[key];
    if (note && noteFrequencies[note]) {
      const keyEl = document.querySelector(`.piano-key[data-note="${note}"]`);
      if (keyEl) {
        playNote(noteFrequencies[note]);
        keyEl.classList.add('active');
        setTimeout(() => keyEl.classList.remove('active'), 180);
      }
    }
  });

  const songBtn = document.getElementById('play-song-btn');
  if (songBtn) {
    const twinkleSong = ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'];
    let isPlayingSong = false;

    songBtn.addEventListener('click', async () => {
      if (isPlayingSong) return;
      isPlayingSong = true;
      songBtn.textContent = '🎶 Playing Song...';

      for (let note of twinkleSong) {
        const keyEl = document.querySelector(`.piano-key[data-note="${note}"]`);
        if (keyEl && noteFrequencies[note]) {
          playNote(noteFrequencies[note], 0.5);
          keyEl.classList.add('active');
          setTimeout(() => keyEl.classList.remove('active'), 200);
        }
        await new Promise(res => setTimeout(res, 450));
      }

      songBtn.textContent = '🎼 Auto-Play "Twinkle Twinkle Little Star"';
      isPlayingSong = false;
      addStars(2);
    });
  }

  // ==========================================================================
  // Balloon Pop Game Logic
  // ==========================================================================
  const balloonArena = document.getElementById('balloon-arena');
  const startBalloonBtn = document.getElementById('start-balloon-game');
  const gameOverlay = document.getElementById('game-overlay');
  const gameScoreEl = document.getElementById('game-score');
  const highScoreEl = document.getElementById('high-score');

  let gameScore = 0;
  let highScore = parseInt(localStorage.getItem('kids_balloon_highscore') || '0', 10);
  let gameInterval = null;
  let isGameRunning = false;

  if (highScoreEl) highScoreEl.textContent = highScore;

  function popSynthSound() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  function spawnBalloon() {
    if (!isGameRunning || !balloonArena) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon-item';
    const colors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#9b59b6', '#ff78ae'];
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.textContent = ['🎈', '⭐', '🎁', '🍬', '🦄'][Math.floor(Math.random() * 5)];

    const arenaWidth = balloonArena.clientWidth - 70;
    balloon.style.left = `${Math.max(10, Math.floor(Math.random() * arenaWidth))}px`;
    const floatDuration = Math.random() * 2 + 3;
    balloon.style.animationDuration = `${floatDuration}s`;

    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      popSynthSound();
      gameScore += 10;
      if (gameScoreEl) gameScoreEl.textContent = gameScore;
      balloon.style.transform = 'scale(1.4)';
      balloon.style.opacity = '0';
      setTimeout(() => balloon.remove(), 100);
    });

    balloonArena.appendChild(balloon);
    setTimeout(() => { if (balloon.parentNode) balloon.remove(); }, floatDuration * 1000);
  }

  if (startBalloonBtn) {
    startBalloonBtn.addEventListener('click', () => {
      if (isGameRunning) return;
      isGameRunning = true;
      gameScore = 0;
      if (gameScoreEl) gameScoreEl.textContent = '0';
      if (gameOverlay) gameOverlay.style.display = 'none';
      document.querySelectorAll('.balloon-item').forEach(b => b.remove());

      gameInterval = setInterval(spawnBalloon, 700);

      setTimeout(() => {
        clearInterval(gameInterval);
        isGameRunning = false;
        if (gameOverlay) {
          gameOverlay.style.display = 'flex';
          gameOverlay.querySelector('h3').textContent = `🎉 Game Over! Score: ${gameScore}`;
        }
        if (gameScore > highScore) {
          highScore = gameScore;
          localStorage.setItem('kids_balloon_highscore', highScore);
          if (highScoreEl) highScoreEl.textContent = highScore;
        }
        addStars(Math.floor(gameScore / 20));
      }, 30000);
    });
  }

  // ==========================================================================
  // Magic Canvas Logic
  // ==========================================================================
  const canvas = document.getElementById('doodle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentMode = 'draw';
    let currentColor = '#ff4757';
    let currentSize = 10;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colorPicker = document.getElementById('brush-color');
    if (colorPicker) colorPicker.addEventListener('input', (e) => currentColor = e.target.value);

    const brushSlider = document.getElementById('brush-size');
    if (brushSlider) brushSlider.addEventListener('input', (e) => currentSize = e.target.value);

    const btnDraw = document.getElementById('tool-draw');
    const btnStar = document.getElementById('tool-stamp-star');
    const btnHeart = document.getElementById('tool-stamp-heart');
    const btnEraser = document.getElementById('tool-eraser');
    const btnClear = document.getElementById('tool-clear');

    function setToolActive(activeBtn, mode) {
      [btnDraw, btnStar, btnHeart, btnEraser].forEach(b => b && b.classList.remove('active'));
      if (activeBtn) activeBtn.classList.add('active');
      currentMode = mode;
    }

    if (btnDraw) btnDraw.addEventListener('click', () => setToolActive(btnDraw, 'draw'));
    if (btnStar) btnStar.addEventListener('click', () => setToolActive(btnStar, 'stamp-star'));
    if (btnHeart) btnHeart.addEventListener('click', () => setToolActive(btnHeart, 'stamp-heart'));
    if (btnEraser) btnEraser.addEventListener('click', () => setToolActive(btnEraser, 'eraser'));
    if (btnClear) btnClear.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function startDraw(e) {
      isDrawing = true;
      const pos = getPos(e);
      if (currentMode === 'stamp-star' || currentMode === 'stamp-heart') {
        ctx.font = `${currentSize * 3}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(currentMode === 'stamp-star' ? '⭐' : '❤️', pos.x, pos.y);
        isDrawing = false;
        return;
      }
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.strokeStyle = currentMode === 'eraser' ? '#ffffff' : currentColor;
      ctx.lineWidth = currentMode === 'eraser' ? currentSize * 2 : currentSize;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', () => isDrawing = false);
  }

  // Confetti Animation
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
