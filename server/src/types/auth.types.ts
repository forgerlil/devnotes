import { JwtPayload } from 'jsonwebtoken'

export type User = {
  _id: string
  email: string
  password: string
}

export interface BaseTokenPayload extends JwtPayload {
  sub: string
  sessionId: string
  type: 'access' | 'refresh'
}

export interface AccessTokenPayload extends BaseTokenPayload {
  type: 'access'
}

export interface RefreshTokenPayload extends BaseTokenPayload {
  type: 'refresh'
  jti: string
}

// TODO: remove this type once migration to redis is complete
export type SessionToken = {
  value: string
  status: 'valid' | 'expired' | 'revoked'
}

export type TokenHistory = {
  accessToken: SessionToken
  refreshToken: SessionToken
  createdAt: Date
}

export type Session = {
  userId: string
  meta: {
    ip: string
    userAgent: string
  }
  tokenHistory: TokenHistory[]
  expiresAt: Date
}
