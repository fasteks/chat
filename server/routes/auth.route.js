// С помощью класса express.Router можно создавать модульные, монтируемые обработчики маршрутов
// router as a module
// обработчик схожих роутов в отдельно вынесенном модуле
// компоновка роутов api/v1/auth в одном месте
// по аналогии можно делать так же и для всех иных возможных крупных api

import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/User.model'
import config from '../config'

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

router.get('/', async (req, res) => {
  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret)
    const user = await User.findById(jwtUser.uid)
    const payload = { uid: user.id }
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    delete user.password
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user })
  } catch (err) {
    res.json({ status: 'error', err })
  }
})

// для успешной авторизации необходимо добавить токен
// для этого нужно расширить api для бд

router.post('/', async (req, res) => {
  try {
    const user = await User.findAndValidateUser(req.body)
    const payload = { uid: user.id }
    delete user.password
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user })
  } catch (err) {
    res.json({ status: 'error', err })
  }
})

export default router
