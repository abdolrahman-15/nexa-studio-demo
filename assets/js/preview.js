
"use strict";

/* ========================================
   شروع مدیریت سال کپی‌رایت
======================================== */

const currentYearElement = document.getElementById("current-year");

if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

/* پایان مدیریت سال کپی‌رایت */
