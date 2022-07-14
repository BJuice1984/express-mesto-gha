const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../costants/constants');

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string()
      .regex(linkRegex),
  }),
});

module.exports.validateUserAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
