export {
  fetchGenres,
  fetchMovies,
  fetchSearchMovies,
  getMovieById,
  getTrailerById,
};
import axios from 'axios';

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

function fetchSearchMovies(searchValue, page) {
  return fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchValue}&page=${page}`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })

    .catch(err => console.log('Error!'));
}

async function getMovieById(id) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
    );
    if (!response.status) {
      throw new Error('This movie is not available');
    }
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function getTrailerById(id) {
  try {
    const URL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`;
    const response = await axios.get(`${URL}`);
    if (!response.status) {
      throw new Error('There is no trailer for this film');
    }
    return response.data.results;
  } catch (error) {
    console.log(error);
  }
}
