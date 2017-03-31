const express = require('express');
const bodyParser = require('body-parser');
const Business = require('../../../../models/business');
const Branch = require('../../../../models/service/Branch');


const router = express.Router();

/**
 * Body-Parser Middleware
 */

router.use(bodyParser.json);

/**
 * View Related Business route
 */

/**
 * This method should return the following :-
 * Business Object :- name, email, phone(s), categories(object), 
 * branches(object), services(object), workinghours, info
 */

router.get('business/category/:id/:offset', (req, res, err) => {
  let category_id = req.params.id,
    offset = req.params.offset;

  Business.count((err, cnt) => {
    if (err) {
      return next(err);
    }
    Business.find({
        'categories': {
          $not: {
            $size: 0,
          },
          $in: {
            category_id,
          }
        }
      }, {
        _deleted: 0,
        gallery: 0,
        password: 0,
      }, {
        skip: offset * 10,
        limit: 10,
      })
      .exec((err, businesses) => {
        if (err) {
          return next(err);
        }

        /**
         * Replacing the _objectids of the branches with its actual data
         */

        businesses.foreach((business) => {
          let branches_array = [];
          business.branches.foreach((branch_id) => {
            Branch.find({
                '_id': branch_id
              }, {
                _business: 0,
                _deleted: 0
              }, {})
              .exec((err, branch) => {
                if (err) {
                  return next(err);
                }
                branches_array.push(branch);
              });
          });
          business.branches = branches_array;
        });

        return res.json({
          count: cnt,
          results: businesses,
        })
      });

  });
});

/**
 * Error handling Middlewares
 */

router.use((err, req, res, next) => {
  res.status(400)
    .json({
      errors: err,
    });
});

module.exports = router;
