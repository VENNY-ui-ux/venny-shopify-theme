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
  // klik på plus/minus/kryds
  document.addEventListener('click', function (event) {
    const minus  = event.target.closest('[data-cart-qty-minus]');
    const plus   = event.target.closest('[data-cart-qty-plus]');
    const remove = event.target.closest('[data-cart-remove]');

    if (!minus && !plus && !remove) return;

    event.preventDefault();

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

    // disable knapper midlertidigt
    if (minus) minus.disabled = true;
    if (plus) plus.disabled = true;
    if (remove) remove.disabled = true;

    updateCartLine(line, newQty);
  });

  function updateCartLine(line, quantity) {
    fetch('/cart/change.js', {
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
        return res.json(); // vi bruger ikke data direkte, men godt at tjekke for fejl
      })
      .then(function () {
        refreshCartDrawer(); // hent kun drawer-sektionen igen
      })
      .catch(function (err) {
        console.error('Cart update failed', err);
      });
  }

  function refreshCartDrawer() {
    // hent kun cart-drawer sektionen fra serveren
    fetch(window.location.pathname + '?section_id=cart-drawer')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newInner = doc.querySelector('#CartDrawer .CartDrawer__Inner');
        const currentInner = document.querySelector('#CartDrawer .CartDrawer__Inner');

        if (!newInner || !currentInner) return;

        // bevar om drawer er åben (klassen "Show" ligger på #CartDrawer, ikke på Inner)
        currentInner.replaceWith(newInner);
      })
      .catch(function (err) {
        console.error('Failed to refresh cart drawer', err);
      });
  }
})();
