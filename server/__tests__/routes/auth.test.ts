import request from 'supertest'
import { ObjectId } from 'mongodb'
import { Application } from 'express'
import { IncomingHttpHeaders } from 'http'
import HTTPError from '@/utils/httpError.js'
import { hash } from '@/utils/hash.js'
import { createMockSessionFromTokens } from '__tests__/__mocks__/redis.js'
import { generateTokens } from '@/utils/auth/tokens.js'

const findOneMock = vi.fn()
const insertOneMock = vi.fn()
const deleteOneMock = vi.fn()
const createSessionMock = vi.fn()
const findUserSessionMock = vi.fn()
const addToHistoryMock = vi.fn()
const checkRevokedCredentialsMock = vi.fn()
const deleteSessionMock = vi.fn()

let app: Application

beforeEach(async () => {
  //vi.spyOn(console, 'log').mockImplementation(() => {})

  vi.doMock('@/db/mongo.js', () => ({
    getCollection: vi.fn().mockResolvedValue({
      findOne: findOneMock,
      insertOne: insertOneMock,
      deleteOne: deleteOneMock,
    }),
  }))

  vi.doMock('@/utils/auth/redis.js', () => ({
    createSession: createSessionMock,
    findUserSession: findUserSessionMock,
    addToHistory: addToHistoryMock,
    checkRevokedCredentials: checkRevokedCredentialsMock,
    deleteSession: deleteSessionMock,
  }))

  const appModule = await import('@/index.js')
  app = appModule.default
})

afterEach(() => {
  vi.resetModules()
  vi.resetAllMocks()
})

describe('POST /api/auth/signup', async () => {
  let headers: IncomingHttpHeaders

  beforeEach(() => {
    headers = {
      ip: '123.45.67.89',
      'user-agent': 'test-user-agent',
      'content-type': 'application/json',
    }
  })

  it('should return a 201 status code and tokens when given valid new user credentials', async () => {
    findOneMock.mockResolvedValue(null)
    insertOneMock.mockResolvedValue({ insertedId: new ObjectId().toString() })

    const body = {
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    }

    const res = await request(app).post('/api/auth/signup').set(headers).send(body)

    expect(res.headers['authorization']).toBeDefined()
    expect(res.headers['set-cookie']).toBeDefined()
    expect(res.headers['set-cookie'][0]).toContain('refresh_token')
    expect(res.body).toEqual({})
    expect(res.status).toBe(201)
  })

  it('should return a 400 status code and error message when given existing user credentials', async () => {
    findOneMock.mockResolvedValue({
      _id: new ObjectId().toString(),
      email: 'test@test.com',
    })

    const body = {
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    }

    const res = await request(app).post('/api/auth/signup').set(headers).send(body)

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ message: 'User already exists' })
    expect(res.headers['authorization']).toBeUndefined()
    expect(res.headers['set-cookie']).toBeUndefined()
  })

  it('should reject invalid credentials', async () => {
    const body1 = {
      email: 'test@test',
      password: 'Password!',
      confirmPassword: 'Password!',
    }
    const body2 = {
      email: 'test@test.com',
      password: 'Password1234!',
    }
    const body3 = {
      email: 'test@test.com',
      password: 'Password!',
      confirmPassword: 'p4ssW0rd@',
    }

    const res1 = await request(app).post('/api/auth/signup').set(headers).send(body1)
    const res2 = await request(app).post('/api/auth/signup').set(headers).send(body2)
    const res3 = await request(app).post('/api/auth/signup').set(headers).send(body3)

    expect(res1.status).toBe(400)
    expect(res2.status).toBe(400)
    expect(res3.status).toBe(400)
    expect(res1.body.errors).toHaveLength(2)
    expect(res2.body.errors).toHaveLength(1)
    expect(res3.body.errors).toHaveLength(2)
    expect(res1.headers['authorization']).toBeUndefined()
    expect(res1.headers['set-cookie']).toBeUndefined()
    expect(res2.headers['authorization']).toBeUndefined()
    expect(res2.headers['set-cookie']).toBeUndefined()
    expect(res3.headers['authorization']).toBeUndefined()
    expect(res3.headers['set-cookie']).toBeUndefined()
    expect(findOneMock).not.toHaveBeenCalled()
    expect(insertOneMock).not.toHaveBeenCalled()
  })

  it('should delete db insertions if session creation fails', async () => {
    findOneMock.mockResolvedValue(null)
    insertOneMock.mockResolvedValue({ insertedId: new ObjectId().toString() })
    createSessionMock.mockRejectedValue(new HTTPError('Redis error', 500))

    const body = {
      email: 'test@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    }

    const res = await request(app).post('/api/auth/signup').set(headers).send(body)

    expect(res.status).toBe(500)
    expect(deleteOneMock).toHaveBeenCalledOnce()
    expect(deleteSessionMock).not.toHaveBeenCalled()
    expect(res.headers['authorization']).toBeUndefined()
    expect(res.headers['set-cookie']).toBeUndefined()
  })
})

