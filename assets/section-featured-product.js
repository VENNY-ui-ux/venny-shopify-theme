if (!customElements.get('section-featured-product')) {
  class TG_SectionFeaturedProduct extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.element = this;
      this.delegateElement = new themegoal.libs.Delegate(this.element);
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));
  
      if(this.element.querySelector('[data-product-json]')){
        this.productVariants = new themegoal.components_business.product_variants.ProductVariants(this.element, this.options);
      }
  
      this._bindEventsListeners();
    }

    disconnectedCallback(){
      if(this.delegateElement)this.delegateElement.destroy();
    }
    
    _bindEventsListeners() {
      this.delegateElement.on('variant:changed', this._updateMainImage.bind(this));
    }

    _updateMainImage(event) {
      var variant = event.detail.variant,
          previousVariant = event.detail.previousVariant;
  
      if (!variant || !variant['featured_image'] || previousVariant && previousVariant['featured_image'] && previousVariant['featured_image']['id'] === variant['featured_image']['id']) {
        return;
      }
  
      var newImage = variant['featured_image'];
      var mainImageContainer = this.element.querySelector('.FeaturedProduct__Gallery .Ratio');
      mainImageContainer.style.cssText = 'max-width: ' + newImage['width'] + 'px; --tg-aspect-ratio: ' + newImage['width'] / newImage['height'];
  
      var newImageElement = document.createElement('img');
      newImageElement.setAttribute('src', newImage['src']);
      mainImageContainer.replaceChild(newImageElement, mainImageContainer.querySelector('img'));
    }
    
  }
        
  customElements.define('section-featured-product', TG_SectionFeaturedProduct);
}