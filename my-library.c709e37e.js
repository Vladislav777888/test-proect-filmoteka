const e={form:document.querySelector(".js-header-form"),btnWatched:document.querySelector("#btn-watched"),btnQueue:document.querySelector("#btn-queue"),filmotekaList:document.querySelector(".films-list"),btnPref:document.querySelector(".pagintion__btn--pref"),btnNext:document.querySelector(".pagintion__btn--next"),paginationList:document.querySelector(".pagination-list"),errerText:document.querySelector(".page-header__error-text"),modalFilm:document.querySelector(".backdrop"),hrefIcon:document.querySelector(".button-close-img").getAttribute("href")};e.btnWatched.addEventListener("click",(function(t){t.preventDefault(),e.btnQueue.classList.remove("button--active"),t.target.classList.add("button--active")})),e.btnQueue.addEventListener("click",(function(t){t.preventDefault(),e.btnWatched.classList.remove("button--active"),t.target.classList.add("button--active")}));
//# sourceMappingURL=my-library.c709e37e.js.map
