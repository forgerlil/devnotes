import { createClient, SCHEMA_FIELD_TYPE } from 'redis'
import configs from '@/configs/index.js'

const client = createClient({
  url: configs.redisUri,
})

client.on('connect', () => console.log('Redis Client Connected'))
client.on('error', (err) => console.log('Redis Client Error', err))
await client.connect()

try {
  await client.ft.create(
    'idx:sessions',
    {
      '$.sessionId': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'sessionId',
      },
      '$.userId': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'userId',
      },
      '$.deviceInfo': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'deviceInfo',
      },
      '$.tokenHistory[*].accessToken.value': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'accessToken.value',
      },
      '$.tokenHistory[*].refreshToken.value': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'refreshToken.value',
      },
      '$.tokenHistory[*].createdAt': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'tokenCreatedAt',
      },
      '$.expiresAt': {
        type: SCHEMA_FIELD_TYPE.TEXT,
        AS: 'expiresAt',
      },
    },
    {
      ON: 'JSON',
      PREFIX: 'session:',
    },
  )
  console.log('Index created')
} catch (error) {
  if (!((error as Error).message === 'Index already exists')) console.log(error)
}

export default client
