const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  firstName: String,
  lastName: String,
  city: String,
  country: String,
  about: String,
  birthday: Date
});

module.exports = mongoose.model('User', schema);
