import { Router } from 'express'
import cookieParser from 'cookie-parser'
import { login, signUp, logout } from '@/controllers/auth.js'
import userValidation from '@/middlewares/validation/index.js'
import tokenVerify from '@/middlewares/auth/tokenVerify.js'
import requireAuth from '@/middlewares/auth/requireAuth.js'

const router = Router()
router.use(cookieParser())

router.post('/signup', ...userValidation.signUp, signUp)
router.post('/login', ...userValidation.login, login)
router.post('/logout', tokenVerify, requireAuth, logout)

export default router
