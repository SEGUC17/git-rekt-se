const calcAge = require('../shared/generalUtils').calcAge;

const getStats = (clients) => {
  const totalCount = clients.length;

  const males = clients.filter(client => client.gender === 'Male');
  const totalMaleCount = males.length;

  const females = clients.filter(client => client.gender === 'Female');
  const totalFemaleCount = females.length;

  const age13to18 = clients.filter(client =>
    (calcAge(client.birthdate) >= 13 && calcAge(client.birthdate) <= 18));
  const age13to18TotalCount = age13to18.length;

  const age13to18Males = age13to18.filter(client => client.gender === 'Male');
  const age13to18MaleCount = age13to18Males.length;

  const age13to18Females = age13to18.filter(client => client.gender === 'Female');
  const age13to18FemaleCount = age13to18Females.length;

  const age19to24 = clients.filter(client =>
    (calcAge(client.birthdate) >= 19 && calcAge(client.birthdate) <= 24));
  const age19to24TotalCount = age19to24.length;

  const age19to24Males = age19to24.filter(client => client.gender === 'Male');
  const age19to24MaleCount = age19to24Males.length;

  const age19to24Females = age19to24.filter(client => client.gender === 'Female');
  const age19to24FemaleCount = age19to24Females.length;

  const age25to30 = clients.filter(client =>
    (calcAge(client.birthdate) >= 25 && calcAge(client.birthdate) <= 30));
  const age25to30TotalCount = age25to30.length;

  const age25to30Males = age25to30.filter(client => client.gender === 'Male');
  const age25to30MaleCount = age25to30Males.length;

  const age25to30Females = age25to30.filter(client => client.gender === 'Female');
  const age25to30FemaleCount = age25to30Females.length;

  const age31to40 = clients.filter(client =>
    (calcAge(client.birthdate) >= 31 && calcAge(client.birthdate) <= 40));
  const age31to40TotalCount = age31to40.length;

  const age31to40Males = age31to40.filter(client => client.gender === 'Male');
  const age31to40MaleCount = age31to40Males.length;

  const age31to40Females = age31to40.filter(client => client.gender === 'Female');
  const age31to40FemaleCount = age31to40Females.length;

  const age41to50 = clients.filter(client =>
    (calcAge(client.birthdate) >= 41 && calcAge(client.birthdate) <= 50));
  const age41to50TotalCount = age41to50.length;

  const age41to50Males = age41to50.filter(client => client.gender === 'Male');
  const age41to50MaleCount = age41to50Males.length;

  const age41to50Females = age41to50.filter(client => client.gender === 'Female');
  const age41to50FemaleCount = age41to50Females.length;

  const age51to60 = clients.filter(client =>
    (calcAge(client.birthdate) >= 51 && calcAge(client.birthdate) <= 60));
  const age51to60TotalCount = age51to60.length;

  const age51to60Males = age51to60.filter(client => client.gender === 'Male');
  const age51to60MaleCount = age51to60Males.length;

  const age51to60Females = age51to60.filter(client => client.gender === 'Female');
  const age51to60FemaleCount = age51to60Females.length;

  const age61to74 = clients.filter(client =>
    (calcAge(client.birthdate) >= 61 && calcAge(client.birthdate) <= 74));
  const age61to74TotalCount = age61to74.length;

  const age61to74Males = age61to74.filter(client => client.gender === 'Male');
  const age61to74MaleCount = age61to74Males.length;

  const age61to74Females = age61to74.filter(client => client.gender === 'Female');
  const age61to74FemaleCount = age61to74Females.length;

  const age75plus = clients.filter(client =>
    (calcAge(client.birthdate) >= 75));
  const age75plusTotalCount = age75plus.length;

  const age75plusMales = age75plus.filter(client => client.gender === 'Male');
  const age75plusMaleCount = age75plusMales.length;

  const age75plusFemales = age75plus.filter(client => client.gender === 'Female');
  const age75plusFemaleCount = age75plusFemales.length;

  return ({
    totalCount,
    totalMaleCount,
    totalFemaleCount,

    age13to18TotalCount,
    age13to18MaleCount,
    age13to18FemaleCount,

    age19to24TotalCount,
    age19to24MaleCount,
    age19to24FemaleCount,

    age25to30TotalCount,
    age25to30MaleCount,
    age25to30FemaleCount,

    age31to40TotalCount,
    age31to40MaleCount,
    age31to40FemaleCount,

    age41to50TotalCount,
    age41to50MaleCount,
    age41to50FemaleCount,

    age51to60TotalCount,
    age51to60MaleCount,
    age51to60FemaleCount,

    age61to74TotalCount,
    age61to74MaleCount,
    age61to74FemaleCount,

    age75plusTotalCount,
    age75plusMaleCount,
    age75plusFemaleCount,

  });
};

module.exports = {
  getStats,
};
