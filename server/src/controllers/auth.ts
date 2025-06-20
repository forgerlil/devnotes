import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { getCollection } from '@/db/mongo.js'
import ErrorHandler from '@/utils/errorHandler.js'
import { User } from '@/types/auth.types.js'
import { addToHistory, createSession, findUserSession } from '@/utils/auth/redis.js'
import { hash } from '@/utils/hash.js'
import { generateTokens } from '@/utils/auth/tokens.js'

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      ip,
      headers: { 'user-agent': userAgent },
    } = req
    const { email, password } = req.body

    if (!ip || !userAgent || !email || !password)
      throw new ErrorHandler('Insufficient request data', 400)

    const deviceInfo = hash(ip + userAgent)
    const collection = await getCollection('users')
    const user = await collection.findOne<User>({ email })

    if (user) throw new ErrorHandler('User already exists', 400)

    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle session & user creation, ensure both are successful
    let newUser
    let accessToken
    let refreshToken
    try {
      newUser = await collection.insertOne({ email, password: hashedPassword })

      const { accessToken: AT, refreshToken: RT } = await createSession(
        newUser.insertedId.toString(),
        deviceInfo,
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
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).end()
  } catch (error) {
    res.clearCookie('refresh_token')
    next(error)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.decoded) {
      res.sendStatus(200)
      return
    }

    const {
      ip,
      headers: { 'user-agent': userAgent },
    } = req
    const { email, password } = req.body
    if (!ip || !userAgent || !email || !password)
      throw new ErrorHandler('Insufficient request data', 400)

    const deviceInfo = hash(ip + userAgent)
    const collection = await getCollection('users')
    const user = await collection.findOne<User>({ email })
    if (!user) throw new ErrorHandler('User not found', 400)
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new ErrorHandler('Invalid password', 400)

    // see if user has session for this device but sent no credentials (ie. cookie cleanup)
    const findSessionByDevice = await findUserSession(user._id.toString(), deviceInfo)
    let accessToken: string
    let refreshToken: string

    if (!findSessionByDevice) {
      const tokens = await createSession(user._id.toString(), deviceInfo)
      accessToken = tokens.accessToken
      refreshToken = tokens.refreshToken
    } else {
      const tokens = generateTokens(user._id.toString(), findSessionByDevice.id)
      accessToken = tokens[0]
      refreshToken = tokens[1]
      await addToHistory(findSessionByDevice.id, accessToken, refreshToken)
    }

    res.set('Authorization', `Bearer ${accessToken}`)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).end()
  } catch (error) {
    res.clearCookie('refresh_token')
    next(error)
  }
}

export { signUp, login }
