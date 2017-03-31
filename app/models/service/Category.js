const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Category Schema
 */

const categorySchema = Schema({
  type: {
    type: String,
    required: true,
    enums: ['Service', 'Business'],
  },
  title: {
    type: String,
  },
  icon: {
    type: String,
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Category', categorySchema);
