'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Cheese = require('./models/cheese');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();
app.use(bodyParser.json());

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

//who can access our server
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

/* ========== GET/READ ALL ITEMS ========== */
app.get('/api/cheeses', (req, res) => {
  // console.log('making get request');

  Cheese.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

/* ========== POST/CREATE NEW ITEMS ========== */
app.post('/api/cheeses', (req, res) => {
  const { name } = req.body;
  const newItem = { name };

  /***** Never trust users - validate input *****/
  if (!name) {
    const message = 'Missing `name` in request body';
    console.error(message);
    return res.status(400).send(message);
  }
  
  Cheese.create(newItem)
    .then(result => {
      res.location(`${req.originalUrl}/${newItem.id}`).status(201).json(result);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
