import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { getCollection } from '@/db/index.js'

const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const collection = await getCollection('users', 'devnotes')
  const user = await collection.findOne({ email })

  if (user) {
    res.status(400).json({ message: 'User already exists' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await collection.insertOne({ email, password: hashedPassword })
  res.status(201).json(newUser)
}

export { signUp }
