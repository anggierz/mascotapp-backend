const Joi = require('joi');

const petSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    type: Joi.string().valid('dog', 'cat').required(),
    birthdate: Joi.date().required(),
    age: Joi.number().integer().min(0),
    weight: Joi.number().positive(),
    breed: Joi.string().max(100),
    picture: Joi.string().uri()
});

module.exports = petSchema;