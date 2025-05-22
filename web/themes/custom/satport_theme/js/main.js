(function ($, Drupal, once) {
  Drupal.behaviors.satport_theme = {
    attach: function (context, settings) {
      const pageHeader = document.getElementById("page-header");
      const mainMenuFixed = document.getElementById("mobile-menu-fixed");
      const mainMenuScroll = document.getElementById("mobile-menu-scroll");
      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
      const heroSections = document.querySelectorAll(".paragraph--type--hero");
      const fullWidthImageSections = document.querySelectorAll(
        ".paragraph--type--full-width-image"
      );
      const desktopMenuSticky = document.getElementById("desktop-menu-sticky");
      const tagSections = document.querySelectorAll(".tag-section");
      const desktopMenu = document.getElementById("desktop-menu");
      const desktopMenuLinks = document.querySelectorAll("#desktop-menu a");

      // Mobile Menu toggle
      function closeMobileMenu() {
        mainMenuFixed.classList.remove("open");
        mobileMenuToggle.classList.remove("open");
        document.documentElement.classList.remove("scroll-lock");
      }
      mobileMenuToggle.addEventListener("click", function () {
        mainMenuFixed.classList.toggle("open");
        mobileMenuToggle.classList.toggle("open");
        document.documentElement.classList.toggle("scroll-lock");
      });

      // Init Page Menu.
      function initPageMenu() {
        if (!desktopMenu || !mobileMenu) return;

        // Create Mobile Menu.
        mobileMenu.innerHTML = desktopMenu.innerHTML;
        const mobileMenuLinks = mobileMenu.querySelectorAll("a");

        // Init link click events.
        function handleMenuLinkClick(e) {
          e.preventDefault();

          const targetId = this.getAttribute("href").substring(1);
          const target = document.getElementById(targetId);
          if (!target) return;

          closeMobileMenu();

          const headerOffset = window.innerWidth < 1024 ? 92 : 0;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }

        desktopMenuLinks.forEach(function (desktopMenuLink) {
          desktopMenuLink.addEventListener("click", handleMenuLinkClick);
        });
        mobileMenuLinks.forEach(function (desktopMenuLink) {
          desktopMenuLink.addEventListener("click", handleMenuLinkClick);
        });
      }
      initPageMenu();

      // Desktop menu position calculation.
      function setDesktopMenuPosition() {
        if (!desktopMenuSticky) return;

        const firstTag = document.querySelector(".section .item-tag");
        const topOffset = firstTag.getBoundingClientRect().top + window.scrollY;
        desktopMenuSticky.style.paddingTop = topOffset + "px";
      }

      //
      function getTagSectionPositions() {
        let values = [];
        tagSections.forEach(function (tagSection) {
          const topOffset =
            tagSection.getBoundingClientRect().top + window.scrollY;
          const bottomOffset =
            tagSection.getBoundingClientRect().bottom + window.scrollY;

          values.push({ topOffset, bottomOffset });
        });

        return values;
      }

      let tagSectionPositions = [];
      function onResize() {
        // Set Mobile menu container to fixed height to enable scrolling when necessary.
        mainMenuScroll.style.height =
          window.innerHeight - pageHeader.clientHeight + "px";

        // Reset Mobile menu visibility when resized to desktop.
        if (window.innerWidth >= 1024) {
          mainMenuFixed.classList.remove("open");
          mobileMenuToggle.classList.remove("open");
          document.documentElement.classList.remove("scroll-lock");
        }

        // Hero: Set min-height to be window height.
        heroSections.forEach(function (heroSection) {
          if (window.innerWidth >= 1024) {
            heroSection.style.height = window.innerHeight + "px";
          } else {
            heroSection.style.height =
              window.innerHeight - pageHeader.clientHeight + "px";
          }
        });

        // Section: Full Width Image.
        // Apply correct background image (mobile/desktop).
        fullWidthImageSections.forEach(function (fullWidthImageSection) {
          if (window.innerWidth >= 1024) {
            fullWidthImageSection.style.backgroundImage = `url(${fullWidthImageSection.dataset.desktopImage})`;
          } else {
            fullWidthImageSection.style.backgroundImage = `url(${fullWidthImageSection.dataset.mobileImage})`;
          }
        });

        //
        if (window.innerWidth >= 1024) {
          setDesktopMenuPosition();
          tagSectionPositions = getTagSectionPositions();
        }
      }

      // Attach the event listener.
      window.addEventListener("resize", onResize);
      onResize();

      function setDesktopMenuActiveItem() {
        if (!tagSectionPositions.length || !desktopMenuLinks.length) return;

        const desktopMenuTopOffset =
          desktopMenu.getBoundingClientRect().top + window.scrollY;
        let activeIndex;
        let i = 0;
        for (const tagSectionPosition of tagSectionPositions) {
          if (
            desktopMenuTopOffset >= tagSectionPosition.topOffset &&
            desktopMenuTopOffset <= tagSectionPosition.bottomOffset
          ) {
            activeIndex = i;
            break;
          }
          i++;
        }

        // Set active.
        i = 0;
        for (const desktopMenuLink of desktopMenuLinks) {
          desktopMenuLink.classList.remove("active");

          if (i === activeIndex) {
            desktopMenuLink.classList.add("active");
          }

          i++;
        }
      }

      // Attach the scroll listener.
      let lastKnownScrollPosition = 0;
      let ticking = false;
      function onScroll(scrollPos) {
        // Set active Desktop Menu item
        setDesktopMenuActiveItem();
      }

      document.addEventListener("scroll", (event) => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
          window.requestAnimationFrame(() => {
            onScroll(lastKnownScrollPosition);
            ticking = false;
          });

          ticking = true;
        }
      });
      onScroll(0);
    },
  };
})(jQuery, Drupal, once);
