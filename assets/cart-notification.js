if (!customElements.get('cart-notification')) {
  class TG_CartNotification extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.cartNotificationInstance = themegoal.components.Toast.getOrCreateInstance(this);
      this.cartNotificationLinks = this.querySelector(".CartNotification__Links");
      this.cartNotificationProduct = this.querySelector(".CartNotification__Product");

      this.onBodyClick = this.handleBodyClick.bind(this);
      this.onProductAdded = this._onProductAdded.bind(this);
      this._bindEventsListeners();
    }

    disconnectedCallback(){
      document.removeEventListener('product:added', this.onProductAdded);
    }

    _bindEventsListeners() {
      var _this = this;
      document.addEventListener('product:added', this.onProductAdded);

      this.addEventListener('shown.tg.Toast', () => {
        document.body.addEventListener('click', _this.onBodyClick);
      });
      this.addEventListener('hidden.tg.Toast', () => {
        document.body.removeEventListener('click', _this.onBodyClick);
      })
    }
    
    _onProductAdded(event){
      var _this = this;
      return fetch(window.routes.cartUrl + '?section_id=cart-notification' + '&timestamp=' + Date.now(), {
        credentials: 'same-origin',
        method: 'GET'
      }).then(function (content) {
        
        content.text().then(function (html) {
          _this._replaceContent(html, event.detail.cartItemKey)
        });

      });
    }

    _replaceContent(html,itemKey) {
      let _this = this;

      let tempElement = document.createElement('div');
      tempElement.innerHTML = html;

      this.cartNotificationLinks.innerHTML = tempElement.querySelector(".CartNotification__Links").innerHTML;
      this.querySelector(".CartNotification__Product").innerHTML = tempElement.querySelector(`[id="cart-notification-product-${itemKey}"]`).innerHTML;

      let cartResult = JSON.parse(tempElement.querySelector('.CartNotification').getAttribute('data-section-settings'));

      let cartCount = themegoal.helpers.Dom.nodeListToArray(document.querySelectorAll('.CartCountBubble')),
      cartText = themegoal.helpers.Dom.nodeListToArray(document.querySelectorAll('.CartCountText')),
      cartQuantity = themegoal.helpers.Dom.nodeListToArray(document.querySelectorAll('.CartCountBubble__Count'));

      this.itemCount = cartResult['itemCount'];

      cartCount.forEach(function (item) {
        if (_this.itemCount === 0) {
          item.classList.remove('Visible'); 
        } else {
          item.classList.add('Visible');
        }
      });

      cartText.forEach(function (item) {
        if (_this.itemCount === 0) {
          item.classList.add('Visible'); 
        } else {
          item.classList.remove('Visible');
        }
      });

      cartQuantity.forEach(function (item) {
        item.textContent = _this.itemCount;
      });

      this.cartNotificationInstance.show();

      this.scrollIntoView({ behavior: 'smooth', block:"start"}); 
    }

    handleBodyClick(evt) {
      const target = evt.target;
      if (target !== this && !target.closest('cart-notification')) {
        this.cartNotificationInstance.hide();
      }
    }

  }

  customElements.define('cart-notification', TG_CartNotification);
}
