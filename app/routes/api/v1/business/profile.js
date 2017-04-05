const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const validationSchemas = require('../../../../services/shared/validation');
const Mailer = require('../../../../services/shared/Mailer');
const Business = require('../../../../models/business/Business');
const BusinessAuthenticator = require('../../../../services/business/BusinessAuthenticator');
const Strings = require('../../../../services/shared/Strings');
const authMiddleWare = require('../../../../services/shared/jwtConfig');


const router = express.Router();

/**
 * Body Parser Middleware
 */

router.use(bodyParser.json());
router.use(expressValidator({}));

/**
 * business edit information route
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
    let emailChanged = false;


    req.checkBody(validationSchemas.businessUpdateValidation);
    req.checkBody('confirmPassword')
      .equals(req.body.password)
      .withMessage(Strings.bussinessValidationErrors.passwordMismatch);

    req.getValidationResult()
      .then((result) => {
        if (result.isEmpty()) {
          Business.findOne({
            _id: req.params.id,
          })
            .exec()
            .then((business) => {
              if (business.email === userInfo.email) {
                emailChanged = false;
              } else {
                emailChanged = true;
              }

              /**
               * Editing existing information
               */

              business.name = userInfo.name;
              business.shortDescription = userInfo.shortDescription;
              business.phoneNumbers = userInfo.phoneNumbers;
              business.password = userInfo.password;
              business.email = userInfo.email;

              if (emailChanged) {
                business.save()
                  .then(() => {
                    Mailer.sendConfirmationMessage(req.body.email)
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
                res.json({
                  message: Strings.businessInformationChanged.UPDATE_SUCCESSFULL,
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

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});

module.exports = router;

/**
 * Business update data
 */

// router.post('/update', authMiddleWare.businessAuthMiddleware, (req, res, next) => {
//   console.log('ok?');
//   const businessInfo = {
//     name: req.body.name,
//     shortDescription: req.body.shortDescription,
//     phoneNumbers: req.body.phoneNumbers, // Add to phone numbers array
//   };
//   req.checkBody(validationSchemas.businessUpdateValidation);
//   req.getValidationResult()
//     .then((result) => {
//       if (result.isEmpty()) {
//         Business.findOne({ email: req.body.email })
//     .exec()
//     .then((business) => {
//       business.name = businessInfo.name;
//       business.shortDescription = businessInfo.shortDescription;
//       business.phoneNumbers = businessInfo.phoneNumbers;

//       return business.save().then(() => {
//         res.json({
//           message: Strings.businessInformationChanged.UPDATE_SUCCESSFULL,
//         });
//       });
//     })
//     .catch(console.log('failed'));
//       } else {
//         next(result.array());
//       }
//     });
// });
