if (!customElements.get('section-cart-drawer')) {
  class TG_SectionCartDrawer extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
      this.el = this;
      this.opts = JSON.parse(this.el.getAttribute('data-section-settings'));
      this.drawer = new themegoal.components.Drawer(this);
      this.el.addEventListener('hidden.tg.Drawer', () => this._onClose());
      this._bind();
      this._updatePromo();
    }

    _bind() {
      document.documentElement.addEventListener('cart:refresh', () => this._updatePromo());
      document.addEventListener('shopify:section:load', e => {
        if (e.detail?.sectionId === 'cart-drawer') this._updatePromo();
      });
      // Bind remove event
      this.el.querySelectorAll('.CartItem__Remove').forEach(removeBtn => {
        removeBtn.addEventListener('click', (e) => this._handleRemove(e));
      });
    }

    _onClose() {
      const note = document.getElementById('CartDrawerNoteCollapse');
      if (note) new themegoal.components.Collapse(note, { toggle: false }).hide();
    }

    _handleRemove(e) {
      e.preventDefault();
      const lineId = e.target.getAttribute('data-line-id');
      const quantity = e.target.getAttribute('data-quantity');

      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line: lineId,
          quantity: quantity,
          sections: 'cart-drawer'
        })
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        // Refresh drawer content
        this._updatePromo();
        document.documentElement.dispatchEvent(new Event('cart:refresh'));
      })
      .catch(error => console.error('Error removing item:', error));
    }

    _updatePromo() {
      const drawer = this.el;
      if (!drawer) return;

      let has3for2 = false;
      (this.opts.discountApplications || []).forEach(d => {
        if (d.code && d.code.toLowerCase() === '3for2') has3for2 = true;
      });

      const filled = drawer.querySelectorAll('.CartItem__Wrapper').length;
      const threshold = 3;
      const pct = Math.min(100, Math.max(0, Math.round((filled / threshold) * 100)));
      const remaining = threshold - filled;

      const txt = drawer.querySelector('.CartDrawer__PromoText');
      const bar = drawer.querySelector('.CartDrawer__ProgressFill');

      if (txt && bar) {
        if (has3for2) {
          if (filled >= threshold) {
            txt.textContent = `YOU’VE EARNED 1 FREE ITEM!`;
            bar.style.width = '100%';
          } else {
            txt.textContent = `ADD ${remaining} MORE ITEMS TO GET ONE FREE`;
            bar.style.width = pct + '%';
          }
          bar.style.backgroundColor = '#151f50';
        } else {
          txt.textContent = '';
          bar.style.width = '0%';
        }
      }
    }
  }

  customElements.define('section-cart-drawer', TG_SectionCartDrawer);
}