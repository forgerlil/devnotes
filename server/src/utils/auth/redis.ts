import { nanoid } from 'nanoid'
import { generateTokens } from '@/utils/auth/tokens.js'
import { hash } from '@/utils/auth/hash.js'
import redis from '@/db/redis.js'
import { Session, TokenHistory } from '@/types/auth.types.js'
import ErrorHandler from '../errorHandler.js'

const sessionExpiryTime = 7 * 24 * 60 * 60 // 7 days
const sessionExpiryDate = new Date(Date.now() + sessionExpiryTime * 1000) // 7 days from now in seconds

export const createSession = async (
  userId: string,
  ip: string = 'unknown',
  userAgent: string = 'unknown',
) => {
  const sessionId = nanoid()
  const sessionKey = `session:${sessionId}`
  const [accessToken, refreshToken] = generateTokens(userId, sessionId)

  const sessionData: Session = {
    userId,
    meta: { ip, userAgent },
    tokenHistory: [
      {
        accessToken: {
          value: hash(accessToken),
          status: 'valid',
        },
        refreshToken: {
          value: hash(refreshToken),
          status: 'valid',
        },
        createdAt: new Date(),
      },
    ],
    expiresAt: sessionExpiryDate,
  }

  await redis.json.set(sessionKey, '$', sessionData)
  await redis.expire(sessionKey, sessionExpiryTime)

  return { accessToken, refreshToken }
}

export const extendSession = async (sessionId: string) => {}

export const getSession = async (sessionId: string) => {
  const session = await redis.json.get(`session:${sessionId}`)
  console.log(session)
  return session ? (session as Session) : null
}

export const getUserSessions = async (userId: string) => {
  const { total, documents } = await redis.ft.search(`idx:sessions`, `@userId:${userId}`)
  return total > 0 ? documents : null
}

export const addToHistory = async (sessionId: string, token: string) => {
  const session = await getSession(sessionId)
  if (!session) throw new ErrorHandler('Session not found', 404)

  const newToken: TokenHistory = {
    accessToken: { value: hash(token), status: 'valid' },
    refreshToken: { value: hash(token), status: 'valid' },
    createdAt: new Date(),
  }

  session.tokenHistory[0].refreshToken.status = 'revoked'
  session.tokenHistory[0].accessToken.status = 'revoked'

  const updatedSession: Session = {
    ...session,
    tokenHistory: [newToken, ...session.tokenHistory],
  }

  await redis.set(`session:${sessionId}`, JSON.stringify(updatedSession))
  return updatedSession
}

export const revokeAllTokens = async (sessionId: string) => {
  const session = (await redis.json.get(`session:${sessionId}`)) as Session
  if (!session) throw new ErrorHandler('Session not found', 404)

  const updatedSession: Session = {
    ...session,
    tokenHistory: session.tokenHistory.map((token) => ({ ...token, status: 'revoked' })),
  }

  return await redis.json.set(`session:${sessionId}`, '$', updatedSession)
}