describe('POST /api/auth/login', async () => {
  let headers: IncomingHttpHeaders

  beforeEach(() => {
    headers = {
      ip: '123.45.67.89',
      'user-agent': 'test-user-agent',
      'content-type': 'application/json',
    }
  })

  it('should return 200 and tokens when given valid user credentials and no session', async () => {
    findOneMock.mockResolvedValue({
      _id: new ObjectId().toString(),
      email: 'test@test.com',
      password: '$2b$10$UbLyPIMXAjNl6yr3AgcvnOj7H5/bhdOXXuDQw9QuVsdF1p3Wq4r86',
    })

    const body = {
      email: 'test@test.com',
      password: 'Passw0rd!',
    }

    const res = await request(app).post('/api/auth/login').set(headers).send(body)

    expect(res.headers['authorization']).toContain('Bearer')
    expect(res.headers['set-cookie']).toBeDefined()
    expect(res.headers['set-cookie'][0]).toContain('refresh_token')
    expect(res.body).toEqual({})
    expect(res.status).toBe(200)
  })

  it('should return 200 and append tokens to existing session', async () => {
    findOneMock.mockResolvedValue({
      _id: new ObjectId().toString(),
      email: 'test@test.com',
      password: '$2b$10$UbLyPIMXAjNl6yr3AgcvnOj7H5/bhdOXXuDQw9QuVsdF1p3Wq4r86',
    })
    findUserSessionMock.mockResolvedValue({
      id: '123',
      value: {
        userId: new ObjectId().toString(),
        deviceInfo: hash(headers.ip! + headers['user-agent']!),
      },
    })

    const body = {
      email: 'test@test.com',
      password: 'Passw0rd!',
    }

    const res = await request(app).post('/api/auth/login').set(headers).send(body)

    expect(findUserSessionMock).toHaveBeenCalledOnce()
    expect(addToHistoryMock).toHaveBeenCalledOnce()
    expect(createSessionMock).not.toHaveBeenCalled()
    expect(res.headers['authorization']).toContain('Bearer')
    expect(res.headers['set-cookie']).toBeDefined()
    expect(res.headers['set-cookie'][0]).toContain('refresh_token')
    expect(res.body).toEqual({})
    expect(res.status).toBe(200)
  })

  it('should return 400 and error message when given incorrect credentials', async () => {
    findOneMock.mockResolvedValueOnce({
      _id: new ObjectId().toString(),
      email: 'test@test.com',
      password: '$2b$10$UbLyPIMXAjNl6yr3AgcvnOj7H5/bhdOXXuDQw9QuVsdF1p3Wq4r86',
    })

    const body = {
      email: 'test@test.com',
      password: 'Password123!',
    }

    const res = await request(app).post('/api/auth/login').set(headers).send(body)

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ message: 'Invalid password' })
    expect(res.headers['authorization']).toBeUndefined()
    expect(res.headers['set-cookie']).toBeUndefined()
    expect(findOneMock).toHaveBeenCalledOnce()
  })
})

describe('POST /api/auth/logout', async () => {
  let headers: IncomingHttpHeaders
  const userId = '68505a07509f48ac99f58b71'
  const sessionId = '68505a07509f48ac99f58b71'

  beforeEach(() => {
    headers = {
      ip: '123.45.67.89',
      'user-agent': 'test-user-agent',
      'content-type': 'application/json',
    }
  })

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).post('/api/auth/logout')
    expect(res.status).toBe(401)
  })

  // WIP - mock redis deleteSession & session object
  it('should return 204 if a valid token is provided', async () => {
    const { accessToken, refreshToken } = generateTokens(userId, sessionId)
    const session = createMockSessionFromTokens({ userId, accessToken, refreshToken })
    headers.authorization = `Bearer ${accessToken}`
    headers.cookie = `refresh_token=${refreshToken}`

    checkRevokedCredentialsMock.mockResolvedValueOnce(false)
    findUserSessionMock.mockResolvedValueOnce(session)
    deleteSessionMock.mockResolvedValueOnce(1)

    const res = await request(app).post('/api/auth/logout').set(headers)

    expect(deleteSessionMock).toHaveBeenCalledOnce()
    expect(res.headers['set-cookie'][0]).toContain('refresh_token')
    expect(res.status).toBe(204)
  })
})
