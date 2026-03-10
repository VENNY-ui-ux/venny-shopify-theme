if (!customElements.get('section-featured-columns')) {
  class TG_SectionFeaturedColumns extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      var _this = this;

      this.options = JSON.parse(this.getAttribute('data-section-settings'));

      if (this.options['animationType'] === 'staggering') {
        this.intersectionObserver = new IntersectionObserver(this._reveal.bind(this));
    
        themegoal.helpers.Dom.nodeListToArray(this.querySelectorAll('.FeaturedColumnsCard')).forEach(function (item) {
          _this.intersectionObserver.observe(item);
        });

      }
    }

    disconnectedCallback(){
      if(this.intersectionObserver)this.intersectionObserver.disconnect();
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
      
   }
          
    customElements.define('section-featured-columns', TG_SectionFeaturedColumns);
  }