(function ($, Drupal, once) {
  Drupal.behaviors.satport_theme = {
    attach: function (context, settings) {
      const pageHeader = document.getElementById("page-header");
      const mainMenuFixed = document.getElementById("mobile-menu-fixed");
      const mainMenuScroll = document.getElementById("mobile-menu-scroll");
      const mobileMenuToggle = document.getElementById("mobile-menu-toggle");

      mobileMenuToggle.addEventListener("click", () => {
        mainMenuFixed.classList.toggle("open");
        mobileMenuToggle.classList.toggle("open");
        document.documentElement.classList.toggle("scroll-lock");
      });

      function onResize() {
        // Set Mobile menu container to fixed height to enable scrolling when necessary
        mainMenuScroll.style.height =
          window.innerHeight - pageHeader.clientHeight + "px";

        // Reset Mobile menu visibility when resized to desktop
        if (window.innerWidth >= 1024) {
          mainMenuFixed.classList.remove("open");
          mobileMenuToggle.classList.remove("open");
          document.documentElement.classList.remove("scroll-lock");
        }
      }

      // Attach the event listener
      window.addEventListener("resize", onResize);
      onResize();
    },
  };
})(jQuery, Drupal, once);
