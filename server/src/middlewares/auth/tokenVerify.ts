import { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Session, TokenHistory } from '@/types/auth.types.js'
import { generateTokens, verifyToken } from '@/utils/auth/tokens.js'
import ErrorHandler from '@/utils/errorHandler.js'
import { hash } from '@/utils/auth/hash.js'
import { revokeAllTokens, getSession, addToHistory } from '@/utils/auth/redis.js'

const tokenVerify: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  const refreshToken = req.cookies.refresh_token

  if (!accessToken && !refreshToken) {
    console.log('No tokens provided')
    return next()
  }

  if (accessToken) {
    try {
      const decodedAccess = verifyToken(accessToken, 'access')
      req.decoded = { userId: decodedAccess.sub, sessionId: decodedAccess.sessionId }
      return next()
    } catch (error) {
      if (!(error instanceof jwt.TokenExpiredError)) return next(error)
    }
  }

  try {
    const decodedRefresh = verifyToken(refreshToken, 'refresh')
    const { userId, sessionId } = decodedRefresh

    console.log('Verifying refresh token')
    // Find token and verify status
    const session = (await getSession(sessionId)) as Session
    if (!session) throw new ErrorHandler('Invalid session', 401)

    console.log('Session found, checking token history')
    const tokenPair = session.tokenHistory.find(
      (token: TokenHistory) => token.refreshToken.value === hash(refreshToken),
    )

    if (!tokenPair) throw new ErrorHandler('Invalid token', 401)

    // If client-sent token was already revoked, revoke all tokens
    if (tokenPair.refreshToken.status === 'revoked') {
      await revokeAllTokens(sessionId)
      console.log(`⚠️ Tokens revoked for session ${sessionId}, user ${userId}`)
      throw new ErrorHandler('Invalid token', 401)
    }

    console.log('Token valid, generating new tokens')
    // Generate new tokens and add them to the session history
    const [newAccessToken, newRefreshToken] = generateTokens(userId, sessionId)
    await addToHistory(sessionId, newAccessToken)

    console.log('new tokens: ', newAccessToken, newRefreshToken)
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.set('Authorization', `Bearer ${newAccessToken}`)

    req.decoded = { userId, sessionId }

    return next()
  } catch (error) {
    return next(error)
  }
}

export default tokenVerify
