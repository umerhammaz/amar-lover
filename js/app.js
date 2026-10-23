document.addEventListener('DOMContentLoaded', () => {
  window.MajnuCart.init();
  window.TrollEngine.init();

  const productGrid = document.getElementById('product-grid');
  if (!productGrid) return;

  productGrid.innerHTML = window.MAJNU_PRODUCTS.map((prod) => `
    <div class="product-card">
      <span class="product-badge">${prod.badge}</span>
      <div class="product-icon">${prod.icon}</div>
      <h4 class="product-title">${prod.name}</h4>
      <p class="product-desc">${prod.desc}</p>
      <div class="product-pricing">
        <span class="price-actual">${prod.price === 0 ? 'FREE (Izzat ke badle)' : `PKR ${prod.price}`}</span>
        <span class="price-grief">Cost: ${prod.griefLabel}</span>
      </div>
      <div class="${prod.isEvasive ? 'runaway-container' : ''}">
        <button
          id="prod-btn-${prod.id}"
          class="btn btn-primary full-width ${prod.isEvasive ? 'runaway-target' : ''}"
          data-id="${prod.id}"
        >
          ${prod.isEvasive ? 'Add to Cart (Try Your Luck)' : 'Add to Pain (Cart)'}
        </button>
      </div>
    </div>
  `).join('');

  window.MAJNU_PRODUCTS.forEach((prod) => {
    const btn = document.getElementById(`prod-btn-${prod.id}`);
    if (!btn) return;

    if (prod.isEvasive) {
      window.TrollEngine.makeButtonEvasive(btn);
    } else {
      btn.addEventListener('click', () => {
        window.MajnuCart.addItem(prod.id);
      });
    }
  });

  const simpsEl = document.getElementById('live-simps');
  setInterval(() => {
    if (simpsEl) {
      const current = parseInt(simpsEl.textContent, 10) || 47;
      const delta = Math.floor(Math.random() * 5) - 2;
      simpsEl.textContent = Math.max(12, current + delta);
    }
  }, 4000);
});