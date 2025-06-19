import { NextFunction, Request, RequestHandler, Response } from 'express'
import ErrorHandler from '@/utils/errorHandler.js'

const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.decoded) {
    next(new ErrorHandler('Unauthorised', 401))
  }
  next()
}

export default requireAuth
