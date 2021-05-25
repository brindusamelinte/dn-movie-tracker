const express = require('express');

const History = require('../models/History');
const Movie = require('../models/Movie');

const router = express.Router();

router.get('/:email', async (req, res) => {
    const history = await History.find({ email: req.params.email });

    if(history.length > 0) {
        const movies = [];
        for(let i=0; i < history.length; i++) {
            const movie = await Movie.findOne({ movieId: history[i].movieId});
            if(movie !== null) {
                movies.push(movie);
            }
        }
        res.send(movies);
    } else {
        res.status(404).send('There is no movie in your history.');
    }
});

router.get('/:movieId/:email', async (req, res) => {
    const movie = await History.findOne({
        movieId: req.params.movieId,
        email: req.params.email,
    });
    if(movie) {
        res.send(true);
    } else {
        res.send(false);
    }
});

router.post('/', async (req, res) => {
    try {
        const history = await History.findOne({
            movieId: req.body.movieId,
            email: req.body.email
        });

        if(!history) {
            const historyMovie = await History.create({
                movieId: req.body.movieId,
                email: req.body.email,
                date: req.body.date
            });
            res.send(historyMovie);
        } else if(req.body.date) {
            await History.updateOne({
                movieId: history.movieId,
                email: history.email
            }, { date: req.body.date });

            const updatedMovie = await History.findOne({
                movieId: req.body.movieId,
                email: req.body.email
            });

            res.send(updatedMovie);
        } else {
            res.send('Enter a valid date.');
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete('/:movieId/:email', async (req, res) => {
    const movie = await History.findOne({
        movieId: req.params.movieId,
        email: req.params.email
    });

    if(movie) {
        const movieDeleted = await movie.deleteOne();
        res.send(`The movie with id ${movie.movieId} was deleted from history.`);
    } else {
        res.status(404).send('Movie not found in your history.');
    }
});

module.exports = router;