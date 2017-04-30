const calcAge = ((birthdate) => {
  const ageDifMs = Date.now() - birthdate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getFullYear() - 1970);
});

module.exports = {
  calcAge,
};
