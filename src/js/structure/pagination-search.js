import { fetchSearchMovies } from '../api-servise';
import { renderFilms, searchQuery } from './render';
import { smoothScrollUp } from '../scroll-up';
import { refs } from '../refs';
export { onBtnNextSearch, onBtnPrefSearch, onPaginationListSearch };

// Вешаем события на кнопки листания вперед и назад и на кнопки с номером страницы
refs.btnNext.addEventListener('click', onBtnNextSearch);
refs.btnPref.addEventListener('click', onBtnPrefSearch);
refs.paginationList.addEventListener('click', onPaginationListSearch);

// Делаю изначально кнопку листания назад и вперед неактивной
refs.btnPref.setAttribute('disabled', true);

// Переменные для листания страниц
let page = 1;
let iterator = 1;
let transformValue = 0;

// Функция для обработки клика по кнопке "next" для листания страниц //
function onBtnNextSearch() {
  page += 1;

  // Делаю активной кнопку листания назад
  refs.btnPref.removeAttribute('disabled');

  // Нахожу текущую и следующую активную кнопку для управления активным классом
  let btnActive = document.querySelector('.pagination-list__btn--active');
  let parentBtnActive = btnActive.parentElement;
  let nextParentBtnActive = parentBtnActive.nextElementSibling;
  let nextBtnActive = nextParentBtnActive.firstElementChild;

  nextBtnActive.classList.add('pagination-list__btn--active');
  btnActive.classList.remove('pagination-list__btn--active');

  // Делаю запрос
  fetchSearchMovies(searchQuery, page)
    .then(data => {
      console.log(data);
      renderFilms(data);

      const maxPage = data.total_pages;

      // Вызоов функции для листания вперед
      transformPaginationNext(page, data);

      // Вызов функции для добавления атрибута неактивности кнопке листания вперед
      giveAttributeBtnNext(page, maxPage);
      smoothScrollUp();
    })
    .catch(err => console.log(err));
}

// Функция для обработки клика по кнопке "prev" для листания страниц //
function onBtnPrefSearch() {
  page -= 1;

  // Делаю активной кнопку листания вперед
  refs.btnNext.removeAttribute('disabled');

  // Нахожу текущую и следующую активную кнопку для управления активным классом
  let btnActive = document.querySelector(
    '.pagination-list__item .pagination-list__btn--active'
  );
  let parentBtnActive = btnActive.parentElement;
  let prevParentBtnActive = parentBtnActive.previousElementSibling;
  let nextBtnActive = prevParentBtnActive.firstElementChild;

  nextBtnActive.classList.add('pagination-list__btn--active');
  btnActive.classList.remove('pagination-list__btn--active');

  // Делаю запрос
  fetchSearchMovies(searchQuery, page)
    .then(data => {
      // console.log(data);
      renderFilms(data);

      // Вызоов функции для листания назад
      transformPaginationPref(page, data);

      // Вызов функции для добавления атрибута неактивности кнопке листания назад
      giveAttributeBtnPref(page);
      smoothScrollUp();
    })
    .catch(err => console.log(err));
}

// Функция для обработки клика непосредственно по кнопкам страниц для листания //
function onPaginationListSearch(evt) {
  page = Number(evt.target.textContent);

  const btnActive = document.querySelector('.pagination-list__btn--active');
  const eventTarget = evt.target;

  if (btnActive !== eventTarget) {
    fetchSearchMovies(searchQuery, page)
      .then(data => {
        // console.log(data);

        renderFilms(data);

        const maxPage = data.total_pages;

        // Условия для того чтобы выбрать в какую сторону листаются страницы
        if (Number(evt.target.textContent) > Number(btnActive.textContent)) {
          // Вызов функции для листания страниц вперед
          transformPaginationNextWithEvt(evt, page, data);
        } else {
          // Вызов функции для листания страниц назад
          transformPaginationPrefWithEvt(evt, page, data);
        }

        // Снятие и добавление класса активности
        btnActive.classList.remove('pagination-list__btn--active');
        evt.target.classList.add('pagination-list__btn--active');

        // Вызов функций для добавления атрибутов неактивности кнопкам листания вперед и назад когда пришли к первой или последней странице
        giveAttributeBtnPref(page);
        giveAttributeBtnNext(page, maxPage);
        smoothScrollUp();
      })
      .catch(err => console.log(err));
  }
}

// ========================================================================================

// функции для добавления атрибута неактивности кнопке листания назад
function giveAttributeBtnPref(page) {
  if (page > 1) {
    refs.btnPref.removeAttribute('disabled');
  } else {
    refs.btnPref.setAttribute('disabled', true);
  }
}

// функции для добавления атрибута неактивности кнопке листания вперед
function giveAttributeBtnNext(page, maxPage) {
  if (page === maxPage) {
    refs.btnNext.setAttribute('disabled', true);
  } else {
    refs.btnNext.removeAttribute('disabled');
  }
}

