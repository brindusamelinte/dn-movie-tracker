const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: { type: String, required: true },
    genreId: {type: Number, required: true }
});

module.exports = mongoose.model('FavoriteGenres', schema);