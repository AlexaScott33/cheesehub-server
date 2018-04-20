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
// app.use(
//   cors({
//     origin: CLIENT_ORIGIN
//   })
// );

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  next();
});

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
app.post('/api/cheeses', (req, res, next) => {
  const { name } = req.body;
  const newItem = { name };
  //console.log(name);

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Cheese.create(newItem)
    .then(() => {
      Cheese.find()
        .then(results => {
          res.json(results);
        });
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
