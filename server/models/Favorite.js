const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    movieId: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    },
});

module.exports = mongoose.model('Favorite', schema);