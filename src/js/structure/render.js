import {
  fetchGenres,
  fetchMovies,
  fetchSearchMovies,
  getMovieById,
  getTrailerById,
} from '../api-servise';
import { onBtnNext, onBtnPref, onPaginationList } from './pagination-scroll';
import {
  onBtnNextSearch,
  onBtnPrefSearch,
  onPaginationListSearch,
} from './pagination-search';

import { refs } from '../refs';
import axios from 'axios';
import notiflix from 'notiflix';
import async from 'async';

export { renderFilms, renderPagination, searchQuery };

const LOCALSTORAGE_KEY = 'genres';
const BASE_POSTER_URL = 'https://image.tmdb.org/t/p/w500/';
const FAKE_POSTER =
  'https://freesvg.org/img/cyberscooty-movie-video-tape-remix.png';
const TRAILER_BTN_IMG =
  'https://t4.ftcdn.net/jpg/00/31/52/05/240_F_31520505_E1LEpdbXWSPYxb4kuaZWfoi2JvAO8SKC.jpg';

refs.form.addEventListener('submit', onFormSubmit);
// refs.filmotekaList.addEventListener('click', onFilmClick);

// Переменная для страниц
let page = 1;

// жанры
let genres = [];

// значение поискового слова
let searchQuery = '';

window.addEventListener('DOMContentLoaded', async () => {
  await fetchGenres()
    .then(array => {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(array));
    })
    .catch(err => console.log(err));

  genres = await JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));

  fetchMovies(page)
    .then(data => {
      console.log(data);
      renderFilms(data);
      renderPagination(data);

      const maxPage = data.total_pages;

      if (maxPage < 5) {
        refs.paginationList.style.justifyContent = 'center';
      }

      if (maxPage === 1) {
        refs.btnNext.setAttribute('disabled', true);
      }

      // Делаем активной кнопку первой страницы //
      document
        .querySelector('.pagination-list__btn')
        .classList.add('pagination-list__btn--active');

      // Убираем класс is-hidden из кнопок "next" и "prev" //
      refs.btnNext.classList.remove('is-hidden');
      refs.btnPref.classList.remove('is-hidden');
    })
    .catch(err => console.log(err));
});

// Функция для рендера популярных фильмов на первую страницу //
function renderFilms(data) {
  const markup = data.results
    .map(({ poster_path, title, release_date, genre_ids, id }) => {
      let genresArray = [];
      let filmGenres = '';
      genres.genres.map(genre => {
        if (genre_ids.includes(genre['id'])) {
          return genresArray.push(genre['name']);
        }
      });
      filmGenres = genresArray.join(', ');

      if (!genre_ids || genre_ids.length === 0) {
        filmGenres = 'genre unknown';
      }

      if (!poster_path) {
        poster_path = FAKE_POSTER;
      } else {
        poster_path = BASE_POSTER_URL + poster_path;
      }

      if (!title) {
        title = 'no name';
      }

      if (!release_date) {
        release_date = '';
      }

      return `<li class="films-list__item" data-id="${id}"  data-modal-open>
  <a href="" class="films-list__link">
    <img
      src="${poster_path}"
      alt="${title}"
      class="films-list__img"
      loading="lazy"
    />
    <h2 class="films-list__title">${title}</h2>
    <span class="films-list__text-ganres">${filmGenres}</span>
    <span class="films-list__span">|</span>
    <span class="films-list__text-date">${release_date.split('-')[0]}</span>    
  </a>
</li>`;
    })
    .join('');
  refs.filmotekaList.innerHTML = markup;
}

// Функция для рендера пагинации //
function renderPagination(data) {
  let array = [];

  // Перебираю все страницы из бекенда для того чтобы зарендерить соответсвующее количество кнопок в пагинацию //
  for (let i = 1; i <= data.total_pages; i += 1) {
    array.push(i);
  }

  const markup = array
    .map(number => {
      return `<li class="pagination-list__item">
            <button type="button" class="pagination-list__btn">${number}</button>
        </li>`;
    })
    .join('');
  refs.paginationList.innerHTML = markup;
}

//--------------------RENDER GALLERY BY SEARCH-----------------

