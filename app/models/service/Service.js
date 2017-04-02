const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Service Schema
 */

const serviceSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
  },
  description: {
    type: String,
  },
  _business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  _totalRating: {
    type: Number,
    default: 0,
  },
  _reviewCount: {
    type: Number,
    default: 0,
  },
  _avgRating: {
    type: Number,
    default: 0,
  },
  branches: [{
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  }],
  offerings: [{
    type: Schema.Types.ObjectId,
    ref: 'Offering',
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review',
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  gallery: [{
    path: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  }],
  _deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Service', serviceSchema);
