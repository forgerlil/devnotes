import { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt from 'jsonwebtoken'
import { generateTokens, verifyToken } from '@/utils/auth/tokens.js'
import ErrorHandler from '@/utils/errorHandler.js'
import { hash } from '@/utils/hash.js'
import { getSession, addToHistory, findTokenPair } from '@/utils/auth/redis.js'
import { autoReuseDetection } from '@/utils/auth/autoReuseDetection.js'

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
      console.log('Access token expired')
      if (!(error instanceof jwt.TokenExpiredError)) return next(error)
    }
  }

  try {
    const decodedRefresh = verifyToken(refreshToken, 'refresh')
    const { sub: userId, sessionId } = decodedRefresh

    // Find token and verify status
    const session = await getSession(sessionId)
    if (!session) throw new ErrorHandler('Authentication not found', 401)

    const tokenPair = findTokenPair(session, hash(refreshToken), 'refresh')
    if (!tokenPair) throw new ErrorHandler('Authentication not found', 401)
    if (tokenPair.refreshToken.status === 'revoked') await autoReuseDetection(sessionId)

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
