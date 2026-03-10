if (!customElements.get('section-counters')) {
    class TG_SectionCounters extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            var _this = this;

            this.counters = this.querySelectorAll(".Counter__Title");
            this._setupAnimation();
        }

        disconnectedCallback(){
          if(this.intersectionObserver)this.intersectionObserver.disconnect();
        }

        _setupAnimation() {
          var _this = this;
          if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
          }

          this.intersectionObserver = new IntersectionObserver(this._reveal.bind(this));
    
          themegoal.helpers.Dom.nodeListToArray(this.counters).forEach(function (item) {
            _this.intersectionObserver.observe(item);
          });
           
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
      
          toReveal.forEach(function (item) {
            _this._animateValue(item, 0, parseInt(item.innerHTML), 3000);
          });
        }

        _animateValue(obj, start, end, duration) {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
      }
          
          
    }
    
    customElements.define('section-counters', TG_SectionCounters);
}