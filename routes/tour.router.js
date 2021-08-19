const express = require('express');

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tour.controller');

const tourRouter = express.Router();

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);

tourRouter.route('/tour-stats').get(getTourStats);

tourRouter.route('/monthly-plan').get(getMonthlyPlan);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = {
  tourRouter,
};
