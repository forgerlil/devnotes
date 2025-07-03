import { createHash } from 'crypto'

export const hash = (token: string, algorithm: string = 'sha256') => {
  if (!token) throw new Error('Invalid input')
  return createHash(algorithm).update(token).digest('hex')
}
