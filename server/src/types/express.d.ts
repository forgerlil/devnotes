declare module 'express' {
  interface Request {
    decoded?: { userId: string; sessionId: string }
  }
}

export {}
