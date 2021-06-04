const express = require('express');

const FavoriteGenres = require('../models/FavoriteGenres');

const router = express.Router();

router.get('/:email', async (req, res) => {
    const favoriteGenre = await FavoriteGenres.find({ email: req.params.email });

    if(favoriteGenre.length > 0) {
        res.send(favoriteGenre);
    } else {
        res.status(404).send('No favorite genres found.');
    }
});


router.post('/', async (req, res) => {
    try {
        const favoriteGenre = await FavoriteGenres.findOne({
            email: req.body.email,
            genreId: req.body.genreId
        });

        if(!favoriteGenre) {
            const genre = await FavoriteGenres.create({
                email: req.body.email,
                genreId: req.body.genreId
            });
            res.send(genre);
        } else {
            res.status(409).send('This genre is already in your favorites.')
        }
    } catch(error) {
        res.status(404).send(error.message);
    }
});


router.delete('/:email/:genreId', async (req, res) => {
    await FavoriteGenres.findOneAndDelete({
        email: req.params.email,
        genreId: req.params.genreId
    }, (err, doc) => {
        console.log(doc)
        if(doc) {
            res.send(`Favorite genre with id ${doc.genreId} was deleted.`);
        } else {
            res.status(404).send('Genre not found!');
        }
    });
});


module.exports = router;