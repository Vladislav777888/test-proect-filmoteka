import { fetchGenres, fetchMovies } from '../api-servise';
import { refs } from '../refs';

const LOCALSTORAGE_KEY = 'genres';
const BASE_POSTER_URL = 'https://image.tmdb.org/t/p/w500/';
const FAKE_POSTER =
  'https://freesvg.org/img/cyberscooty-movie-video-tape-remix.png';

// Переменная для страниц
let page = 1;

// Делаем запрос на бекенд и рендерим популярные фильмы и пагинацию //
fetchMovies(page)
  .then(data => {
    // console.log(data);
    renderFilms(data);
    refs.paginationList.innerHTML = renderPagination(data);

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

// Делаю запрос на локалсторедж для получения массива жанров фильмов
fetchGenres()
  .then(array => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(array));
  })
  .catch(err => console.log(err));

const genres = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
// console.log(genres);

// Функция для рендера популярных фильмов на первую страницу //
function renderFilms(data) {
  const markup = data.results
    .map(({ poster_path, title, release_date, genre_ids, id }) => {
      genresArray = [];
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
  let markup = [];

  // Перебираю все страницы из бекенда для того чтобы зарендерить соответсвующее количество кнопок в пагинацию //
  for (let i = 1; i <= data.total_pages; i += 1) {
    markup.push(i);
  }

  return markup
    .map(number => {
      return `<li class="pagination-list__item">
            <button type="button" class="pagination-list__btn">${number}</button>
        </li>`;
    })
    .join('');
}
