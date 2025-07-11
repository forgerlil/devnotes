import { Mock } from 'vitest'
import { Response } from 'express'

export type MockedResponse = Response & {
  clearCookie: Mock
  cookie: Mock
  set: Mock
}
