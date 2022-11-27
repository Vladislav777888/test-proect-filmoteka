const refs = {
  home: document.querySelector('.js-link-home'),
  library: document.querySelector('.js-link-library'),
  form: document.querySelector('.js-header-form'),
};

// refs.home.addEventListener('click', onHomeClick);
refs.library.addEventListener('click', onLibraryClick);

function onLibraryClick(evt) {
  evt.preventDefault();
  refs.home.classList.remove('link--current');
  evt.target.classList.add('link--current');
  refs.form.style.display = 'none';
}
