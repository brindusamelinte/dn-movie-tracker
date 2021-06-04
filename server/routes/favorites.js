const express = require('express');
const { rawListeners } = require('../models/Favorite');

const Favorite = require('../models/Favorite');
const Movie = require('../models/Movie');

const router = express.Router();

router.get('/:email', async (req, res) => {
    Favorite
        .find({ email: req.params.email})
        .populate('movie')
        .then(favorites => {
            const favoriteMovies = favorites.map(favorite => favorite.movie)
            res.send(favoriteMovies);
        })
});


router.get('/:movieId/:email', async (req, res) => {
    const isFavorite = await Favorite.exists({ 
        movieId: req.params.movieId,
        email: req.params.email
    });

    res.send(isFavorite);
}); 


router.post('/', async (req, res) => {
    try {
        const favorite = await Favorite.findOne({ 
            movieId: req.body.movieId, 
            email: req.body.email 
        });

        if(!favorite) {
            const movie = await Movie.findOne({movieId: req.body.movieId});
            if(!movie) {
                res.status(404).send('Movie not found in db.');
                return;
            }

            const favoriteMovie = await Favorite.create({
                movieId: req.body.movieId,
                email: req.body.email,
                date: new Date(),
                movie: movie._id
            });
            res.send(favoriteMovie);
        } else {
            res.status(409).send('This movie already exists in your favorites.');
        }
    } catch (error) {
        res.status(404).send(error);
    }
});


router.delete('/:movieId/:email', async (req, res) => {
    await Favorite.findOneAndDelete({ 
        movieId: req.params.movieId,
        email: req.params.email
    }, (err, doc) => {
        if(doc) {
            res.send(`Favorite movie with id ${doc.movieId} was deleted.`);
        } else {
            res.status(404).send('Favorite movie not found!');
        }
    });
});

module.exports = router;