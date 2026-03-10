if (!customElements.get('section-vertical-accordion')) {
    class TG_VerticalAccordion extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.delegateElement = new themegoal.libs.Delegate(this);
            this.verticalAccordionItems = this.querySelectorAll(".VerticalAccordion__Item");
            
            this._bindEventsListeners();
        }

        _bindEventsListeners() {      
            this.delegateElement.on('mouseover', '.VerticalAccordion__Item', this._ActiveItem.bind(this), true);
        }

        _ActiveItem(event, target){
            var _this = this;
            this.verticalAccordionItems.forEach(function (item) {
                if(item.getAttribute("id") != target.getAttribute("id"))
                item.classList.remove("Active");
            });

            target.classList.add("Active");
        }
    }
    
    customElements.define('section-vertical-accordion', TG_VerticalAccordion);
}