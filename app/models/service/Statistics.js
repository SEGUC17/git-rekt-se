const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Service Statisics Schema.
 */

const statisticsSchema = Schema({
  _business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  _service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  viewingClients: [{
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  }],
  _deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Statistics', statisticsSchema);

