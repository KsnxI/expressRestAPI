const joi = require('joi')

const categories = ['электроника', 'одежда', 'еда', 'другое']


const createSchema = joi.object({
    name: joi.string().min(2).max(100).required(),
    price: joi.number().greater(0).required(),
    category: joi.string().valid(...categories).required(),
    stock: joi.number().integer().min(0).default(0),
    description: joi.string().max(500).allow('')
})


const patchSchema = joi.object({
    name: joi.string().min(2).max(100),
    price: joi.number().greater(0),
    category: joi.string().valid(...categories),
    stock: joi.number().integer().min(0),
    description: joi.string().max(500).allow('')
}).min(1)


const validate = (schema) => (req, res, next) => {

    const { error, value } = schema.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({
            error: 'Ошибка валидации',
            details: error.details.map((item) => item.message)
        })
    }

    req.body = value 
    next()
}

module.exports = { validate, createSchema, patchSchema }