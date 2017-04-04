/**
 * Facebook signup & login configuration.
 */

const passport = require('passport');
const passportFB = require('passport-facebook');
const Client = require('../../models/client/Client');

const FBStrategy = passportFB.Strategy;

/**
 * Facebook Strategy
 */

const facebookStrategy = new FBStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: process.env.FB_CALLBACK,
  profileFields: ['id', 'email', 'birthday', 'first_name', 'last_name', 'gender'],
}, (accessToken, refreshToken, profile, done) => {
  /**
   * No data from facebook.
   * Fail authentication.
   */

  if (!profile) {
    done(null, null, null);
  } else {
    /**
     * Check If user already registered.
     */

    Client.findOne({
      _facebookId: profile._json.id,
    })
      .then((user) => {
        if (!user) {
          done(null, false, profile._json);
        } else {
          done(null, user, null);
        }
      })
      .catch((err) => {
        /**
         * Send information obtained from facebook to callback.
         */

        done(err, false, profile._json);
      });
  }
});

/**
 * Facebook Middleware.
 */

const facebookMiddleware = (req, res, next) => {
  passport.authenticate('facebook_strategy', {
    session: false,
  }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    /**
     * User doesn't exist but authorized facebook.
     */

    if (!user && info) {
      if (info.message === 'Permissions error') {
        return next(['Permissions error']);
      }
      res.locals.facebookInfo = info;
      return next();
    }

    /**
     * User didn't authorize facebook.
     */

    if (!user) {
      return next(err);
    }

    /**
     * User found, authenticate him.
     */

    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = {
  facebookStrategy,
  facebookMiddleware,
};
