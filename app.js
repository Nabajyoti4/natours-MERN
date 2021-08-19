const express = require('express');

const morgan = require('morgan');

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

module.exports = app;
