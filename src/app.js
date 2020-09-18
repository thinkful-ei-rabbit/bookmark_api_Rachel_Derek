require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');


const { NODE_ENV, API_TOKEN } = require('./config');
const { bookmarks } = require('./mockData');
let BOOKMARKS = bookmarks

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/', (req, res, next) => {
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

app.get('/bookmarks', (req, res) => {
  res.json(BOOKMARKS);
});

app.get('/bookmarks/:id', (req, res) => {
  const id = req.params.id

  console.log(BOOKMARKS);

  BOOKMARKS = BOOKMARKS.find(book => book.id === id)

  res.json(BOOKMARKS);
});

app.post('/bookmarks', (req, res) => {

  res.json(BOOKMARKS);
});

app.delete('/bookmarks/:id', (req, res) => {

  res.json(BOOKMARKS);
});


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
