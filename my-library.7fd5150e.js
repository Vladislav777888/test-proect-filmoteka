!function(){var t={form:document.querySelector(".js-header-form"),btnWatched:document.querySelector("#btn-watched"),btnQueue:document.querySelector("#btn-queue"),filmotekaList:document.querySelector(".films-list"),btnPref:document.querySelector(".pagintion__btn--pref"),btnNext:document.querySelector(".pagintion__btn--next"),paginationList:document.querySelector(".pagination-list")};t.btnWatched.addEventListener("click",(function(e){e.preventDefault(),t.btnQueue.classList.remove("button--active"),e.target.classList.add("button--active")})),t.btnQueue.addEventListener("click",(function(e){e.preventDefault(),t.btnWatched.classList.remove("button--active"),e.target.classList.add("button--active")}))}();
//# sourceMappingURL=my-library.7fd5150e.js.map
