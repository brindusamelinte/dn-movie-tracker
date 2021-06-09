// Server API connector
// `/server` folder

// the base for all API routes
const URL = '/api';
export const EMAIL = 'brindusa.melinte@gmail.com';

// This const is used to keep track of watchlist status. Using a variable instead of plain text in the code, let the editor scream at us when we misspell it
export const WATCHLIST = {
  LISTED: 'listed',
  REMOVED: 'removed',
};

// keep track of all routes of our API. You can use functions if you need to add some strings inside the URL (check tmdb.js for an example)
export const MOVIES_URL = `${URL}/movies`;
export const WATCHLIST_URL = `${URL}/watchlist`;

export const buildSearchMovieApiUrl = terms => `${URL}/movies/search/${terms}`;
export const buildMovieApiUrl = movieId => `${URL}/movies/${movieId}`;

export const buildIsFavoriteApiUrl = (movieId, email= EMAIL) => `${URL}/favorites/${movieId}/${email}`;
export const buildAddFavoriteApiUrl = () => `${URL}/favorites`;
export const buildFavoritesApiUrl =(email= EMAIL) => `${URL}/favorites/${email}`;

