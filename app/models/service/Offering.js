const mongoose = require('mongoose');
const locations = require('../../seed/service/locations');

const Schema = mongoose.Schema;

/**
 * Offering Schema
 */

const offeringSchema = Schema({
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  location: {
    type: String,
    required: true,
    enum: locations,
  },
  address: {
    type: String,
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
  _deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Offering', offeringSchema);
