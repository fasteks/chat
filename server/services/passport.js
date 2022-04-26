// passport module  - упрощает авторизацию для node js
// passport-jwt совмещает модуль для работы с jwt и вышеуказанный модуль
// т.е. добавляет функциональность проверки jwt token-a на сервере без нашего непосредственного участия

// passport-jwt - одна из множества возможных стратегий
// данный же файл, описывает её, как надо нам
// eslint-disable-next-line
import passportJWT from 'passport-jwt'
// eslint-disable-next-line
import User from '../model/User.model'
// eslint-disable-next-line
import config from '../config'

const cookieExtractor = (req) => {
  return req && req.cookies && req.cookies.token
}

// options is an object literal containing options to control
// how the token is extracted from the request or verified.
// содержит параметры для управления тем, как токен извлекается из запроса или ?проверяется?.
const jwtOptions = {
  secretOrKey: config.secret,
  // набор ф. для получения токена, в данном случае из кукисов
  jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([cookieExtractor])
}

// function is responsible for determining the user to which the username(id for our instance) belongs
// стратегия находит пользователя в бд, говорит зарегистрирован он или нет и расширяет его как-то?
// зная содержимое jwt tokena как найти пользователя
// (как правило, прячем туда userId)      jwtpayload = ---.вторая часть jwt токена.---
const jwtStrategy = new passportJWT.Strategy(jwtOptions, (jwtPayload, done) => {
  //                       done = значит ф. выполнилась и пользователь есть
  User.findById(jwtPayload.uid, (err, user) => {
    // если ошибка есть, она стоит на первом месте
    // если ошибки нет, на втором месте данные, но т.к. ошибка, смысл их передавать
    if (err) {
      return done(err, null)
    }
    // если ошибки нет, на первом месте null
    // если ошибки нет, на втором данные пользователя
    if (user) {
      return done(null, user)
    }
    // если ошибки нет, но и пользователя нет
    return done(null, false)
  })
})

exports.jwt = jwtStrategy
