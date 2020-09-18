require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bookRouter = require('./bookmarksRoute');
const logger = require('./logger');

const { NODE_ENV, API_TOKEN } = require('./config');
const errorHandler = require('./errorHandler');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', (req, res, next) => {
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {

    logger.error(`Unauthorized request to path: ${req.path}`)
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

app.use(errorHandler)
app.use('/bookmarks', bookRouter)

module.exports = app;
