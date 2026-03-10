function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function(event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  elementToFocus.focus();
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(":focus-visible");
} catch(e) {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  const navKeys = ['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'TAB', 'ENTER', 'SPACE', 'ESCAPE', 'HOME', 'END', 'PAGEUP', 'PAGEDOWN']
  let currentFocusedElement = null;
  let mouseClick = null;

  window.addEventListener('keydown', (event) => {
    if(navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false;
    }
  });

  window.addEventListener('mousedown', (event) => {
    mouseClick = true;
  });

  window.addEventListener('focus', () => {
    if (currentFocusedElement) currentFocusedElement.classList.remove('focused');

    if (mouseClick) return;

    currentFocusedElement = document.activeElement;
    currentFocusedElement.classList.add('focused');

  }, true);
}

function pauseAllMedia() {
    document.querySelectorAll('.js-youtube').forEach(video => {
      video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
    });
    document.querySelectorAll('.js-vimeo').forEach(video => {
      video.contentWindow.postMessage('{"method":"pause"}', '*');
    });
    document.querySelectorAll('video').forEach(video => video.pause());
    document.querySelectorAll('product-model').forEach(model => {
      if (model.modelViewerUI) model.modelViewerUI.pause();
    });
}

class TG_DeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.poster = this.querySelector('[id^="Deferred-Cover-"]');
    this.autoplay = this.getAttribute('data-tg-video-auto');
    if (!this.poster) return;
    this.poster.addEventListener('click', this.loadContent.bind(this));
  }

  connectedCallback() {
    if(this.autoplay == "1" && window.getComputedStyle(this).display != 'none'){
      // if (this.poster) this.poster.click();
      this.loadContent(false);
      // var video = this.querySelector('.DeferredMedia__SelfVideo');
      // if(video)video.play();
    }
  }

  loadContent(focus = true) {
    // window.pauseAllMedia();

    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      let templateElement = this.querySelector('template');
      if(!templateElement) return;
      content.appendChild(templateElement.content.firstElementChild.cloneNode(true));
      this.setAttribute('loaded', true);
      const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
      if (focus) deferredElement.focus();
      
      var video = this.querySelector('.DeferredMedia__SelfVideo');
      if(video)video.play();
    }
  }

}

customElements.define('deferred-media', TG_DeferredMedia);


class TG_ProductCardColorSwatch {
  constructor() {
    this.element = document.body;
    this.delegateElement = new themegoal.libs.Delegate(this.element);
    this.delegateElement.on('change', '.ProductCard__ColorSwatchRadio', this._colorChanged.bind(this));
  }

  _colorChanged(event, target) {
    let productItem = target.closest('.ProductCard'),
        variantUrl = target.getAttribute('data-variant-url');
   
    productItem.querySelector('.ProductCard__ImageWrapper > a').setAttribute('href', variantUrl);
    productItem.querySelector('.ProductCard__Title > a').setAttribute('href', variantUrl);

    var originalImageElement = productItem.querySelector('.ProductCard__Image:not(.ProductCard__Image--alternate)');

    if (target.hasAttribute('data-image-url') && target.getAttribute('data-image-id') !== originalImageElement.getAttribute('data-image-id')) {
      var newImageElement = document.createElement('img');
      newImageElement.className = 'ProductCard__Image';
      newImageElement.setAttribute('data-image-id', target.getAttribute('data-image-id'));
      newImageElement.setAttribute('src', target.getAttribute('data-image-url'));
      newImageElement.setAttribute('srcset', target.getAttribute('data-image-srcset'));

      if (window.theme.productImageSize === 'natural') {
        originalImageElement.parentNode.style.setProperty('--tg-aspect-ratio', target.getAttribute('data-image-aspect-ratio'));
      }

      originalImageElement.parentNode.replaceChild(newImageElement, originalImageElement);
    }
  }

}

if (!customElements.get('feature-img')) {
  class TG_ImageWrapper extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.cardImages = this.querySelectorAll(".Image--withLoader");
      this.cardImages.forEach(function (item) {
        if(item.complete){
          item.classList.add("Image--loaded");
        }else{
          item.onload = function(){
            item.classList.add("Image--loaded");
          }
        }
      });
    }
  }

  customElements.define('feature-img', TG_ImageWrapper);
}


class TG_LocalizationSelector extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let _this = this;
    this.addEventListener('show.tg.Dropdown', () => {
      _this._initDropdownList();
    });
  }

  _initDropdownList() {
    if (!this.getAttribute('loaded')) {
      this.setAttribute('loaded', true);
      
      let templateElement = this.querySelector('template');
      if(!templateElement) return;

      this.querySelector('.Dropdown__Body').innerHTML = templateElement.innerHTML; 
    }
  }

}

customElements.define('tg-localization-selector', TG_LocalizationSelector);