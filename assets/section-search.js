if (!customElements.get('section-search')) {
  class TG_SectionSearch extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
        new themegoal.components_business.filter_products.FilterProducts(this);
    }
    
  }
        
  customElements.define('section-search', TG_SectionSearch);
}