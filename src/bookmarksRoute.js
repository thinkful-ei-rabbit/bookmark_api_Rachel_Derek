const express = require('express');
const bookRouter = express.Router();
const { v4: uuid } = require('uuid');
const logger = require('./logger');

const { bookmarks } = require('./mockData');
let BOOKMARKS = bookmarks;

bookRouter.route('/').get((req, res) => {
  logger.info('Bookmark search successful');
  res.json(BOOKMARKS);
});

bookRouter.route('/:id').get((req, res) => {
  const id = req.params.id;

  const bookmark = BOOKMARKS.find(book => book.id === id);

  if (!bookmark) {
    logger.error(`Bookmark with id ${id} found`);
    return res.status(404).send('This bookmark does not exist');
  }

  logger.info('Bookmark was successfully found');
  res.json(bookmark);
});

bookRouter.route('/').post((req, res) => {
  const { title, url, description, rating } = req.body;
  const id = uuid();

  const bookmark = {
    title,
    url,
    description,
    rating,
    id
  };

  if (!title) {
    logger.error('Title not found in POST');
    return res.status(400).send('This bookmark needs a title');
  }

  if (!url) {
    logger.error('URL not found in POST');
    return res.status(400).send('This bookmark needs a url');
  }
  if (!description) {
    logger.error('Description not found in POST');
    return res.status(400).send('This bookmark needs a descripts');
  }
  if (!rating) {
    logger.error('Rating not found in POST');
    return res.status(400).send('This bookmark needs a rating');
  }
  console.log(typeof rating);

  if (isNaN(rating) || rating > 5 || rating < 0) {
    logger.error('Invalid Rating');
    return res.status(400).send('Rating must be a number between 1 and 5');
  }

  BOOKMARKS.push(bookmark);

  logger.info(`Bookmark with the id ${id} was successfully created`);
  res.json(BOOKMARKS);
});

bookRouter.route('/:id').delete((req, res) => {
  const id = req.params.id;
  let length = BOOKMARKS.length;

  BOOKMARKS = BOOKMARKS.filter(bookmark => bookmark.id !== id);

  if (length === BOOKMARKS.length) {
    logger.error('Bookmark not found');
    return res.status(404).send('This bookmark wasnt found');
  }

  logger.info(`Bookmark with id ${id} was successfully deleted`);
  res.json(BOOKMARKS);
});

module.exports = bookRouter;
