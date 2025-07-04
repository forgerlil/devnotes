import { JwtPayload } from 'jsonwebtoken'

export type User = {
  _id: string
  email: string
  password: string
}

export interface TokenPayload extends JwtPayload {
  jti: string
  sub: string
  sessionId: string
  type: 'access' | 'refresh'
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

export type SessionData = Omit<Session, 'tokenHistory' | 'expiresAt'> & {
  tokenPair: { accessToken: string; refreshToken: string }
  sessionId?: string
}

export type Session = {
  userId: string
  deviceInfo: string
  tokenHistory: TokenHistory[]
  expiresAt: Date
}

export type RedisSearchResult = {
  total: number
  documents: { id: string; value: Session }[]
}
