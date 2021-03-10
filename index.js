const express = require('express')
const path = require('path')
const boom = require('boom')
const debug = require('debug')('app:server')
const helmet = require('helmet')
//const expressJsx = require('./express-jsx')

const productsRouter = require('./routes/views/products')
const productsApiRouter = require('./routes/api/products')
const authApiRouter = require('./routes/api/auth')

const { logErrors, wrapErrors, clientErrorHandler, errorHandler } = require('./utils/middlewares/errorsHandlers')
const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi')

// app
const app = express()

// middlewares
app.use(helmet())
app.use(express.json())

// static files
app.use('/static', express.static(path.join(__dirname, 'public')))

// view engine setup
//app.engine('jsx', expressJsx)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')


// routes
app.use('/products', productsRouter)
app.use('/api/products', productsApiRouter)
app.use('/api/auth', authApiRouter)

// redirect
app.get('/', function(req, res) {
	res.redirect('/products')
})

app.use(function(req, res, next) {
	if(isRequestAjaxOrApi(req)) {
		const { output: { statusCode, payload } } = boom.notFound()
		res.statusCode(statusCode).json(payload)
	}

	res.status(404).render('404')
})

// errorHandlers
app.use(logErrors)
app.use(wrapErrors)
app.use(clientErrorHandler)
app.use(errorHandler)


// init server
const server = app.listen(8000, function() {
	debug(`Listening on http://localhost:${server.address().port}`)
})