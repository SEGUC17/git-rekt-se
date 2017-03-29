const mongoose = require('mongoose');
const locations = require('../../seed/service/locations');

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
    required: true,
    enum: locations,
  },
  icon: {
    type: String,
    required: false,
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Category', categorySchema);
