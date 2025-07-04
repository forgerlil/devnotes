import { nanoid } from 'nanoid'
import { ObjectId } from 'mongodb'
import { hash } from '@/utils/hash.js'
import { generateTokens } from '@/utils/auth/tokens.js'
import {
  createSession,
  getSession,
  deleteSession,
  findTokenPair,
  findUserSession,
  addToHistory,
  revokeAllTokens,
} from '@/utils/auth/redis.js'
import { mockSingleSession } from '../__mocks__/redis.js'
import redis from '@/db/redis.js'
import { TokenHistory } from '@/types/auth.types.js'

vi.mock('@/db/redis.js', () => ({
  default: {
    json: {
      set: vi.fn(),
      get: vi.fn(),
    },
    expire: vi.fn(),
    del: vi.fn(),
    ft: {
      search: vi.fn(),
    },
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('createSession', () => {
  const sessionId = nanoid()
  const userId = new ObjectId().toString()
  const ip = '127.0.0.1'
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
  const deviceInfo = hash(ip + userAgent)
  const tokenPair = generateTokens(userId, sessionId)

  it('should send correct session data to redis', async () => {
    await createSession({ userId, deviceInfo, tokenPair, sessionId })

    expect(redis.json.set).toHaveBeenCalledExactlyOnceWith(`session:${sessionId}`, '$', {
      userId,
      deviceInfo,
      tokenHistory: [
        {
          accessToken: { value: hash(tokenPair.accessToken), status: 'valid' },
          refreshToken: { value: hash(tokenPair.refreshToken), status: 'valid' },
          createdAt: expect.any(Date),
        },
      ],
      expiresAt: expect.any(Date),
    })
    expect(redis.expire).toHaveBeenCalledExactlyOnceWith(`session:${sessionId}`, 604800)
  })

  it('should generate an id if none is provided', async () => {
    const sessionId = await createSession({ userId, deviceInfo, tokenPair })

    expect(redis.json.set).toHaveBeenCalledExactlyOnceWith(sessionId, '$', {
      userId,
      deviceInfo,
      tokenHistory: [
        {
          accessToken: { value: hash(tokenPair.accessToken), status: 'valid' },
          refreshToken: { value: hash(tokenPair.refreshToken), status: 'valid' },
          createdAt: expect.any(Date),
        },
      ],
      expiresAt: expect.any(Date),
    })
    expect(redis.expire).toHaveBeenCalledExactlyOnceWith(sessionId, 604800)
  })
})

describe('getSession', () => {
  it('should find an existing session', async () => {
    ;(redis.json.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSingleSession)

    await getSession(mockSingleSession.sessionId)

    expect(redis.json.get).toHaveBeenCalledExactlyOnceWith(mockSingleSession.sessionId)
  })

  it('should return null if session does not exist', async () => {
    ;(redis.json.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null)

    const session = await getSession('V1StGXR8_Z5jdHi6B-myT')

    expect(session).toBeNull()
  })
})

describe('deleteSession', () => {
  it('should format sessionId correctly before passing to redis', async () => {
    const sessionId1 = 'V1StGXR8_Z5jdHi6B-myT'
    const sessionId2 = 'sessions:V1StGXR8_Z5jdHi6B-myT'
    const sessionId3 = 'session:session:V1StGXR8_Z5jdHi6B-myT'
    const correctSessionId = 'session:V1StGXR8_Z5jdHi6B-myT'

    await deleteSession(sessionId1)
    await deleteSession(sessionId2)
    await deleteSession(sessionId3)

    expect(redis.del).toHaveBeenNthCalledWith(1, correctSessionId)
    expect(redis.del).toHaveBeenNthCalledWith(2, correctSessionId)
    expect(redis.del).toHaveBeenNthCalledWith(3, correctSessionId)
  })
})

describe('findToken', () => {
  it('should find an existing token in provided session object', () => {
    const token1 = mockSingleSession.tokenHistory[2].accessToken.value
    const token2 = mockSingleSession.tokenHistory[1].refreshToken.value

    const result1 = findTokenPair(mockSingleSession, token1, 'access')
    const result2 = findTokenPair(mockSingleSession, token2, 'refresh')

    expect(result1).toBeDefined()
    expect(result2).toBeDefined()
  })

  it('should return undefined if token is not found', () => {
    const token = 'invalid-token'
    const result = findTokenPair(mockSingleSession, token, 'access')
    expect(result).toBeUndefined()
  })
})

describe('findUserSession', () => {
  it('should return object with id and value of session', async () => {
    const rawSessionId = mockSingleSession.sessionId.split(':')[1]
    ;(redis.ft.search as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      total: 1,
      documents: [{ id: mockSingleSession.sessionId, value: mockSingleSession }],
    })

    const result = await findUserSession('66e17e663bb5c2b01f42eb30', 'device-info')
    expect(result).toEqual({ id: rawSessionId, value: mockSingleSession })
  })

  it('should return null if no documents are found', async () => {
    ;(redis.ft.search as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      total: 0,
      documents: [],
    })

    const result = await findUserSession('66e17e663bb5c2b01f42eb30', 'device-info')
    expect(result).toBeNull()
  })

  it('should throw an error if user ID is invalid', async () => {
    const findUserSesh = async () => await findUserSession('invalid-user-id', 'device-info')
    await expect(findUserSesh()).rejects.toThrow('Invalid user ID')
  })
})

describe('addToHistory', () => {
  const { userId, sessionId } = mockSingleSession

  it('should add a token as the first item in the session history and update session expiresAt', async () => {
    ;(redis.json.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSingleSession)
    const tokenPair = generateTokens(userId, sessionId)

    const result = await addToHistory(sessionId, tokenPair)

    expect(result.tokenHistory[0]).toEqual({
      accessToken: { value: hash(tokenPair.accessToken), status: 'valid' },
      refreshToken: { value: hash(tokenPair.refreshToken), status: 'valid' },
      createdAt: expect.any(Date),
    })
    expect(result.expiresAt).not.toEqual(mockSingleSession.expiresAt)
  })

  it('should revoke the previous token pair', async () => {
    ;(redis.json.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSingleSession)
    const tokenPair = generateTokens(userId, sessionId)

    const result = await addToHistory(sessionId, tokenPair)

    expect(result.tokenHistory[1]).toEqual({
      ...mockSingleSession.tokenHistory[0],
      accessToken: { ...mockSingleSession.tokenHistory[0].accessToken, status: 'revoked' },
      refreshToken: { ...mockSingleSession.tokenHistory[0].refreshToken, status: 'revoked' },
    })
  })

  it('should forward the same updated session to redis and update key TTL', async () => {
    ;(redis.json.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSingleSession)
    const tokenPair = generateTokens(userId, sessionId)

    const result = await addToHistory(sessionId, tokenPair)

    expect(redis.json.set).toHaveBeenCalledExactlyOnceWith(`session:${sessionId}`, '$', result)
    expect(redis.expire).toHaveBeenCalledExactlyOnceWith(`session:${sessionId}`, 604800)
  })

  it('should throw an error if session is not found', async () => {
    const tokenPair = generateTokens(userId, sessionId)
    const addMalformedHistory = async () => await addToHistory('invalid-session-id', tokenPair)
    await expect(addMalformedHistory()).rejects.toThrow('Session not found')
  })
})

describe('revokeAllTokens', () => {
  const { sessionId } = mockSingleSession

  it('should revoke all tokens for a session and forward the updated session to redis', async () => {
    ;(redis.json.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSingleSession)

    await revokeAllTokens(sessionId)

    expect(redis.json.set).toHaveBeenCalledExactlyOnceWith(`session:${sessionId}`, '$', {
      ...mockSingleSession,
      tokenHistory: mockSingleSession.tokenHistory.map((token: TokenHistory) => ({
        ...token,
        accessToken: { ...token.accessToken, status: 'revoked' },
        refreshToken: { ...token.refreshToken, status: 'revoked' },
      })),
    })
  })

  it('should throw an error if session is not found', async () => {
    const revokeMalformedSession = async () => await revokeAllTokens('invalid-session-id')
    await expect(revokeMalformedSession()).rejects.toThrow('Session not found')
  })
})
