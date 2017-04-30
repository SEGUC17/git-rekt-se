const passport = require('passport');
const passportJWT = require('passport-jwt');
const InvalidToken = require('../../models/shared/InvalidToken');
const Client = require('../../models/client/Client');
const Business = require('../../models/business/Business');
const Statistics = require('../../models/service/Statistics');
const Admin = require('../../models/admin/Admin');
const Strings = require('../../services/shared/Strings');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

require('dotenv')
  .config();

/**
 * JWT Configuration.
 */

/**
 * JWT Client Options.
 */
const JWTOptionsClient = {
  jwtFromRequest: ExtractJWT.fromAuthHeader(),
  secretOrKey: process.env.JWT_KEY_CLIENT,
  passReqToCallback: true,
};

/**
 * JWT Business Options.
 */
const JWTOptionsBusiness = Object.assign({}, JWTOptionsClient);
JWTOptionsBusiness.secretOrKey = process.env.JWT_KEY_BUSSINES;

/**
 * JWT Admin Options.
 */
const JWTOptionsAdmins = Object.assign({}, JWTOptionsClient);
JWTOptionsAdmins.secretOrKey = process.env.JWT_KEY_ADMINISTRATOR;

/**
 * Extract JWT Token from the header.
 * https://github.com/themikenicholson/passport-jwt/blob/master/lib/auth_header.js
 * @param {string} hdrValue.
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
  console.log(2);
  Client.findOne({
    _id: payload.id,
    _deleted: false,
  })
    .then((user) => {
      if (!user) {
        done(null, false, Strings.clientLoginMessages.invalidCreds);
      } else {
        const tokenCreationTime = parseInt(payload.iat, 10);
        const lastPasswordChangeTime = Math.floor(user.passwordChangeDate.getTime() / 1000);
        const reqToken = parseAuthHeader(req.headers.authorization)
          .value;

        InvalidToken.findOne({
          token: reqToken,
        })
          .then((token) => {
            if (token) {
              return done(null, false, Strings.clientLoginMessages.invalidToken);
            }

            if (tokenCreationTime < lastPasswordChangeTime) {
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
 * Stats Middleware.
 */
const statsMiddleware = (req, res, next) => {
  passport.authenticate('jwt_client', {
    session: false,
  }, (err, user, info) => {
    if (!err && user) {
      Statistics.findOne({
        _service: req.params.id,
      })
        .exec()
        .then((stats) => {
          if (stats) {
            stats.viewingClients.addToSet(user.id);
            stats.save()
              .then()
              .catch();
          }
        })
        .catch(next);
    }
    return next();
  })(req, res, next);
};

/**
 * Business Authentication Strategy.
 */
const businessStrategy = new JWTStrategy(JWTOptionsBusiness, (req, payload, done) => {
  Business.findOne({
    _id: payload.id,
    _deleted: false,
  })
    .then((user) => {
      if (!user) {
        done(null, false, Strings.businessLoginMessages.invalidCreds);
      } else {
        const tokenCreationTime = parseInt(payload.iat, 10);
        const lastPasswordChangeTime = Math.floor(user.passwordChangeDate.getTime() / 1000);
        const reqToken = parseAuthHeader(req.headers.authorization)
          .value;

        InvalidToken.findOne({
          token: reqToken,
        })
          .then((token) => {
            if (token) {
              return done(null, false, Strings.businessLoginMessages.invalidToken);
            }

            if (tokenCreationTime < lastPasswordChangeTime) {
              return done(null, false, Strings.businessLoginMessages.invalidToken);
            }

            return done(null, user);
          })
          .catch(done);
      }
    })
    .catch(done);
});

/**
 * Business Authentication Middleware.
 */
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
    _deleted: false,
  })
    .then((user) => {
      if (!user) {
        done(null, false, Strings.adminLoginMessages.invalidCreds);
      } else {
        const tokenCreationTime = parseInt(payload.iat, 10);
        const lastPasswordChangeTime = Math.floor(user.passwordChangeDate.getTime() / 1000);
        const reqToken = parseAuthHeader(req.headers.authorization)
          .value;

        InvalidToken.findOne({
          token: reqToken,
        })
          .then((token) => {
            if (token) {
              return done(null, false, Strings.adminLoginMessages.invalidToken);
            }

            if (tokenCreationTime < lastPasswordChangeTime) {
              return done(null, false, Strings.adminLoginMessages.invalidToken);
            }

            return done(null, user);
          })
          .catch(done);
      }
    })
    .catch(done);
});

/**
 * Admin Authentication Middleware.
 */
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
  parseAuthHeader,
  clientStrategy,
  clientAuthMiddleware,
  businessStrategy,
  businessAuthMiddleware,
  adminStrategy,
  statsMiddleware,
  adminAuthMiddleware,
};
