const { custom } = require('joi');
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  };

  if (err.code && err.code === 11000) {
    customError.statusCode = 400;
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, Please choose another value`;
  }
  return res.status(customError.statusCode).json({msg:customError.msg});

}

module.exports = errorHandlerMiddleware
