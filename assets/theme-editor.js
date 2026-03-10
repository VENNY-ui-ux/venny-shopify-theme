/*
 * Chord Theme Editor Section Event Function JS
 *
 */
if ((typeof window.ChordThemeEditor) == 'undefined') {
    window.ChordThemeEditor = {};
}
// Section
document.addEventListener('shopify:section:select', function(event) {
    ChordThemeEditor.selectSectionAnnouncementBar(event);
    ChordThemeEditor.selectSectionMenuDrawer(event);
    ChordThemeEditor.selectSectionCartDrawer(event);
    ChordThemeEditor.selectSectionMainCart(event);
    ChordThemeEditor.selectSectionSearchDrawer (event);

    ChordThemeEditor.selectSectionQuickviewModal(event);

    ChordThemeEditor.selectSectionNewsletterModal(event);
    ChordThemeEditor.selectPrivacyBannerToast(event);
    ChordThemeEditor.selectProductSection(event);
});

document.addEventListener('shopify:section:deselect', function(event) {
    ChordThemeEditor.deselectSectionMenuDrawer(event);
    ChordThemeEditor.deselectSectionCartDrawer(event);
    ChordThemeEditor.deselectSectionSearchDrawer(event);
    ChordThemeEditor.deselectSectionQuickviewModal(event);

    ChordThemeEditor.deselectSectionNewsletterModal(event);
});

// Block
document.addEventListener('shopify:block:select', function(event) {
    ChordThemeEditor.selectBlockProductInfoTitle(event);
    ChordThemeEditor.selectBlockMegaMenuImage(event);
    ChordThemeEditor.selectBlocDropdownMenu(event);
    ChordThemeEditor.selectBlockSlideshow(event);
    ChordThemeEditor.selectBlockTestimonials(event);
    ChordThemeEditor.selectBlockVerticalAccordion(event);
});

document.addEventListener('shopify:block:deselect', function(event) {
    ChordThemeEditor.deselectBlockProductInfoTitle(event);
    ChordThemeEditor.deselectBlockMegaMenuImage(event);
    ChordThemeEditor.deselectBlocDropdownMenu(event);
    ChordThemeEditor.deselectBlockSlideshow(event);
    ChordThemeEditor.deselectBlockTestimonials(event);
});

ChordThemeEditor.selectProductSection = function(event) {
    const productSectionContainerSelected = event.target.classList.contains('shopify-section--main-product');
    if (!productSectionContainerSelected) return;
    let sectionProductEle = event.target.querySelector("section-product");
    if (!sectionProductEle) return;
    let sectionId = sectionProductEle.getAttribute("data-section-id");
    let destinationGalleryZoomPhotoSwipe = document.querySelector("#MediaLightbox-"+sectionId);
    if (destinationGalleryZoomPhotoSwipe) {
        let pElem = destinationGalleryZoomPhotoSwipe.parentNode;
        let newScript = document.createElement('script');
        newScript.type = 'module';
        newScript.id = "MediaLightbox-"+sectionId;
        newScript.innerHTML = destinationGalleryZoomPhotoSwipe.innerHTML;

        pElem.removeChild(destinationGalleryZoomPhotoSwipe);
        pElem.appendChild(newScript);
    }
}

//Search Drawer section
ChordThemeEditor.selectSectionSearchDrawer = function(event) {
    const menuDrawerSectionSelected = event.target.classList.contains('shopify-section--search-drawer');
    if (!menuDrawerSectionSelected) return;
    document.querySelector("body").style.removeProperty('overflow');
    let menuDrawerEle = document.getElementById('SearchDrawer');
    if(menuDrawerEle && !menuDrawerEle.classList.contains('Show')){
        let ele = document.getElementById('Header__SearchTrigger');
        ele.click();
    }
};
ChordThemeEditor.deselectSectionSearchDrawer = function(event) {
    const menuDrawerSectionSelected = event.target.classList.contains('shopify-section--search-drawer');
    if (!menuDrawerSectionSelected) return;
    document.querySelector("body").style.removeProperty('overflow');

    let menuDrawerEle = document.getElementById('SearchDrawer');
    if(menuDrawerEle && menuDrawerEle.classList.contains('Show')){
        let ele = document.getElementById('Header__SearchTrigger');
        ele.click();
    }
};

