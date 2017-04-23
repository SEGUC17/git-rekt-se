const Coupon = require('../../models/service/Coupon');
const Booking = require('../../models/service/Booking');
const Review = require('../../models/service/Review');

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
 * Utility function for deleting business services, service offerings,
 * reviews and copouns
 * @param {Object} services
 * @returns {Promise}
 */

const deleteServices = (services) => {
  const resultServices = services.map((service) => {
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
  });
  return Promise.all(resultServices);
};


const deleteBranches = (branches) => {
  const resultBranches = branches.map((branch) => {
    branch._deleted = true;
    return new Promise((resolve, reject) => {
      branch
        .save()
        .then(resultBranch => resolve(resultBranch._id))
        .catch(reject);
    });
  });
  return Promise.all(resultBranches);
};


module.exports = {
  deleteServices,
  deleteBranches,
  deleteBookings,
};
