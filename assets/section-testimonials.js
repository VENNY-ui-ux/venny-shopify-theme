if (!customElements.get('section-testimonials')) {
  class TG_SectionTestimonials extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback(){
      this.carousel = new themegoal.components.Carousel(this.querySelector('.Testimonials__Body'));
    }

    disconnectedCallback(){
      if(this.carousel)this.carousel.destroy();
    }
    
  }
    
  customElements.define('section-testimonials', TG_SectionTestimonials);
}