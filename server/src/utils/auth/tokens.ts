import jwt, { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { nanoid } from 'nanoid'
import type { StringValue } from 'ms'
import configs from '@/configs/index.js'
import { TokenPayload } from '@/types/auth.types.js'
import HTTPError from '../httpError.js'

// Type guard to validate TokenPayload
const isTokenPayload = (decoded: JwtPayload | string): decoded is TokenPayload => {
  if (typeof decoded === 'string') return false

  // Get keys from TokenPayload type, plus standard JWT claims
  const expectedKeys = ['jti', 'sub', 'sessionId', 'type'] as const
  const jwtClaims = ['iat', 'exp'] as const
  const actualKeys = Object.keys(decoded)

  // Check if payload has exactly the expected keys
  const validKeys = [...expectedKeys, ...jwtClaims]
  if (actualKeys.length !== validKeys.length) return false
  if (!actualKeys.every((key) => validKeys.includes(key as (typeof validKeys)[number])))
    return false

  return (
    typeof decoded.jti === 'string' &&
    typeof decoded.sub === 'string' &&
    typeof decoded.sessionId === 'string' &&
    typeof decoded.type === 'string' &&
    (decoded.type === 'access' || decoded.type === 'refresh') &&
    ObjectId.isValid(decoded.sub)
  )
}

export const generateTokens = (
  userId: string,
  sessionId: string,
  accessExpiresIn: StringValue = '15m',
  refreshExpiresIn: StringValue = '7d',
) => {
  if (!ObjectId.isValid(userId)) throw new HTTPError('Invalid user id', 401)
  const tokenPairId = nanoid()

  const accessToken = jwt.sign(
    { jti: tokenPairId, sub: userId, sessionId, type: 'access' } as TokenPayload,
    configs.jwtSecret!,
    { expiresIn: accessExpiresIn },
  )
  const refreshToken = jwt.sign(
    { jti: tokenPairId, sub: userId, sessionId, type: 'refresh' } as TokenPayload,
    configs.jwtSecret!,
    { expiresIn: refreshExpiresIn },
  )
  return { accessToken, refreshToken }
}

export const decodeToken = (token: string): TokenPayload => {
  const decoded = jwt.decode(token)
  if (!decoded || !isTokenPayload(decoded)) throw new HTTPError('Invalid token format', 401)
  return decoded
}

export const verifyToken = (token: string, type: 'access' | 'refresh'): TokenPayload => {
  const decoded = jwt.verify(token, configs.jwtSecret!)

  if (!isTokenPayload(decoded)) throw new HTTPError('Invalid token format', 401)
  if (type !== decoded.type) throw new HTTPError('Invalid token type', 401)

  return decoded
}