ChordThemeEditor.selectSectionAnnouncementBar = function(event){
    const announcementBarSectionContainerSelected = event.target.classList.contains('shopify-section--announcement-bar');
    if (!announcementBarSectionContainerSelected) return;
    
    const announcementBarSectionSelected = document.getElementById('AnnouncementBar');

    if (announcementBarSectionSelected && announcementBarSectionSelected.getAttribute("data-closeable") == "1" ) {
        sessionStorage.removeItem('AnnoucementClosed');
        announcementBarSectionSelected.setAttribute('aria-hidden', 'false');
        document.documentElement.style.setProperty('--tg-announcement-bar-height', document.getElementById('AnnouncementBar').offsetHeight + 'px'); 
    }
}

//Cart Drawer
ChordThemeEditor.selectSectionCartDrawer = function(event){
    const cartDrawerSectionSelected = event.target.classList.contains('shopify-section--cart-drawer');
    if (!cartDrawerSectionSelected) return;
    document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
        bubbles: true
    }));

    document.querySelector("body").style.removeProperty('overflow');
    let cartDrawerEle = document.getElementById('CartDrawer');
    if(cartDrawerEle && !cartDrawerEle.classList.contains('Show')){
        let ele = document.getElementById('Header__CartTrigger');
        ele.click();
    }
  }

ChordThemeEditor.deselectSectionCartDrawer = function(event) {
    const cartDrawerSectionSelected = event.target.classList.contains('shopify-section--cart-drawer');
    if (!cartDrawerSectionSelected) return;
    document.querySelector("body").style.removeProperty('overflow');
    let cartDrawerEle = document.getElementById('CartDrawer');
    if(cartDrawerEle && cartDrawerEle.classList.contains('Show')){
        let ele = document.getElementById('Header__CartTrigger');
        ele.click();
    }
};

//Cart Main
ChordThemeEditor.selectSectionMainCart = function(event){
    const cartDrawerSectionSelected = event.target.classList.contains('shopify-section--main-cart');
    if (!cartDrawerSectionSelected) return;
    document.documentElement.dispatchEvent(new CustomEvent('main-cart:refresh', {
        bubbles: true
      }));
}

//MenuDrawer section
ChordThemeEditor.selectSectionMenuDrawer = function(event) {
    const menuDrawerSectionSelected = event.target.classList.contains('shopify-section--menu-drawer');
    if (!menuDrawerSectionSelected) return;
    document.querySelector("body").style.removeProperty('overflow');
    let menuDrawerEle = document.getElementById('MenuDrawer');
    if(menuDrawerEle && !menuDrawerEle.classList.contains('Show')){
        let ele = document.getElementById('Header__MenuTrigger');
        ele.click();
    }
};
ChordThemeEditor.deselectSectionMenuDrawer = function(event) {
    const menuDrawerSectionSelected = event.target.classList.contains('shopify-section--menu-drawer');
    if (!menuDrawerSectionSelected) return;
    document.querySelector("body").style.removeProperty('overflow');

    let menuDrawerEle = document.getElementById('MenuDrawer');
    if(menuDrawerEle && menuDrawerEle.classList.contains('Show')){
        let ele = document.getElementById('Header__MenuTrigger');
        ele.click();
    }
};

ChordThemeEditor.selectBlockProductInfoTitle = function(event) {
    const productInfoBlockSelected = event.target.classList.contains('ProductInfoDrawer__Title');
    if (!productInfoBlockSelected) return;

    let dataSource = document.getElementById("product-drawer-design-mode-"+event.detail.blockId);
    let dataTarget = document.getElementById("product-drawer-"+event.detail.blockId);

    if(dataSource && dataTarget){
        dataTarget.innerHTML = dataSource.innerHTML;
    }

    document.querySelector("body").style.removeProperty('overflow');
    
    if(dataTarget && !dataTarget.classList.contains('Show')){
        event.target.querySelector("button").click();
    }
};
ChordThemeEditor.deselectBlockProductInfoTitle = function(event) {
    const productInfoBlockSelected = event.target.classList.contains('ProductInfoDrawer__Title');
    if (!productInfoBlockSelected) return;
    
    document.querySelector("body").style.removeProperty('overflow');

    let dataTarget = document.getElementById("product-drawer-"+event.detail.blockId);
    if(dataTarget && dataTarget.classList.contains('Show')){
        event.target.querySelector("button").click();
    }
};

