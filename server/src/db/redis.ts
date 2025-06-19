import { createClient, SCHEMA_FIELD_TYPE } from 'redis'
import configs from '@/configs/index.js'

const client = createClient({
  url: configs.redisUri,
})

client.on('error', (err) => console.log('Redis Client Error', err))
await client.connect()

// try {
//   await client.ft.create(
//     'idx:sessions',
//     {
//       '$.sessionId': {
//         type: SCHEMA_FIELD_TYPE.TEXT,
//         AS: 'sessionId',
//       },
//       '$.userId': {
//         type: SCHEMA_FIELD_TYPE.TEXT,
//         AS: 'userId',
//       },
//       '$.meta.ip': {
//         type: SCHEMA_FIELD_TYPE.TEXT,
//         AS: 'meta.ip',
//       },
//       '$.meta.userAgent': {
//         type: SCHEMA_FIELD_TYPE.TEXT,
//         AS: 'meta.userAgent',
//       },
//       '$.tokenHistory[*].accessToken.value': {
//         type: SCHEMA_FIELD_TYPE.TEXT,
//         AS: 'tokenHistory[*].accessToken.value',
//       },
//       '$.tokenHistory[*].refreshToken.value': {
//         type: SCHEMA_FIELD_TYPE.TEXT,
//         AS: 'tokenHistory[*].refreshToken.value',
//       },
//       '$.tokenHistory[*].createdAt': {
//         type: SCHEMA_FIELD_TYPE.TEXT,
//         AS: 'tokenHistory[*].createdAt',
//       },
//       '$.expiresAt': {
//         type: SCHEMA_FIELD_TYPE.TEXT,
//         AS: 'expiresAt',
//       },
//     },
//     {
//       ON: 'JSON',
//       PREFIX: 'session:',
//     },
//   )
// } catch (error) {
//   console.log(error)
// }

export default client
