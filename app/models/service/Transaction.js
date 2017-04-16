const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Transaction Schema.
 */

const transactionSchema = Schema({
  _client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  _booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['cleared', 'refunded'],
    default: 'cleared',
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
