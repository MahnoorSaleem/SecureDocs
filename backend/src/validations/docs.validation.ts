import Joi, { ObjectSchema } from 'joi';

export const objectIdSchema: ObjectSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid ObjectId format',
      'any.required': 'Document ID is required',
    }),
  });