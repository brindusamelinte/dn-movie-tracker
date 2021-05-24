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
  const movie = await Movie.findOne({ name: req.params.movieId });

  if(movie) {
    res.send(movie);
  } else {
    //res.send('No movie found with this name.');
    const url = tmdb.getMovieUrl(req.params.movieId);

    //TODO: to handle errors
    const checkStatus = res => {
      if(res.success === false) {
        throw res.status_message;
      }
    }

    fetch(url, {method: 'GET', headers: { 'Content-Type': 'application/json' }})
      .then(res => res.json())
      .then(checkStatus)
      .then(async(json) =>  {
        //console.log(json);
        const movie = await Movie.create({
            movieId: json.id,
            name: json.title,
            year: new Date(json.release_date).getFullYear()
          });
        res.send(movie);
      })
      .catch(error => res.send(error));
  }
});

router.get('/search/:terms', async (req, res) => {
  const url = tmdb.getSearchMovieUrl(req.params.terms);

  fetch(url, {method: 'GET', headers: { 'Content-Type': 'application/json' }})
    .then(res => res.json())
    .then(json => res.send(json));
})


module.exports = router;
