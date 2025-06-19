import { Router } from 'express'
import cookieParser from 'cookie-parser'
import { login, signUp } from '@/controllers/auth.js'
import userValidation from '@/middlewares/validation/index.js'
import tokenVerify from '@/middlewares/auth/tokenVerify.js'

const router = Router()
router.use(cookieParser())

router.post('/signup', ...userValidation.signUp, signUp)
router.post('/login', tokenVerify, ...userValidation.login, login)

// TODO: testing area, remove routes before commit
import redis from '@/db/redis.js'
import { Session } from '@/types/auth.types.js'
import { getSession, getUserSessions } from '@/utils/auth/redis.js'

router.post('/verify', tokenVerify, (req, res) => {
  res.status(200).json({ message: 'verification middleware passed' })
})
// test route for redis functions
router.get('/redis/:sessionId', async (req, res) => {
  const { sessionId } = req.params
  const { user_id: userId } = req.query

  let userSessions = await getSession(sessionId)
  if (!userSessions && userId) userSessions = await getUserSessions(userId as string)

  res.status(200).json({ userSessions })
})

// test route to add mock sessions to redis
router.post('/redis', async (req, res) => {
  const session1 = '54df8fd1-1a12-45c5-8aec-73f4aa2b3396'
  const session2 = '00d85e7d-f398-4a78-952e-abc9221a530d'
  const session3 = 'c9a043fb-2d47-4da4-8490-3955f1634821'

  const baseData = {
    userId: '68505a07509f48ac99f58b71',
    meta: {
      ip: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
    },
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }

  const data1: Session = {
    ...baseData,
    tokenHistory: [
      {
        accessToken: {
          value: '123',
          status: 'valid',
        },
        refreshToken: {
          value: '123',
          status: 'valid',
        },
        createdAt: new Date(),
      },
    ],
  }

  const data2: Session = {
    ...baseData,
    tokenHistory: [
      {
        accessToken: {
          value: 'abc',
          status: 'valid',
        },
        refreshToken: {
          value: 'abc',
          status: 'valid',
        },
        createdAt: new Date(),
      },
      {
        accessToken: {
          value: 'def',
          status: 'revoked',
        },
        refreshToken: {
          value: 'def',
          status: 'revoked',
        },
        createdAt: new Date(),
      },
    ],
  }

  const data3: Session = {
    ...baseData,
    userId: '684fe63ad49108e8bd41e269',
    tokenHistory: [
      {
        accessToken: {
          value: 'xyz',
          status: 'revoked',
        },
        refreshToken: {
          value: 'xyz',
          status: 'revoked',
        },
        createdAt: new Date(),
      },
    ],
  }

  const [result1, result2, result3] = await Promise.all([
    redis.json.set(`session:${session1}`, '$', data1),
    redis.json.set(`session:${session2}`, '$', data2),
    redis.json.set(`session:${session3}`, '$', data3),
  ])
  res.status(200).json({ result1, result2, result3 })
})

export default router
