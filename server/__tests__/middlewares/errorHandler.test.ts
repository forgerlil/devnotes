import { errorHandler } from '@/middlewares/errorHandler.js'
import HTTPError from '@/utils/httpError.js'
import { NextFunction, Request, Response } from 'express'

describe('Error Handler middleware', () => {
  const req = {} as Request
  let res = {} as Response
  const next: NextFunction = vi.fn()

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response
  })

  it('should set the status code and message on the response if error is an instance of HTTPError', () => {
    const error = new HTTPError('http error with status code', 418)

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(error.statusCode)
    expect(res.json).toHaveBeenCalledWith({ message: error.message })
  })

  it('should send a 500 status code and message on the response if error is not an instance of HTTPError', () => {
    const error = new Error('non-http-error')

    errorHandler(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: error.message, stack: error.stack })
  })
})
