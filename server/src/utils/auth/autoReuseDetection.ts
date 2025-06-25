import ErrorHandler from '../errorHandler.js'
import { revokeAllTokens } from './redis.js'

export const autoReuseDetection = async (sessionId: string) => {
  await revokeAllTokens(sessionId)
  console.log(`⚠️ All tokens revoked for session ${sessionId}`)
  throw new ErrorHandler('Invalid token', 401)
}
