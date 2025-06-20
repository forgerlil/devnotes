import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '@/utils/errorHandler.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message)
  console.log(err.stack)
  if (err instanceof ErrorHandler) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }

  res.status(500).json({ message: err.message, stack: err.stack })
}
