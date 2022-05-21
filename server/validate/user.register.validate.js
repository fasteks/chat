const Joi = require('@hapi/joi')

const userSchema = Joi.object({
  email: Joi.string().pattern(/^\w+$/).min(1).max(15).required(),
  password: Joi.string().pattern(/^\w+$/).required(),
  confirm_password: Joi.any().valid(Joi.ref('password')).required()
})

function validateRequest(req, res, next, schema) {
  const { error, value } = schema.validate(req.body)
  if (error) {
    res.status(400).json({
      status: 'error',
      message: `Error: ${error.details.map((x) => x.message).join(', ')}`
    })
  } else {
    req.body = value
    next()
  }
}

function validateUser(req, res, next) {
  validateRequest(req, res, next, userSchema)
}

export default validateUser
