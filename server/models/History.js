const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    movieId: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('History', schema);