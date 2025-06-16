import { Router } from 'express'
import { login, signUp } from '@/controllers/auth.js'
import userValidation from '@/middlewares/validation/index.js'

const router = Router()

router.post('/signup', ...userValidation.signUp, signUp)
router.post('/login', ...userValidation.login, login)

export default router
