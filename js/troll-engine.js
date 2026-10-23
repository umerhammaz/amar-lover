window.TrollEngine = {
  audioCtx: null,

  init() {
    this.setupExitIntent();
    this.setupCheckoutTrolls();
    this.setupCrushChat();
  },

  playTone(freq, duration, type = 'sine') {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (_) {}
  },

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  },

  triggerTearRain(count = 25) {
    const container = document.getElementById('tear-container');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const tear = document.createElement('div');
      tear.className = 'tear-drop';
      tear.textContent = ['💧', '😭', '💔', '🥺'][Math.floor(Math.random() * 4)];
      tear.style.left = `${Math.random() * 100}vw`;
      tear.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      tear.style.animationDelay = `${Math.random() * 0.8}s`;
      container.appendChild(tear);
      setTimeout(() => tear.remove(), 4000);
    }
  },

  setupExitIntent() {
    const modal = document.getElementById('exit-modal');
    let triggered = false;

    document.documentElement.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !triggered) {
        triggered = true;
        modal.classList.add('active');
        this.playTone(180, 0.4, 'sawtooth');
      }
    });

    document.getElementById('exit-stay-btn').addEventListener('click', () => {
      modal.classList.remove('active');
      this.showToast('Good choice. Aashiq kabhi maidan nahi chhorta.');
    });

    document.getElementById('exit-leave-btn').addEventListener('click', () => {
      modal.classList.remove('active');
      this.showToast('Jao... sab chale jaate hain ek din.');
    });
  },

  setupCheckoutTrolls() {
    const checkoutModal = document.getElementById('checkout-modal');
    const triggerBtn = document.getElementById('checkout-trigger-btn');
    const closeBtn = document.getElementById('checkout-close-btn');
    const couponInput = document.getElementById('coupon-code-input');
    const couponBtn = document.getElementById('apply-coupon-btn');
    const couponFeedback = document.getElementById('coupon-feedback');
    const confirmBtn = document.getElementById('confirm-order-btn');

    triggerBtn.addEventListener('click', () => {
      if (window.MajnuCart.items.length === 0) {
        this.showToast('Cart khali hai, pehle koi gham toh select kar lo!');
        return;
      }
      window.MajnuCart.close();
      checkoutModal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
    });

    couponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      couponFeedback.className = 'coupon-feedback';

      if (code === 'AMMINAHIMAANEGI') {
        couponFeedback.classList.add('success');
        couponFeedback.textContent = '✅ Code Applied: 100% Reality Check! Rishta cancelled permanently.';
        this.playTone(440, 0.2);
      } else if (code === 'ILOVEYOU') {
        couponFeedback.classList.add('error');
        couponFeedback.textContent = '❌ Error: You are permanently demoted to "Acha Dost" status.';
        this.playTone(140, 0.3, 'sawtooth');
      } else if (code === 'MAAF_KARDO') {
        couponFeedback.classList.add('success');
        couponFeedback.textContent = '😭 Maafi namumkin hai. Screen weeping protocol activated...';
        this.triggerTearRain(35);
        this.playTone(220, 0.5, 'triangle');
      } else if (code === 'BESTFRIEND') {
        couponFeedback.classList.add('error');
        couponFeedback.textContent = '⚠ Alert: Status demoted from Majnu to "Bhai".';
      } else {
        couponFeedback.classList.add('error');
        couponFeedback.textContent = '❌ Invalid Coupon: Uss ke dil ki tarah yahan bhi koi jagah nahi.';
      }
    });

    confirmBtn.addEventListener('click', () => {
      const selected = document.querySelector('input[name="payment-method"]:checked').value;

      if (selected === 'self_respect') {
        alert('Transaction Failed (Code 402):\nInsufficient Self-Respect balance in your emotional account!');
        this.playTone(120, 0.4, 'sawtooth');
      } else if (selected === 'sadapay') {
        this.triggerTearRain(40);
        alert('SadaPay Activated:\nPayment processed via tears. Rider is currently crying on the way.');
        checkoutModal.classList.remove('active');
        window.MajnuCart.items = [];
        window.MajnuCart.updateBadge();
        window.MajnuCart.render();
      } else if (selected === 'royepay') {
        alert('RoyePay Confirmed:\nCharged 500 Aansoo directly from your eyes.');
        checkoutModal.classList.remove('active');
        window.MajnuCart.items = [];
        window.MajnuCart.updateBadge();
        window.MajnuCart.render();
      }
    });
  },

  setupCrushChat() {
    const trigger = document.getElementById('chat-trigger-btn');
    const windowEl = document.getElementById('chat-window');
    const closeBtn = document.getElementById('chat-close-btn');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const status = document.getElementById('chat-status');

    trigger.addEventListener('click', () => windowEl.classList.toggle('hidden'));
    closeBtn.addEventListener('click', () => windowEl.classList.add('hidden'));

    const botReplies = [
      'Hmm.',
      'Achha.',
      'K.',
      'Mai abhi busy hoon, baad me baat karti hu.',
      'Seen at 5:32 PM.',
      'Hum sirf ache dost hain na please aisi baatein mat karo.',
      'Mera phone recharge karwa do pehle.',
      'Mene so jana hai, good night.'
    ];

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const userMsg = document.createElement('div');
      userMsg.className = 'msg user';
      userMsg.textContent = text;
      messages.appendChild(userMsg);
      input.value = '';
      messages.scrollTop = messages.scrollHeight;

      status.textContent = 'Typing paragraph...';
      this.playTone(500, 0.05);

      setTimeout(() => {
        status.textContent = 'Online';
        const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
        const botMsg = document.createElement('div');
        botMsg.className = 'msg bot';
        botMsg.textContent = reply;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
        this.playTone(260, 0.15);
      }, 1400);
    });
  },

  makeButtonEvasive(buttonEl) {
    let escapes = 0;
    const phrases = [
      'Itni asaani se nahi!',
      'Pehle message seen karwa!',
      'Friendzone warning!',
      'Izzat bachao bhaago!',
      'Error 404: Pyaar Not Found'
    ];

    const dodge = (e) => {
      escapes++;
      const maxOffset = 130;
      const randX = (Math.random() - 0.5) * maxOffset * 2;
      const randY = (Math.random() - 0.5) * maxOffset * 2;
      buttonEl.style.transform = `translate(${randX}px, ${randY}px)`;

      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      buttonEl.textContent = `${randomPhrase} (${escapes})`;
      window.TrollEngine.playTone(350 + escapes * 25, 0.08);

      if (escapes >= 7) {
        buttonEl.textContent = 'Sold Out To Your Best Friend';
        buttonEl.disabled = true;
        buttonEl.style.transform = 'none';
        buttonEl.removeEventListener('mouseenter', dodge);
      }
    };

    buttonEl.addEventListener('mouseenter', dodge);
  }
};