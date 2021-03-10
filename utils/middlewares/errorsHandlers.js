const boom = require('boom')
const { config } = require('../../config')
const isRequestAjaxOrApi = require('../isRequestAjaxOrApi')

function withErrorStack(err, stack) {
	if (config.dev) {
		return { ...err, stack }
	}
	return err
}

function logErrors(err, req, res, next) {
  console.log(err.stack);
  next(err);
}

function wrapErrors(err, req, res, next) {
	if (err.isBoom) {
		next(boom.badImplementation(err))
	}
	next(err)
}

function clientErrorHandler(err, req, res, next) {
	const { output: { statusCode, payload}, stack } = err
  // catch errors for AJAX request or if an error occurs while streaming 
  if (isRequestAjaxOrApi(req) || res.headerSent) {
    res.status(statusCode).json(withErrorStack(payload, stack));
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  // catch erros while streaming
  const { output: { statusCode, payload}, stack } = err

  res.status(statusCode);
  res.render("error", withErrorStack(payload, stack));
}

module.exports = {
	logErrors,
	wrapErrors,
	clientErrorHandler,
	errorHandler
}