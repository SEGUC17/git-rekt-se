const mongoose = require('mongoose');
const locations = require('../../seed/service/locations');

const Schema = mongoose.Schema;

/**
 * Branch Schema
 */

const branchSchema = Schema({
  _business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
  },
  location: {
    type: String,
    required: true,
    enum: locations,
  },
  address: {
    type: String,
    required: false,
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Branch', branchSchema);
