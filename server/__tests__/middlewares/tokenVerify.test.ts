import { Request } from 'express'
import tokenVerify from '@/middlewares/auth/tokenVerify.js'
import * as tokenUtils from '@/utils/auth/tokens.js'
import * as redisUtils from '@/utils/auth/redis.js'
import ErrorHandler from '@/utils/errorHandler.js'
import { hash } from '@/utils/hash.js'
import { MockedResponse } from '@/types/tests.types.js'
import { createMockSessionFromTokens, mockSingleSessionWithId } from '../__mocks__/redis.js'

describe('tokenVerify', () => {
  let req: Request
  const res = {
    clearCookie: vi.fn(),
    cookie: vi.fn(),
    set: vi.fn(),
  } as MockedResponse
  const next = vi.fn()

  const { userId, sessionId: fullSessionId } = mockSingleSessionWithId
  const sessionId = fullSessionId.split(':')[1]

  const {
    tokens: { decodeToken, generateTokens, verifyToken },
    redis: { addToHistory, checkRevokedCredentials, getSession, revokeAllTokens },
  } = {
    tokens: {
      decodeToken: vi.spyOn(tokenUtils, 'decodeToken'),
      generateTokens: vi.spyOn(tokenUtils, 'generateTokens'),
      verifyToken: vi.spyOn(tokenUtils, 'verifyToken'),
    },
    redis: {
      addToHistory: vi.spyOn(redisUtils, 'addToHistory'),
      checkRevokedCredentials: vi.spyOn(redisUtils, 'checkRevokedCredentials'),
      getSession: vi.spyOn(redisUtils, 'getSession'),
      revokeAllTokens: vi.spyOn(redisUtils, 'revokeAllTokens'),
    },
  }

  beforeEach(() => {
    req = { headers: {}, cookies: {} } as Request
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should forward request if no tokens are provided', () => {
    tokenVerify(req, res, next)
    expect(next).toHaveBeenCalledWith()
    expect(res.clearCookie).not.toHaveBeenCalled()
    expect(res.cookie).not.toHaveBeenCalled()
    expect(res.set).not.toHaveBeenCalled()
  })

  it('should successfully verify valid access token', async () => {
    const { accessToken, refreshToken } = tokenUtils.generateTokens(userId, sessionId)

    req.headers.authorization = `Bearer ${accessToken}`
    req.cookies.refresh_token = refreshToken
    checkRevokedCredentials.mockResolvedValueOnce(false)

    await tokenVerify(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(req.decoded).toEqual({ userId, sessionId })
    expect(next).not.toHaveBeenCalledWith(expect.any(ErrorHandler))
    expect(res.clearCookie).not.toHaveBeenCalled()
  })

  it('should throw if access token is valid but revoked', async () => {
    const { accessToken } = tokenUtils.generateTokens(userId, sessionId)
    req.headers.authorization = `Bearer ${accessToken}`
    checkRevokedCredentials.mockResolvedValueOnce(true)
    revokeAllTokens.mockResolvedValueOnce('OK')

    await tokenVerify(req, res, next)

    expect(checkRevokedCredentials).toHaveBeenCalledWith(sessionId, hash(accessToken), 'access')
    expect(revokeAllTokens).toHaveBeenCalledWith(sessionId)
    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
    expect(next.mock.calls[0][0].message).toBe('Invalid authentication')
    expect(next.mock.calls[0][0].statusCode).toBe(403)
    expect(req.decoded).not.toBeDefined()
  })

  it("should throw if valid access token doesn't match refresh token jti", async () => {
    const { accessToken: accessToken1 } = tokenUtils.generateTokens(userId, sessionId)
    const { refreshToken: refreshToken2 } = tokenUtils.generateTokens(userId, sessionId)

    req.headers.authorization = `Bearer ${accessToken1}`
    req.cookies.refresh_token = refreshToken2
    checkRevokedCredentials.mockResolvedValueOnce(false)

    await tokenVerify(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
    expect(next.mock.calls[0][0].message).toBe('Mismatched token pair')
    expect(next.mock.calls[0][0].statusCode).toBe(403)
    expect(req.decoded).not.toBeDefined()
  })

  it('should forward to error handler middleware if access token is malformed', () => {
    const { accessToken } = tokenUtils.generateTokens(userId, sessionId)
    req.headers.authorization = `Bearer ${accessToken}tampered`

    tokenVerify(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
    expect(decodeToken).not.toHaveBeenCalled()
  })

  it("should throw if expired access token doesn't match refresh token jti", async () => {
    const { accessToken: accessToken1 } = tokenUtils.generateTokens(userId, sessionId, '1ms')
    const { refreshToken: refreshToken2 } = tokenUtils.generateTokens(userId, sessionId)

    req.headers.authorization = `Bearer ${accessToken1}`
    req.cookies.refresh_token = refreshToken2
    checkRevokedCredentials.mockResolvedValueOnce(false)

    await tokenVerify(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
    expect(next.mock.calls[0][0].message).toBe('Mismatched token pair')
    expect(next.mock.calls[0][0].statusCode).toBe(403)
    expect(req.decoded).not.toBeDefined()
  })

  it('should throw if access token is expired and no refresh token is provided', async () => {
    const { accessToken } = tokenUtils.generateTokens(userId, sessionId, '1ms')
    req.headers.authorization = `Bearer ${accessToken}`
    checkRevokedCredentials.mockResolvedValueOnce(false)

    await tokenVerify(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
    expect(next.mock.calls[0][0].message).toBe('Insufficient authentication')
    expect(next.mock.calls[0][0].statusCode).toBe(401)
    expect(req.decoded).not.toBeDefined()
  })

  it('should continue with refresh token validation if access token is valid but expired', async () => {
    const { accessToken, refreshToken } = tokenUtils.generateTokens(userId, sessionId, '1ms')

    req.headers.authorization = `Bearer ${accessToken}`
    req.cookies.refresh_token = refreshToken

    checkRevokedCredentials.mockResolvedValueOnce(false)

    await tokenVerify(req, res, next)

    expect(checkRevokedCredentials).toHaveBeenCalledOnce()
    expect(verifyToken).toHaveBeenCalledWith(accessToken, 'access')
    expect(verifyToken).toHaveBeenCalledWith(refreshToken, 'refresh')
    expect(next).toHaveBeenCalled()
  })

  it('should successfully verify a valid refresh token and add new tokens to response', async () => {
    const { accessToken: originalAccessToken, refreshToken: originalRefreshToken } =
      tokenUtils.generateTokens(userId, sessionId, '1ms')
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      tokenUtils.generateTokens(userId, sessionId)

    const mockSession = createMockSessionFromTokens({
      userId,
      accessToken: originalAccessToken,
      refreshToken: originalRefreshToken,
    })
    checkRevokedCredentials.mockResolvedValueOnce(false)
    getSession.mockResolvedValueOnce(mockSession)
    generateTokens.mockReturnValueOnce({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
    addToHistory.mockResolvedValueOnce(mockSession)
    req.headers.authorization = `Bearer ${originalAccessToken}`
    req.cookies.refresh_token = originalRefreshToken

    await tokenVerify(req, res, next)

    expect(res.cookie).toHaveBeenCalledWith('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 3600000,
    })
    expect(res.set).toHaveBeenCalledWith('Authorization', `Bearer ${newAccessToken}`)
    expect(req.decoded).toEqual({ userId, sessionId })
    expect(next).toHaveBeenCalled()
  })

  it('should throw if refresh token has been revoked', async () => {
    const { refreshToken } = tokenUtils.generateTokens(userId, sessionId)
    req.cookies.refresh_token = refreshToken
    checkRevokedCredentials.mockResolvedValueOnce(true)
    revokeAllTokens.mockResolvedValueOnce('OK')

    await tokenVerify(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
    expect(next.mock.calls[0][0].message).toBe('Invalid authentication')
    expect(next.mock.calls[0][0].statusCode).toBe(403)
    expect(res.clearCookie).toHaveBeenCalledWith('refresh_token')
    expect(req.decoded).not.toBeDefined()
  })
})
