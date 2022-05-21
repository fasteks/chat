// A router object is an isolated instance(module) of middleware and routes.
// С помощью класса express.Router можно создавать модульные, монтируемые обработчики маршрутов
// обработчик схожих роутов в отдельно вынесенном модуле
// компоновка роутов api/v1/auth в одном месте
// по аналогии можно делать так же и для всех иных возможных крупных api

import express from 'express'
import jwt from 'jsonwebtoken'

import config from '../config'
import auth from '../middleware/auth'
import User from '../model/User.model'
import validateUser from '../validate/user.register.validate'

const router = express.Router()

// middleware that is specific to this router
// просто пример использования миддлвэр внутри модуля
// по сути, это просто такой же server.use
// то бишь .use МОЖЕТ обрабатывает каждый request
// если подходят api или есть другие условия
// т.к. тут условий нет = будет всегда сначала выполняться консоль лог
// вне зависимости от выбора нижеследующих конечных апи

// router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/', auth([]), async (req, res) => {
  try {
    //  jwt занимается конкретно проверкой токена "на подлинность" получается
    // const jwtUser = jwt.verify(req.cookies.token, config.secret)
    // const user = await User.findById(jwtUser.uid)
    // const payload = { uid: user.id }
    // user.password = undefined
    // res.json({ status: 'ok', token, user })

    // то же самое, что вышЕ только через auth - парсинг токена и поиск юзера по полученому айди
    // произойдет с помощью passport-jwt, а не jwt.
    const payload = { uid: req.user.id }
    req.user.password = undefined
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user: req.user })
  } catch (err) {
    res.status(400).json({ error: err, message: 'Wrong confidentials' })
  }
})

// для успешной авторизации необходимо добавить токен
// для этого нужно расширить api для бд

router.post('/', async (req, res) => {
  try {
    const user = await User.findAndValidateUser(req.body)
    const payload = { uid: user.id }
    user.password = undefined
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user })
  } catch (err) {
    res.status(400).json({ status: 'error', error: err.message, message: 'Wrong confidentials' })
  }
})

router.post('/register', validateUser, async (req, res) => {
  // try {
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    return res.status(400).json({ status: 'error', message: 'Account name already taken!' })
  }

  const userObj = new User({
    email: req.body.email,
    password: req.body.password
  })
  userObj.save()
  return res.json({ status: 'ok', message: 'Registration succeed!' })
  // } catch (err) {
  //   res.json({ status: 'error', err })
  // }
})

export default router
