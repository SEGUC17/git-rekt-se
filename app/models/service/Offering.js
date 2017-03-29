const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Offering Schema
 */

const offeringSchema = Schema({
  _service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
  },
  price: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Offering', offeringSchema);
