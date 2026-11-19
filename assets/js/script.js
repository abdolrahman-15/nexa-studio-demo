
"use strict";

/* ==================================================
   شروع مدیریت منوی موبایل
================================================== */

(() => {
    // دریافت عناصر موردنیاز منو
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNavigation = document.querySelector(".main-navigation");
    const navigationLinks = document.querySelectorAll(".navigation-link");

    // بررسی وجود عناصر منو
    if (!menuToggle || !mainNavigation) {
        return;
    }

    // تنظیم وضعیت اولیه منو
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "باز کردن منو");

    // باز و بسته کردن منوی موبایل
    function toggleMobileMenu() {
        const isMenuOpen = mainNavigation.classList.toggle("is-open");

        menuToggle.classList.toggle("is-active", isMenuOpen);

        menuToggle.setAttribute("aria-expanded", String(isMenuOpen));

        menuToggle.setAttribute(
            "aria-label",
            isMenuOpen ? "بستن منو" : "باز کردن منو"
        );
    }

    // بستن منوی موبایل
    function closeMobileMenu() {
        mainNavigation.classList.remove("is-open");
        menuToggle.classList.remove("is-active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "باز کردن منو");
    }

    // مدیریت کلیک روی دکمه منو
    menuToggle.addEventListener("click", toggleMobileMenu);

    // بستن منو پس از انتخاب لینک
    navigationLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    // بستن منو با کلید Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    // بستن منو با کلیک خارج از آن
    document.addEventListener("click", (event) => {
        const clickedInsideMenu = mainNavigation.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }
    });

    // بستن منو هنگام تغییر اندازه صفحه
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
})();

/* پایان مدیریت منوی موبایل */


/* ==================================================
   شروع مدیریت فرم تماس
================================================== */

(() => {
    // دریافت عناصر فرم
    const contactForm = document.querySelector(
        "#contact-form, #contactForm"
    );

    const formFeedback = document.querySelector(
        "#form-feedback, #formFeedback"
    );

    // بررسی وجود فرم
    if (!contactForm || !formFeedback) {
        return;
    }

    // مدیریت ارسال فرم
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // بررسی اعتبار اطلاعات واردشده
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // نمایش پیام واقعی وضعیت فرم
        formFeedback.textContent =
            "اطلاعات فرم معتبر است. برای ارسال واقعی پیام، باید سرویس فرم یا بک‌اند متصل شود.";

        formFeedback.setAttribute("role", "status");
        formFeedback.setAttribute("aria-live", "polite");
    });

    // پاک کردن پیام قبلی هنگام تغییر اطلاعات
    contactForm.addEventListener("input", () => {
        formFeedback.textContent = "";
    });
})();

/* پایان مدیریت فرم تماس */


/* ==================================================
   شروع مدیریت انیمیشن اسکرول
================================================== */

(() => {
    // دریافت عناصر دارای انیمیشن
    const revealElements = document.querySelectorAll("[data-reveal]");

    // بررسی وجود عناصر
    if (revealElements.length === 0) {
        return;
    }

    // بررسی تنظیمات کاهش حرکت
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // نمایش مستقیم عناصر در صورت نیاز
    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    // فعال کردن حالت انیمیشن
    document.documentElement.classList.add("js-enabled");

    // ساخت ناظر انیمیشن اسکرول
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                // نمایش عنصر هنگام ورود به صفحه
                entry.target.classList.add("is-visible");

                // توقف بررسی عنصر نمایش داده‌شده
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    // ثبت عناصر برای مشاهده
    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
})();

/* پایان مدیریت انیمیشن اسکرول */


/* ==================================================
   شروع مدیریت افکت هدر هنگام اسکرول
================================================== */

(() => {
    // دریافت هدر سایت
    const siteHeader = document.querySelector(".site-header");

    // بررسی وجود هدر
    if (!siteHeader) {
        return;
    }

    // به‌روزرسانی ظاهر هدر
    function updateHeaderAppearance() {
        const hasScrolled = window.scrollY > 30;

        siteHeader.classList.toggle("is-scrolled", hasScrolled);
    }

    // اجرای اولیه افکت هدر
    updateHeaderAppearance();

    // بررسی اسکرول صفحه
    window.addEventListener("scroll", updateHeaderAppearance, {
        passive: true
    });
})();

/* پایان مدیریت افکت هدر هنگام اسکرول */