ChordThemeEditor.selectBlockMegaMenuImage = function(event) {
    const megaMenuImageBlockSelected = event.target.classList.contains('MegaMenu__Item--image');
    if (!megaMenuImageBlockSelected) return;
    const parentMegaMenuBody = event.target.closest('.DropdownMenu__Body--mega');
    if(parentMegaMenuBody){
        parentMegaMenuBody.classList.add("Show");
        event.target.classList.add("MegaMenu__Item--imageThemeEditorFoucs");
    }
    const headerMainMenu = document.querySelector(".Header__MainMenu");
    if(!headerMainMenu) return ;
    headerMainMenu.addEventListener('mouseover', ChordThemeEditor_closeMainMenuDropdownMenu);
};
ChordThemeEditor.deselectBlockMegaMenuImage = function(event) {
    const megaMenuImageBlockSelected = event.target.classList.contains('MegaMenu__Item--image');
    if (!megaMenuImageBlockSelected) return;
    const parentMegaMenuBody = event.target.closest('.DropdownMenu__Body--mega');
    if(parentMegaMenuBody){
        parentMegaMenuBody.classList.remove("Show");
        event.target.classList.remove("MegaMenu__Item--imageThemeEditorFoucs");
    }
    const headerMainMenu = document.querySelector(".Header__MainMenu");
    if(!headerMainMenu) return ;
    headerMainMenu.removeEventListener('mouseover', ChordThemeEditor_closeMainMenuDropdownMenu);
};

// mega or title menu  blocks
ChordThemeEditor.selectBlocDropdownMenu = function(event) {
    const megaOrTitleMenuBlockSelected = event.target.classList.contains('DropdownMenu__Body');
    if (!megaOrTitleMenuBlockSelected) return;

    const headerMainMenu = document.querySelector(".Header__MainMenu");
    if(!headerMainMenu) return ;
    headerMainMenu.addEventListener('mouseover', ChordThemeEditor_closeMainMenuDropdownMenu);

    event.target.classList.add("Show");
};
ChordThemeEditor.deselectBlocDropdownMenu = function(event) {
    const megaOrTitleMenuBlockSelected = event.target.classList.contains('DropdownMenu__Body');
    if (!megaOrTitleMenuBlockSelected) return;

    const headerMainMenu = document.querySelector(".Header__MainMenu");
    if(!headerMainMenu) return ;
    headerMainMenu.removeEventListener('mouseover', ChordThemeEditor_closeMainMenuDropdownMenu);
    
    event.target.classList.remove("Show");
};

function ChordThemeEditor_closeMainMenuDropdownMenu(){
    document.querySelectorAll(".DropdownMenu__Body").forEach(function (item) {
        item.classList.remove("Show");
    });
}


//Slideshow
ChordThemeEditor.selectBlockSlideshow = function(event){
    const sectionTarget = event.target.classList.contains('SlideItem--'+event.detail.blockId);
    if (!sectionTarget) return;

    let ele = document.getElementById("section-"+event.detail.sectionId);
    let swiperEle = ele.querySelector('[data-carousel-config]');

    if(swiperEle){
        let swiperInstance = swiperEle.swiper;

        if(swiperInstance){
            swiperInstance.autoplay.pause();

            let selectToIndex = parseInt(event.target.getAttribute('data-slide-index'));
            swiperInstance.slideTo(selectToIndex, 500);
        }
    }
}

