/* ==========================================================================
   Kids Playland - Interactive Logic, Web Audio Synth, Games & Canvas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let totalStars = parseInt(localStorage.getItem('kids_stars') || '0', 10);
  updateStarCounter();

  // Audio Context Initialization
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Text to Speech
  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.2; // friendly kid voice
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
  // SECTION 1: Rainbow Xylophone Logic
  // ==========================================================================
  const noteFrequencies = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25
  };

  function playNote(freq, duration = 0.6) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine'; // warm xylophone tone
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Bell-like envelope
    gain.gain.setValueAtTime(1.0, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  const xyloBars = document.querySelectorAll('.xylophone-bar');
  xyloBars.forEach(bar => {
    bar.addEventListener('click', () => {
      const note = bar.dataset.note;
      if (noteFrequencies[note]) {
        playNote(noteFrequencies[note]);
        bar.classList.add('active');
        setTimeout(() => bar.classList.remove('active'), 150);
      }
    });
  });

  // Automated Twinkle Twinkle Song
  const songBtn = document.getElementById('play-song-btn');
  if (songBtn) {
    const twinkleSong = [
      'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4',
      'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4'
    ];
    let isPlayingSong = false;

    songBtn.addEventListener('click', async () => {
      if (isPlayingSong) return;
      isPlayingSong = true;
      songBtn.textContent = '🎶 Playing Song...';

      for (let note of twinkleSong) {
        const bar = document.querySelector(`.xylophone-bar[data-note="${note}"]`);
        if (bar) {
          playNote(noteFrequencies[note], 0.5);
          bar.classList.add('active');
          setTimeout(() => bar.classList.remove('active'), 200);
        }
        await new Promise(res => setTimeout(res, 450));
      }

      songBtn.textContent = '🎼 Play "Twinkle Twinkle Little Star"';
      isPlayingSong = false;
      addStars(2);
    });
  }

  // ==========================================================================
  // SECTION 2: Animal Sounds & Facts Logic
  // ==========================================================================
  function playAnimalSynthSound(soundType) {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (soundType === 'roar') { // Lion
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.8);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    } else if (soundType === 'trumpet') { // Elephant
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.3);
      osc.frequency.linearRampToValueAtTime(450, now + 0.7);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
    } else if (soundType === 'quack') { // Duck
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.25);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    } else if (soundType === 'ribbit') { // Frog
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.2);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    } else { // Default chirp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  const animalCards = document.querySelectorAll('.animal-card');
  const factBox = document.getElementById('animal-fact-box');
  const factText = document.getElementById('fact-text');

  animalCards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name;
      const sound = card.dataset.sound;
      const fact = card.dataset.fact;

      playAnimalSynthSound(sound);
      speakText(`${name}! ${fact}`);

      if (factBox && factText) {
        factBox.classList.remove('hidden');
        factText.textContent = `🦁 ${name}: ${fact}`;
      }
    });
  });

  // Hero Welcome Voice Button
  const btnSayHello = document.getElementById('btn-say-hello');
  if (btnSayHello) {
    btnSayHello.addEventListener('click', () => {
      speakText("Welcome to Kids Playland! Have a super fun time exploring music, games, animals, and drawing!");
    });
  }

  const btnExplore = document.getElementById('btn-explore');
  if (btnExplore) {
    btnExplore.addEventListener('click', () => {
      document.getElementById('xylophone').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // SECTION 3: Balloon Pop Game Logic
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
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.backgroundColor = randomColor;

    const emojis = ['🎈', '⭐', '🎁', '🍬', '🦄'];
    balloon.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const arenaWidth = balloonArena.clientWidth - 70;
    const randomX = Math.max(10, Math.floor(Math.random() * arenaWidth));
    balloon.style.left = `${randomX}px`;

    const floatDuration = Math.random() * 2 + 3; // 3 to 5 seconds float
    balloon.style.animationDuration = `${floatDuration}s`;

    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      popSynthSound();
      gameScore += 10;
      if (gameScoreEl) gameScoreEl.textContent = gameScore;

      // Pop Animation
      balloon.style.transform = 'scale(1.4)';
      balloon.style.opacity = '0';
      setTimeout(() => balloon.remove(), 100);
    });

    balloonArena.appendChild(balloon);

    // Auto remove after animation completes
    setTimeout(() => {
      if (balloon.parentNode) balloon.remove();
    }, floatDuration * 1000);
  }

  if (startBalloonBtn) {
    startBalloonBtn.addEventListener('click', () => {
      if (isGameRunning) return;
      isGameRunning = true;
      gameScore = 0;
      if (gameScoreEl) gameScoreEl.textContent = '0';
      if (gameOverlay) gameOverlay.style.display = 'none';

      // Clear existing balloons
      document.querySelectorAll('.balloon-item').forEach(b => b.remove());

      gameInterval = setInterval(spawnBalloon, 700);

      // 30 Seconds timer
      setTimeout(() => {
        clearInterval(gameInterval);
        isGameRunning = false;
        if (gameOverlay) {
          gameOverlay.style.display = 'flex';
          gameOverlay.querySelector('h3').textContent = `🎉 Game Over! Final Score: ${gameScore}`;
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
  // SECTION 4: Magic Doodle Canvas Logic
  // ==========================================================================
  const canvas = document.getElementById('doodle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentMode = 'draw'; // 'draw', 'stamp-star', 'stamp-heart', 'eraser'
    let currentColor = '#ff4757';
    let currentSize = 10;

    // Resize canvas internal buffer
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color Swatches & Color Picker
    const colorPicker = document.getElementById('brush-color');
    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => currentColor = e.target.value);
    }

    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        currentColor = swatch.dataset.color;
        if (colorPicker) colorPicker.value = currentColor;
      });
    });

    const brushSlider = document.getElementById('brush-size');
    if (brushSlider) {
      brushSlider.addEventListener('input', (e) => currentSize = e.target.value);
    }

    // Tool Switchers
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

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      isDrawing = true;
      const pos = getPos(e);
      if (currentMode === 'stamp-star' || currentMode === 'stamp-heart') {
        drawStamp(pos.x, pos.y, currentMode);
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

      if (currentMode === 'eraser') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = currentSize * 2;
      } else {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentSize;
      }

      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function stopDraw() {
      isDrawing = false;
    }

    function drawStamp(x, y, mode) {
      ctx.font = `${currentSize * 3}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const emoji = mode === 'stamp-star' ? '⭐' : '❤️';
      ctx.fillText(emoji, x, y);
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);
  }

  // ==========================================================================
  // SECTION 5: Quiz Game Logic
  // ==========================================================================
  const quizQuestions = [
    {
      q: "How many legs does a cute puppy 🐶 have?",
      opts: ["2", "4", "6", "8"],
      ans: "4",
      speech: "How many legs does a puppy have?"
    },
    {
      q: "What color is the bright sun ☀️ in the sky?",
      opts: ["Blue", "Green", "Yellow", "Purple"],
      ans: "Yellow",
      speech: "What color is the bright sun in the sky?"
    },
    {
      q: "Which animal says 'QUACK QUACK'? 🦆",
      opts: ["Duck", "Lion", "Cat", "Frog"],
      ans: "Duck",
      speech: "Which animal says quack quack?"
    },
    {
      q: "What shape is a delicious round pizza 🍕?",
      opts: ["Square", "Circle", "Triangle", "Star"],
      ans: "Circle",
      speech: "What shape is a delicious round pizza?"
    },
    {
      q: "If you have 2 apples 🍎 and get 1 more, how many apples do you have?",
      opts: ["1", "2", "3", "5"],
      ans: "3",
      speech: "If you have 2 apples and get 1 more, how many apples do you have?"
    }
  ];

  let currentQuizIdx = 0;
  const qNum = document.getElementById('quiz-num');
  const qTitle = document.getElementById('quiz-question');
  const qOptsContainer = document.getElementById('quiz-options');
  const qFeedback = document.getElementById('quiz-feedback');

  function renderQuiz() {
    if (!qTitle || !qOptsContainer) return;
    const q = quizQuestions[currentQuizIdx];
    if (qNum) qNum.textContent = currentQuizIdx + 1;
    qTitle.textContent = q.q;
    qOptsContainer.innerHTML = '';
    if (qFeedback) qFeedback.className = 'quiz-feedback hidden';

    speakText(q.speech);

    q.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => checkAnswer(opt, q.ans));
      qOptsContainer.appendChild(btn);
    });
  }

  function checkAnswer(selected, correct) {
    if (!qFeedback) return;
    qFeedback.classList.remove('hidden');

    if (selected === correct) {
      qFeedback.textContent = '🌟 Correct! Awesome Job! (+1 Star)';
      qFeedback.className = 'quiz-feedback correct';
      speakText("Awesome job! You got it right!");
      addStars(1);

      setTimeout(() => {
        currentQuizIdx = (currentQuizIdx + 1) % quizQuestions.length;
        renderQuiz();
      }, 1800);
    } else {
      qFeedback.textContent = '❌ Oops! Try again, super star!';
      qFeedback.className = 'quiz-feedback wrong';
      speakText("Oops! Try again!");
    }
  }

  renderQuiz();

  // ==========================================================================
  // Confetti Particle Generator
  // ==========================================================================
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
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 12,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.3; // gravity
          p.life -= 0.02;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (alive) {
        requestAnimationFrame(renderParticles);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    renderParticles();
  }
});
