export default {
  port: process.env.PORT || '8000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI,
  redisUri: process.env.REDIS_URI,
  dbName: process.env.DB_NAME || 'test',
  jwtSecret: process.env.JWT_SECRET,
}
