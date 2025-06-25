import { body, ValidationChain } from 'express-validator'

const emailValidation = body('email').isEmail().withMessage('Invalid email format')
const passwordValidation = body('password')
  .isLength({ min: 8 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .withMessage(
    'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  )
const confirmPasswordValidation = body('confirmPassword')
  .custom((value, { req }) => value === req.body.password)
  .withMessage('Passwords do not match')

export const signUpValidation: Record<string, ValidationChain> = {
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
}

export const loginValidation: Record<string, ValidationChain> = {
  email: emailValidation,
  password: passwordValidation,
}
