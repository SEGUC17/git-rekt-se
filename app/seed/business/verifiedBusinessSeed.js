/*
 * Verified Business Database Seed
 */

const Businesses = [{
  name: 'Enhance',
  email: 'enhance@gmail.com',
  shortDescription: 'Self developpment is our target.',
  categories: null,
  _status: 'verified',
},
{
  name: 'Not Courses',
  email: 'notcourses@gmail.com',
  shortDescription: 'Teaching English Courses',
  categories: null,
  _status: 'verified',
},
{
  name: 'GUC german center',
  email: 'gucgermancenter@gmail.com',
  shortDescription: 'Teaching German Courses',
  categories: null,
  _status: 'verified',
},
{
  name: 'IELTS Center',
  email: 'ielts_egypt@gmail.com',
  shortDescription: 'Verified Center for teaching IELTS course',
  categories: null,
  _status: 'verified',
  _deleted: true,
},
];

module.exports = Businesses;
