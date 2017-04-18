const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Review Schema.
 */

const reviewSchema = mongoose.Schema({
  _client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
  reports: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
