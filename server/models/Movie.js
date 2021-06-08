const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  movieId: { type: String, unique: true, required: true }, // TMDB movieId
  name: String,
  year: Number,
  posterPath: String,
  imdbId: String,
  title: String,
  originalLanguage: String,
  runtime: Number,
  genres: [String],
  tagline: String,
  overview: String,
  homepage: String,
  status: String,
  budget: Number,
  revenue: Number
});

module.exports = mongoose.model('Movie', schema);
