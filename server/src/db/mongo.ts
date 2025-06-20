import { MongoClient } from 'mongodb'
import configs from '@/configs/index.js'

const uri = configs.mongoUri
if (!uri) throw new Error('Missing Mongo URI in env variables')

const client = new MongoClient(uri)

const getDB = async (dbName: string = configs.dbName) => {
  const connection = await client.connect()
  console.log('MongoDB Client Connected')
  const db = connection.db(dbName)
  if (!db) throw new Error('Database not found')
  return db
}

const getCollection = async (collectionName: string, dbName?: string) => {
  const db = await getDB(dbName)
  return db.collection(collectionName)
}

export { getDB, getCollection }
