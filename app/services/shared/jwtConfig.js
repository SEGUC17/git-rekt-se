const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../../../app/models/business/Business');
const InvalidToken = require('../../../app/models/client/Client');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;


require('dotenv')
  .config();

const JWT_KEY = process.env.JWT_KEY;
const JWTOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeader(),
  secretOrKey: JWT_KEY,
  passReqToCallback: true,
};

/**
 * Extract JWT Token from the header.
 * https://github.com/themikenicholson/passport-jwt/blob/master/lib/auth_header.js
 */

const parseAuthHeader = function (hdrValue) {
  if (typeof hdrValue !== 'string') {
    return null;
  }
  const matches = hdrValue.match(/(\S+)\s+(\S+)/);
  return matches && {
    scheme: matches[1],
    value: matches[2],
  };
};

/**
 * Authentication Strategy.
 */

const strategy = new JWTStrategy(JWTOptions, (req, payload, done) => {
  User.findOne({
    _id: payload.id,
  }, (user) => {
    if (!user) {
      done(null, false, 'Invalid Credentials.');
    }

    const tokenCreationTime = new Date(parseInt(payload.iat, 10) * 1000);
    const lastPasswordChangeTime = user.passwordChangeDate;
    const reqToken = parseAuthHeader(req.headers.authorization)
      .value;
    // Check if token is blacklisted.
    InvalidToken.findOne({
      token: reqToken,
    }, (token) => {
      if (token) {
        return done(null, false, 'Invalid Token.');
      }
        // Check if user changed password after generating token.
      if (tokenCreationTime.getTime() < lastPasswordChangeTime.getTime()) {
        return done(null, false, 'Invalid Token.');
      }
      return done(null, user);
    }).catch(err => done([err]));
  }).catch(err => done([err]));
});


/**
 * Middleware for JWT authentication validation.
 */

const authMiddleware = function (req, res, next) {
  passport.authenticate('jwt', {
    session: false,
  }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(info);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = {
  strategy,
  authMiddleware,
  parseAuthHeader,
};
