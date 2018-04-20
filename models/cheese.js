'use strict';

const mongoose = require('mongoose');

const cheeseSchema = new mongoose.Schema({
  name: { type: String }
});

cheeseSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Cheese', cheeseSchema);