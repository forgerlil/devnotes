import { Router } from 'express'
import tokenVerify from '@/middlewares/tokenVerify.js'
import { signUp } from '@/controllers/auth.js'
import userValidation from '@/middlewares/validation/index.js'

const router = Router()

router.post('/signup', ...userValidation.signUp, signUp)
router.use(tokenVerify)
router.all('/', (req, res) => {
  res.status(200).json({ message: 'Logged in' })
})

export default router
