const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  movieId: { type: String, unique: true, required: true }, // TMDB movieId
  name: String,
  year: Number,
});

module.exports = mongoose.model('Movie', schema);
