/**
 * All the errors that can be thrown by JWT.
 */
const JWT_ERRORS = ['jwt expired', 'jwt malformed', 'jwt signature is required',
  'invalid signature', 'jwt audience invalid. expected: [OPTIONS AUDIENCE]',
  'jwt issuer invalid. expected: [OPTIONS ISSUER]',
  'jwt id invalid. expected: [OPTIONS JWT ID]',
  'jwt subject invalid. expected: [OPTIONS SUBJECT]'];

/**
 * Checks if the errors array contains a JWT Error.
 * @param {[string]} errors - Arrays of strings representing
 * errors sent from the server.
 * @return {boolean} - whether it contains a JWT Error or no.
 */
export default (errors) => {
  errors = errors.filter(error => JWT_ERRORS.includes(error));
  return errors.length > 0;
};
