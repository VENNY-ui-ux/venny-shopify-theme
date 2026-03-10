if (!customElements.get('section-announcement-bar')) {
    class TG_SectionAnnouncementBar extends HTMLElement {
      constructor() {
          super();
      }

      connectedCallback() {
        this.delegateElement = new themegoal.libs.Delegate(this);
  
        this.options = JSON.parse(this.getAttribute('data-section-settings'));
  
        try {
          if (this.options['closeable'] && sessionStorage.getItem('AnnoucementClosed') === null) {
              this._openAnnoucement();
          }
        } catch (error) {
        }
  
        this._bindEventsListeners();
      }

      disconnectedCallback(){
        if(this.delegateElement)this.delegateElement.destroy();
      }

      _bindEventsListeners() {
        this.delegateElement.on('click', '[data-action="close-annoucement"]', this._closeAnnoucement.bind(this));
      }
  
      _openAnnoucement() {
          this.setAttribute('aria-hidden', 'false');
          document.documentElement.style.setProperty('--tg-announcement-bar-height', document.getElementById('AnnouncementBar').offsetHeight + 'px'); 
      }
  
      _closeAnnoucement() {
          sessionStorage.setItem('AnnoucementClosed', 'true');
          this.setAttribute('aria-hidden', 'true');
          document.documentElement.style.setProperty('--tg-announcement-bar-height', '0px');
      }
    }
    
    customElements.define('section-announcement-bar', TG_SectionAnnouncementBar);
}