function onFormSubmit(evt) {
  evt.preventDefault();

  refs.btnNext.removeEventListener('click', onBtnNext);
  refs.btnPref.removeEventListener('click', onBtnPref);
  refs.paginationList.removeEventListener('click', onPaginationList);

  const searchValue = evt.target.elements.search.value.trim();
  searchQuery += searchValue;
  console.log(searchQuery);

  if (!searchValue || searchValue.length === 0) {
    refs.errerText.classList.remove('is-hidden');

    setTimeout(() => {
      refs.errerText.classList.add('is-hidden');
    }, 3000);
  }

  fetchSearchMovies(searchValue, page)
    .then(data => {
      console.log(data);
      renderFilms(data);
      renderPagination(data);

      refs.btnNext.addEventListener('click', onBtnNextSearch);
      refs.btnPref.addEventListener('click', onBtnPrefSearch);
      refs.paginationList.addEventListener('click', onPaginationListSearch);

      const maxPage = data.total_pages;

      if (maxPage < 5) {
        refs.paginationList.style.justifyContent = 'center';
      }

      if (maxPage === 1) {
        refs.btnNext.setAttribute('disabled', true);
      }

      // Делаем активной кнопку первой страницы //
      document
        .querySelector('.pagination-list__btn')
        .classList.add('pagination-list__btn--active');

      // Убираем класс is-hidden из кнопок "next" и "prev" //
      refs.btnNext.classList.remove('is-hidden');
      refs.btnPref.classList.remove('is-hidden');
    })
    .catch(error => {
      console.log(error);
    });
}

// ---------------------RENDER MODAL-----------------------
// function onFilmClick(evt) {
//   evt.preventDefault();
//   const filmId = evt.target.closest('li').dataset.id;

//   getMovieById(filmId)
//     .then(data => {
//       return data.data;
//     })
//     .then(data => {
//       if (!data.poster_path) {
//         data.poster_path = FAKE_POSTER;
//       } else {
//         data.poster_path = BASE_POSTER_URL + data.poster_path;
//       }

//       if (!data.title) {
//         title = 'no name';
//       }

//       if (!data.vote_average) {
//         data.vote_average = 'N/A';
//       } else {
//         data.vote_average = String(data.vote_average).slice(0, 3);
//       }

//       if (!data.vote_count) {
//         data.vote_count = 'N/A';
//       }

//       if (!data.popularity) {
//         data.popularity = 'N/A';
//       }

//       if (!data.genres.length) {
//         data.genres = 'genres unknown';
//       } else {
//         data.genres = data.genres.map(genre => genre.name).join(', ');
//       }

//       if (!data.overview) {
//         data.overview = 'No description';
//       }
//       // setTimeout(() => {
//       //   preload();
//       // }, 100);
//       // console.log(data.genres);
//       dataVar = data;
//       // console.log(dataVar);
//       const filmInfo = `<div class="modal">
//   <button class="button-close" type="button" data-modal-close>
//     <svg class="button-close__icon" width="14" height="14">
//       <use href="${refs.hrefIcon}"></use>
//     </svg>
//   </button>
//   <img class="modal__img-wrapper" src="${data.poster_path}" alt="${data.title}">
//   <div class="modal__info">
//     <p class="modal__title">${data.title}</p>
//     <div class="modal__data">
//         <p class="modal__data-info"><span class="modal__data-info--grey">Vote / Votes</span><span class="modal__data-number"><span class="modal__data-ratio">${data.vote_average}</span>/ ${data.vote_count}</span></p>
//         <p class="modal__data-info"><span class="modal__data-info--grey">Popularity</span><span class="modal__data-number">${data.popularity}</span></p>
//         <p class="modal__data-info"><span class="modal__data-info--grey">Original Title</span><span>${data.title}</span></p>
//         <p class="modal__data-info"><span class="modal__data-info--grey">Genre</span><span>${data.genres}</span></p>
//     </div>
//     <div class="modal__description">
//         <p class="modal__description-title">About<button class="modal__button-play" type="button" data-value="${filmId}"><img class="modal__button-play-wrapper" src="${TRAILER_BTN_IMG}" alt="trailer"></button></p>
//         <p class="modal__description-about">${data.overview}</p>
//     </div>
//     <div class="modal__buttons" >
//         <button class="modal__button modal__button--watched" type="button" data-value="watched">ADD TO WATCHED</button>
//         <button class="modal__button modal__button--queue" type="button" data-value="queue">ADD TO QUEUE</button>
//     </div>
//   </div>
//   `;
//       refs.modalFilm.insertAdjacentHTML('beforeend', filmInfo);
//       refs.modalFilm.classList.remove('is-hidden');
//       const btnCloseModal =
//         refs.modalFilm.getElementsByClassName('button-close')[0];
//       btnCloseModal.addEventListener('click', closeModalByBtn);

//       const btnTrailerModal = refs.modalFilm.querySelector(
//         '.modal__button-play'
//       );
//       console.log(btnTrailerModal);
//       // btnTrailerModal.addEventListener('click', FUNCTION(filmId)); -------- сюди додату функцію для відтворення трейлера
//       // btnTrailerModal.addEventListener('click', showTrailer(filmId));
//     });
// }

// function closeModalByBtn() {
//   refs.modalFilm.classList.add('is-hidden');
//   document.querySelector('body').style.overflow = 'auto';
// }
