(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.themegoal = global.themegoal || {}, global.themegoal.components_business = global.themegoal.components_business || {}, global.themegoal.components_business.filter_products = factory()));
  })(this, (function () { 'use strict';

    class FilterProducts {
        constructor(element) {
            this.element = element;
            this.delegateElement = new themegoal.libs.Delegate(this.element);
            //replace conent, layout switch srcoll
            this.filterProductsElement = this.element.querySelector('.FilterProducts');
            this.filterProductsContentElement = this.element.querySelector('.FilterProducts__Content');

            //reload scroll
            this.filterProductsToolbarElement = this.element.querySelector('.FilterProducts__Toolbar');
            this.filterProductsDrawerElement = this.element.querySelector('.FilterProducts__Drawer');

            this.settings = JSON.parse(this.element.getAttribute('data-section-settings'));
            this.currentSortBy = this.settings['sortBy'];
        
            new TG_ProductCardColorSwatch();

            this.options = JSON.parse(this.element.getAttribute('data-section-settings'));
        
            if (this.options['animationType'] === 'staggering') {
              this._setupAnimation();
            }

            this._initPriceRangeToolbarSlider();
            this._initPriceRangeDrawerSlider();

            this._bindEventsListeners();
          }
        
          _debounce(fn, wait) {
            let t;
            return (...args) => {
              clearTimeout(t);
              t = setTimeout(() => fn.apply(this, args), wait);
            };
          }
        
          _bindEventsListeners() {
            this._onInputListener = this._debounce(this._toggleFilter.bind(this), 500);
        
            this.delegateElement.on('click', '[data-tg-action="change-layout-mode"]', this._changeLayoutMode.bind(this));
        
            this.delegateElement.on('click', '[data-tg-action="change-sort"]', this._sortByChanged.bind(this));
        
            this.delegateElement.on('click', '.FilterProducts__Form .ProductFilters__Item', this._onInputListener);
        
            this.delegateElement.on('click', '[data-tg-action="apply-price"]', this._onInputListener);//price toogle by button, not input
        
            window.addEventListener('popstate', function (event) {
              if (event.state.path) {
                window.location.href = event.state.path;
              }
            });
          }
        
          _setupAnimation() {
            var _this = this;
        
            //_setupAnimation(true),ajax 
            var forceLoadFromTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        
            if (this.intersectionObserver) {
              this.intersectionObserver.disconnect();
            }
        
            if (forceLoadFromTop) {
              themegoal.libs.anime({
                targets: this.filterProductsContentElement.querySelectorAll('.ProductCard'),
                opacity: [0, 1],
                translateY: [30,0],
                duration: 500,
                easing: 'cubicBezier(.5, .05, .1, .3)',
                delay: themegoal.libs.anime.stagger(300)
              });
             
            } else {
              
              this.intersectionObserver = new IntersectionObserver(this._reveal.bind(this), {
                threshold: 0.3
              });
        
              themegoal.helpers.Dom.nodeListToArray(this.filterProductsContentElement.querySelectorAll('.ProductCard')).forEach(function (item) {
                _this.intersectionObserver.observe(item);
              });
        
            }
          }
        
          _reveal(results) {
            var _this = this;
        
            var toReveal = [];
        
            results.forEach(function (result) {
              if (result.isIntersecting || result.intersectionRatio > 0) {
                toReveal.push(result.target);
                _this.intersectionObserver.unobserve(result.target);
              }
            });
        
            if (toReveal.length === 0) {
              return;
            }
        
            themegoal.libs.anime({
              targets: toReveal,
              opacity: [0, 1],
              translateY: [30,0],
              duration: 500,
              easing: 'cubicBezier(.5, .05, .1, .3)',
              delay: themegoal.libs.anime.stagger(300)
            });
            
          }
        
          //did not reload products
          _changeLayoutMode(event, target) {
            let _this = this;
        
            let layoutType = target.getAttribute('data-grid-type'),
                newCount = parseInt(target.getAttribute('data-count')),
                layoutTemplate = target.getAttribute('data-grid-template');
        
            if (this.filterProductsContentElement) {
              let previousCount = parseInt(this.filterProductsContentElement.getAttribute('data-' + layoutType + '-count'));
              if (previousCount === newCount) {
                return; // Nothing has changed so we just return to avoid reflow
              }
        
              this.filterProductsContentElement.setAttribute('data-' + layoutType + '-count', newCount);
        
              themegoal.helpers.Dom.nodeListToArray(this.filterProductsContentElement.querySelectorAll('.Grid__Item')).forEach(function (item) {
                if (layoutType === 'mobile') {
                  item.classList.remove('1/' + previousCount + '--small'); // IE11 and lower does not support classList.replace
                  item.classList.add('1/' + newCount + '--small');
                } else {
                  item.classList.remove('1/' + previousCount + '--medium-up');
                  item.classList.add('1/' + newCount+ '--medium-up');
                }
        
                item.firstElementChild.style.opacity = 0; 
              });
        
            }
        
            target.parentNode.querySelectorAll(".Button--icon").forEach(
              function(item){
                item.classList.remove("Active");
              }
            )
        
            target.classList.add('Active');
        
            this._setupAnimation();
            
            fetch(window.routes.cartUrl + '/update.js', {
              body: JSON.stringify({
                attributes: _this._defineProperty({}, layoutTemplate+'_' + layoutType + '_items_per_row', newCount)
              }),
              credentials: 'same-origin',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            });
          }
        
          _defineProperty(obj, key, value){ 
            if (key in obj) { 
              Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); 
            } else { 
              obj[key] = value; 
            } 
            return obj; 
          }
        
          _sortByChanged(event, target) {
            let sortBy = target.getAttribute("data-value");
            if (this.currentSortBy === sortBy) {
              return;
            }
        
            let eleP = target.closest('ul');
            let eles = eleP.querySelectorAll("li");
        
            eles.forEach(function(item){
              item.classList.remove("Active");
            });
        
            target.classList.add("Active");
        
            this.currentSortBy = sortBy;
        
            
        
            this._toggleFilter(event, target);
          }
        
          _toggleFilter(event, target){
            
            let formData = new FormData(this.element.querySelector('.FilterProducts__Form--drawer'));
        
            if(target.classList.contains("Active")){
              target.classList.remove("Active");
            }else{
              target.classList.add("Active");
            }
        
            let filterFrom = target.getAttribute("data-filter-from");
        
            if(filterFrom != undefined && filterFrom == 'toolbar'){
              formData = new FormData(this.element.querySelector('.FilterProducts__Form--toolbar'));
            }
        
            const searchParams = new URLSearchParams(formData).toString();
        
            this._reloadProducts(searchParams, filterFrom);
          }
        
        
          _reloadProducts(searchParams, filterFrom) {
            
            let _this = this;
        
            document.dispatchEvent(new CustomEvent('theme:loading:start'));
        
            var newUrl = window.location.protocol + '//' + window.location.host + this.settings['url'] +  '?sort_by=' + this.currentSortBy+ '&options[prefix]=last&' + searchParams;

            if (history.replaceState) {
              window.history.pushState({ path: newUrl }, '', newUrl);
            }
        
            fetch(newUrl, {
              credentials: 'same-origin',
              method: 'GET'
            }).then(function (response) {
              response.text().then(function (content) {
                var tempElement = document.createElement('div');
                tempElement.innerHTML = content;
        
                _this.filterProductsElement.innerHTML = tempElement.querySelector('.FilterProducts').innerHTML;
                document.dispatchEvent(new CustomEvent('theme:loading:end'));

                let filterProductsFormToolbar = tempElement.querySelector('.FilterProducts__Form--toolbar');
                let targetFilterProductsFormToolbar = _this.element.querySelector(".FilterProducts__Form--toolbar");

                let filterProductsFormDrawer = tempElement.querySelector('.FilterProducts__Form--drawer');
                let targetFilterProductsFormDrawer = _this.element.querySelector(".FilterProducts__Form--drawer");

                let accordionHeaders = tempElement.querySelectorAll(".FilterProducts__Form .Accordion__Button");
                let accordionBodys = tempElement.querySelectorAll(".FilterProducts__Form .Accordion__Collapse");

                accordionHeaders.forEach(function (item) {
                    let itemId = item.getAttribute("id");
        
                    if(itemId){
                        let preItem =  _this.element.querySelector("#"+itemId);
                        if(preItem){
                            item.setAttribute("class",  preItem.getAttribute("class"));
                            item.setAttribute("aria-expanded", preItem.getAttribute("aria-expanded"));
                        }
                    }
        
                });
                accordionBodys.forEach(function (item) {
                    let itemId = item.getAttribute("id");
                    if(itemId){
                        let preItem =  _this.element.querySelector("#"+itemId);
                        if(preItem){
                            item.setAttribute("class",  preItem.getAttribute("class"));
                        }
                    }
                });
        
                if(filterProductsFormToolbar && targetFilterProductsFormToolbar){
                  targetFilterProductsFormToolbar.innerHTML = filterProductsFormToolbar.innerHTML; 
                }
      
                if(filterProductsFormDrawer && targetFilterProductsFormDrawer){
                  targetFilterProductsFormDrawer.innerHTML = filterProductsFormDrawer.innerHTML; 
                }
        
                _this._initPriceRangeDrawerSlider();
                _this._initPriceRangeToolbarSlider();
        
        
                //Reset, the content has been replaced
                _this.filterProductsContentElement = _this.element.querySelector('.FilterProducts__Content');
                _this.filterProductsToolbarElement = _this.element.querySelector('.FilterProducts__Toolbar');
                _this.filterProductsDrawerElement = _this.element.querySelector('.FilterProducts__Drawer');
        
                if (_this.options['animationType'] === 'staggering') {
                  _this._setupAnimation(true);
                }
                
                var elementOffset = _this.filterProductsElement.getBoundingClientRect().top - parseInt(document.documentElement.style.getPropertyValue('--tg-header-height'))  - parseInt(document.documentElement.style.getPropertyValue('--tg-announcement-bar-height'));
        
                if (themegoal.helpers.Responsive.matchesBreakpoint('large') && _this.filterProductsToolbarElement && _this.filterProductsToolbarElement.clientHeight === 0) {
                  elementOffset -= 50;
                }
        
                if (elementOffset < 0) {
                  window.scrollBy({ top: elementOffset, behavior: 'smooth' });
                }
              });
            });
          }
        
          _initPriceRangeToolbarSlider(){
            let toolbarPriceSlider = document.getElementById('Toolbar-Price-Slider');
        
            if(!(window.noUiSlider && toolbarPriceSlider)){
              return;
            }
        
            let maxRangeValue = toolbarPriceSlider.getAttribute("data-tg-max-price");
        
            let toolbarPriceMin = document.getElementById('Filter-Toolbar-Min-Price');
            let toolbarPriceMax = document.getElementById('Filter-Toolbar-Max-Price');
        
            toolbarPriceMin.setAttribute("readonly", "true");
            toolbarPriceMax.setAttribute("readonly", "true");
        
            let handleMin = 0;
            let handleMax = parseFloat(maxRangeValue);
        
            if(toolbarPriceMin.value != ""){
              handleMin = parseFloat(toolbarPriceMin.value);
            }
        
            if(toolbarPriceMax.value != ""){
              handleMax = parseFloat(toolbarPriceMax.value);
            }
        
            noUiSlider.create(toolbarPriceSlider, {
              start: [handleMin, handleMax],
                connect: true,
                range: {
                    'min': 0,
                    'max': parseFloat(maxRangeValue)
                }
            });
        
            
        
            toolbarPriceSlider.noUiSlider.on('update', function (values, handle) {
                if(handle == 0){
                  toolbarPriceMin.value = values[handle];
                }
                if(handle == 1){
                  toolbarPriceMax.value = values[handle];
                }
            });
          }
        
          _initPriceRangeDrawerSlider(){
            let drawerPriceSlider = document.getElementById('Drawer-Price-Slider');
        
            if(!(window.noUiSlider && drawerPriceSlider)){
              return;
            }
        
            let maxRangeValue = drawerPriceSlider.getAttribute("data-tg-max-price");
        
            let drawerPriceMin = document.getElementById('Filter-Drawer-Min-Price');
            let drawerPriceMax = document.getElementById('Filter-Drawer-Max-Price');
        
            drawerPriceMin.setAttribute("readonly", "true");
            drawerPriceMax.setAttribute("readonly", "true");
        
            let handleMin = 0;
            let handleMax = parseFloat(maxRangeValue);
        
            if(drawerPriceMin.value != ""){
              handleMin = parseFloat(drawerPriceMin.value);
            }
        
            if(drawerPriceMax.value != ""){
              handleMax = parseFloat(drawerPriceMax.value);
            }
        
            noUiSlider.create(drawerPriceSlider, {
                start: [handleMin, handleMax],
                connect: true,
                range: {
                    'min': 0,
                    'max': parseFloat(maxRangeValue)
                }
            });
        
            drawerPriceSlider.noUiSlider.on('update', function (values, handle) {
                if(handle == 0){
                    drawerPriceMin.value = values[handle];
                }
                if(handle == 1){
                    drawerPriceMax.value = values[handle];
                }
            });
          }
  }


    const components_business = {
        FilterProducts
    };

    return components_business;

}));
