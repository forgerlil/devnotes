import { nanoid } from 'nanoid'
import { hash } from '@/utils/hash.js'
import redis from '@/db/redis.js'
import { Session, TokenHistory, RedisSearchResult, SessionData } from '@/types/auth.types.js'
import ErrorHandler from '../errorHandler.js'

const sessionExpiryTime = 7 * 24 * 60 * 60 // 7 days
const sessionExpiryDate = new Date(Date.now() + sessionExpiryTime * 1000) // 7 days from now in seconds

export const createSession = async ({ userId, deviceInfo, tokenPair, sessionId }: SessionData) => {
  const sessionKey = `session:${sessionId ?? nanoid()}`

  const newSession: Session = {
    userId,
    deviceInfo,
    tokenHistory: [
      {
        accessToken: {
          value: hash(tokenPair.accessToken),
          status: 'valid',
        },
        refreshToken: {
          value: hash(tokenPair.refreshToken),
          status: 'valid',
        },
        createdAt: new Date(),
      },
    ],
    expiresAt: sessionExpiryDate,
  }

  await redis.json.set(sessionKey, '$', newSession)
  await redis.expire(sessionKey, sessionExpiryTime)
}

export const getSession = async (sessionId: string) => {
  const sessionKey = sessionId.startsWith('session:') ? sessionId : `session:${sessionId}`
  const session = await redis.json.get(sessionKey)
  return session ? (session as Session) : null
}

export const deleteSession = async (sessionId: string) => {
  const sessionKey = sessionId.startsWith('session:') ? sessionId : `session:${sessionId}`
  return await redis.del(sessionKey)
}

export const findToken = (session: Session, tokenHash: string) => {
  return session.tokenHistory.find((token: TokenHistory) => token.refreshToken.value === tokenHash)
}

export const findUserSession = async (userId: string, deviceInfo: string) => {
  const { total, documents } = (await redis.ft.search(
    `idx:sessions`,
    `@userId:${userId} @deviceInfo:"${deviceInfo}"`,
  )) as unknown as RedisSearchResult
  if (total === 0) return null
  const id = documents[0].id.split(':')[1]
  return { id, value: documents[0].value as Session }
}

export const addToHistory = async (
  sessionId: string,
  accessToken: string,
  refreshToken: string,
) => {
  const session = await getSession(sessionId)
  if (!session) throw new ErrorHandler('Session not found', 404)

  const newToken: TokenHistory = {
    accessToken: { value: hash(accessToken), status: 'valid' },
    refreshToken: { value: hash(refreshToken), status: 'valid' },
    createdAt: new Date(),
  }

  session.tokenHistory[0].refreshToken.status = 'revoked'
  session.tokenHistory[0].accessToken.status = 'revoked'

  const updatedSession: Session = {
    ...session,
    tokenHistory: [newToken, ...session.tokenHistory],
  }

  await redis.json.set(`session:${sessionId}`, '$', updatedSession)
  await redis.expire(`session:${sessionId}`, sessionExpiryTime)
  return updatedSession
}

export const revokeAllTokens = async (sessionId: string) => {
  const session = (await redis.json.get(`session:${sessionId}`)) as Session
  if (!session) throw new ErrorHandler('Session not found', 404)

  const updatedSession: Session = {
    ...session,
    tokenHistory: session.tokenHistory.map((token) => ({
      ...token,
      accessToken: { ...token.accessToken, status: 'revoked' },
      refreshToken: { ...token.refreshToken, status: 'revoked' },
    })),
  }

  return await redis.json.set(`session:${sessionId}`, '$', updatedSession)
}
