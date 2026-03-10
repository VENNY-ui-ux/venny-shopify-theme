if (!customElements.get('section-product-recommendations')) {
  class TG_SectionProductRecommendation extends HTMLElement {
    constructor() {
    super();
    }

    connectedCallback() {
      this.element = this;
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));

      if (Shopify.visualPreviewMode) {
        // This will only execute inside the theme editor's visual preview
        //this.options['sectionId'] = 'product-recommendations' or 'product-recommendations-complementary'
        return;
      }

      if (Shopify.designMode) {
          setTimeout(this._loadRecommendations.bind(this), 1000);
      }else{
          this._loadRecommendations();
      }
    }


    _loadRecommendations() {
      var _this = this;
  
      var url = window.routes.productRecommendationsUrl + '?section_id=' + this.options['sectionId'] + '&product_id=' + this.options['productId'] + '&limit=' + this.options['recommendationsCount'] + '&intent=' + this.options['recommendationsType'];
  
      return fetch(url).then(function (response) {
        return response.text().then(function (content) {
          var container = document.createElement('div');
          container.innerHTML = content;
  
          //has recommend product
          if(container.querySelector('.ProductList--hasProduct')){
            _this.element.querySelector('.ProductRecommendations__Body').innerHTML = container.querySelector('.ProductRecommendations__Body').innerHTML;
  
            if (_this.options['layout'] === 'carousel' ) {
              _this.carousel = new themegoal.components.Carousel(_this.element.querySelector('[data-carousel-config]'));
            }
          }else{
            // Show the section
            _this.element.style.display = 'none';
          }
  
        });
      });
    }
  }
    
  customElements.define('section-product-recommendations', TG_SectionProductRecommendation);
}