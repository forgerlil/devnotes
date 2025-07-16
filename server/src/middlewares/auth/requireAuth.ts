import { NextFunction, Request, RequestHandler, Response } from 'express'
import HTTPError from '@/utils/httpError.js'

const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.decoded) {
    next(new HTTPError('Unauthorised', 401))
    return
  }

  if (req.body?.userId && req.decoded.userId !== req.body.userId) {
    next(new HTTPError('Unauthorised', 401))
    return
  }

  next()
}

export default requireAuth
