if (!customElements.get('quick-add-to-cart-button')) {
    class TG_QuickAddToCartButton extends HTMLElement {
        constructor() {
          super();
        }
  
        connectedCallback() {
          this.delegateElement = new themegoal.libs.Delegate(this);
          this.delegateElement.on('submit', 'form.ProductCard__AddToCartForm', this._addToCart.bind(this));
        }

        disconnectedCallback(){
          if(this.delegateElement)this.delegateElement.destroy();
        }
  
        _addToCart(event) {
          let _this = this;
      
          event.preventDefault();
      
          let formElement = this.querySelector('form.ProductCard__AddToCartForm');
      
          let addToCartButton = this.querySelector('.ProductQuickAddToCardForm__AddToCart');
      
          addToCartButton.setAttribute('disabled', 'disabled');
          document.dispatchEvent(new CustomEvent('theme:loading:start'));
      
          fetch(window.routes.cartAddUrl + '.js', {
            body: JSON.stringify(themegoal.components.Form.serialize(formElement)),
            credentials: 'same-origin',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest' 
            }
          }).then(function (response) {
            document.dispatchEvent(new CustomEvent('theme:loading:end'));

            if (!response.ok) {
              response.json().then(function (content) {
                var errorMessageElement = document.createElement('div');
                errorMessageElement.className = 'Alert Alert--danger';
                if (typeof content['description'] === 'object') {
                  errorMessageElement.innerHTML = content['message'];
                } else {
                  errorMessageElement.innerHTML = content['description'];
                }
                addToCartButton.removeAttribute('disabled');
                addToCartButton.insertAdjacentElement('beforeBegin', errorMessageElement);
                setTimeout(function () {
                  errorMessageElement.remove();
                }, 8000);
              });
              return;
            }

            if (window.theme.cartType == "page") {
              window.location.href = window.routes.cartUrl;
              return;
            }

            addToCartButton.removeAttribute('disabled');

            response.json().then(function (data) {
              const variantInput = formElement.querySelector('[name="id"]');
              const quantityInput = formElement.querySelector('[name="quantity"]');

              _this.dispatchEvent(new CustomEvent('product:added', {
                bubbles: true,
                detail: {
                  variant: variantInput ? parseInt(variantInput.value, 10) : null,
                  quantity: parseInt(quantityInput?.value || 1, 10),
                  cartItemKey: data.key
                }
              }));

              const cartTrigger = document.getElementById('Header__CartTrigger');
              if (window.theme.cartType == "drawer" && cartTrigger) {
                cartTrigger.click();
              }
            });
          });
        }
    }
    
    customElements.define('quick-add-to-cart-button', TG_QuickAddToCartButton);
  }
