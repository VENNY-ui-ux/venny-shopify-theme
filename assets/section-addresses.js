if (!customElements.get('section-addresses')) {
    class TG_SectionAddresses extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            var _this = this;

            this.countrySelectors = [];

            themegoal.helpers.Dom.nodeListToArray(document.querySelectorAll('.Modal--address')).forEach(function (modal) {
                _this.countrySelectors.push(new themegoal.components_business.country_selector.CountrySelector(modal.querySelector('[name="address[country]"]'), modal.querySelector('[name="address[province]"]')));
            });
        }
    }
    
    customElements.define('section-addresses', TG_SectionAddresses);
}