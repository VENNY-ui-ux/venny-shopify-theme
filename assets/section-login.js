if (!customElements.get('section-login')) {
  class TG_SectionLogin extends HTMLElement{
    constructor() {
      super();
    }

    connectedCallback() {
      this.element = this;
      this.delegateElement = new themegoal.libs.Delegate(this.element);
      
      this.customerLoginForm = this.element.querySelector('#CustomerLogin');
      this.recoverCustomerPasswordForm = this.element.querySelector('#RecoverCustomerPassword');
  
      this.delegateElement.on('click', '[data-action="toggle-customer-form"]', this._toggleCustomerForm.bind(this));
    }

    disconnectedCallback(){
      if(this.delegateElement)this.delegateElement.destroy();
    }
  
    _toggleCustomerForm() {
      var isLoginActive = this.customerLoginForm.style.display === 'block';
  
      this.timeline = themegoal.libs.anime.timeline({
        easing: 'cubicBezier(.5, .05, .1, .3)',
        duration: 300
      });
  
      if (isLoginActive) {
        this.customerLoginForm.style.display = 'none';
        this.recoverCustomerPasswordForm.style.display = 'block';
        this.recoverCustomerPasswordForm.style.opacity = 0;
  
        this.timeline
        .add({
          targets: this.customerLoginForm,
          opacity: [1, 0],
          translateY: [0,30]
        })
        .add({
          targets: this.recoverCustomerPasswordForm,
          opacity: [0, 1],
          translateY: [30,0]
        })
  
      } else {
        this.customerLoginForm.style.display = 'block';
        this.recoverCustomerPasswordForm.style.display = 'none';
        this.customerLoginForm.style.opacity = 0;
  
        this.timeline
        .add({
          targets: this.recoverCustomerPasswordForm,
          opacity: [1, 0],
          translateY: [0,30]
        })
        .add({
          targets: this.customerLoginForm,
          opacity: [0, 1],
          translateY: [30,0]
        })
  
      }
    }
  }

  customElements.define('section-login', TG_SectionLogin);
}