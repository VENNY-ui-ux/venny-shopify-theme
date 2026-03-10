if (!customElements.get('image-comparison')) {
    class TG_ImageComparison extends HTMLElement {
        constructor() {
            super();
        }
    
        connectedCallback() {
            this.cursor = this.querySelector(".ImageComparison__Cursor");
            this.cursor.addEventListener('input', this._onInputChange.bind(this));
        }
    
        disconnectedCallback(){
            this.cursor.removeEventListener('input', this._onInputChange.bind(this));
        }
        
        _onInputChange(){
            this.style.setProperty("--section-image-comparison-cursor-position", this.cursor.value+"%");
            this.style.setProperty("--section-image-comparison-cursor-button", this.cursor.value+"%");
        }
    }
  
    customElements.define('image-comparison', TG_ImageComparison);
}