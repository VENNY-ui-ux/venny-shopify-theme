if (!customElements.get('section-collection')) {
  class TG_SectionCollection extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
          new themegoal.components_business.filter_products.FilterProducts(this);
      }
    
  }
        
  customElements.define('section-collection', TG_SectionCollection);
}