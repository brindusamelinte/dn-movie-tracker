const express = require('express');

const User = require('../models/User');

const router = express.Router();

router.get('/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
 
  // findOne will return the found user object or null
  if (user) {
    res.send(user);
  } else {
    res.status(404).send('User not found');
  }
});


router.get('/', async (req, res) => {

  //find all users
  const users = await User.find();
  res.send(users);
});


router.post('/', async (req, res) => {

  // create will try to create a new user, but can throw an error if there is already an user with the same email (unique param in the schema)
  try {
    const user = await User.create({ 
      email: req.body.email, 
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      city: req.body.city,
      country: req.body.country,
      about: req.body.about,
      birthday: req.body.birthday
    });
    res.send(user);
  } catch (error) {
    //console.log(error);
    if(!req.body.email) {
      res.status(400).send(`${error._message}. Your email is required.`);
    } else {
      res.status(400). send('An user with the same email already exist.');
    }
  }
});


router.patch('/:email', async (req, res) => {

  //update one user
  const result = await User.updateOne({ email: req.params.email}, req.body);
  const userUpdated = await User.findOne({ email: req.params.email });
  res.send(userUpdated);
});

router.put('/:email', async (req, res) => {

  //replace user
  const result = await User.replaceOne({email: req.params.email}, req.body);
  const userReplaced = await User.findOne({ email: req.body.email });
  res.send(userReplaced);
});


router.delete('/:email', async (req, res) => {
  await User.findOneAndDelete({
    email: req.params.email
  }, (err, doc) => {
      if(doc) {
        res.send(`User with email ${doc.email} was deleted.`);
      } else {
        res.status(404).send('User not found!');
      }
    });
});

module.exports = router;
