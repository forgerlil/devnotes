import { NextFunction, Request, Response } from 'express'
import userValidation from '@/middlewares/validation/index.js'

console.log(userValidation.signUp)

describe('User validation middleware', () => {
  let req = {} as Request
  let res = {} as Response
  const next: NextFunction = vi.fn()

  beforeEach(() => {
    req = {} as Request
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response
  })

  it('', () => {})
})
