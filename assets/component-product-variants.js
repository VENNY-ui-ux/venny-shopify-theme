(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.themegoal = global.themegoal || {}, global.themegoal.components_business = global.themegoal.components_business || {}, global.themegoal.components_business.product_variants = factory()));
})(this, (function () { 'use strict';

class ProductImageModal {
  constructor(element) {
    this.element = element;
    this.delegateElement = new themegoal.libs.Delegate(this.element);

    this.quiviewModalElement = document.getElementById('ProductMediaZoomModal');
    this.quiviewModal = null;

    this.activeMedia = null;

    this._bindEventsListeners();
  }
  
  destroy() {
    this.delegateElement.off('click');
  }
  
  _bindEventsListeners() {
    this.delegateElement.on('click', '.MediaModalOpener', this._openMediaModal.bind(this), true);
    this.quiviewModalElement.addEventListener('hidden.tg.Modal', function (event) {
      window.pauseAllMedia();
    });
    let _this = this;
    this.quiviewModalElement.addEventListener('shown.tg.Modal', function (event) {
      window.pauseAllMedia();
      _this.activeMedia.scrollIntoView({ behavior: 'smooth', block:"start"});
    });
  }
  
  _openMediaModal(event, target) {
    let imageBreakpoint = themegoal.helpers.Responsive.getCurrentBreakpoint();

    if ( imageBreakpoint == "small" ){
      event.stopImmediatePropagation();
      this._setActiveMeida(target);
      this.quiviewModal = new themegoal.components.Modal(this.quiviewModalElement);
      this.quiviewModal.show();  
    }else{
      if (target.classList.contains("MediaModalOpener--image")){
        this._setActiveMeida(target);
        this.quiviewModal = new themegoal.components.Modal(this.quiviewModalElement);
        this.quiviewModal.show();
      }
    }
  }
  
  _setActiveMeida(target){
    let openers = this.quiviewModalElement.querySelectorAll(".Product__MediaWrapper");
    let currentMediaId = target.getAttribute("data-media-id");

    if(openers){
      openers.forEach(function (item) {
        item.classList.remove("Active");
      });

      this.activeMedia = this.quiviewModalElement.querySelector('[data-media-id="'+ currentMediaId +'"]');
      if(this.activeMedia){
        this.activeMedia.classList.add("Active");
      }
    }
  }
}

class ProductPickupAvailability {
  constructor(element) {
    this.element = element;
  }

  updateWithVariant(variant) {
    if (!this.element) {
      return; 
    }

    if (!variant) {
      this.element.textContent = '';
      return;
    }

    this._renderAvailabilitySection(variant['id']);
  }

  _renderAvailabilitySection(id) {
    let _this = this;

    this.element.innerHTML = '';

    var availabilityModal = document.getElementById('PickupAvailabilityModal-' + id);
    if (availabilityModal) {
      availabilityModal.remove();
    }

    return fetch(window.routes.rootUrlWithoutSlash + '/variants/' + id + '?section_id=pickup-availability').then(function (response) {
      return response.text().then(function (content) {
        _this.element.innerHTML = content;
        _this.element.innerHTML = _this.element.firstElementChild.innerHTML;

        let availabilityModal = document.getElementById('PickupAvailabilityModal-' + id);

        if(availabilityModal){
          document.body.appendChild(availabilityModal);

          new themegoal.components.Drawer(availabilityModal);
        }
      });
    });
  }
}
class ProductVariants {
  constructor(container, options) {
    let _this = this;

    this.element = container;
    this.delegateElement = new themegoal.libs.Delegate(this.element);
    this.options = options;

    let jsonData = JSON.parse(this.element.querySelector('[data-product-json]').innerHTML);

    this.productData = jsonData['product'];
    this.sectionId = jsonData['section_id'];

    if(!this.productData['id']) return ;

    this.currentVariant = this.productData['selected_or_first_available_variant'];
    this.variantsInventories = jsonData['inventories'] || {};

    this.pickupAvailability = new ProductPickupAvailability(this.element.querySelector('.Product__StoreAvailabilityContainer'));
    this.pickupAvailability.updateWithVariant(this.currentVariant);

    this._bindEventsListeners();

  }

  destroy() {
    this.delegateElement.off('click');
  }

  _bindEventsListeners() {
    this.delegateElement.on('click', '[data-action="add-to-cart"]', this._addToCart.bind(this));
    this.delegateElement.on('click', '[data-action="decrease-quantity"]', this._decreaseQuantity.bind(this));
    this.delegateElement.on('click', '[data-action="increase-quantity"]', this._increaseQuantity.bind(this));
    this.delegateElement.on('change', '.ProductForm__QuantityNum', this._validateQuantity.bind(this));

    this.delegateElement.on('change', '.ProductForm__Option [type="radio"]', this._onOptionChanged.bind(this));
    this.delegateElement.on('keydown', '.ProductForm__Option [type="radio"]~label', this._labeEnerKeyEvent.bind(this));
    this.delegateElement.on('change', '.ProductForm__Option .Form__Select', this._onOptionChanged.bind(this));

    this.delegateElement.on('change', '.ProductForm__CustomProperty [type="radio"]', this._onChangeCustomPropertyRadio.bind(this));
    this.delegateElement.on('change', '.ProductForm__CustomProperty .Form__Select', this._onChangeCustomPropertySelect.bind(this));
    this.delegateElement.on('change', '.ProductForm__CustomProperty .Form__Input', this._onChangeCustomPropertyText.bind(this));
  }

  _labeEnerKeyEvent(event, target){
    if(event.keyCode == 13) {
      let inputId = target.getAttribute("for");
      let inputElement = document.getElementById(inputId);
      inputElement.click();
    }
  }

  _onOptionChanged(event, target) {
    const targetUrl = this.element.dataset.productUrl;

    const inputElement = target.tagName === 'SELECT' ? target.selectedOptions[0] : target;

    if(inputElement.dataset.productUrl && targetUrl != inputElement.dataset.productUrl){
      if(this.options["productForm"] == "main-product" || this.options["productForm"] == "featured-product"){
        this._goToSubProductPage(inputElement.dataset.productUrl);
      }else{ //'product-quickview'
        this.element.setAttribute("data-product-url", inputElement.dataset.productUrl);
        this._reRenderFullSection(inputElement.dataset.productUrl, this.options["productForm"]);
      }
    }else{
      if(inputElement.dataset.variantId){
        this._reRenderBlocks(inputElement.dataset.variantId);
      }else{
        //variant does not exist, not sold out
        let selectedOption = target.closest('.ProductForm__Option');
        if(selectedOption){
          let selectedValue = selectedOption.querySelector('.ProductForm__SelectedValue');
          if (selectedValue) {
            selectedValue.innerHTML = target.value;
          }
        }
        this._updateAddToCartButton(null);
        this._updateProductInfo(null,null,null);
      }
     
    }
  }

  _reRenderBlocks(newVariantId){
    let _this = this;

    fetch(_this.element.dataset.productUrl + '?variant=' + newVariantId + '&section_id='+_this.sectionId).then(function (response) {
      return response.text().then(function (content) {
        const responseHtml = new DOMParser().parseFromString(content, 'text/html');

        let previousVariant = _this.currentVariant;

        let jsonData = JSON.parse(responseHtml.querySelector('[data-product-json]').innerHTML);
        _this.productData = jsonData['product'];
        if(!_this.productData['id']) return ;

        _this.currentVariant = _this.productData['selected_or_first_available_variant'];
        _this.variantsInventories = jsonData['inventories'] || {};

        _this._onVariantChanged(previousVariant, _this.currentVariant, responseHtml);

        if (_this.currentVariant) {
        if (_this.options['enableHistoryState']) {
          _this._updateHistoryState(_this.currentVariant);
        }
      }

      })
    });
  }

  _onVariantChanged(previousVariant, newVariant, responseHtml) {
    this._updateProductInfo(previousVariant, newVariant, responseHtml);
    this._updateAddToCartButton(newVariant);
    this.pickupAvailability.updateWithVariant(newVariant);

    this.element.dispatchEvent(new CustomEvent('variant:changed', {
      bubbles: true,
      detail: { variant: newVariant, previousVariant: previousVariant }
    }));
  }

  _updateProductInfo(previousVariant, newVariant,responseHtml){
    let _this = this;

    let destinationPriceList = _this.element.querySelector(".Product__PriceList");
    let destinationSKU = _this.element.querySelector(".Product__Sku");
    let destinationUnitPrice = _this.element.querySelector(".Product__UnitPrice");
    let destinationInventory = _this.element.querySelector('.ProductForm__Inventory');
    let destinationPayInstallments = _this.element.querySelector(".Product__PayInstallments");
    let destinationProductFormOptions = _this.element.querySelector(".Product__Block--variantPicker");
    let destinationRefreshVariantChanges = _this.element.querySelectorAll(".Product__Block--refreshVariantChange");

    if (!newVariant){//the new variant does not exist, not available
      if(destinationPriceList) destinationPriceList.innerHTML = "";
      if(destinationSKU) destinationSKU.innerHTML = "";
      if(destinationUnitPrice) destinationUnitPrice.innerHTML = "";
      if(destinationInventory) destinationInventory.innerHTML = "";
      if(destinationPayInstallments) destinationPayInstallments.innerHTML = "";
      // if(destinationProductFormOptions) destinationProductFormOptions.innerHTML = "";// The option needs to be shown even if the new variant does not exist. when Total number of variants ! = option 1 * option 2 * option 3
      return;
    }  

   
    if(responseHtml){
        const sourcePriceList = responseHtml.querySelector(".Product__PriceList");
        if (sourcePriceList && destinationPriceList) destinationPriceList.innerHTML = sourcePriceList.innerHTML;

        if (_this.options['showSku']) {
          const sourceSKU = responseHtml.querySelector(".Product__Sku");
          if (sourceSKU && destinationSKU) {
            destinationSKU.innerHTML = sourceSKU.innerHTML;
            destinationSKU.style.display = sourceSKU.style.display;
          };
        }
  
        const sourceUnitPrice = responseHtml.querySelector(".Product__UnitPrice");
        if (sourceUnitPrice && destinationUnitPrice) {
          destinationUnitPrice.innerHTML = sourceUnitPrice.innerHTML;
          destinationUnitPrice.style.display = sourceUnitPrice.style.display;
        };

        if (_this.options['showInventoryQuantity']) {

          let variantInventory = newVariant ? _this.variantsInventories : null;

          if(destinationInventory && variantInventory){
      
            if ( null === newVariant['inventory_management'] || variantInventory['inventory_quantity'] <= 0 || _this.options['inventoryQuantityThreshold'] > 0 && variantInventory['inventory_quantity'] > _this.options['inventoryQuantityThreshold']) {
              destinationInventory.style.display = 'none';
            } else {
              const sourceInventory = responseHtml.querySelector(".ProductForm__Inventory");
              if (sourceInventory) {
                destinationInventory.innerHTML = sourceInventory.innerHTML;
                destinationInventory.style.display = '';
              }
            }
          }
        }

        const sourcePayInstallments = responseHtml.querySelector(".Product__PayInstallments");
        if (sourcePayInstallments && destinationPayInstallments) destinationPayInstallments.innerHTML = sourcePayInstallments.innerHTML;

        const sourceProductFormOptions = responseHtml.querySelector(".Product__Block--variantPicker");
        if (sourceProductFormOptions && destinationProductFormOptions) {
          destinationProductFormOptions.innerHTML = sourceProductFormOptions.innerHTML;
        }

        if(this.options["enableMediaGrouping"]&&previousVariant.options[0]!=newVariant.options[0]){
          let destinationGallery = _this.element.querySelector(".ProductGallery");
          const sourceGallery = responseHtml.querySelector(".ProductGallery");
          if (sourceGallery && destinationGallery) {
            destinationGallery.innerHTML = sourceGallery.innerHTML;
          }

          let destinationMediaIdIndexs = _this.element.querySelector('[data-product-media-id-index-json]');
          const sourceMediaIdIndexs = responseHtml.querySelector('[data-product-media-id-index-json]');
          if(destinationMediaIdIndexs && sourceMediaIdIndexs){
            destinationMediaIdIndexs.innerHTML = sourceMediaIdIndexs.innerHTML;
          }

          let destinationGalleryZoomModal = document.querySelector("#ProductMediaZoomModal .ProductGallery--zoomModal");
          const sourceGalleryZoomModal = responseHtml.querySelector("#ProductMediaZoomModal .ProductGallery--zoomModal");
          if (sourceGalleryZoomModal && destinationGalleryZoomModal) {
            destinationGalleryZoomModal.innerHTML = sourceGalleryZoomModal.innerHTML;
          }

          if(this.options['enableImageZoom']&&this.options['imageZoomLayout'] == 'carousel'){
            let destinationGalleryZoomPhotoSwipe = document.querySelector("#MediaLightbox-"+this.sectionId);
            const sourceGalleryZoomPhotoSwipe = responseHtml.querySelector("#MediaLightbox-"+this.sectionId);
            if (destinationGalleryZoomPhotoSwipe && sourceGalleryZoomPhotoSwipe) {
              let pElem = destinationGalleryZoomPhotoSwipe.parentNode;
              let newScript = document.createElement('script');
              newScript.type = 'module';
              newScript.id = "MediaLightbox-"+this.sectionId;
              newScript.innerHTML = sourceGalleryZoomPhotoSwipe.innerHTML;

              pElem.removeChild(destinationGalleryZoomPhotoSwipe);
              pElem.appendChild(newScript);
            }
          }
        }

        const sourceRefreshVariantChanges = responseHtml.querySelectorAll(".Product__Block--refreshVariantChange");
        if (sourceRefreshVariantChanges && destinationRefreshVariantChanges) {
          sourceRefreshVariantChanges.forEach(sItem => {
            destinationRefreshVariantChanges.forEach(dItem => {
              if(sItem.getAttribute("id") == dItem.getAttribute("id")){
                dItem.innerHTML = sItem.innerHTML;
              }
            });
          });
        }

      }

  }

  _updateAddToCartButton(newVariant) {
    let addToCartButton = this.element.querySelector('.ProductForm__AddToCart'),
      shopifyPaymentButton = this.element.querySelector('.shopify-payment-button'),
      newButton = document.createElement('button');

    if(addToCartButton){
      newButton.setAttribute('type', 'submit');
      newButton.className = 'ProductForm__AddToCart Button Button--full';

      if (!newVariant) {
        newButton.setAttribute('disabled', 'disabled');
        newButton.removeAttribute('data-action');
        newButton.classList.add('Button--secondary');
        newButton.innerHTML = window.languages.productFormUnavailable;
      } else {
        if (newVariant['available']) {
          newButton.removeAttribute('disabled');
          newButton.classList.add(this.options['showPaymentButton'] ? 'Button--secondary' : 'Button--primary');
          newButton.setAttribute('data-action', 'add-to-cart');
          
          newButton.innerHTML = '<span>' + window.languages.productFormAddToCart + '</span>';
          
        } else {
          newButton.setAttribute('disabled', 'disabled');
          newButton.classList.add('Button--secondary');
          newButton.removeAttribute('data-action');
          newButton.innerHTML = window.languages.productFormSoldOut;
        }
      }

      if (this.options['showPaymentButton'] && shopifyPaymentButton) {
        if (!newVariant || !newVariant['available']) {
          shopifyPaymentButton.style.display = 'none';
        } else {
          shopifyPaymentButton.style.display = 'block';
        }
      }

      addToCartButton.parentNode.replaceChild(newButton, addToCartButton);
    }
  }

  _reRenderFullSection(url, productForm){
    let _this = this;
    fetch(window.location.protocol + '//' + window.location.host + '' + url + '?section_id='+this.sectionId).then(function (response) {
      return response.text().then(function (content) {
        const responseHtml = new DOMParser().parseFromString(content, 'text/html');

        //quickview
        if('product-quickview' == productForm){
          _this.element.querySelector("#ProductQuickviewModal").innerHTML = responseHtml.querySelector("#ProductQuickviewModal").innerHTML;
          // _this.pickupAvailability.updateWithVariant(newVariant);//The quick view section does not show pickup availability because the drawer is located on the back of the modal
        }

      });
    });
  }

  _goToSubProductPage(url){
    location.href = window.location.protocol + '//' + window.location.host + '' + url;
  }

  _updateHistoryState(variant) {
    if (!history.replaceState) {
      return;
    }

    let newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;

    window.history.replaceState({ path: newUrl }, '', newUrl);
  }

  _addToCart(event) {
    let _this = this;

    event.preventDefault(); 

    let formElement = this.element.querySelector('form.ProductForm');

    if (!formElement.checkValidity()) {
      if(!this.element.classList.contains(".ProductFormValidated")){
        this.element.classList.add('ProductFormValidated');
      }
      return;
    }else{
      this.element.classList.remove('ProductFormValidated')
    }

    let addToCartButton = this.element.querySelector('.ProductForm__AddToCart');

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

      if (response.ok) {
        if (window.theme.cartType == "page") {
          window.location.href = window.routes.cartUrl;
          // return; 
        }else{
          addToCartButton.removeAttribute('disabled');
          response.json().then(function (data) {
            _this.element.dispatchEvent(new CustomEvent('product:added', {
              bubbles: true,
              detail: {
                variant: _this.currentVariant,
                quantity: parseInt(_this.element.querySelector('[name="quantity"]').value),
                cartItemKey: data.key
              }
            }));
          });
        }
      } else {
        response.json().then(function (content) {
          var errorMessageElement = document.createElement('div');
          errorMessageElement.className = 'Alert Alert--danger';
          if (typeof content['description'] === 'object') {
            errorMessageElement.innerHTML = content['message'];
          }else{
            errorMessageElement.innerHTML = content['description'];
          }
          addToCartButton.removeAttribute('disabled');
          addToCartButton.insertAdjacentElement('beforeBegin', errorMessageElement);
          setTimeout(function () {
            errorMessageElement.remove();
          }, 8000);
        });
      }
    });

    event.preventDefault();
  }

  _decreaseQuantity(event, target) {
    let qty = Math.max(parseInt(this.element.querySelector(".ProductForm__QuantityNum").value) - 1, 1);
    this.element.querySelector(".ProductForm__QuantityNum").value = qty;
    this.element.querySelector('[name="quantity"]').value = qty;
  }

  _increaseQuantity(event, target) {
    let qty = parseInt(this.element.querySelector(".ProductForm__QuantityNum").value) + 1;
    this.element.querySelector(".ProductForm__QuantityNum").value = qty;
    this.element.querySelector('[name="quantity"]').value = qty;
  }

  _validateQuantity(event, target) {
    target.value = Math.max(parseInt(target.value) || 1, 1);
  }

  _onChangeCustomPropertyRadio(event, target){
    let selectedValue = target.closest('.ProductForm__CustomProperty').querySelector('.ProductForm__SelectedValue');

    let invalidFeedbackElment = target.closest('.ProductForm__CustomProperty').querySelector('.InvalidFeedback');

    if (selectedValue) {
      selectedValue.innerHTML = target.value;
    }

    if (invalidFeedbackElment) {
      invalidFeedbackElment.classList.add("Valided");
    }
  }

  _onChangeCustomPropertySelect(event, target){
    let invalidFeedbackElment = target.closest('.ProductForm__CustomProperty').querySelector('.InvalidFeedback');
    if (invalidFeedbackElment) {
      if(target.value != ""){
        invalidFeedbackElment.classList.add("Valided");
      }else{
        invalidFeedbackElment.classList.remove("Valided");
      }
    }
  }

  _onChangeCustomPropertyText(event, target){
    let invalidFeedbackElment = target.closest('.ProductForm__CustomProperty').querySelector('.InvalidFeedback');

    if (invalidFeedbackElment) {
      if(target.value != ""){
        invalidFeedbackElment.classList.add("Valided");
      }else{
        invalidFeedbackElment.classList.remove("Valided");
      }
    }
  }
  
}

const components_business = {
    ProductImageModal,
    ProductVariants
};

return components_business;

}));
