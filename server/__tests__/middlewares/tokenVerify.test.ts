import { Request, Response, NextFunction } from 'express'
import tokenVerify from '@/middlewares/auth/tokenVerify.js'
import * as tokenUtils from '@/utils/auth/tokens.js'
import * as redisUtils from '@/utils/auth/redis.js'
import ErrorHandler from '@/utils/errorHandler.js'

describe('tokenVerify', () => {
  const req = { headers: {}, cookies: {} } as unknown as Request
  const res = {
    clearCookie: vi.fn(),
    cookie: vi.fn(),
    set: vi.fn(),
  } as unknown as Response

  const next: NextFunction = vi.fn()
  const userId = '685bf9edac1d2721a96620a1'
  const sessionId = 'AzkATnICb5p7f8u_bYmLG'

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should forward request if no tokens are provided', () => {
    tokenVerify(req, res, next)
    expect(next).toHaveBeenCalledWith()
  })

  it('should successfully verify valid access token', () => {
    const { accessToken } = tokenUtils.generateTokens(userId, sessionId)
    req.headers.authorization = `Bearer ${accessToken}`

    tokenVerify(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(req.decoded).toEqual({ userId, sessionId })
    expect(res.clearCookie).not.toHaveBeenCalled()
  })

  it('should throw if access token is present but malformed', () => {
    let { accessToken } = tokenUtils.generateTokens(userId, sessionId)
    accessToken += 'tampered'
    req.headers.authorization = `Bearer ${accessToken}`
    const spy = vi.spyOn(tokenUtils, 'decodeToken')

    tokenVerify(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(Error))
    expect(spy).not.toHaveBeenCalled()
  })
})