ChordThemeEditor.deselectBlockSlideshow = function(event){
    const sectionTarget = event.target.classList.contains('SlideItem--'+event.detail.blockId);
    if (!sectionTarget) return;

    let ele = document.getElementById("section-"+event.detail.sectionId);
    let swiperEle = ele.querySelector('[data-carousel-config]');

    if(swiperEle){
        let swiperInstance = swiperEle.swiper;
        if(swiperInstance){
            swiperInstance.autoplay.resume();
        }
    }
}

//Testimonials
ChordThemeEditor.selectBlockTestimonials = function(event){
    const sectionTarget = event.target.classList.contains('TestimonialWrapper--'+event.detail.blockId);
    if (!sectionTarget) return;

    let ele = document.getElementById("section-"+event.detail.sectionId);
    let swiperEle = ele.querySelector('[data-carousel-config]');

    if(swiperEle){
        let swiperInstance = swiperEle.swiper;
        if(swiperInstance){
            swiperInstance.autoplay.pause();
    
            let selectToIndex = parseInt(event.target.getAttribute('data-slide-index'));
            swiperInstance.slideTo(selectToIndex, 500);
        }
    }
}

ChordThemeEditor.deselectBlockTestimonials = function(event){

    const sectionTarget = event.target.classList.contains('TestimonialWrapper--'+event.detail.blockId);
    if (!sectionTarget) return;

    let ele = document.getElementById("section-"+event.detail.sectionId);
    let swiperEle = ele.querySelector('[data-carousel-config]');

    if(swiperEle){
        let swiperInstance = swiperEle.swiper;
        if(swiperInstance){
            swiperInstance.autoplay.resume();
        }
    }
}

//Quickview Modal section
ChordThemeEditor.selectSectionQuickviewModal = function(event) {
    const sectionTarget = event.target.classList.contains('shopify-section--product-quickview');
    if (!sectionTarget) return;
    let ele = document.getElementById('ProductQuickviewModal');
 
    let quiviewModal = themegoal.components.Modal.getOrCreateInstance(ele);
   
    quiviewModal.show();
};
ChordThemeEditor.deselectSectionQuickviewModal = function(event) {
    const sectionTarget = event.target.classList.contains('shopify-section--product-quickview');
    if (!sectionTarget) return;
    let ele = document.getElementById('ProductQuickviewModal');
 
    let quiviewModal = themegoal.components.Modal.getOrCreateInstance(ele);
   
    quiviewModal.hide();
};

//Newsletter Modal section
ChordThemeEditor.selectSectionNewsletterModal = function(event) {
    const sectionTarget = event.target.classList.contains('shopify-section--newsletter-popup');
    if (!sectionTarget) return;
    let ele = document.querySelector('.NewsletterPopup');
 
    if(ele){
        let newsletterModal = themegoal.components.Modal.getOrCreateInstance(ele);
        newsletterModal.show();
    }
};
ChordThemeEditor.deselectSectionNewsletterModal = function(event) {
    const sectionTarget = event.target.classList.contains('shopify-section--newsletter-popup');
    if (!sectionTarget) return;
    let ele = document.querySelector('.NewsletterPopup');
 
    if(ele){
        let newsletterModal = themegoal.components.Modal.getOrCreateInstance(ele);
        newsletterModal.hide();
    }
};

ChordThemeEditor.selectPrivacyBannerToast = function(event) {
    const sectionTarget = event.target.classList.contains('shopify-section--privacy-banner');
    if (!sectionTarget) return;
    let ele = document.querySelector('.PrivacyBanner');
 
    if(ele){
        let privacyBannerToast = themegoal.components.Toast.getOrCreateInstance(ele);
        privacyBannerToast.show();
    }
};

//VerticalAccordion
ChordThemeEditor.selectBlockVerticalAccordion = function(event){
    const itemSelected = event.target.classList.contains('VerticalAccordion__Item--'+event.detail.blockId);
    if (!itemSelected) return;

    const parentEle = event.target.closest('.VerticalAccordion__Wrapper');
    let items = parentEle.querySelectorAll(".VerticalAccordion__Item");

    items.forEach(function (item) {
        if(item.getAttribute("id") != event.target.getAttribute("id"))
        item.classList.remove("Active");
    });

    event.target.classList.add("Active");
};