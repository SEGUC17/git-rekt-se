const passport = require('passport');
const passportJWT = require('passport-jwt');
const InvalidToken = require('../../models/shared/InvalidToken');
const Client = require('../../models/client/Client');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

require('dotenv')
  .config();

/**
 * JWT Configuration
 */

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

const parseAuthHeader = (hdrValue) => {
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
 * Client Authentication Strategy.
 */

const clientStrategy = new JWTStrategy(JWTOptions, (req, payload, done) => {
  Client.findOne({
    _id: payload.id,
  })
    .then((user) => {
      if (!user) {
        done(null, false, 'Invalid Credentatials.');
      } else {
        const tokenCreationTime = new Date(parseInt(payload.iat, 10) * 1000);
        const lastPasswordChangeTime = user.passwordChangeDate;
        const reqToken = parseAuthHeader(req.headers.authorization)
          .value;

        InvalidToken.findOne({
          token: reqToken,
        })
          .then((token) => {
            if (token) {
              return done(null, false, 'Invalid Token.');
            }

            if (tokenCreationTime.getTime() < lastPasswordChangeTime.getTime()) {
              return done(null, false, 'Invalid Token.');
            }

            return done(null, user);
          })
          .catch(done);
      }
    })
    .catch(done);
});

/**
 * Client Authentication Middleware
 */

const clientAuthMiddleware = (req, res, next) => {
  passport.authenticate('jwt_client', {
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
  clientStrategy,
  clientAuthMiddleware,
};

    Contact GitHub API Training Shop Blog About 

    © 2017 GitHub, Inc. Terms Privacy Security Status Help 

