/**
<<<<<<< HEAD
 * Businesses Database Seed
 */


const Businesses = [{
  name: 'hobala1',
  email: 'test@gmail.com',
  shortDescription: 'This item is for testing the Business SignUp API',
  phoneNumbers: ['01000000000', '01111111111', '01222222222'],
  password: 'blahblah1',
  confirmPassword: 'blahblah1',
  description: 'This is for testing the API',
  workingHours: 'Saturday To Thursday 8AM-5PM',
  categories: null,
  branches: null,
  _status: 'verified',
},
{
  name: 'hobala26',
  email: 'test1@gmail.com',
  shortDescription: 'This item is for testing the Business SignUp API',
  phoneNumbers: ['01000000000', '01111111111', '01222222222'],
  password: 'blahblah1',
  confirmPassword: 'blahblah1',
  description: 'This is for testing the API',
  workingHours: 'Saturday To Thursday 8AM-5PM',
  categories: null,
  branches: null,
  _status: 'verified',
=======
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
>>>>>>> 1a21105aa4ac0a78e0de0c6745afb98a01be0ef5
},
];

module.exports = Businesses;
