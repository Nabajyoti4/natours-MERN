const AppError = require('../utils/appError')

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error : err,
    message: err.message,
    stack : err.stack
  })
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message)
}


const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400)
}

const handleDuplicateFieldDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value: ${value[0]}. Please use another value`
  return new AppError(message, 400);
}


const sendErrorProd = (err, res) => {
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  }else{
    console.log('ERROR' , err)
    res.status(500).json({
      status : 'error',
      message : "Something went wrong , Please try again Later"
    })
  }

}



 const errorHandler  =  ((err, req, res , next)=>{
   
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    
    if(process.env.NODE_ENV === 'development'){
       sendErrorDev(err, res)
    }else if(process.env.NODE_ENV === 'production'){

      // to handle mongoose errors
      let error = {...err}
      if(error.name === 'CastError') error =  handleCastErrorDB(error)

      if(error.name === 11000) error =  handleDuplicateFieldDB(error)

      if(error.name === 'ValidationError') error = handleValidationErrorDB(error)

      sendErrorProd(error)
    }



  })


  module.exports = {
      errorHandler
  }