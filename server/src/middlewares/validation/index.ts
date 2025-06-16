import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Result, validationResult } from 'express-validator'
import { signUpValidation } from './user.js'

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

const addValidate = (validations: RequestHandler[]) => [...validations, validate]

export default {
  signUp: addValidate(Object.values(signUpValidation)),
}
