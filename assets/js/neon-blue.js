
"use strict";

/* شروع انتخاب عناصر اصلی */

const nbHeader = document.querySelector("#nb-header");
const nbMenuToggle = document.querySelector("#nb-menu-toggle");
const nbNavigation = document.querySelector("#nb-navigation");
const nbNavigationLinks = document.querySelectorAll(".nb-navigation__link");
const nbHeroCard = document.querySelector(".nb-hero-card");
const nbHeroVisual = document.querySelector(".nb-hero__visual");

const nbReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

/* پایان انتخاب عناصر اصلی */


/* شروع مدیریت منوی موبایل */

const nbSetMenuState = (isOpen) => {
    if (!nbMenuToggle || !nbNavigation) {
        return;
    }

    nbMenuToggle.classList.toggle("active", isOpen);
    nbNavigation.classList.toggle("open", isOpen);

    nbMenuToggle.setAttribute("aria-expanded", String(isOpen));
    nbMenuToggle.setAttribute(
        "aria-label",
        isOpen ? "بستن منو" : "باز کردن منو"
    );
};

const nbCloseMenu = () => {
    nbSetMenuState(false);
};

if (nbMenuToggle && nbNavigation) {
    nbMenuToggle.setAttribute(
        "aria-expanded",
        String(nbNavigation.classList.contains("open"))
    );

    nbMenuToggle.addEventListener("click", () => {
        const isOpen =
            nbMenuToggle.getAttribute("aria-expanded") === "true";

        nbSetMenuState(!isOpen);
    });

    nbNavigationLinks.forEach((link) => {
        link.addEventListener("click", nbCloseMenu);
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = nbNavigation.contains(event.target);
        const clickedToggle = nbMenuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            nbCloseMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            nbCloseMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) {
            nbCloseMenu();
        }
    });
}

/* پایان مدیریت منوی موبایل */


/* شروع افکت اسکرول هدر */

const nbUpdateHeader = () => {
    if (!nbHeader) {
        return;
    }

    nbHeader.classList.toggle("scrolled", window.scrollY > 40);
};

if (nbHeader) {
    window.addEventListener("scroll", nbUpdateHeader, {
        passive: true
    });

    nbUpdateHeader();
}

/* پایان افکت اسکرول هدر */


/* شروع تعامل سه بعدی کارت هیرو */

const nbResetHeroCard = () => {
    if (nbHeroCard) {
        nbHeroCard.style.transform = "";
    }
};

if (nbHeroCard && nbHeroVisual && !nbReducedMotion.matches) {
    nbHeroVisual.addEventListener("pointermove", (event) => {
        if (window.innerWidth <= 800 || event.pointerType === "touch") {
            return;
        }

        const bounds = nbHeroVisual.getBoundingClientRect();

        if (!bounds.width || !bounds.height) {
            return;
        }

        const positionX = (event.clientX - bounds.left) / bounds.width;
        const positionY = (event.clientY - bounds.top) / bounds.height;

        const rotateY = (positionX - 0.5) * 12;
        const rotateX = (0.5 - positionY) * 8;

        nbHeroCard.style.transform = `
            rotateY(${-9 + rotateY}deg)
            rotateX(${4 + rotateX}deg)
            translateY(-4px)
        `;
    });

    nbHeroVisual.addEventListener("pointerleave", nbResetHeroCard);
    nbHeroVisual.addEventListener("pointercancel", nbResetHeroCard);
}

/* پایان تعامل سه بعدی کارت هیرو */


/* شروع مدیریت لینک فعال منو */

const nbUpdateActiveLink = () => {
    const currentHash = window.location.hash || "#home";

    nbNavigationLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === currentHash;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
};

window.addEventListener("hashchange", nbUpdateActiveLink);
nbUpdateActiveLink();

/* پایان مدیریت لینک فعال منو */


/* شروع انیمیشن نمایش عناصر */

