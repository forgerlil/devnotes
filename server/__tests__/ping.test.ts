import request from 'supertest'
import app from '@/index.js'

describe('GET /api/ping', () => {
  it('should return 200 and "pong"', async () => {
    const res = await request(app).get('/api/ping')

    expect(res.status).toBe(200)
    expect(res.text).toBe('pong')
  })
})
