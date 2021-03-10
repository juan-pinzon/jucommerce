const { Strategy, ExtractJwt } = require('passport-jwt')
const boom = require('boom')
const { config } = require('../../../config')
const MongoLib = require('../../../lib/mongo')

const JwtStrategy = new Strategy(
	{
		secretOrKey: config.authJwtSecret,
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
	},
	async function(tokenPayload, done) {
		const mongoDB = new MongoLib()

		try {
			const [user] = await mongoDB.getAll('users', {
				username: tokenPayload.sub
			})

			if(!user) {
				return done(boom.unauthorized(), false)
			}

			return done(null, user)
		} catch (error) {
			done(error)
		}
	}
)

module.exports = { JwtStrategy }