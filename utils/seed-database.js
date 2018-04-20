'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const Cheese = require('../models/cheese');

const seedCheeses = require('../db/cheeses');


mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Cheese.insertMany(seedCheeses),
    ])
      .then(results => console.log('seeding data'));
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });