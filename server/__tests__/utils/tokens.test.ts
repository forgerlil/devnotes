import jwt from 'jsonwebtoken'
import { generateTokens, verifyToken, decodeToken } from '@/utils/auth/tokens.js'
import { TokenPayload } from '@/types/auth.types.js'

const mockUserId = '685bf98dac1d2721a96620a0'
const mockSessionId = 'yhupFteLikMOjQ84vMnbQ'
const { JWT_SECRET } = process.env

describe('generateTokens', () => {
  it('should generate access and refresh tokens', () => {
    const { accessToken, refreshToken } = generateTokens(mockUserId, mockSessionId)
    expect(accessToken).toBeDefined()
    expect(refreshToken).toBeDefined()
  })

  it('should throw an error with an invalid userId', () => {
    expect(() => generateTokens('1', mockSessionId)).toThrow()
  })

  it('should generate different tokens for different sessions', () => {
    const { accessToken: aT1, refreshToken: rT1 } = generateTokens(mockUserId, mockSessionId)
    const { accessToken: aT2, refreshToken: rT2 } = generateTokens(mockUserId, mockSessionId)

    expect(aT1).not.toBe(aT2)
    expect(rT1).not.toBe(rT2)
  })

  it('should have correct payload', () => {
    const { accessToken, refreshToken } = generateTokens(mockUserId, mockSessionId)
    const verifiedAccessToken = jwt.verify(accessToken, JWT_SECRET!) as TokenPayload
    const verifiedRefreshToken = jwt.verify(refreshToken, JWT_SECRET!) as TokenPayload

    expect(verifiedAccessToken.sub).toBe(mockUserId)
    expect(verifiedAccessToken.sessionId).toBe(mockSessionId)
    expect(verifiedAccessToken.type).toBe('access')
    expect(verifiedRefreshToken.sub).toBe(mockUserId)
    expect(verifiedRefreshToken.sessionId).toBe(mockSessionId)
    expect(verifiedRefreshToken.type).toBe('refresh')
  })

  it('should generate tokens with custom expiresIn', () => {
    const { accessToken, refreshToken } = generateTokens(mockUserId, mockSessionId, '1h', '1d')
    const verifiedAccessToken = jwt.verify(accessToken, JWT_SECRET!) as TokenPayload

    expect(verifiedAccessToken.exp).toBeDefined()
    expect(verifiedAccessToken.exp).toBeLessThanOrEqual(Math.floor(Date.now() / 1000 + 3600))

    const verifiedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET!) as TokenPayload
    expect(verifiedRefreshToken.exp).toBeDefined()
    expect(verifiedRefreshToken.exp).toBeLessThanOrEqual(Math.floor(Date.now() / 1000 + 86400))
  })
})

describe('decodeToken', () => {
  it('should decode a token', () => {
    const { accessToken, refreshToken } = generateTokens(mockUserId, mockSessionId)
    const decodedAccessToken = decodeToken(accessToken)
    const decodedRefreshToken = decodeToken(refreshToken)

    expect(decodedAccessToken).toBeDefined()
    expect(decodedRefreshToken).toBeDefined()
  })

  it('should throw an error with an invalid token', () => {
    expect(() => decodeToken('invalid')).toThrow()
  })

  it('should throw an error with an invalid token format', () => {
    const invalidToken = jwt.sign(
      { jti: '123456', message: 'This is not a valid token', type: 'invalid' },
      JWT_SECRET!,
      { expiresIn: '30s' },
    )

    expect(() => decodeToken(invalidToken)).toThrow()
  })
})

describe('verifyToken', () => {
  it('should verify a token', () => {
    const { accessToken, refreshToken } = generateTokens(mockUserId, mockSessionId)
    const verifiedAccessToken = verifyToken(accessToken, 'access')
    const verifiedRefreshToken = verifyToken(refreshToken, 'refresh')

    expect(verifiedAccessToken).toBeDefined()
    expect(verifiedRefreshToken).toBeDefined()
  })

  it('should throw an error with an invalid token', () => {
    expect(() => verifyToken('invalid', 'access')).toThrow()
  })

  it('should throw an error with an invalid token type', () => {
    const { accessToken, refreshToken } = generateTokens(mockUserId, mockSessionId)

    expect(() => verifyToken(accessToken, 'refresh')).toThrow()
    expect(() => verifyToken(refreshToken, 'access')).toThrow()
  })
})
