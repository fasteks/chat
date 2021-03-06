// суть файла = passport.authenticate - это middleware!
// которым будет обработан запрос на котором middleware вызвыается,
// (т.е. не все подряд запросы, а только в данном случае требующие аутентификации)

import passport from 'passport'

// обработчик токена
// проверяет имеет ли юзер роли позволяющие получать доступ к определенным роутам или нет
const handleJWT = (req, res, next, roles) => {
  return async (err, user, info) => {
    const error = err || info

    if (error || !user) return res.status(401).json({ status: 401, ...error })

    // Note: passport.authenticate() middleware invokes req.login() automatically.
    // This function is primarily used when users sign up,
    // during which req.login() can be invoked to automatically log in the newly registered user.
    // то есть, вход в профиль после успешной регистрации

    // When the login operation completes, user will be assigned to req.user.
    // вероятно, функция неявно присваивает req.user = user
    // хотя Леха и повторяет этот же код на 26 строке?
    await req.logIn(user, { session: false })
    // session: false = не сохраняет никакие данные о текущем логине в сессии

    // see if user is authorized to do the action
    if (!roles.reduce((acc, rec) => acc && user.role.some((t) => t === rec), true)) {
      return res.status(401).json({ status: 401, ...err })
    }

    // если роут не анонимный, то миддлвэр заполняет запрос пользователем
    // req.user = user
    return next()
  }
}

// функция берет стратегию авторизации 'jwt' и дополнительно обрабатывает запрос функцией handleJWT
const auth =
  (roles = []) =>
  (req, res, next) => {
    return passport.authenticate(
      'jwt',
      // (passport.authenticate() middleware invokes req.login() automatically.)
      // if jwt strategy succeed automaticaly establishing session even if leha sets it too
      {
        session: true
      },
      handleJWT(req, res, next, roles)
    )(req, res, next)
  }

// exports the middleware
export default auth
