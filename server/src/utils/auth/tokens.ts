import jwt, { JwtPayload } from 'jsonwebtoken'
import configs from '@/configs/index.js'
import { nanoid } from 'nanoid'
import ErrorHandler from '../errorHandler.js'
import { AccessTokenPayload, RefreshTokenPayload } from '@/types/auth.types.js'

export const generateTokens = (userId: string, sessionId: string) => {
  const accessToken = jwt.sign(
    { sub: userId, sessionId, type: 'access' } as AccessTokenPayload,
    configs.jwtSecret as string,
    {
      expiresIn: '15m',
    },
  )
  const refreshToken = jwt.sign(
    { jti: nanoid(), sub: userId, sessionId, type: 'refresh' } as RefreshTokenPayload,
    configs.jwtSecret as string,
    {
      expiresIn: '7d',
    },
  )
  return [accessToken, refreshToken]
}

export const verifyToken = <T extends 'access' | 'refresh'>(
  token: string,
  type: T,
): T extends 'access' ? AccessTokenPayload : RefreshTokenPayload => {
  const decoded = jwt.verify(token, configs.jwtSecret as string) as JwtPayload
  if (type === 'access' && decoded.type !== 'access') throw new ErrorHandler('Invalid token', 401)
  if (type === 'refresh' && decoded.type !== 'refresh') throw new ErrorHandler('Invalid token', 401)
  return decoded as T extends 'access' ? AccessTokenPayload : RefreshTokenPayload
}
