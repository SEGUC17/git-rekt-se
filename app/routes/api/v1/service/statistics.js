const express = require('express');
const mongoose = require('mongoose');

const Statistics = require('../../../../models/service/Statistics');
const Booking = require('../../../../models/service/Booking');


const BusinessAuth = require('../../../../services/shared/jwtConfig')
  .businessAuthMiddleware;
const Strings = require('../../../../services/shared/Strings');
const errorHandler = require('../../../../services/shared/errorHandler');
const getStats = require('../../../../services/business/statsUtils').getStats;

const router = express.Router();
mongoose.Promise = Promise;

router.get('/:id', BusinessAuth, (req, res, next) => {
  Statistics.findOne({
    _service: req.params.id,
    _deleted: false,
  })
    .exec()
    .then((stats) => {
      if (!stats) {
        next(Strings.statisticsMessages.noService);
        return;
      }
      if (`${stats._business}` !== `${req.user.id}`) {
        next(Strings.statisticsMessages.notOwner);
        return;
      }
      const viewingStats = new Promise((resolve, reject) => {
        stats.populate({
          path: 'viewingClients',
          select: 'birthdate gender',
        })
          .execPopulate()
          .then((populatedStats) => {
            const viewingStatstoReturn = getStats(populatedStats.viewingClients);
            resolve(viewingStatstoReturn);
          })
          .catch((e) => {
            reject(e);
          });
      });

      const bookingStats = new Promise((resolve, reject) => {
        Booking.find({
          _service: req.params.id,
        })
        .populate({
          path: '_client',
          select: 'birthdate gender',
        })
        .exec()
        .then((populatedBookings) => {
          const bookingClients = populatedBookings.map(booking => booking._client);

          const distinctBookinClients = bookingClients.filter((client1, idx1) => {
            const idx2 = bookingClients.findIndex(
              client2 => client1._id === client2._id);
            return idx1 === idx2;
          });
          const bookingStatsToReturn = getStats(distinctBookinClients);
          resolve(bookingStatsToReturn);
        })
        .catch((e) => {
          reject(e);
        });
      });
      Promise.all([viewingStats, bookingStats])
      .then((statistics) => {
        res.json({
          viewingStats: statistics[0],
          bookingStats: statistics[1],
        });
      })
      .catch(e => next(e));
    });
});

/**
 * Error handling middleware
 */

router.use(errorHandler);


module.exports = router;
