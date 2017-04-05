/**
 * Error Handling Middleware.
 */

const generalErrors = require('./Strings')
  .generalErrors;

module.exports = (err, req, res, next) => {
  let errors;

  if (err instanceof Array) {
    errors = err;
  } else if (err instanceof Error && err.message !== undefined) {
    errors = [err.message];
  } else if (typeof err === 'string') {
    errors = [err];
  } else {
    errors = generalErrors.generalError;
  }

  res.status(400)
    .json({
      errors,
    });
};
