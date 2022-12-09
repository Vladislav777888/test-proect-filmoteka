export { refs };

const refs = {
  form: document.querySelector('.js-header-form'),
  btnWatched: document.querySelector('#btn-watched'),
  btnQueue: document.querySelector('#btn-queue'),
  filmotekaList: document.querySelector('.films-list'),
  btnPref: document.querySelector('.pagintion__btn--pref'),
  btnNext: document.querySelector('.pagintion__btn--next'),
  paginationList: document.querySelector('.pagination-list'),
  errerText: document.querySelector('.page-header__error-text'),
  modalFilm: document.querySelector('.backdrop'),
  hrefIcon: document.querySelector('.button-close-img').getAttribute('href'),
};
