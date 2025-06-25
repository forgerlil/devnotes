import { createHash } from 'crypto'

export const hash = (token: string, algorithm: string = 'sha256') => {
  return createHash(algorithm).update(token).digest('hex')
}
