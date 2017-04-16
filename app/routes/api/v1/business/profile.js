const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Business = require('../../../../models/business/Business');
const Strings = require('../../../../services/shared/Strings');
const authMiddleWare = require('../../../../services/shared/jwtConfig');
const errorHandler = require('../../../../services/shared/errorHandler');


const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
router.use(expressValidator({
  customValidators: {
    isPassword: validationSchemas.validatePassword,
    arePhoneNumbers: validationSchemas.validatePhoneNumber,
  },
}));

/**
 * Get Business
 */
router.get('/profile', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  const searchID = {
    _id: req.user._id,
    _deleted: false,
    _status: 'verified',
  };
  const projection = {
    name: true,
    email: true,
    shortDescription: true,
    phoneNumbers: true,
  };
  Business.findOne(searchID, projection)
    .exec()
    .then((business) => {
      if (!business) {
        next(Strings.businessMessages.businessDoesntExist);
      } else {
        res.json({
          business,
        });
      }
    })
    .catch(next);
});

/**
 * Business edit basic information route.
 */

router.post('/:id/edit', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
  if (req.user.id === req.params.id) {
    /**
     * The new data
     */

    const userInfo = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      shortDescription: req.body.shortDescription,
      phoneNumbers: req.body.phoneNumbers,
    };

    const search = {
      _id: req.params.id,
      _deleted: false,
    };

    let emailChanged = false;


    req.checkBody(validationSchemas.businessUpdateValidation);
    req.checkBody('confirmPassword')
      .equals(req.body.password)
      .withMessage(Strings.bussinessValidationErrors.passwordMismatch);

    req.getValidationResult()
      .then((result) => {
        if (result.isEmpty()) {
          Business.findOne(search)
            .exec()
            .then((business) => {
              if (!business) {
                next(Strings.businessMessages.mismatchID);
                return;
              }
              if (business.email === userInfo.email) {
                emailChanged = false;
              } else {
                emailChanged = true;
              }

              /**
               * Editing existing information
               */
              const oldMail = business.email;
              business.name = userInfo.name;
              business.shortDescription = userInfo.shortDescription;
              business.phoneNumbers = userInfo.phoneNumbers;
              business.password = userInfo.password || business.password;
              business.email = userInfo.email;

              if (emailChanged) {
                business.save()
                  .then(() => {
                    Mailer.sendConfirmationMessage(oldMail)
                      .then(() => {
                        res.json({
                          message: Strings.businessSuccess.emailConfirmation,
                        });
                      })
                      .catch((e) => {
                        next([e]);
                      });
                  })
                  .catch(e => next(e));
              } else {
                business.save()
                  .then(() => {
                    res.json({
                      message: Strings.businessInformationChanged.UPDATE_SUCCESSFULL,
                    });
                  });
              }
            })
            .catch((e) => {
              next([e]);
            });
        } else {
          next(result.array());
        }
      });
  } else {
    next(Strings.businessMessages.mismatchID);
  }
});

/**
 *  Error Handling Middlewares.
 */

router.use(errorHandler);

module.exports = router;
