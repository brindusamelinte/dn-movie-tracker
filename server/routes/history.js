const express = require('express');

const History = require('../models/History');
const Movie = require('../models/Movie');

const router = express.Router();

router.get('/:email', async (req, res) => {
    History
        .find({ email: req.params.email })
        .populate('movie')
        .then(histories => {
            const historyMovies = histories.map(history => {
                return { ...history.movie.toObject(), watchAt: history.date.toDateString() };
            });
            res.send(historyMovies);
        })
});


router.get('/:movieId/:email', async (req, res) => {
    const isHistory = await History.exists({
        movieId: req.params.movieId,
        email: req.params.email,
    });

    res.send(isHistory);    
});


router.post('/', async (req, res) => {
    try {
        const history = await History.findOne({
            movieId: req.body.movieId,
            email: req.body.email
        });
        
        if(!history) {
            const movie = await Movie.findOne({ movieId: req.body.movieId });
            if(!movie) {
                res.status(404).send('Movie not found in db.');
                return;
            }

            const historyMovie = await History.create({
                movieId: req.body.movieId,
                email: req.body.email,
                date: req.body.date,
                movie: movie._id
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


router.delete('/:movieId/:email', (req, res) => {
   History.findOneAndDelete({
        movieId: req.params.movieId,
        email: req.params.email
    }, (err, doc) => {
        if(doc) {
            res.send(`The movie with id ${doc.movieId} was deleted from history.`);
        } else {
            res.status(404).send('Movie not found in your history!');
        }
    });
});

module.exports = router;