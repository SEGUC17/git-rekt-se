const Branch = require('../../models/service/Branch');
const Coupon = require('../../models/service/Coupon');
const Booking = require('../../models/service/Booking');
const Review = require('../../models/service/Review');

/**
 * Utility Function for parsing and creating an array of branches and returning a Promise
 * @param {Object} branches
 * @param {ObjectId} businessID
 * @returns {Promise}
 */

const addBranches = (branches, businessID) => {
  const resultBranches = branches.map((branch) => {
    const branchData = {
      _business: businessID,
      location: branch.location,
      address: branch.address,
    };
    return new Promise((resolve, reject) => {
      new Branch(branchData)
        .save()
        .then(resultBranch => resolve(resultBranch._id))
        .catch(reject);
    });
  });
  return Promise.all(resultBranches);
};

/**
 * Utility function for deleting service reviews
 * @param {Object} reviews
 * @returns {Promise}
 */

const deleteReviews = (reviewsIDs) => {
  const resultReviews = reviewsIDs.map(reviewID => new Promise((resolve, reject) => {
    Review.findOne({
      _id: reviewID,
    }).then((review) => {
      review._deleted = true;
      review.save()
        .then(resultReview => resolve(resultReview._id))
        .catch(reject);
    }).catch(reject);
  }));
  return Promise.all(resultReviews);
};

/**
 * Utility function for deleting service coupons
 * @param {Object} coupons
 * @returns {Promise}
 */

const deleteCoupons = (coupons) => {
  const resultCoupons = coupons.map((coupon) => {
    coupon._deleted = true;
    return new Promise((resolve, reject) => {
      coupon
        .save()
        .then(resultCoupon => resolve(resultCoupon._id))
        .catch(reject);
    });
  });
  return Promise.all(resultCoupons);
};

/**
 * Utility function for deleting service bookings
 * @param {Object} bookings
 * @returns {Promise}
 */

const deleteBookings = (bookings) => {
  const resultBookings = bookings.map((booking) => {
    booking._deleted = true;
    return new Promise((resolve, reject) => {
      booking
        .save()
        .then(resultBooking => resolve(resultBooking._id))
        .catch(reject);
    });
  });
  return Promise.all(resultBookings);
};

/**
 * Utility function for deleting a service, service offerings,
 * reviews and coupons
 * @param {Object} service
 * @returns {Promise}
 */

const deleteService = (service) => {
  service.offerings.forEach((offering) => {
    offering._deleted = true;
  });
  service.markModified('offerings');
  service._deleted = true;
  return new Promise((resolve, reject) => {
    deleteReviews(service.reviews)
      .then((resultReviews) => {
        Coupon.find({
          _service: service._id,
        })
          .then((coupons) => {
            deleteCoupons(coupons)
              .then((resultCoupons) => {
                Booking.find({
                  _service: service._id,
                })
                  .then((bookings) => {
                    deleteBookings(bookings)
                      .then((resultBookings) => {
                        service
                          .save()
                          .then(resultService => resolve(resultService._id))
                          .catch(reject);
                      })
                      .catch(reject);
                  })
                  .catch(reject);
              })
              .catch(reject);
          })
          .catch(reject);
      })
      .catch(reject);
  });
};

module.exports = {
  addBranches,
  deleteReviews,
  deleteCoupons,
  deleteBookings,
  deleteService,
};
