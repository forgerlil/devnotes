import { MockedFunction } from 'vitest'
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
  checkRevokedCredentials,
  addToHistory,
  revokeAllTokens,
} from '@/utils/auth/redis.js'
import { mockSingleSessionWithId } from '../__mocks__/redis.js'
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

const { mockJsonGet, mockJsonSet, mockFtSearch } = {
  mockJsonGet: redis.json.get as MockedFunction<typeof redis.json.get>,
  mockJsonSet: redis.json.set as MockedFunction<typeof redis.json.set>,
  mockFtSearch: redis.ft.search as MockedFunction<typeof redis.ft.search>,
}

afterEach(() => {
  vi.resetAllMocks()
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
    mockJsonSet.mockResolvedValueOnce('OK')
    await createSession({ userId, deviceInfo, tokenPair, sessionId })

    expect(redis.json.set).toHaveBeenCalledExactlyOnceWith(`session:${sessionId}`, '$', {
      userId,
      deviceInfo,
      tokenHistory: [
        {
          accessToken: { value: hash(tokenPair.accessToken), status: 'valid' },
          refreshToken: { value: hash(tokenPair.refreshToken), status: 'valid' },
          createdAt: expect.any(String),
        },
      ],
      expiresAt: expect.any(String),
    })
    expect(redis.expire).toHaveBeenCalledExactlyOnceWith(`session:${sessionId}`, 604800)
  })

  it('should generate an id if none is provided', async () => {
    mockJsonSet.mockResolvedValueOnce('OK')
    const sessionId = await createSession({ userId, deviceInfo, tokenPair })

    expect(redis.json.set).toHaveBeenCalledExactlyOnceWith(sessionId, '$', {
      userId,
      deviceInfo,
      tokenHistory: [
        {
          accessToken: { value: hash(tokenPair.accessToken), status: 'valid' },
          refreshToken: { value: hash(tokenPair.refreshToken), status: 'valid' },
          createdAt: expect.any(String),
        },
      ],
      expiresAt: expect.any(String),
    })
    expect(redis.expire).toHaveBeenCalledExactlyOnceWith(sessionId, 604800)
  })
})

describe('getSession', () => {
  it('should find an existing session', async () => {
    mockJsonGet.mockResolvedValueOnce(mockSingleSessionWithId)

    await getSession(mockSingleSessionWithId.sessionId)

    expect(redis.json.get).toHaveBeenCalledExactlyOnceWith(mockSingleSessionWithId.sessionId)
  })

  it('should return null if session does not exist', async () => {
    mockJsonGet.mockResolvedValueOnce(null)

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
    const token1 = mockSingleSessionWithId.tokenHistory[2].accessToken.value
    const token2 = mockSingleSessionWithId.tokenHistory[1].refreshToken.value

    const result1 = findTokenPair(mockSingleSessionWithId, token1, 'access')
    const result2 = findTokenPair(mockSingleSessionWithId, token2, 'refresh')

    expect(result1).toBeDefined()
    expect(result2).toBeDefined()
  })

  it('should return undefined if token is not found', () => {
    const token = 'invalid-token'
    const result = findTokenPair(mockSingleSessionWithId, token, 'access')
    expect(result).toBeUndefined()
  })
})

describe('findUserSession', () => {
  it('should return object with id and value of session', async () => {
    const rawSessionId = mockSingleSessionWithId.sessionId.split(':')[1]
    mockFtSearch.mockResolvedValueOnce({
      total: 1,
      documents: [{ id: mockSingleSessionWithId.sessionId, value: mockSingleSessionWithId }],
    })

    const result = await findUserSession('66e17e663bb5c2b01f42eb30', 'device-info')
    expect(result).toEqual({ id: rawSessionId, value: mockSingleSessionWithId })
  })

  it('should return null if no documents are found', async () => {
    mockFtSearch.mockResolvedValueOnce({
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

describe('checkRevokedCredentials', () => {
  const { sessionId, tokenHistory } = mockSingleSessionWithId

  it('should return true if token has been revoked', async () => {
    mockJsonGet.mockResolvedValue(mockSingleSessionWithId)

    const result1 = await checkRevokedCredentials(
      sessionId,
      tokenHistory[1].accessToken.value,
      'access',
    )
    const result2 = await checkRevokedCredentials(
      sessionId,
      tokenHistory[1].refreshToken.value,
      'refresh',
    )
    const result3 = await checkRevokedCredentials(
      sessionId,
      tokenHistory[2].accessToken.value,
      'access',
    )

    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(result3).toBe(true)
  })

  it('should return false if credentials are not revoked', async () => {
    mockJsonGet.mockResolvedValue(mockSingleSessionWithId)

    const result1 = await checkRevokedCredentials(
      sessionId,
      tokenHistory[0].accessToken.value,
      'access',
    )
    const result2 = await checkRevokedCredentials(
      sessionId,
      tokenHistory[0].refreshToken.value,
      'refresh',
    )

    expect(result1).toBe(false)
    expect(result2).toBe(false)
  })

  it('should throw an error if token is not found in session history', async () => {
    mockJsonGet.mockResolvedValue(mockSingleSessionWithId)

    const checkRevokedMalformedToken1 = async () =>
      await checkRevokedCredentials(sessionId, 'invalid-token', 'access')
    const checkRevokedMalformedToken2 = async () =>
      await checkRevokedCredentials(sessionId, tokenHistory[2].accessToken.value, 'refresh')

    await expect(checkRevokedMalformedToken1()).rejects.toThrow('Token not in session')
    await expect(checkRevokedMalformedToken2()).rejects.toThrow('Token not in session')
  })
})

describe('addToHistory', () => {
  const { userId, sessionId } = mockSingleSessionWithId

  it('should add a token as the first item in the session history and update session expiresAt', async () => {
    mockJsonGet.mockResolvedValueOnce(mockSingleSessionWithId)
    const tokenPair = generateTokens(userId, sessionId)

    const result = await addToHistory(sessionId, tokenPair)

    expect(result.tokenHistory[0]).toEqual({
      accessToken: { value: hash(tokenPair.accessToken), status: 'valid' },
      refreshToken: { value: hash(tokenPair.refreshToken), status: 'valid' },
      createdAt: expect.any(String),
    })
    expect(result.expiresAt).not.toEqual(mockSingleSessionWithId.expiresAt)
  })

  it('should revoke the previous token pair', async () => {
    mockJsonGet.mockResolvedValueOnce(mockSingleSessionWithId)
    const tokenPair = generateTokens(userId, sessionId)

    const result = await addToHistory(sessionId, tokenPair)

    expect(result.tokenHistory[1]).toEqual({
      ...mockSingleSessionWithId.tokenHistory[0],
      accessToken: { ...mockSingleSessionWithId.tokenHistory[0].accessToken, status: 'revoked' },
      refreshToken: { ...mockSingleSessionWithId.tokenHistory[0].refreshToken, status: 'revoked' },
    })
  })

  it('should forward the same updated session to redis and update key TTL', async () => {
    mockJsonGet.mockResolvedValueOnce(mockSingleSessionWithId)
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
  const { sessionId } = mockSingleSessionWithId

  it('should revoke all tokens for a session and forward the updated session to redis', async () => {
    mockJsonGet.mockResolvedValueOnce(mockSingleSessionWithId)

    await revokeAllTokens(sessionId)

    expect(redis.json.set).toHaveBeenCalledExactlyOnceWith(`session:${sessionId}`, '$', {
      ...mockSingleSessionWithId,
      tokenHistory: mockSingleSessionWithId.tokenHistory.map((token: TokenHistory) => ({
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
