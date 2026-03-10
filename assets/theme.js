(function () {
  'use strict';

  (function () {
    new themegoal.helpers.Responsive();
    new TG_ProductCardColorSwatch();

    let windowWidth = window.innerWidth;
    window.addEventListener('resize', function () {
      let newWidth = window.innerWidth;

      if (newWidth === windowWidth) {
        return;
      }

      windowWidth = newWidth;
      let headerSection = document.getElementById('Header');
      let announcementBarSection = document.getElementById('AnnouncementBar');
      document.documentElement.style.setProperty('--tg-window-height', window.innerHeight + 'px');

      if (headerSection) {
        document.documentElement.style.setProperty('--tg-header-height', headerSection.offsetHeight + 'px');
        document.documentElement.style.setProperty('--tg-header-logo-width', document.querySelector('.Header__LogoWrapper').offsetWidth + 'px');
      }

      if (announcementBarSection) {
        document.documentElement.style.setProperty('--tg-announcement-bar-height', announcementBarSection.offsetHeight + 'px');
      }
    });
    
  })();

})();



