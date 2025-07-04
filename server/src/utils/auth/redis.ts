import { nanoid } from 'nanoid'
import { ObjectId } from 'mongodb'
import { hash } from '@/utils/hash.js'
import redis from '@/db/redis.js'
import { Session, TokenHistory, RedisSearchResult, SessionData } from '@/types/auth.types.js'
import ErrorHandler from '../errorHandler.js'

const sessionExpiryTime = 7 * 24 * 60 * 60 // 7 days
const getSessionExpiryDate = () => new Date(Date.now() + sessionExpiryTime * 1000)

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
    expiresAt: getSessionExpiryDate(),
  }

  await redis.json.set(sessionKey, '$', newSession)
  await redis.expire(sessionKey, sessionExpiryTime)
  return sessionKey
}

const formatSessionId = (sessionId: string) => {
  return `session:${sessionId.split(':').at(-1)}`
}

export const getSession = async (sessionId: string) => {
  const sessionKey = formatSessionId(sessionId)
  const session = await redis.json.get(sessionKey)
  return session ? (session as Session) : null
}

export const deleteSession = async (sessionId: string) => {
  const sessionKey = formatSessionId(sessionId)
  return await redis.del(sessionKey)
}

export const findTokenPair = (session: Session, tokenHash: string, type: 'refresh' | 'access') => {
  return session.tokenHistory.find((token: TokenHistory) =>
    type === 'refresh'
      ? token.refreshToken.value === tokenHash
      : token.accessToken.value === tokenHash,
  )
}

export const findUserSession = async (userId: string, deviceInfo: string) => {
  if (!ObjectId.isValid(userId)) throw new ErrorHandler('Invalid user ID', 400)
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
  tokenPair: { accessToken: string; refreshToken: string },
) => {
  const sessionKey = formatSessionId(sessionId)
  const session = (await redis.json.get(sessionKey)) as Session
  if (!session) throw new ErrorHandler('Session not found', 404)

  const newToken: TokenHistory = {
    accessToken: { value: hash(tokenPair.accessToken), status: 'valid' },
    refreshToken: { value: hash(tokenPair.refreshToken), status: 'valid' },
    createdAt: new Date(),
  }

  session.tokenHistory[0].refreshToken.status = 'revoked'
  session.tokenHistory[0].accessToken.status = 'revoked'

  const updatedSession: Session = {
    ...session,
    tokenHistory: [newToken, ...session.tokenHistory],
    expiresAt: getSessionExpiryDate(),
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
