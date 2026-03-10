if (!customElements.get('section-interactive-links')) {
    class TG_InteractiveLinks extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.delegateElement = new themegoal.libs.Delegate(this);
            this.interactiveLinks = this.querySelectorAll(".InteractiveLinks__Link");
            this.interactiveLinksImages = this.querySelectorAll(".InteractiveLinks__Image");
            
            this._bindEventsListeners();
        }

        _bindEventsListeners() {      
            this.delegateElement.on('mouseover', '.InteractiveLinks__Link', this._ActiveItem.bind(this), true);
        }

        _ActiveItem(event, target){
            var _this = this;
            this.interactiveLinks.forEach(function (item) {
                if(item.getAttribute("id") != target.getAttribute("id")){
                    item.classList.remove("Active");
                }
            });
            this.interactiveLinksImages.forEach(function (item) {
                if(item.getAttribute("id") != (target.getAttribute("id")+"-Image")){
                    item.classList.remove("Active");
                }
            });

            target.classList.add("Active");
            let targetImage = this.querySelector("#"+target.getAttribute("id")+"-Image");
            if(targetImage)targetImage.classList.add("Active");
        }
    }
    
    customElements.define('section-interactive-links', TG_InteractiveLinks);
}