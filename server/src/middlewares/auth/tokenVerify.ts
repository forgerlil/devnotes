import { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt from 'jsonwebtoken'
import { decodeToken, generateTokens, verifyToken } from '@/utils/auth/tokens.js'
import ErrorHandler from '@/utils/errorHandler.js'
import { hash } from '@/utils/hash.js'
import {
  getSession,
  addToHistory,
  findTokenPair,
  checkRevokedCredentials,
  revokeAllTokens,
} from '@/utils/auth/redis.js'

const tokenVerify: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  const refreshToken = req.cookies.refresh_token

  if (!accessToken && !refreshToken) return next()

  if (accessToken) {
    try {
      // Decode access token first
      const { jti: accessJti, sub: userId, sessionId } = verifyToken(accessToken, 'access')

      // Check if access token has been previously revoked
      const isRevoked = await checkRevokedCredentials(sessionId, hash(accessToken), 'access')
      if (isRevoked) {
        await revokeAllTokens(sessionId)
        if (req.cookies.refresh_token) res.clearCookie('refresh_token')
        throw new ErrorHandler('Invalid authentication', 403)
      }

      // Check if refresh and access tokens are the same pair
      if (refreshToken) {
        const { jti: refreshJti } = decodeToken(refreshToken)
        if (accessJti !== refreshJti) throw new ErrorHandler('Mismatched token pair', 403)
      }

      req.decoded = { userId, sessionId }
      return next()
    } catch (error) {
      // Any non-expired error is passed to next()
      if (!(error instanceof jwt.TokenExpiredError)) return next(error)

      // Check validity and match with refresh token
      const { jti: accessJti, sessionId } = decodeToken(accessToken)

      if (refreshToken) {
        const { jti: refreshJti } = decodeToken(refreshToken)
        if (accessJti !== refreshJti) return next(new ErrorHandler('Mismatched token pair', 403))
      }

      const isRevoked = await checkRevokedCredentials(sessionId, hash(accessToken), 'access')
      if (isRevoked) {
        await revokeAllTokens(sessionId)
        if (req.cookies.refresh_token) res.clearCookie('refresh_token')
        return next(new ErrorHandler('Invalid authentication', 403))
      }
    }
  }

  try {
    const { sub: userId, sessionId } = verifyToken(refreshToken, 'refresh')

    // Find token and verify status
    const session = await getSession(sessionId)
    if (!session) throw new ErrorHandler('Authentication not found', 401)

    if (req.body?.userId && userId !== req.body.userId)
      throw new ErrorHandler('Invalid authentication', 403)

    const tokenPair = findTokenPair(session, hash(refreshToken), 'refresh')
    if (!tokenPair) throw new ErrorHandler('Authentication not found', 401)
    if (tokenPair.refreshToken.status === 'revoked') {
      await revokeAllTokens(sessionId)
      return next(new ErrorHandler('Invalid authentication', 403))
    }

    // Generate new tokens and add them to session history
    const newTokens = generateTokens(userId, sessionId)
    await addToHistory(sessionId, newTokens)

    res.cookie('refresh_token', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.set('Authorization', `Bearer ${newTokens.accessToken}`)

    req.decoded = { userId, sessionId }

    return next()
  } catch (error) {
    res.clearCookie('refresh_token')
    return next(error)
  }
}

export default tokenVerify
