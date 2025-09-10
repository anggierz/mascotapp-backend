const Joi = require('joi');

const dietSchema = Joi.object({
  brand: Joi.string().required(),
  food_name: Joi.string().required(),
  grams_per_day: Joi.number().required(),
  PetId: Joi.number().required()
});

module.exports = dietSchema;
