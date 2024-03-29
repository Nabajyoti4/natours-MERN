const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const {catchAsync} = require('../utils/catchAsync');


const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  // eslint-disable-next-line no-unused-expressions
  req.query.sort = '-ratingAverage, price';
  req.query.fields = 'name, price, ratingAverage, summary, difficulty';
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
});

const createTour = catchAsync(async (req, res, next) => {
 
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
 
});

const getTour = catchAsync(async (req, res, next) => {
    const tourId = req.params.id;

    const tour = await Tour.findById(tourId);

    if(!tour){
      return next(new AppError("No tour found by the given Id", 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
 
});

const updateTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
      new: true,
      runValidators: true,
  });


  if(!tour){
    return next(new AppError("No tour found by the given Id", 404))
  }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });

});

const deleteTour = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;

    const tour = await Tour.findByIdAndDelete(tourId);


    if(!tour){
      return next(new AppError("No tour found by the given Id", 404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });

});

const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
 
});

const getMonthlyPlan = catchAsync(async (req, res, next) => { 

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours : {$push : "$name"}
        }, 
      },
      {
        $addFields : {month : "$_id"}
      },
      {
        $project : {
          _id : 0
        }
      },
      {
        $sort : {numTourStarts: 1}
      }, 
      {
        $limit : 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });

});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};

//19
