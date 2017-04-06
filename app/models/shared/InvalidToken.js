const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Invalid Token Schema.
 */

const invalidTokenSchema = Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('InvalidToken', invalidTokenSchema);
