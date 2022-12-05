export { fetchGenres, fetchMovies };

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '46cf2a6d2c28bead868caabe4f80f475';

function fetchGenres() {
  return fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })

    .catch(err => console.log('Error!'));
}

function fetchMovies(page) {
  return fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&page=${page}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })

    .catch(err => console.log('Error!'));
}
