import { Session } from '@/types/auth.types.js'
import { hash } from '@/utils/hash.js'

export const mockSingleSession: Session = {
  userId: '685bf98dac1d2721a96620a0',
  deviceInfo: '19b6c0e2b745ac1ff2ef72d8710df6c889e5e4e913b824352c2b101998a6f6bf',
  tokenHistory: [
    {
      accessToken: {
        value: 'f54386356db0beeebf247a321221f7b814d67e80dee7c908dd6c2509b55a6f87',
        status: 'valid',
      },
      refreshToken: {
        value: '3aa57917c472378692b325c9cc812d1ffa6e55bef5107b820d548d31956dcefc',
        status: 'valid',
      },
      createdAt: '2025-07-04T10:03:46.091Z',
    },
    {
      accessToken: {
        value: '4eba8c0e4c5e88da02dec951df7b22eee215e98e9a1dcd46e2a6959d4beb0acd',
        status: 'revoked',
      },
      refreshToken: {
        value: '03b4cd4ef98d72555d7ebf2ffa9d5726f0d9498bc955c65397b888e53583ec8c',
        status: 'revoked',
      },
      createdAt: '2025-07-04T10:03:44.259Z',
    },
    {
      accessToken: {
        value: '2b456ac001abec7773afbb5608f5861093abe22ef9be3719f367e7a2937c2a86',
        status: 'revoked',
      },
      refreshToken: {
        value: '7a2c1dd791801a46439f2b503a79d91b0bab5b9bc57c5269e56d02d2ec1bb977',
        status: 'revoked',
      },
      createdAt: '2025-07-04T10:02:23.150Z',
    },
  ],
  expiresAt: '2025-07-11T09:57:09.177Z',
}

export const mockSingleSessionWithId: Session & { sessionId: string } = {
  ...mockSingleSession,
  sessionId: 'session:woqwC9-c_Bug3jdvgjMYC',
}

export function createMockSessionFromTokens({
  userId,
  accessToken,
  refreshToken,
  accessStatus = 'valid',
  refreshStatus = 'valid',
  createdAt = new Date().toISOString(),
  additionalHistory = [],
}: {
  userId: string
  accessToken: string
  refreshToken: string
  accessStatus?: 'valid' | 'revoked'
  refreshStatus?: 'valid' | 'revoked'
  createdAt?: string
  additionalHistory?: Session['tokenHistory']
}): Session {
  return {
    userId,
    deviceInfo: '19b6c0e2b745ac1ff2ef72d8710df6c889e5e4e913b824352c2b101998a6f6bf',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    tokenHistory: [
      {
        accessToken: { value: hash(accessToken), status: accessStatus },
        refreshToken: { value: hash(refreshToken), status: refreshStatus },
        createdAt,
      },
      ...additionalHistory,
    ],
  }
}
