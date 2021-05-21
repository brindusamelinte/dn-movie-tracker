const express = require('express');
const Movie = require('../models/Movie');

const tmdb = require('../tmdb');

const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find();

  res.send(movies);
});

router.get('/search/:terms', async (req, res) => {
  const url = tmdb.getSearchMovieUrl(req.params.terms);

  
  res.send(url);
})


module.exports = router;
