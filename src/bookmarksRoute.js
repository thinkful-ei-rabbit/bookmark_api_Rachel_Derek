const express = require('express');
const bookRouter = express.Router();
const { v4: uuid } = require('uuid');

const { bookmarks } = require('./mockData');
let BOOKMARKS = bookmarks

bookRouter
    .route('/')
    .get((req, res) => {
        res.json(BOOKMARKS);
    });

bookRouter
    .route('/:id')
    .get((req, res) => {
        const id = req.params.id;

        BOOKMARKS = BOOKMARKS.find(book => book.id === id)

        if (!BOOKMARKS) {
            res.status(404).send('This bookmark does not exist')
        }



        res.json(BOOKMARKS);
    });

bookRouter
    .route('/')
    .post((req, res) => {
        const { title, url, description, rating } = req.body
        const id = uuid();

        const bookmark = {
            title,
            url,
            description,
            rating,
            id
        }

        if (!title) {
            res.status(400).send('This bookmark needs a title')
        }

        if (!url) {
            res.status(400).send('This bookmark needs a url')
        }
        if (!description) {
            res.status(400).send('This bookmark needs a descripts')
        }
        if (!rating) {
            res.status(400).send('This bookmark needs a rating')
        }
        console.log(typeof (rating))

        if (isNaN(rating) || rating > 5 || rating < 0) {

            res.status(400).send('Rating must be a number between 1 and 5')

        }

        BOOKMARKS.push(bookmark);

        res.json(BOOKMARKS);
    });

bookRouter
    .route('/:id')
    .delete((req, res) => {
        const id = req.params.id;
        let length = BOOKMARKS.length

        BOOKMARKS = BOOKMARKS.filter(bookmark => bookmark.id !== id)

        if (length === BOOKMARKS.length) {
            res.status(404).send('This bookmark wasnt found')
        }

        res.json(BOOKMARKS);
    });

module.exports = bookRouter