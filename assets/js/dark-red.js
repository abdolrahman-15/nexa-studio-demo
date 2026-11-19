
"use strict";

/* ========================================
   شروع انتخاب عناصر صفحه
======================================== */

const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNavigation = document.querySelector(".main-navigation");
const navigationLinks = document.querySelectorAll(".nav-link");

const nexaScene = document.querySelector(".nexa-scene");
const nexaObject = document.querySelector(".nexa-object");

const filterButtons = document.querySelectorAll(".filter-button");
const gameCards = document.querySelectorAll(".game-card");

const counterElements = document.querySelectorAll("[data-counter]");
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

const backToTopLink = document.querySelector(".back-to-top");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

/* ========================================
   پایان انتخاب عناصر صفحه
======================================== */


/* ========================================
   شروع مدیریت منوی موبایل
======================================== */

function closeNavigation() {
    if (!menuToggle || !mainNavigation) {
        return;
    }

    menuToggle.classList.remove("is-active");
    mainNavigation.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "باز کردن منو");
}

function toggleNavigation() {
    if (!menuToggle || !mainNavigation) {
        return;
    }

    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.classList.toggle("is-active", !isOpen);
    mainNavigation.classList.toggle("is-open", !isOpen);

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "باز کردن منو" : "بستن منو"
    );
}

if (menuToggle && mainNavigation) {
    menuToggle.addEventListener("click", toggleNavigation);

    navigationLinks.forEach((link) => {
        link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("click", (event) => {
        const clickedInsideNavigation =
            mainNavigation.contains(event.target) ||
            menuToggle.contains(event.target);

        if (!clickedInsideNavigation) {
            closeNavigation();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeNavigation();
        }
    });
}

/* ========================================
   پایان مدیریت منوی موبایل
======================================== */


/* ========================================
   شروع افکت اسکرول هدر
======================================== */

function updateHeaderOnScroll() {
    if (!siteHeader) {
        return;
    }

    siteHeader.classList.toggle(
        "is-scrolled",
        window.scrollY > 30
    );
}

window.addEventListener("scroll", updateHeaderOnScroll, {
    passive: true
});

updateHeaderOnScroll();

/* ========================================
   پایان افکت اسکرول هدر
======================================== */


/* ========================================
   شروع تشخیص بخش فعال در منو
======================================== */

const pageSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const currentSectionId = entry.target.id;

                navigationLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${currentSectionId}`;

                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}

/* ========================================
   پایان تشخیص بخش فعال در منو
======================================== */


/* ========================================
   شروع حرکت سه‌بعدی نوشته NEXA
======================================== */

const supportsPointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (
    nexaScene &&
    nexaObject &&
    supportsPointer &&
    !prefersReducedMotion.matches
) {
    nexaScene.addEventListener("pointermove", (event) => {
        const sceneBounds = nexaScene.getBoundingClientRect();

        const pointerX =
            (event.clientX - sceneBounds.left) / sceneBounds.width;

        const pointerY =
            (event.clientY - sceneBounds.top) / sceneBounds.height;

        const rotateY = (pointerX - 0.5) * 18;
        const rotateX = (0.5 - pointerY) * 12;

        nexaObject.style.transform =
            `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    nexaScene.addEventListener("pointerleave", () => {
        nexaObject.style.transform = "";
    });
}

/* ========================================
   پایان حرکت سه‌بعدی نوشته NEXA
======================================== */


/* ========================================
   شروع فیلتر بازی‌ها
======================================== */

function filterGames(selectedCategory) {
    gameCards.forEach((card) => {
        const cardCategory = card.dataset.category;

        const shouldShow =
            selectedCategory === "all" ||
            cardCategory === selectedCategory;

        card.classList.toggle("is-hidden", !shouldShow);
    });
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
            const isActive = filterButton === button;

            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        filterGames(selectedCategory);
    });
});

/* ========================================
   پایان فیلتر بازی‌ها
======================================== */


/* ========================================
   شروع شمارنده‌های متحرک
======================================== */

function animateCounter(element) {
    const targetValue = Number(element.dataset.counter);
    const suffix = element.dataset.suffix || "";

    if (!Number.isFinite(targetValue)) {
        return;
    }

    if (prefersReducedMotion.matches) {
        element.textContent =
            `${targetValue.toLocaleString("en-US")}${suffix}`;
        return;
    }

    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(targetValue * easedProgress);

        element.textContent =
            `${currentValue.toLocaleString("en-US")}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.5
        }
    );

    counterElements.forEach((counter) => {
        counterObserver.observe(counter);
    });
} else {
    counterElements.forEach(animateCounter);
}

/* ========================================
   پایان شمارنده‌های متحرک
======================================== */


/* ========================================
   شروع تعامل نمایشی فرم تماس
======================================== */

if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        formFeedback.textContent =
            "اطلاعات فرم بررسی شد؛ برای ارسال واقعی باید فرم به بک‌اند متصل شود.";

        contactForm.reset();
    });
}

/* ========================================
   پایان تعامل نمایشی فرم تماس
======================================== */


/* ========================================
   شروع مدیریت لینک بازگشت به بالا
======================================== */

if (backToTopLink) {
    backToTopLink.addEventListener("click", (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion.matches ? "auto" : "smooth"
        });
    });
}

/* ========================================
   پایان مدیریت لینک بازگشت به بالا
======================================== */


/* ========================================
   شروع تنظیمات اولیه صفحه
======================================== */

document.documentElement.classList.add("js-enabled");

/* ========================================
   پایان تنظیمات اولیه صفحه
======================================== */
