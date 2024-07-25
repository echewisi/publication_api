const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'seller', 'buyer').required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const roleSchema = Joi.object({
  username: Joi.string().required(),
  role: Joi.string().valid('admin', 'seller', 'buyer').required()
});

module.exports = {
  registerSchema,
  loginSchema,
  roleSchema
};
