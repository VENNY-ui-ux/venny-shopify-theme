if (!customElements.get('section-cart')) {
  class TG_SectionCart extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
      this.element = this;
      this.delegateElement = new themegoal.libs.Delegate(this.element);
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));
      this.itemCount = this.options['itemCount'];
  
      this._bindEventsListeners();
      this._loadShippingAmountNotice();
    }

    disconnectedCallback(){
      if(this.delegateElement)this.delegateElement.destroy();
    }

    _bindEventsListeners() {
      this.delegateElement.on('change', '#CartNote', this._updateCartNote.bind(this));
      this.delegateElement.on('click', '[data-action="update-item-quantity"], [data-action="remove-item"]', this._updateItemQuantity.bind(this));
      this.delegateElement.on('change', '.CartItem__QuantityNum', this._updateItemQuantity.bind(this));
      this.delegateElement.on('main-cart:refresh', this._rerenderCart.bind(this, false));
    }
  
    _updateCartNote(event, target) {
      fetch(window.routes.cartUrl + '/update.js', {
        body: JSON.stringify({ note: target.value }),
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' 
        }
      });
    }
  
    _updateItemQuantity(event, target) {
      var _this = this;
  
      document.dispatchEvent(new CustomEvent('theme:loading:start'));
  
      var quantity = null,
          elementToAnimate = null;
  
      if (target.tagName === 'INPUT') {
        quantity = parseInt(Math.max(parseInt(target.value) || 1, 1));
      } else {
        quantity = parseInt(target.getAttribute('data-quantity'));
      }
  
      if (quantity === 0) {
        elementToAnimate = target.closest('.CartItem__Wrapper');
      }
  
      fetch(window.routes.cartChangeUrl + '.js', {
        body: JSON.stringify({ id: target.getAttribute('data-line-id'), quantity: quantity }),
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' 
        }
      }).then(function (cart) {
        cart.json().then(function (content) {
          _this.itemCount = content['item_count'];
          _this._rerenderCart(elementToAnimate);
  
          document.dispatchEvent(new CustomEvent('theme:loading:end'));
        });
      });
  
      event.preventDefault();
    }
  
    _rerenderCart(elementToAnimate) {
      var _this = this;
  
      return fetch(window.routes.cartUrl + '?timestamp=' + Date.now(), {
        credentials: 'same-origin',
        method: 'GET'
      }).then(function (content) {
        if (elementToAnimate) {
          themegoal.libs.anime({
            targets: elementToAnimate,
            opacity: 0,
            height: 0,
            duration: 500,
            easing: 'easeOutCubic',
            complete: function(anim) {
              content.text().then(function (html) {
                  _this._replaceContent(html);
              });
            }
          });
        } else {
          content.text().then(function (html) {
              _this._replaceContent(html);
          });
        }
      });
    }
  
    _replaceContent(html) {
      let _this = this;
  
      let tempElement = document.createElement('div');
      tempElement.innerHTML = html;
  
      let cartNodeParent = this.element.querySelector('.Form--cart').parentNode;
  
      if (this.itemCount === 0) {
        this.element.innerHTML = tempElement.querySelector('.shopify-section .Cart').firstElementChild.innerHTML;
      } else {
        cartNodeParent.replaceChild(tempElement.querySelector('.Form--cart'), this.element.querySelector('.Form--cart'));
      }
      
      let cartResult = JSON.parse(tempElement.querySelector('section-cart').getAttribute('data-section-settings'));
  
      let cartCount = themegoal.helpers.Dom.nodeListToArray(document.querySelectorAll('.CartCountBubble')),
        cartQuantity = themegoal.helpers.Dom.nodeListToArray(document.querySelectorAll('.CartCountBubble__Count'));
  
      this.itemCount = cartResult['itemCount'];
  
      cartCount.forEach(function (item) {
        if (_this.itemCount === 0) {
          item.classList.remove('Visible'); 
        } else {
          item.classList.add('Visible');
        }
      });
  
      cartQuantity.forEach(function (item) {
        item.textContent = _this.itemCount;
      });
  
      this._loadShippingAmountNotice();
    
    }
  
    _loadShippingAmountNotice(){
      if(this.options["freeShippingThreshold"]){
        let freeShippingElement = this.element.querySelector(".Cart__ShippingAmountNotice");
        let cartForm = this.element.querySelector(".Form--cart");
  
        if(freeShippingElement && cartForm){
          let cartTotalPrice = cartForm.getAttribute("data-cart-total-price");
          let cartCurrencySymbol = cartForm.getAttribute("data-cart-currency-symbol");
  
          cartTotalPrice = parseInt(cartTotalPrice);
  
          let freeShippingAmount = Math.round(this.options["freeShippingAmount"] * (Shopify.currency.rate || 1));
  
          if(cartTotalPrice >= freeShippingAmount){
            freeShippingElement.innerHTML = this.options["freeShippingString"];
          }else{
            let freeShippingAmountString = this.options["freeShippingAmountString"];
            freeShippingAmountString = freeShippingAmountString.replace("remaining__amount", "" + cartCurrencySymbol + (freeShippingAmount - cartTotalPrice)/100);
            freeShippingElement.innerHTML = freeShippingAmountString;  
          }
        }
      }
    }
  
  }
  
  customElements.define('section-cart', TG_SectionCart);
}