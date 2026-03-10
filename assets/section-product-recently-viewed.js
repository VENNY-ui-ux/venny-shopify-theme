if (!customElements.get('section-product-recently-viewed')) {
  class TG_SectionProductRecentlyViewed extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.element = this;
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));

      if (this.options['productId'] != 0 ) {
        this._saveProduct(this.options['productId']);
      }

      if (Shopify.visualPreviewMode) {
        // This will only execute inside the theme editor's visual preview
        //this.options['sectionId'] = 'product-recently-viewed'
        return;
      }
      if (Shopify.designMode) {
        setTimeout(this._fetchProducts.bind(this), 1000);
      }else{
        this._fetchProducts();
      }
    }

    _saveProduct(productId) {
      var items = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');

      if (!items.includes(productId)) {
        items.unshift(productId);
      }

      try {
        localStorage.setItem('recentlyViewedProducts', JSON.stringify(items.slice(0, this.options['viewedCount'])));
      } catch (error) {
        // Do nothing
      }
    }

    _fetchProducts() {
      var _this = this;
  
      var queryString = this._getSearchQueryString();
      if (queryString === '') {
        return;
      }
  
      fetch(window.routes.searchUrl + '?section_id=' + this.options['sectionId'] + '&type=product&q=' + queryString, {
        credentials: 'same-origin',
        method: 'GET'
      }).then(function (response) {
        response.text().then(function (content) {
          var tempElement = document.createElement('div');
          tempElement.innerHTML = content;
  
          _this.element.querySelector('.ProductRecentlyViewed__Body').innerHTML = tempElement.querySelector('.ProductRecentlyViewed__Body').innerHTML;
  
          _this.element.parentNode.style.display = 'block';
  
          if (_this.options['layout'] === 'carousel' ) {
            _this.carousel = new themegoal.components.Carousel(_this.element.querySelector('[data-carousel-config]'));
          }
        });
      });
    }
  
    _getSearchQueryString() {
      var items = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
  
      if (items.includes(this.options['productId'])) {
        items.splice(items.indexOf(this.options['productId']), 1);
      }
  
      return items.map(function (item) {
        return 'id:' + item;
      }).join(' OR ');
    }
    
  }
    
  customElements.define('section-product-recently-viewed', TG_SectionProductRecentlyViewed);
}