// функции для листания вперед
function transformPaginationNext(page, data) {
  const maxPage = data.total_pages;

  if (page > 3 && page <= maxPage - 2) {
    refs.paginationList.style.transform = `translateX(calc((-40px) * ${iterator}))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += -40;
    iterator += 1;
  }
}

// функции для листания назад
function transformPaginationPref(page, data) {
  const maxPage = data.total_pages;

  if (page >= 3 && page < maxPage - 2) {
    refs.paginationList.style.transform = `translateX(calc(40px + ${transformValue}px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += 40;
    iterator -= 1;
  }
}

// функции для листания страниц вперед при клике по номерам страниц
function transformPaginationNextWithEvt(evt, page, data) {
  const maxPage = data.total_pages;

  // Поиск текущей и следующей активной кнопки
  const btnActiveValue = Number(
    document.querySelector('.pagination-list__btn--active').textContent
  );
  const evtTargetValue = Number(evt.target.textContent);

  // константы для проверки условий листаний страниц
  const total = evtTargetValue - btnActiveValue;
  const condition = btnActiveValue === 1 || btnActiveValue === 2;
  const condition2 =
    evtTargetValue === maxPage - 2 || evtTargetValue === maxPage - 1;
  const condition3 = btnActiveValue === maxPage - 3;

  // Разные проверки для правильного листания страниц
  if (page > 3 && page <= maxPage - 2 && total === 1 && !condition2) {
    refs.paginationList.style.transform = `translateX(calc((-40px) * ${iterator}))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += -40;
    iterator += 1;
  }

  if (page > 3 && page <= maxPage - 2 && total === 2 && !condition) {
    refs.paginationList.style.transform = `translateX(calc(${transformValue}px - 80px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += -80;
    iterator += 2;
  }

  if (condition && evtTargetValue === 4 && maxPage !== 5) {
    refs.paginationList.style.transform = `translateX(calc((-40px) * ${iterator}))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += -40;
    iterator += 1;
  }

  if (condition && evtTargetValue === 5 && maxPage !== 5 && maxPage !== 6) {
    refs.paginationList.style.transform = `translateX(calc(${transformValue}px - 80px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += -80;
    iterator += 2;
  }

  if (condition && evtTargetValue === 5 && maxPage !== 5 && maxPage === 6) {
    refs.paginationList.style.transform = `translateX(calc(${transformValue}px - 40px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += -40;
    iterator += 1;
  }

  if (condition2 && condition3 && maxPage !== 5) {
    refs.paginationList.style.transform = `translateX(calc((-40px) * ${iterator}))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += -40;
    iterator += 1;
  }
}

// функции для листания страниц назад при клике по номерам страниц
function transformPaginationPrefWithEvt(evt, page, data) {
  const maxPage = data.total_pages;
  // Поиск текущей и следующей активной кнопки
  const btnActiveValue = Number(
    document.querySelector('.pagination-list__btn--active').textContent
  );
  const evtTargetValue = Number(evt.target.textContent);

  // константы для проверки условий листаний страниц
  const total = btnActiveValue - evtTargetValue;
  const condition = evtTargetValue === 2 || evtTargetValue === maxPage - 3;
  const condition2 =
    btnActiveValue === maxPage || btnActiveValue === maxPage - 1;
  const condition3 = evtTargetValue === maxPage - 3;
  const condition4 = evtTargetValue === maxPage - 4;

  // Разные проверки для правильного листания страниц
  if (page >= 3 && page < maxPage - 2 && total === 1) {
    refs.paginationList.style.transform = `translateX(calc(40px + ${transformValue}px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += 40;
    iterator -= 1;
  }

  if (page >= 3 && page < maxPage - 2 && total === 2 && !condition) {
    refs.paginationList.style.transform = `translateX(calc(${transformValue}px + 80px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += 80;
    iterator -= 2;
  }

  if (btnActiveValue === 4 && condition && maxPage !== 5) {
    refs.paginationList.style.transform = `translateX(calc(40px + ${transformValue}px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += 40;
    iterator -= 1;
  }

  if (condition2 && condition3 && maxPage !== 5) {
    refs.paginationList.style.transform = `translateX(calc(40px + ${transformValue}px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += 40;
    iterator -= 1;
  }

  if (condition2 && condition4 && maxPage !== 5 && maxPage !== 6) {
    refs.paginationList.style.transform = `translateX(calc(${transformValue}px + 80px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += 80;
    iterator -= 2;
  }

  if (condition2 && condition4 && maxPage !== 5 && maxPage === 6) {
    refs.paginationList.style.transform = `translateX(calc(${transformValue}px + 40px))`;
    refs.paginationList.style.transition =
      'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

    transformValue += 40;
    iterator -= 1;
  }
}
