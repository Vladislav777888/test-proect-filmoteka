import { fetchGenres, fetchMovies, fetchSearchMovies } from '../api-servise';
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

refs.form.addEventListener('submit', onFormSubmit);

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

      return `<li class="films-list__item" data-id="${id}">
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
