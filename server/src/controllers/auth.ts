import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { getCollection } from '@/db/mongo.js'
import ErrorHandler from '@/utils/errorHandler.js'
import { User } from '@/types/auth.types.js'
import { createSession, getSession, revokeAllTokens } from '@/utils/auth/redis.js'

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const collection = await getCollection('users')
    const user = await collection.findOne<User>({ email })

    if (user) throw new ErrorHandler('User already exists', 400)

    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle session & user creation
    let newUser
    let accessToken
    let refreshToken
    try {
      newUser = await collection.insertOne({ email, password: hashedPassword })

      const { accessToken: AT, refreshToken: RT } = await createSession(
        newUser.insertedId.toString(),
        req.ip,
        req.headers['user-agent'],
      )

      accessToken = AT
      refreshToken = RT
    } catch (error) {
      if (newUser) await collection.deleteOne({ _id: newUser.insertedId })
      throw error
    }

    res.set('Authorization', `Bearer ${accessToken}`)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).end()
  } catch (error) {
    next(error)
  }
}

/*
if user has no session (long time since last login), if statement is skipped
  credentials are verified, new session and history are created

if user has session, but no credentials, if statement is skipped

if user has session and credentials, if statement is executed
  credentials are verified, session is updated



*/

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.decoded) return res.sendStatus(200)

    const { email, password } = req.body
    const collection = await getCollection('users')
    const user = await collection.findOne<User>({ email })

    if (!user) throw new ErrorHandler('User not found', 400)

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new ErrorHandler('Invalid password', 400)

    // TODO: check if a session exists but client sent no credentials (cookie cleanup ie.)
    // find session by userId and check matching ip and userAgent

    // TODO#2: add tokens to history
    const { accessToken, refreshToken } = await createSession(
      user._id.toString(),
      req.ip,
      req.headers['user-agent'],
    )

    res.set('Authorization', `Bearer ${accessToken}`)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).end()
  } catch (error) {
    next(error)
  }
}

export { signUp, login }
