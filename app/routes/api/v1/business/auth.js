const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Strings = require('../../../../services/shared/Strings');
const Mailer = require('../../../../services/shared/Mailer');
const validationSchemas = require('../../../../services/shared/validation');
const Business = require('../../../../models/business/Business');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const router = express.Router();
mongoose.Promise = Promise;

require('dotenv')
  .config();

const JWT_KEY = process.env.JWT_KEY;


/**
 * Parsing Middleware(s)
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * Business signup route
 */

router.post('/unverified/signup', (req, res, next) => {
  /**
   * Body Inputs
   */

  const userInfo = {
    name: req.body.name,
    email: req.body.email,
    shortDescription: req.body.shortDescription,
    mobile: req.body.mobile, // Add to phone numbers array
  };

  /**
   * Form Validation.
   */

  req.checkBody(validationSchemas.businessSignupValidation);

  req.getValidationResult()
    .then((result) => {
      if (result.isEmpty()) {
        new Business({
          name: userInfo.name,
          email: userInfo.email,
          shortDescription: userInfo.shortDescription,
          phoneNumbers: [userInfo.mobile],
        })
          .save()
          .then(() => {
            Mailer.notifyAdminOfNewBusinessSignup()
              .then(() => {
                res.json({
                  message: Strings.businessSuccess.unverifiedSignup,
                });
              })
              .catch(() => next([Strings.generalErrors.mailerError]));
          })
          .catch(() => next([Strings.bussinessValidationErrors.businessExists]));
      } else {
        next(result.array());
      }
    });
});

/**
 * Business forgot password
 */

router.post('/forgot', (req, res, next) => {
  const email = req.body.email;
  const iat = Math.floor(Date.now() / 1000);
  const resetToken = jwt.sign({
    email,
    iat,
  }, JWT_KEY, {
    expiresIn: '1h',
  });

  Business.findOne({
    email: req.body.email,
  }).exec().then((business) => {
    if (!business) { // Business not found, Invalid mail
      // Not using middleware due to status
      return res.json({
        message: Strings.businessForgotPassword.CHECK_YOU_EMAIL,
      });
    }
    business.passwordResetTokenDate = iat * 1000;

    return business.save().then(() => {
      Mailer.forgotPasswordEmail(email, req.headers.host, resetToken)
        .then(() => res.json({ message: Strings.businessForgotPassword.CHECK_YOU_EMAIL }))
        .catch(() => res.json('err'));
    });
  }).catch(err => next([err]));
});

/**
 * Business reset password
 */

router.post('/reset', (req, res, next) => {
  const resetToken = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;


  // Check If any required field are missing
  if (!(password && confirmPassword && resetToken)) {
    next(Strings.INCOMPLETE_INFORMATION);
  }

  // Check if password and confirmation mismatch
  if (password !== confirmPassword) {
    return next(Strings.PASSWORD_MISMATCH);
  }

  // Check that password satisfies password conditions
  // The password must be at least 8 characters and includes at least a digit
  //  and a special character.
  // http://stackoverflow.com/questions/19605150/

  // const passwordRegex = /(?=.*\d)(?=.*[$@$!%*#?.&])[A-Za-z\d$@$!%*#?.&]{8,}$/;
  // if (!passwordRegex.test(password)) {
  //   next(Strings.INVALID_PASSWORD);
  // }

  return jwt.verify(resetToken, JWT_KEY, (err, payload) => {
    const email = payload.email;
    const creationDate = new Date(parseInt(payload.iat, 10) * 1000);

    Business.findOne({
      email,
      passwordChangeDate: {
        $lte: creationDate,
      },
    })
      .exec()
      .then((business) => {
        if (!business) {
          return next(Strings.businessForgotPassword.INVALID_RESET_TOKEN);
        }
        business.passwordResetTokenDate = undefined; // Disable the token
        business.passwordChangeDate = Date.now(); // Invalidate Login Tokens
        business.password = password; // Reset password

        return business.save()
          .then(() => res.json({
            message: 'password changed successfuly',
          }));
      })
      .catch(e => next([e]));
  });
});

/**
 *  Error Handling Middlewares.
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});


module.exports = router;

