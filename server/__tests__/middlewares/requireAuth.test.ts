import { Request, Response } from 'express'
import requireAuth from '@/middlewares/auth/requireAuth.js'
import ErrorHandler from '@/utils/errorHandler.js'

describe('requireAuth', () => {
  const req = {} as Request
  const res = {} as Response
  const next = vi.fn()

  it('should throw if no decoded property is present', async () => {
    await requireAuth(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler))
    expect(next.mock.calls[0][0].message).toBe('Unauthorised')
    expect(next.mock.calls[0][0].statusCode).toBe(401)
    expect(req.decoded).not.toBeDefined()
  })

  it('should forward the request if decoded property is present', async () => {
    req.decoded = { userId: '123', sessionId: '456' }
    await requireAuth(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
