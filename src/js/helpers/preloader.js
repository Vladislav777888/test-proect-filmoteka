// const preloaderRef = document.querySelector('.preloader');
import { refs } from '../refs';
export function preload() {
  refs.preloaderRef.classList.toggle('visually-hidden');
}
