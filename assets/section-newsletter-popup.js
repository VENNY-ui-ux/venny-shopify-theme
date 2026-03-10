if (!customElements.get('section-newsletter-popup')) {
  class TG_SectionNewsletterPopup extends HTMLElement{
    constructor() {
      super();
    }

    connectedCallback() {
      this.options = JSON.parse(this.getAttribute('data-section-settings'));
      this.isEnabled = true;// backdrop open again, delay open when disconnected in the theme editor, unenable 
      this.newsletterPopupInstance = themegoal.components.Modal.getOrCreateInstance(this);

      this.newsletterPopupNoButton = document.getElementById("NewsletterPopupNo");
      
      this.newsletterPopupNo = this._newsletterPopupNo.bind(this);

      if(this.newsletterPopupNoButton){
        this.newsletterPopupNoButton.addEventListener("click", this.newsletterPopupNo);
      }

      try {
        if (!(this.options['showOnlyOnce'] && localStorage.getItem("newsletterPopupAppeared") === "true" || localStorage.getItem("newsletterPopupFilled") === "true" || localStorage.getItem("newsletterPopupNo") === "true")) {
          setTimeout(this._openPopup.bind(this), this.options['apparitionDelay'] * 1000);
        }
      } catch (error) {
      }
    }

    _newsletterPopupNo(){
      localStorage.setItem("newsletterPopupNo", "true");
      if(this.newsletterPopupInstance){
        this.newsletterPopupInstance.hide();
      }
    }

    _openPopup(){
      if(this.newsletterPopupInstance && this.isEnabled){
        this.newsletterPopupInstance.show();
        localStorage.setItem("newsletterPopupAppeared", "true");
      }
    }

    disconnectedCallback(){
      this.isEnabled = false;
      if(this.newsletterPopupInstance) this.newsletterPopupInstance.hide();
      if(this.newsletterPopupNoButton){
        this.newsletterPopupNoButton.removeEventListener("click", this.newsletterPopupNo);
      }
    }
  }

  customElements.define('section-newsletter-popup', TG_SectionNewsletterPopup);
}