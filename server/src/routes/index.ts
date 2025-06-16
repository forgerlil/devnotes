import { Router, Request, Response } from 'express'
import authRouter from './auth.js'

const router = Router()

router.all('/ping', (req: Request, res: Response) => {
  res.send('pong')
})

router.use('/auth', authRouter)

export default router
