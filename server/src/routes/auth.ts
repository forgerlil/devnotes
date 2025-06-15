import { Router } from 'express'
import tokenVerify from '@/middlewares/tokenVerify.js'

const router = Router()

router.use(tokenVerify)

router.get('/', (req, res) => {
  res.send('Logged in')
})

export default router
