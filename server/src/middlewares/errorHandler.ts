import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '@/utils/errorHandler.js'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message)
  console.log(err.stack)
  if (err instanceof ErrorHandler) {
    res.status(err.statusCode).json({ message: err.message })
  } else if (err instanceof Error) {
    res.status(500).json({ message: err.message, stack: err.stack })
  } else {
    res.status(500).json({ message: 'Internal server error' })
  }
}
