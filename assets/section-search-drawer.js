if (!customElements.get('search-drawer')) {
    class TG_SearchDrawerTag extends HTMLElement {
      constructor() {
        super();
      }
  
      connectedCallback() {
        this.documentDelegate = new themegoal.libs.Delegate(document.body);
  
        this.sectionId = this.getAttribute('data-section-id');
        this.searchInputElement = this.querySelector('[name="q"]');
        this.searchDrawerResults = this.querySelector('.SearchDrawer__Results');
        this.searchResultsElement = this.querySelector('[data-predictive-search-drawer-results]');
        this.searchStatusElement = this.querySelector('[data-predictive-search-drawer-status]');
        this.searchSummaryElement = this.querySelector('[data-predictive-search-drawer-summary]');
  
        this._bindEventsListeners();
      }

      disconnectedCallback(){
        if(this.searchInputElement)this.searchInputElement.removeEventListener('input', this._onInputListener);
        if(this.documentDelegate)this.documentDelegate.destroy();
      }
  
      _bindEventsListeners() {
        let _this = this;
        this.addEventListener('shown.tg.Drawer', event => {
          _this.searchInputElement.focus();
        });
    
        this._onInputListener = this._debounce(this._onInput.bind(this), 250);
        this.searchInputElement.addEventListener('input', this._onInputListener);
        this.documentDelegate.on('search:close', this._closeSearch.bind(this)); 
      }
  
      _closeSearch(){
        let searchDrawerElement = document.getElementById('SearchDrawer')
        let searchDrawer = new themegoal.components.Drawer(searchDrawerElement);
        searchDrawer.hide();
      }
    
      _onInput(event) {
        let _this = this;
    
        if (event.keyCode === 13) {
          return;
        }
    
        this.lastInputValue = event.target.value;
    
        if (this.lastInputValue === '') {
          this._resetSearch();
          return;
        }
    
        var queryOptions = { method: 'GET', credentials: 'same-origin' };
    
        var queries = [fetch(window.routes.predictiveSearchUrl + '?section_id='+this.sectionId+'&q=' + encodeURIComponent(this.lastInputValue), queryOptions)];
    
    
        document.dispatchEvent(new CustomEvent('theme:loading:start'));
        this.searchStatusElement.style.display = 'block';
        this.searchDrawerResults.setAttribute('aria-hidden', 'false');
    
        Promise.all(queries).then(function (responses) {
          if (_this.lastInputValue !== event.target.value) {
            return;
          }
    
    
          Promise.all(responses.map(function (response) {
            return response.text();
          })).then(function (contents) {
            var tempElement = new DOMParser().parseFromString(contents, 'text/html');
    
            _this.searchResultsElement.innerHTML = tempElement.querySelector('[data-predictive-search-drawer-results]').innerHTML;
            if(tempElement.querySelector('[data-predictive-search-drawer-summary]')){
                _this.searchSummaryElement.innerHTML = tempElement.querySelector('[data-predictive-search-drawer-summary]').innerHTML;
            }
          });
    
          document.dispatchEvent(new CustomEvent('theme:loading:end'));
          _this.searchStatusElement.style.display = 'none';
        });
      }
    
      _resetSearch() {
        this.searchResultsElement.innerHTML = '';
        this.searchSummaryElement.innerHTML = '';
        this.searchDrawerResults.setAttribute('aria-hidden', 'true');
        document.dispatchEvent(new CustomEvent('theme:loading:end')); 
        this.searchStatusElement.style.display = 'none';
      }
    
      _debounce(fn, delay) {
        var _this = this;
    
        var timer = null;
    
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }
        
            clearTimeout(timer);
        
            timer = setTimeout(function () {
                fn.apply(_this, args);
            }, delay);
        };
      }
      
    }
  
    customElements.define('search-drawer', TG_SearchDrawerTag);
  }