export default {
  port: process.env.PORT || '8000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017',
}
