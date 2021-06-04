const express = require('express');

const Movie = require('../models/Movie');
const tmdb = require('../tmdb');
const fetch = require('node-fetch');

const router = express.Router();


router.get('/', async (req, res) => {
  const movies = await Movie.find();

  res.send(movies);
});


router.get('/:movieId', async (req, res) => {
  const movie = await Movie.findOne({ movieId: req.params.movieId });
 
  if(movie) {
    res.send(movie);
  } else {
    const url = tmdb.getMovieUrl(req.params.movieId);
  
    const checkStatus = res => {
      if(res.success === false) {
        throw res.status_message;
      }
      return res;
    }

    fetch(url, {method: 'GET', headers: { 'Content-Type': 'application/json' }})
      .then(res => res.json())
      .then(checkStatus)
      .then(jsonResp => Movie.create({
          movieId: jsonResp.id,
          name: jsonResp.title,
          year: new Date(jsonResp.release_date).getFullYear()
      }))
      .then(movie => res.send(movie))
      .catch(error => {
        res.status(404).send(error);
      });  
  }
});


router.get('/search/:terms', async (req, res) => {
  const url = tmdb.getSearchMovieUrl(req.params.terms);

  fetch(url, {method: 'GET', headers: { 'Content-Type': 'application/json' }})
    .then(res => res.json())
    .then(json => res.send(json));
})


module.exports = router;
