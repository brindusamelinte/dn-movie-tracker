const express = require('express');
const { rawListeners } = require('../models/Favorite');

const Favorite = require('../models/Favorite');
const Movie = require('../models/Movie');

const router = express.Router();

router.get('/:email', async (req, res) => {
    const favorites = await Favorite.find({ email: req.params.email});    

    if(favorites.length > 0) {
       const movies = [];
       for(let i=0; i<favorites.length; i++) {
            const movie = await Movie.findOne({ movieId: favorites[i].movieId });
            if(movie !== null) {
                movies.push(movie);
            }
       }
       res.send(movies);
    } else {
        res.status(404).send('No favorites movies found.');
    }
});


router.get('/:movieId/:email', async (req, res) => {
    const favorite = await Favorite.findOne({ 
        movieId: req.params.movieId,
        email: req.params.email
    });
    if(favorite) {
        res.send(true);
    } else {
        res.send(false);
    }
}); 


router.post('/', async (req, res) => {
    try {
        const favorite = await Favorite.findOne({ 
            movieId: req.body.movieId, 
            email: req.body.email 
        });

        if(!favorite) {
            const favoriteMovie = await Favorite.create({
                movieId: req.body.movieId,
                email: req.body.email,
                date: new Date()
            });
            res.send(favoriteMovie);
        } else {
            res.status(409).send('This movie already exists in your favorites.');
        }
       
    } catch (error) {
        //console.log(error);
        res.status(404).send(error);
    }
});


router.delete('/:movieId/:email', async (req, res) => {
    const favorite = await Favorite.findOne({ 
        movieId: req.params.movieId,
        email: req.params.email
    });
    //console.log(favorite);
    if(favorite) {
        const movieDeleted = await favorite.deleteOne();
        res.send(`Favorite movie with ${favorite.movieId} was deleted.`);
    } else {
        res.status(404).send('Favorite movie not found!');
    }
});

module.exports = router;