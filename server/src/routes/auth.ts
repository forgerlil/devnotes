import { Router } from 'express'
import cookieParser from 'cookie-parser'
import { login, signUp } from '@/controllers/auth.js'
import userValidation from '@/middlewares/validation/index.js'

const router = Router()
router.use(cookieParser())

router.post('/signup', ...userValidation.signUp, signUp)
router.post('/login', ...userValidation.login, login)

export default router
