const offeringsSeed = require('./searchOfferingsSeed');
const Offering = require('../../../app/models/service/Offering');
/**
 * Services Seed For Search Tests
*/

const services = [{
  name: 'German Course',
  shortDescription: '3000 NC - 2000 Z',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[0]),
    new Offering(offeringsSeed[1]),
  ],
},
{
  name: 'English Course',
  shortDescription: '5000 T - 7000 T',
  _avgRating: 10,
  offerings: [
    new Offering(offeringsSeed[2]),
    new Offering(offeringsSeed[3]),
  ],
},
{
  name: 'French Course',
  shortDescription: '4000 SZ',
  _avgRating: 10,
  offerings: [
    new Offering(offeringsSeed[4]),
  ],
},
{
  name: 'Presentation Session',
  shortDescription: '1500 6O - 4000Z',
  _avgRating: 8,
  offerings: [
    new Offering(offeringsSeed[5]),
    new Offering(offeringsSeed[6]),
  ],
},
{
  name: 'Italian Lesson',
  shortDescription: 'DELETED',
  _avgRating: 10,
  _deleted: true,
  offerings: [
    new Offering(offeringsSeed[7]),
  ],
},
{
  name: 'Self-Development Stuff',
  shortDescription: '3000 T',
  _avgRating: 8,
  offerings: [
    new Offering(offeringsSeed[8]),
  ],
},
{
  name: 'Test',
  shortDescription: '2000 Z',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[1]),
  ],
},
{
  name: 'Test2',
  shortDescription: '10000 Z',
  _avgRating: 9,
  offerings: [
    new Offering(offeringsSeed[9]),
  ],
},
{
  name: 'Test3',
  shortDescription: '5000 6O',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[10]),
  ],
},
{
  name: 'Japanese Lesson',
  shortDescription: '600 Z',
  _avgRating: 10,
  offerings: [
    new Offering(offeringsSeed[11]),
  ],
},
{
  name: 'Tagamo3 Pagination Test1',
  shortDescription: 'Tagamo3 1st Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test2',
  shortDescription: 'Tagamo3 1st Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test3',
  shortDescription: 'Tagamo3 1st Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test4',
  shortDescription: 'Tagamo3 1st Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test5',
  shortDescription: 'Tagamo3 1st Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test6',
  shortDescription: 'Tagamo3 1st Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test7',
  shortDescription: 'Tagamo3 1st Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test8',
  shortDescription: 'Tagamo3 2nd Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test9',
  shortDescription: 'Tagamo3 2nd Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test10',
  shortDescription: 'Tagamo3 2nd Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'Tagamo3 Pagination Test11',
  shortDescription: 'Tagamo3 2nd Page',
  _avgRating: 7,
  offerings: [
    new Offering(offeringsSeed[2]),
  ],
},
{
  name: 'English Course',
  shortDescription: '2000 6O',
  _avgRating: 9,
  offerings: [
    new Offering(offeringsSeed[12]),
  ],
}];

module.exports = services;
