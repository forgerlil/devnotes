import jwt from 'jsonwebtoken'
import { generateTokens, verifyToken } from '@/utils/auth/tokens.js'
import { TokenPayload } from '@/types/auth.types.js'

const mockUserId = '685bf98dac1d2721a96620a0'
const mockSessionId = 'yhupFteLikMOjQ84vMnbQ'
const { JWT_SECRET } = process.env

describe('generateTokens', () => {
  it('should generate access and refresh tokens', () => {
    const tokens = generateTokens(mockUserId, mockSessionId)
    expect(tokens).toHaveLength(2)
    expect(tokens[0]).toBeDefined()
  })

  it('should throw an error with an invalid userId', () => {
    expect(() => generateTokens('1', mockSessionId)).toThrow()
  })

  it('should generate different tokens for different sessions', () => {
    const tokens = generateTokens(mockUserId, mockSessionId)
    const tokens2 = generateTokens(mockUserId, mockSessionId)

    expect(tokens[0]).not.toBe(tokens2[0])
    expect(tokens[1]).not.toBe(tokens2[1])
  })

  it('should have correct payload', () => {
    const tokens = generateTokens(mockUserId, mockSessionId)
    const verifiedAccessToken = jwt.verify(tokens[0], JWT_SECRET!) as TokenPayload
    const verifiedRefreshToken = jwt.verify(tokens[1], JWT_SECRET!) as TokenPayload

    expect(verifiedAccessToken.sub).toBe(mockUserId)
    expect(verifiedAccessToken.sessionId).toBe(mockSessionId)
    expect(verifiedAccessToken.type).toBe('access')
    expect(verifiedRefreshToken.sub).toBe(mockUserId)
    expect(verifiedRefreshToken.sessionId).toBe(mockSessionId)
    expect(verifiedRefreshToken.type).toBe('refresh')
  })

  it('should generate tokens with custom expiresIn', () => {
    const tokens = generateTokens(mockUserId, mockSessionId, '1h', '1d')
    const verifiedAccessToken = jwt.verify(tokens[0], JWT_SECRET!) as TokenPayload

    expect(verifiedAccessToken.exp).toBeDefined()
    expect(verifiedAccessToken.exp).toBeLessThanOrEqual(Math.floor(Date.now() / 1000 + 3600))

    const verifiedRefreshToken = jwt.verify(tokens[1], process.env.JWT_SECRET!) as TokenPayload
    expect(verifiedRefreshToken.exp).toBeDefined()
    expect(verifiedRefreshToken.exp).toBeLessThanOrEqual(Math.floor(Date.now() / 1000 + 86400))
  })
})

describe('verifyToken', () => {
  it('should verify a token', () => {
    const tokens = generateTokens(mockUserId, mockSessionId)
    const verifiedAccessToken = verifyToken(tokens[0], 'access')
    const verifiedRefreshToken = verifyToken(tokens[1], 'refresh')

    expect(verifiedAccessToken).toBeDefined()
    expect(verifiedRefreshToken).toBeDefined()
  })

  it('should throw an error with an invalid token', () => {
    expect(() => verifyToken('invalid', 'access')).toThrow()
  })

  it('should throw an error with an invalid token type', () => {
    const tokens = generateTokens(mockUserId, mockSessionId)

    expect(() => verifyToken(tokens[0], 'refresh')).toThrow()
    expect(() => verifyToken(tokens[1], 'access')).toThrow()
  })
})
