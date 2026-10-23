window.MajnuCart = {
  items: [],

  init() {
    this.drawer = document.getElementById('cart-drawer');
    this.backdrop = document.getElementById('drawer-backdrop');
    this.cartItemsList = document.getElementById('cart-items');
    this.badge = document.getElementById('cart-badge');
    this.totalGriefEl = document.getElementById('cart-total-grief');

    document.getElementById('cart-toggle-btn').addEventListener('click', () => this.open());
    document.getElementById('cart-close-btn').addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', () => this.close());
  },

  open() {
    this.drawer.classList.add('open');
    this.backdrop.classList.add('active');
    this.render();
  },

  close() {
    this.drawer.classList.remove('open');
    this.backdrop.classList.remove('active');
  },

  addItem(productId) {
    const prod = window.MAJNU_PRODUCTS.find(p => p.id === productId);
    if (!prod) return;

    this.items.push(prod);
    this.updateBadge();
    window.TrollEngine.playTone(320, 0.15, 'triangle');
    window.TrollEngine.showToast(`💔 Added "${prod.name}" to your grief tally.`);
    this.render();
  },

  removeItem(index) {
    this.items.splice(index, 1);
    this.updateBadge();
    this.render();
  },

  updateBadge() {
    this.badge.textContent = this.items.length;
  },

  getTotalGrief() {
    return this.items.reduce((sum, item) => sum + item.griefCost, 0);
  },

  render() {
    if (!this.cartItemsList) return;

    if (this.items.length === 0) {
      this.cartItemsList.innerHTML = `
        <div class="cart-empty-text">
          <p>💔 Tera Cart Khali Hai...</p>
          <p style="font-size:0.8rem; margin-top:8px;">Bilkul uske inbox ki tarah jahan tera koi reply nahi aaya.</p>
        </div>
      `;
      this.totalGriefEl.textContent = '0 Aansoo';
      return;
    }

    this.cartItemsList.innerHTML = this.items.map((item, idx) => `
      <div class="cart-item-row">
        <div>
          <div class="cart-item-name">${item.icon} ${item.name}</div>
          <div class="cart-item-grief">${item.griefLabel}</div>
        </div>
        <button class="remove-item-btn" onclick="window.MajnuCart.removeItem(${idx})">Bhula Do</button>
      </div>
    `).join('');

    this.totalGriefEl.textContent = `${this.getTotalGrief()} Aansoo`;
  }
};