const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Coupon Schema.
 */

const couponSchema = Schema({
  _service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
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
  code: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Coupon', couponSchema);
