class TG_ProductQuickviewVariant {
  constructor(container) {

    this.element = container;
    this.delegateElement = new themegoal.libs.Delegate(this.element);
    this.options = JSON.parse(this.element.getAttribute('data-section-settings'));

    this.quiviewModal = null;

    if(this.element.querySelector('[data-product-json]')){
      this.productVariants = new themegoal.components_business.product_variants.ProductVariants(container, this.options);
    }

    this._bindEventsListeners();
  }

  _bindEventsListeners() {
      this.delegateElement.on('variant:changed', this._updateMainImage.bind(this));
  }

  _updateMainImage(event) {
    var variant = event.detail.variant;

    if (!variant || !variant['featured_image'] ) {
      return;
    }

    var newImage = variant['featured_image'];

    var mainImageContainer = this.element.querySelector('.ProductQuickview__Gallery .Ratio');
    mainImageContainer.style.cssText = 'max-width: ' + newImage['width'] + 'px; --tg-aspect-ratio: ' + newImage['width'] / newImage['height'];

    var newImageElement = document.createElement('img');
    newImageElement.setAttribute('src', newImage['src']);


    mainImageContainer.replaceChild(newImageElement, mainImageContainer.querySelector('img'));
  }
}

class TG_ProductQuickvew {
  constructor() {

      this.element = document.body;
      this.delegateElement = new themegoal.libs.Delegate(this.element);
      this.quiviewModal = null;

      this._attachListeners();
  }

  _attachListeners() {
    this.delegateElement.on('click', '[data-tg-action="product-quickview-modal"]', this._debounce(this._openModal.bind(this), 1000)); 
  }

  _openModal(event,target) {
      let _this = this;
  
      let productURL = target.getAttribute('data-product-handle');

      if(productURL){
        document.dispatchEvent(new CustomEvent('theme:loading:start'));

        target.classList.add("Loading");

        let ProductQuickviewSection = this.element.querySelector("#ProductQuickviewSection");
        if(ProductQuickviewSection){
          let sectionId = ProductQuickviewSection.getAttribute('data-section-id');
  
          fetch(window.routes.rootUrlWithoutSlash+'/products/'+productURL+'?section_id='+sectionId, {
            credentials: 'same-origin',
            method: 'GET'
          }).then(function (response) {
            response.text().then(function (content) {
                document.dispatchEvent(new CustomEvent('theme:loading:end'));

                target.classList.remove("Loading");
                var tempElement = document.createElement('div');
                tempElement.innerHTML = content;

                _this.element.querySelector("#shopify-section-product-quickview").innerHTML = tempElement.querySelector("#shopify-section-product-quickview").innerHTML;

                new TG_ProductQuickviewVariant(_this.element.querySelector(".ProductQuickview"));

                let ele = document.getElementById('ProductQuickviewModal');

                document.querySelector("body").style.removeProperty('overflow');
                
                _this.quiviewModal = new themegoal.components.Modal(ele);
            
                _this.quiviewModal.show();
    
            });
          });
        }
      }
  }

  _debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

}

new TG_ProductQuickvew();