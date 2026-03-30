/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */
// Simple cart drawer quantity + remove handler
// --- CART DRAWER: qty + remove uden reload ---
(function () {
  let isUpdating = false;

  // klik på plus/minus/kryds + recommendation add
  document.addEventListener('click', function (event) {
    const recAdd = event.target.closest('[data-cart-rec-add]');
    const minus  = event.target.closest('[data-cart-qty-minus]');
    const plus   = event.target.closest('[data-cart-qty-plus]');
    const remove = event.target.closest('[data-cart-remove]');

    if (!minus && !plus && !remove && !recAdd) return;

    event.preventDefault();

    if (isUpdating) return;

    if (recAdd) {
      const variantId = parseInt(recAdd.getAttribute('data-variant-id'), 10);
      if (!variantId) return;
      setLoadingState(recAdd, true);
      addVariantToCart(variantId).finally(function () {
        setLoadingState(recAdd, false);
      });
      return;
    }

    const target = minus || plus || remove;
    const line = parseInt(target.getAttribute('data-line'), 10);
    if (!line) return;

    let newQty;

    if (remove) {
      newQty = 0;
    } else {
      const input = document.querySelector(
        '.CartDrawerItem__QtyInput[data-line="' + line + '"]'
      );
      if (!input) return;
      const current = parseInt(input.value, 10) || 0;
      newQty = minus ? Math.max(0, current - 1) : current + 1;
    }

    setLoadingState(target.closest('.CartDrawerItem') || target, true);
    updateCartLine(line, newQty).finally(function () {
      setLoadingState(target.closest('.CartDrawerItem') || target, false);
    });
  });

  document.addEventListener('change', function (event) {
    const input = event.target.closest('[data-cart-qty-input]');
    if (!input) return;

    const line = parseInt(input.getAttribute('data-line'), 10);
    if (!line) return;

    let quantity = parseInt(input.value, 10);
    if (Number.isNaN(quantity)) quantity = 1;
    quantity = Math.max(1, quantity);
    input.value = quantity;

    if (isUpdating) return;
    setLoadingState(input.closest('.CartDrawerItem') || input, true);
    updateCartLine(line, quantity).finally(function () {
      setLoadingState(input.closest('.CartDrawerItem') || input, false);
    });
  });

  function setLoadingState(element, enabled) {
    if (!element) return;
    element.classList.toggle('is-loading', enabled);
  }

  function setDrawerBusy(enabled) {
    const drawerInner = document.querySelector('#CartDrawer .CartDrawer__Inner');
    if (!drawerInner) return;
    if (enabled) {
      drawerInner.setAttribute('aria-busy', 'true');
    } else {
      drawerInner.removeAttribute('aria-busy');
    }
  }

  function updateCartCounters(itemCount) {
    const bubbles = document.querySelectorAll('.CartCountBubble');
    const bubbleCounts = document.querySelectorAll('.CartCountBubble__Count:not(.VisuallyHidden)');
    const countTexts = document.querySelectorAll('.CartCountText');

    bubbles.forEach(function (bubble) {
      bubble.classList.toggle('Visible', itemCount > 0);
    });

    bubbleCounts.forEach(function (node) {
      node.textContent = itemCount;
    });

    countTexts.forEach(function (node) {
      node.classList.toggle('Visible', itemCount === 0);
    });
  }

  function addVariantToCart(variantId) {
    isUpdating = true;
    setDrawerBusy(true);
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1
      })
    })
      .then(function (res) { return res.json(); })
      .then(function () {
        return fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
      })
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        updateCartCounters(cart.item_count || 0);
        return refreshCartDrawer();
      })
      .catch(function (err) {
        console.error('Recommendation add failed', err);
      })
      .finally(function () {
        isUpdating = false;
        setDrawerBusy(false);
      });
  }

  function updateCartLine(line, quantity) {
    isUpdating = true;
    setDrawerBusy(true);
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        line: line,
        quantity: quantity
      })
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (cart) {
        updateCartCounters(cart.item_count || 0);
        return refreshCartDrawer();
      })
      .catch(function (err) {
        console.error('Cart update failed', err);
      })
      .finally(function () {
        isUpdating = false;
        setDrawerBusy(false);
      });
  }

  function refreshCartDrawer() {
    return fetch(window.location.pathname + '?section_id=cart-drawer')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newInner = doc.querySelector('#CartDrawer .CartDrawer__Inner');
        const currentInner = document.querySelector('#CartDrawer .CartDrawer__Inner');

        if (!newInner || !currentInner) return;

        currentInner.replaceWith(newInner);
        document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      })
      .catch(function (err) {
        console.error('Failed to refresh cart drawer', err);
      });
  }
})();
