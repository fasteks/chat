// проверяет должен ли юзер иметь доступ к определенным роутам или нет

import passport from 'passport'

// обработчик токена
// каким ролям доступ к этим рутам
const handleJWT = (req, res, next, roles) => {
  return async (err, user, info) => {
    const error = err || info

    if (error || !user) return res.status(401).json({ status: 401, ...error })

    await req.logIn(user, { session: false })

    // eslint-disable-next-line
    console.log(user.role, roles)

    // see if user is authorized to do the action
    if (!roles.reduce((acc, rec) => acc && user.role.some((t) => t === rec), true)) {
      return res.status(401).json({ status: 401, ...err })
    }

    // если роут не анонимный, то миддлвэр заполняет запрос пользователем
    req.user = user
    return next()
  }
}

// exports the middleware
const auth =
  (roles = []) =>
  (req, res, next) => {
    return passport.authenticate(
      'jwt',
      // session: false = не сохраняй никакие данные о текущем логине в сессии
      {
        session: true
      },
      handleJWT(req, res, next, roles)
    )(req, res, next)
  }

export default auth
