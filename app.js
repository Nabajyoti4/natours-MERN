const express = require('express');

const morgan = require('morgan');
const AppError = require('./utils/appError');
const {errorHandler} = require('./controllers/error.controller');

//Routes
const { tourRouter } = require('./routes/tour.router');
const { userRouter } = require('./routes/user.router');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Route Mounting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
 
// if no routes matched
app.all('*', (req, res, next)=> {
next(new AppError(`Can't find ${req.originalUrl} on this server`, 404 ));
})

app.use(errorHandler)



module.exports = app;
