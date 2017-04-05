/**
 * Client Database Seed
 */

const clients = [{
  _facebookId: '995126147288426',
  email: 'mohamedelzarei@gmail.com',
  password: 'YEQmxoav4NqK',
  confirmPassword: 'YEQmxoav4NqK',
  firstName: 'Mohamed',
  lastName: 'El Zarei',
  mobile: '01193125263',
  gender: 'Male',
  birthdate: new Date('11-2-1996'),
}, {
  email: 'atherkhalid158@gmail.com',
  password: 'YEQmxoav4N1K',
  confirmPassword: 'YEQmxoav4N1K',
  firstName: 'Ahmed',
  lastName: 'Mazen',
  mobile: '01093125263',
  gender: 'Male',
  birthdate: new Date('11-2-1994'),
  status: 'confirmed',
}];

module.exports = clients;
