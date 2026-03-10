if (!customElements.get('privacy-banner')) {
  class TG_PrivacyBanner extends HTMLElement {
    constructor() {
      super();

      this.privacyBannerInstance = themegoal.components.Toast.getOrCreateInstance(this);
      this.acceptPolicyButton = this.querySelector(".PrivacyBanner__Accept");
      this.declinePolicyButton = this.querySelector(".PrivacyBanner__Decline");

      window.Shopify.loadFeatures(
        [
          {
            name: 'consent-tracking-api',
            version: '0.1',
            onLoad: this._onConsentLibraryLoaded.bind(this)
          }
        ]
       );
    }

    disconnectedCallback(){
      if(this.privacyBannerInstance) this._hidePrivacyBanner();
    }

    _onConsentLibraryLoaded(){
      if (window.Shopify.customerPrivacy?.shouldShowBanner() && window.Shopify.customerPrivacy?.userCanBeTracked()) {
        this.privacyBannerInstance.show();
        this._bindEventsListeners();
      }
    }

    _bindEventsListeners() {
      this.acceptPolicyButton.addEventListener('click', this._acceptPolicy.bind(this));
      this.declinePolicyButton.addEventListener('click', this._declinePolicy.bind(this));
    }

    _hidePrivacyBanner(){
      this.privacyBannerInstance.hide();
    }

    _acceptPolicy(){
      window.Shopify.customerPrivacy.setTrackingConsent(!0, this._hidePrivacyBanner.bind(this));
    }

    _declinePolicy(){
      window.Shopify.customerPrivacy.setTrackingConsent(!1, this._hidePrivacyBanner.bind(this));
      
    }


  }

  customElements.define('privacy-banner', TG_PrivacyBanner);
}
