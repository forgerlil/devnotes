import { Session } from '@/types/auth.types.js'

export const mockSingleSession: Session & { sessionId: string } = {
  sessionId: 'session:woqwC9-c_Bug3jdvgjMYC',
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
      createdAt: new Date('2025-07-04T10:03:46.091Z'),
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
      createdAt: new Date('2025-07-04T10:03:44.259Z'),
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
      createdAt: new Date('2025-07-04T10:02:23.150Z'),
    },
  ],
  expiresAt: new Date('2025-07-11T09:57:09.177Z'),
}

export const mockMultipleSessions: (Session & { sessionId: string })[] = [
  mockSingleSession,
  {
    sessionId: 'session:fDeRcCkK-v1xGYCzkDapC',
    userId: '685bf98dac1d2721a96620a0',
    deviceInfo: 'fd88dcb8c50feeb9a950628935d4e12cb1e06519328116c961c2d3d70747690c',
    tokenHistory: [
      {
        accessToken: {
          value: '62e1a1c0ce986f559e6313e846813aadc6ecda49b65e2b9497b3b6ca7ed663bb',
          status: 'valid',
        },
        refreshToken: {
          value: '28a465ffd0925d8cbb69ecf49d27cdc2a6258e0ac9c93767305d72fa334696d7',
          status: 'valid',
        },
        createdAt: new Date('2025-07-04T10:04:35.395Z'),
      },
      {
        accessToken: {
          value: '16000f01fdb610dbcdc0257271fdef0b6ad90f29fa319c6422cf11ca26a2ec3e',
          status: 'revoked',
        },
        refreshToken: {
          value: '34cb478989631bd1c094e3e38f0f2fe793a693a9ba98e835405f965bb8a776a6',
          status: 'revoked',
        },
        createdAt: new Date('2025-07-04T10:04:13.636Z'),
      },
    ],
    expiresAt: new Date('2025-07-11T09:57:09.177Z'),
  },
  {
    sessionId: 'session:VdNSlIxKLukrBmpxXnHZ9',
    userId: '685411e9b8c16573bedf4fa7',
    deviceInfo: 'fd88dcb8c50feeb9a950628935d4e12cb1e06519328116c961c2d3d70747690c',
    tokenHistory: [
      {
        accessToken: {
          value: '69081e04f17dbcdb3d4aa41193268761fd6ed234b14fe338d94fe730b50b605c',
          status: 'valid',
        },
        refreshToken: {
          value: '42b94b47a9c302ba0886f9b3128beb66623f5c5f4f2826fcba62f9e7ebcc5c83',
          status: 'valid',
        },
        createdAt: new Date('2025-07-04T10:10:02.339Z'),
      },
    ],
    expiresAt: new Date('2025-07-11T09:57:09.177Z'),
  },
]
