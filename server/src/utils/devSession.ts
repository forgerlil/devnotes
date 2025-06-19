// // This is a temporary session manager for development purposes
// // TODO: move everything related to "sessions" to redis
// import { Session } from '@/types/auth.types.js'

// class DevSession {
//   private sessions: Session[] = []

//   constructor() {
//     this.sessions = []
//   }

//   newSession(session: Session) {
//     this.sessions.push(session)
//   }

//   getSession(sessionId: string) {
//     return this.sessions.find((session) => session.sessionId === sessionId)
//   }

//   get allSessions() {
//     return this.sessions
//   }

//   addTokensToSession(sessionId: string, tokens: { accessToken: string; refreshToken: string }) {
//     const session = this.getSession(sessionId)
//     if (!session) throw new Error('Session not found')
//     this.revokeTokens(sessionId)
//     session.tokenHistory.unshift({
//       accessToken: { value: tokens.accessToken, status: 'valid' },
//       refreshToken: { value: tokens.refreshToken, status: 'valid' },
//       createdAt: new Date(),
//     })
//   }

//   findToken(sessionId: string, tokenValue: string, tokenType: 'accessToken' | 'refreshToken') {
//     const session = this.getSession(sessionId)
//     if (!session) throw new Error('Session not found')
//     return session.tokenHistory.find((token) => token[tokenType].value === tokenValue)
//   }

//   revokeTokens(sessionId: string) {
//     const session = this.getSession(sessionId)
//     if (!session) throw new Error('Session not found')
//     const { accessToken, refreshToken } = session.tokenHistory[0]
//     accessToken.status = 'revoked'
//     refreshToken.status = 'revoked'
//   }

//   revokeAllTokens(sessionId: string) {
//     const session = this.getSession(sessionId)
//     if (!session) throw new Error('Session not found')
//     session.tokenHistory.forEach((token) => {
//       token.accessToken.status = 'revoked'
//       token.refreshToken.status = 'revoked'
//     })
//   }
// }

// export default DevSession
