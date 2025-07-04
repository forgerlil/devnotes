import {
  createSession,
  getSession,
  findToken,
  findUserSession,
  addToHistory,
  revokeAllTokens,
} from '@/utils/auth/redis.js'
import redisMock from '../__mocks__/redisClient.js'

vi.mock('@/db/redis.js', () => ({
  default: redisMock,
}))

describe('createSession', () => {
  it('should create a session', () => {})
})

describe('getSession', () => {
  it('should find an existing session', () => {})
})

describe('findToken', () => {
  it('should find an existing token in provided session object', () => {})
})

describe('findUserSession', () => {
  it('should find an existing session for a user', () => {})
})

describe('addToHistory', () => {
  it('should add a token to the session history', () => {})
})

describe('revokeAllTokens', () => {
  it('should revoke all tokens for a session', () => {})
})
