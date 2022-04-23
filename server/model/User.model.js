import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: [String],
      default: ['user']
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamp: true
  }
)

// из лехиного вебинара по авторизации, его реальный код какого-то приложения
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }

    this.password = bcrypt.hashSync(this.password)

    return next()
  } catch (error) {
    return next(error)
  }
})

// //  мидлвэр применяемое к документам выбранной коллекции
// // eslint-disable-next-line
// userSchema.pre('save', async function (next) {
//   //  this - указатель на текущий документ({}) выбранной коллекции
//   //  isModified универсальный прототип что может быть вызван на
//   //  на каждом документе ({}) в принципе (вне зависимости от принадлежности к коллекции)
//   if (!this.isModified('password')) {
//     return next()
//   }

//   this.password = bcrypt.hashSync(this.password)

//   return next()
// })

// далее 2 разновидности объявления/присвоения функций документу({}) и модели(коллекции)
// идущих последовательно соотвественно (способы евивалетны по сути)
// можно записовать как в method, так и в methods и т.д.
// если в метод то запись нового метода - method({}), если в объект всех методов - methods = ({})

//  прототип может быть вызван на всех "документах"(объектах коллекции(модели) {})
//  конкретной колекции (в данном случае колекции юзеров)!
userSchema.methods = {
  passwordMatches(password) {
    // this - указатель на сам документ({})
    return bcrypt.compareSync(password, this.password)
  }
}

//  (намного удобнее чем проверять конкретно в рутах (с) леха)
//  прототип может быть вызван на конкретной колекции(модели) (в данном случае юзеров)
userSchema.static({
  async findAndValidateUser({ email, password }) {
    if (!email) {
      throw new Error('No Email')
    }

    if (!password) {
      throw new Error('No Password')
    }

    // this - указательно на всю конкретную коллекцию(модель) юзеров
    const user = await this.findOne({ email })

    if (!user) {
      throw new Error('No User')
    }

    const isPasswordOk = await user.passwordMatches(password)

    if (!isPasswordOk) {
      throw new Error('PasswordIncorrect')
    }

    return user
  }
})

//  A model is a class with which we construct documents

//  получается это экспорт всей коллекции(модели) юзеров
//  кстати, модели и документы, это классы в Монгусе
export default mongoose.model('users', userSchema)
