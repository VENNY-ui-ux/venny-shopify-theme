(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.themegoal = global.themegoal || {},  global.themegoal.components_business = global.themegoal.components_business || {},  global.themegoal.components_business.country_selector = factory()));
  })(this, (function () { 'use strict';

  class CountrySelector {
    constructor(countrySelect, provinceSelect) {
      this.countrySelect = countrySelect;
      this.provinceSelect = provinceSelect;
  
      if (this.countrySelect && this.provinceSelect) {
        this._bindEventsListeners();
        this._initSelectors();
      }
    }
  
    destroy() {
      if (this.countrySelect) {
        this.countrySelect.removeEventListener('change', this._onCountryChangedListener);
      }
    }
  
    _initSelectors() {
        var defaultCountry = this.countrySelect.getAttribute('data-default');
  
        if (defaultCountry) {
          for (var i = 0; i !== this.countrySelect.options.length; ++i) {
            if (this.countrySelect.options[i].text === defaultCountry) {
              this.countrySelect.selectedIndex = i;
              break;
            }
          }
        } else {
          this.countrySelect.selectedIndex = 0;
        }
  
        var event = new Event('change', { bubbles: true });
        this.countrySelect.dispatchEvent(event);
  
        var defaultProvince = this.provinceSelect.getAttribute('data-default');
  
        if (defaultProvince) {
          this.provinceSelect.value = defaultProvince;
        }
    }
  
    _bindEventsListeners() {
      this._onCountryChangedListener = this._onCountryChanged.bind(this);
      this.countrySelect.addEventListener('change', this._onCountryChangedListener);
    }
  
    _onCountryChanged() {
      var _this = this;
  
      var selectedOption = this.countrySelect.options[this.countrySelect.selectedIndex],
          provinces = JSON.parse(selectedOption.getAttribute('data-provinces') || '[]');
  
      this.provinceSelect.innerHTML = '';
  
      if (provinces.length === 0) {
        this.provinceSelect.parentNode.parentNode.style.display = 'none';
        return;
      }
  
      provinces.forEach(function (data) {
        _this.provinceSelect.options.add(new Option(data[1], data[0]));
      });
  
      this.provinceSelect.parentNode.parentNode.style.display = 'block'; 
    }
  
      
  }

  const components_business = {
    CountrySelector
};

return components_business;

}));