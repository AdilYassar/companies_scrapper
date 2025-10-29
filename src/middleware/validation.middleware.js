const Joi = require('joi');

const validateScrapingRequest = (req, res, next) => {
  const schema = Joi.object({
    sources: Joi.array().items(Joi.string()).optional(),
    cities: Joi.array().items(Joi.string()).optional(),
    async: Joi.boolean().optional()
  });
  
  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  
  next();
};

const validateLinkedInRequest = (req, res, next) => {
  const schema = Joi.object({
    country: Joi.string().valid('IT', 'RO').required(),
    filters: Joi.object({
      industries: Joi.array().items(Joi.string()).optional(),
      company_size: Joi.array().items(Joi.string()).optional()
    }).optional(),
    async: Joi.boolean().optional()
  });
  
  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  
  next();
};

module.exports = {
  validateScrapingRequest,
  validateLinkedInRequest
};
