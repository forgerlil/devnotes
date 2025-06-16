import { Request, Response, NextFunction } from 'express'
import { Result, ValidationChain, validationResult } from 'express-validator'
import { loginValidation, signUpValidation } from './user.js'

export const validate = (req: Request, res: Response, next: NextFunction) => {
  try {
    validationResult(req).throw()
    next()
  } catch (error) {
    res.status(400).json({
      message: 'Validation failed',
      errors: (error as Result).array().map((err) => ({ path: err.path, msg: err.msg })),
    })
  }
}

const addValidate = (validations: Record<string, ValidationChain>) => [
  ...Object.values(validations),
  validate,
]

export default {
  signUp: addValidate(signUpValidation),
  login: addValidate(loginValidation),
}
