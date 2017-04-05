const locations = require('../../seed/service/locations');

/**
 * Branches Database Seed
 */
const Branches = [{
  // _business to be added during testing
  location: locations[0],
  address: '1 Test St.',
}, {
  location: locations[1],
  address: '2 Test Blvd.',
}];

module.exports = Branches;
