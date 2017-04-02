const passport = require('passport');
const passportJWT = require('passport-jwt');
const InvalidToken = require('../../models/shared/InvalidToken');
const Client = require('../../models/client/Client');
const Business = require('../../models/business/Business');
const Admin = require('../../models/admin/Admin');
const Strings = require('../../services/shared/Strings');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

require('dotenv')
  .config();

/**
 * JWT Configuration
 */

const JWTOptionsClient = {
  jwtFromRequest: ExtractJWT.fromAuthHeader(),
  secretOrKey: process.env.JWT_KEY_CLIENT,
  passReqToCallback: true,
};

const JWTOptionsBusiness = Object.assign({}, JWTOptionsClient);
JWTOptionsBusiness.secretOrKey = process.env.JWT_KEY_BUSSINES;

const JWTOptionsAdmins = Object.assign({}, JWTOptionsClient);
JWTOptionsAdmins.secretOrKey = process.env.JWT_KEY_ADMINISTRATOR;

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

const clientStrategy = new JWTStrategy(JWTOptionsClient, (req, payload, done) => {
  Client.findOne({
    _id: payload.id,
  })
    .then((user) => {
      if (!user) {
        done(null, false, Strings.clientLoginMessages.invalidCreds);
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
              return done(null, false, Strings.clientLoginMessages.invalidToken);
            }

            if (tokenCreationTime.getTime() < lastPasswordChangeTime.getTime()) {
              return done(null, false, Strings.clientLoginMessages.invalidToken);
            }

            return done(null, user);
          })
          .catch(done);
      }
    })
    .catch(done);
});

/**
 * Client Authentication Middleware.
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

/**
 * Business Authentication Strategy.
 */

const businessStrategy = new JWTStrategy(JWTOptionsBusiness, (req, payload, done) => {
  Business.findOne({
    _id: payload.id,
  })
    .then((user) => {
      if (!user) {
        done(null, false, Strings.businessLoginMessages.invalidCreds);
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
              return done(null, false, Strings.businessLoginMessages.invalidToken);
            }

            if (tokenCreationTime.getTime() < lastPasswordChangeTime.getTime()) {
              return done(null, false, Strings.businessLoginMessages.invalidToken);
            }

            return done(null, user);
          })
          .catch(done);
      }
    })
    .catch(done);
});

const businessAuthMiddleware = (req, res, next) => {
  passport.authenticate('jwt_bussiness', {
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

/**
 * Administrator Authentication Strategy.
 */

const adminStrategy = new JWTStrategy(JWTOptionsAdmins, (req, payload, done) => {
  Admin.findOne({
    _id: payload.id,
  })
    .then((user) => {
      if (!user) {
        done(null, false, Strings.adminLoginMessages.invalidCreds);
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
              return done(null, false, Strings.adminLoginMessages.invalidToken);
            }

            if (tokenCreationTime.getTime() < lastPasswordChangeTime.getTime()) {
              return done(null, false, Strings.adminLoginMessages.invalidToken);
            }

            return done(null, user);
          })
          .catch(done);
      }
    })
    .catch(done);
});

const adminAuthMiddleware = (req, res, next) => {
  passport.authenticate('jwt_administrator', {
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
  businessStrategy,
  businessAuthMiddleware,
  adminStrategy,
  adminAuthMiddleware,
};
