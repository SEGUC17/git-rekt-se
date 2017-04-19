const mongoose = require('mongoose');
const Offering = require('../service/Offering');

const Schema = mongoose.Schema;

/**
 * Booking Schema.
 */

const bookingSchema = Schema({
  _service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  _client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  _offering: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  _coupon: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon',
  },
  _transaction: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending',
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
