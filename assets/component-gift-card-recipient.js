if (!customElements.get('gift-card-recipient')) {
  customElements.define('gift-card-recipient', class GiftCardRecipient extends HTMLElement {
    constructor() {
      super();
      this.checkboxInput = this.querySelector(`#GiftCardRecipient-checkbox-${ this.dataset.sectionId }-${ this.dataset.blockId }`);
      this.checkboxInput.disabled = false;
      this.hiddenControlField = this.querySelector(`#GiftCardRecipient-control-${ this.dataset.sectionId }-${ this.dataset.blockId }`);
      this.hiddenControlField.disabled = true;
      this.emailInput = this.querySelector(`#GiftCardRecipient-email-${ this.dataset.sectionId }-${ this.dataset.blockId }`);
      this.nameInput = this.querySelector(`#GiftCardRecipient-name-${ this.dataset.sectionId }-${ this.dataset.blockId }`);
      this.messageInput = this.querySelector(`#GiftCardRecipient-message-${ this.dataset.sectionId }-${ this.dataset.blockId }`);
      this.addEventListener('change', this.onChange.bind(this));
    }

    onChange() {
      if (!this.checkboxInput.checked) {
        this.clearInputFields();
      }
    }

    clearInputFields() {
      this.emailInput.value = '';
      this.nameInput.value = '';
      this.messageInput.value = '';
    }

  });
}
