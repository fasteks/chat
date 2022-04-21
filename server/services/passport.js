// eslint-disable-next-line
import passportJWT from 'passport-jwt'
// eslint-disable-next-line
import User from '../model/User.model'
// eslint-disable-next-line
import config from '../config'

const cookieExtractor = (req) => {
  return req && req.cookies && req.cookies.token
}

const jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([cookieExtractor])
}

const jwtStrategy = new passportJWT.Strategy(jwtOptions, (jwtPayload, done) => {
  User.findById(jwtPayload.uid, (err, user) => {
    if (err) {
      return done(err, null)
    }

    if (user) {
      return done(null, user)
    }

    return done(null, false)
  })
})

exports.jwt = jwtStrategy