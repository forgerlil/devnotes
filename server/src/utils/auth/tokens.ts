import jwt, { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { nanoid } from 'nanoid'
import type { StringValue } from 'ms'
import configs from '@/configs/index.js'
import { TokenPayload } from '@/types/auth.types.js'
import ErrorHandler from '../errorHandler.js'

// Type guard to validate TokenPayload
const isTokenPayload = (decoded: JwtPayload | string): decoded is TokenPayload => {
  if (typeof decoded === 'string') return false

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
  if (!ObjectId.isValid(userId)) throw new ErrorHandler('Invalid user id', 401)
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

export const verifyToken = (token: string, type: 'access' | 'refresh'): TokenPayload => {
  const decoded = jwt.verify(token, configs.jwtSecret!)

  if (!isTokenPayload(decoded)) throw new ErrorHandler('Invalid token format', 401)
  if (type !== decoded.type) throw new ErrorHandler('Invalid token type', 401)

  return decoded
}
