import { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

const tokenVerify: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  req.decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

  next()
}

export default tokenVerify
