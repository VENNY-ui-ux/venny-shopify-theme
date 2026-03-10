if (!customElements.get('section-scrolling-bar')) {
    class TG_SectionScrollingBar extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            this.animationId = 0;
            
            this.scrollingBar = this.querySelector('.ScrollingBar');

            if (! this.scrollingBar || this.scrollingBar.children.length === 0) {
                return;
            }
            
            this.scrollingBarInner = this.scrollingBar.querySelector('.ScrollingBar__Inner');
            this.scrollingBarItem = this.scrollingBar.querySelector('.ScrollingBar__Item');
            
            this.parent = this.scrollingBar.parentElement;
            this.parentProps = this.parent.getBoundingClientRect();
                  
            this._setupContent();

            this._startScroll();
        }
    
        _setupContent() {

            this.contentWidth = this.scrollingBarItem.offsetWidth;
            if(this.contentWidth < 8)return;
        
            this.requiredReps = this.contentWidth > this.parentProps.width ? 2 : Math.ceil((this.parentProps.width - this.contentWidth) / this.contentWidth) + 1;
        
            for (let i = 0; i < this.requiredReps; i++) {
                this._cloneItemElement();
            }

            this.scrollingBar.classList.add("ScrollingBar--animate");
        
        }

        _cloneItemElement(){
            const clone = this.scrollingBarItem.cloneNode(true);
            this.scrollingBarInner.appendChild(clone);
        }
    
    
        _repopulate(difference, isLarger) {
            this.contentWidth = this.scrollingBarItem.offsetWidth;
            if(this.contentWidth < 8)return;
            if (isLarger) {
                const amount = Math.ceil(difference / this.contentWidth) + 1;
                this.scrollingBar.classList.remove("ScrollingBar--animate");
                for (let i = 0; i < amount; i++) {
                    this._cloneItemElement();
                }
                this.scrollingBar.offsetWidth;//reflow
                if(!this.scrollingBar.classList.contains("ScrollingBar--animate"))this.scrollingBar.classList.add("ScrollingBar--animate");
            }
        }

        _startScroll() {
            let _this = this;
            let previousWidth = window.innerWidth;
            let timer;

            window.addEventListener('resize', () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    const isLarger = previousWidth < window.innerWidth;
                    const difference = window.innerWidth - previousWidth;
                    _this._repopulate(difference, isLarger);

                    previousWidth = this.innerWidth;
                }, 350);
            });
        }
      
    }
          
    customElements.define('section-scrolling-bar', TG_SectionScrollingBar);
  } 