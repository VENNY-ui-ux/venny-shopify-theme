if (!customElements.get('shipping-estimator')) {
  class TG_ShippingEstimator extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.element = this;
      this.delegateElement = new themegoal.libs.Delegate(this.element);
      this.countrySelector = new themegoal.components_business.country_selector.CountrySelector(this.element.querySelector('[name="country"]'), this.element.querySelector('[name="province"]'));
  
      this._bindEventsListeners();
    }

    disconnectedCallback(){
      if(this.delegateElement)this.delegateElement.destroy();
    }
  
    _bindEventsListeners() {
      this.delegateElement.on('click', '.ShippingEstimator__Submit', this._fetchRates.bind(this));
    }

    _fetchRates() {
      var _this = this;
  
      var country = this.element.querySelector('[name="country"]').value,
          province = this.element.querySelector('[name="province"]').value,
          zip = this.element.querySelector('[name="zip"]').value;
  
      document.dispatchEvent(new CustomEvent('theme:loading:start'));
  
      fetch(window.routes.cartUrl + '/shipping_rates.json?shipping_address[zip]=' + zip + '&shipping_address[country]=' + country + '&shipping_address[province]=' + province, {
        credentials: 'same-origin',
        method: 'GET'
      }).then(function (response) {
        response.json().then(function (result) {
          document.dispatchEvent(new CustomEvent('theme:loading:end'));
  
          var resultsContainer = _this.element.querySelector('.ShippingEstimator__Results'),
              errorContainer = _this.element.querySelector('.ShippingEstimator__Error');
  
          if (response.ok) {
            var shippingRates = result['shipping_rates'];
  
            if (shippingRates.length === 0) {
              resultsContainer.innerHTML = '<div class="Alert Alert--danger"><p class="Alert__Title">' + window.languages.shippingEstimatorNoResults + '</p></div>';
            } else {
              let html = '';
  
              if (shippingRates.length === 1) {
                html += '<div class="Alert Alert--success"><p class="Alert__Title">' + window.languages.shippingEstimatorOneResult + '</p><ul class="List List--unstyle">';
              } else {
                html += '<div class="Alert Alert--success"><p class="Alert__Title">' + window.languages.shippingEstimatorMoreResults.replace('{{count}}', shippingRates.length) + '</p><ul class="List List--unstyle">';
              }
  
              shippingRates.forEach(function (item) {
                html += '<li>' + item['name'] + ': ' + themegoal.helpers.Currency.formatMoney(item['price'], window.theme.moneyFormat) + '</li>';
              });
  
              html += '</ul></div>';
  
              resultsContainer.innerHTML = html;
            }
  
            themegoal.libs.anime({
              targets: resultsContainer,
              opacity: [0, 1],
              translateY: [-15,0],
              duration: 600,
              easing: 'cubicBezier(.5, .05, .1, .3)',
              delay: 350
            });
  
            errorContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
  
          } else {
            var errorHtml = '';
  
            Object.keys(result).forEach(function (key) {
              errorHtml += '<li>' + key + ' : ' + result[key] + '</li>';
            });
  
            errorContainer.innerHTML = '<ul class="List List--unstyle">' + errorHtml + '</ul>';
  
            resultsContainer.style.display = 'none';
            errorContainer.style.display = 'block';
          }
        });
      });
    }
  
  }
    
  customElements.define('shipping-estimator', TG_ShippingEstimator);
}