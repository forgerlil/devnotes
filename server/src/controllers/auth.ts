import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { getCollection } from '@/db/index.js'
import ErrorHandler from '@/utils/errorHandler.js'
import { User } from '@/types/user.types.js'
import { generateTokens } from '@/utils/auth/tokens.js'

const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const collection = await getCollection('users')
    const user = await collection.findOne<User>({ email })

    if (user) throw new ErrorHandler('User already exists', 400)

    const hashedPassword = await bcrypt.hash(password, 10)
    await collection.insertOne({ email, password: hashedPassword })

    const { accessToken, refreshToken } = generateTokens(email)
    res.set('Authorization', `Bearer ${accessToken}`)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).end()
  } catch (error) {
    if (error instanceof ErrorHandler) {
      res.status(error.statusCode).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const collection = await getCollection('users')
    const user = await collection.findOne<User>({ email })

    if (!user) throw new ErrorHandler('User not found', 400)

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new ErrorHandler('Invalid password', 400)

    const { accessToken, refreshToken } = generateTokens(email)

    await collection.updateOne({ email }, { $set: { refreshToken } })

    res.set('Authorization', `Bearer ${accessToken}`)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).end()
  } catch (error) {
    if (error instanceof ErrorHandler) {
      res.status(error.statusCode).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export { signUp, login }