(() => {
    const revealElements = document.querySelectorAll(".nb-reveal");

    if (!revealElements.length) {
        return;
    }

    const revealElement = (element) => {
        element.classList.add("is-visible");
    };

    if (
        nbReducedMotion.matches ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach(revealElement);
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                revealElement(entry.target);
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
})();

/* پایان انیمیشن نمایش عناصر */


/* شروع شمارنده های آماری */

(() => {
    const counterElements = new Set([
        ...document.querySelectorAll("[data-counter]"),
        ...document.querySelectorAll(".nb-stat-card__number[data-target]")
    ]);

    if (!counterElements.size) {
        return;
    }

    const numberFormatter = new Intl.NumberFormat("fa-IR");
    const counterDuration = 1600;

    const getCounterTarget = (element) => {
        const rawValue = element.dataset.target ?? element.dataset.counter;
        const target = Number(rawValue);

        return Number.isFinite(target) && target >= 0
            ? target
            : null;
    };

    const setCounterValue = (element, value) => {
        element.textContent = numberFormatter.format(value);
    };

    const animateCounter = (element) => {
        if (element.dataset.animated === "true") {
            return;
        }

        const target = getCounterTarget(element);

        if (target === null) {
            return;
        }

        element.dataset.animated = "true";

        if (nbReducedMotion.matches || target === 0) {
            setCounterValue(element, target);
            return;
        }

        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / counterDuration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easedProgress * target);

            setCounterValue(element, currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
                return;
            }

            setCounterValue(element, target);
        };

        requestAnimationFrame(updateCounter);
    };

    if (!("IntersectionObserver" in window)) {
        counterElements.forEach(animateCounter);
        return;
    }

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

    counterElements.forEach((element) => {
        counterObserver.observe(element);
    });
})();

/* پایان شمارنده های آماری */


/* شروع فیلتر دسته بندی بازی ها */

(() => {
    const filterButtons = document.querySelectorAll(".nb-filter");
    const gameCards = document.querySelectorAll(".nb-game-card");

    if (!filterButtons.length || !gameCards.length) {
        return;
    }

    const filterGames = (selectedFilter) => {
        gameCards.forEach((card) => {
            const category = card.dataset.category;
            const shouldShow =
                selectedFilter === "all" ||
                category === selectedFilter;

            card.classList.toggle("is-hidden", !shouldShow);
            card.setAttribute("aria-hidden", String(!shouldShow));
        });
    };

    const setActiveFilter = (activeButton) => {
        filterButtons.forEach((button) => {
            const isActive = button === activeButton;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        filterGames(activeButton.dataset.filter || "all");
    };

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setActiveFilter(button);
        });
    });

    const initialFilter =
        [...filterButtons].find((button) =>
            button.classList.contains("active")
        ) || filterButtons[0];

    setActiveFilter(initialFilter);
})();

/* پایان فیلتر دسته بندی بازی ها */


/* شروع اعتبارسنجی فرم تماس */

(() => {
    const contactForm = document.querySelector("#nb-contact-form");
    const contactStatus = document.querySelector("#nb-contact-status");

    if (!contactForm || !contactStatus) {
        return;
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        contactStatus.textContent = "";

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            contactStatus.textContent =
                "لطفاً تمام فیلدها را به‌درستی تکمیل کنید.";
            return;
        }

        const formData = new FormData(contactForm);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const subject = String(formData.get("subject") || "").trim();
        const message = String(formData.get("message") || "").trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            name.length < 2 ||
            subject.length < 3 ||
            message.length < 10 ||
            !emailPattern.test(email)
        ) {
            contactStatus.textContent =
                "اطلاعات واردشده معتبر نیست. لطفاً دوباره بررسی کنید.";
            return;
        }

        contactStatus.textContent =
            "اطلاعات معتبر است؛ اما فرم هنوز به سامانه دریافت پیام متصل نشده است.";
    });
})();

/* پایان اعتبارسنجی فرم تماس */
