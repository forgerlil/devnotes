import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { getCollection } from '@/db/mongo.js'
import HTTPError from '@/utils/httpError.js'
import { User } from '@/types/auth.types.js'
import { addToHistory, createSession, findUserSession, deleteSession } from '@/utils/auth/redis.js'
import { hash } from '@/utils/hash.js'
import { generateTokens } from '@/utils/auth/tokens.js'

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      ip,
      headers: { 'user-agent': userAgent, 'true-client-ip': trueClientIp },
    } = req
    const { email, password } = req.body

    if ((!ip && !trueClientIp) || !userAgent || !email || !password)
      throw new HTTPError('Insufficient request data', 400)

    const deviceInfo = hash(
      process.env.NODE_ENV === 'production' ? trueClientIp + userAgent : ip + userAgent,
    )
    const collection = await getCollection('users')
    const user = await collection.findOne<User>({ email }, { projection: { password: 0 } })

    if (user) throw new HTTPError('User already exists', 400)

    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle session & user creation, ensure both are successful
    let newUser
    let newSession
    let accessToken
    let refreshToken
    const sessionId = nanoid()

    try {
      newUser = await collection.insertOne({ email, password: hashedPassword })

      const tokenPair = generateTokens(newUser.insertedId.toString(), sessionId)
      newSession = await createSession({
        userId: newUser.insertedId.toString(),
        deviceInfo,
        tokenPair,
        sessionId,
      })

      accessToken = tokenPair.accessToken
      refreshToken = tokenPair.refreshToken
    } catch (error) {
      if (newUser) await collection.deleteOne({ _id: newUser.insertedId })
      if (newSession) await deleteSession(sessionId)
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
    if (req.cookies.refresh_token) res.clearCookie('refresh_token')
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
      headers: { 'user-agent': userAgent, 'true-client-ip': trueClientIp },
    } = req
    const { email, password } = req.body
    if ((!ip && !trueClientIp) || !userAgent || !email || !password)
      throw new HTTPError('Insufficient request data', 400)

    const deviceInfo = hash(
      process.env.NODE_ENV === 'production' ? trueClientIp + userAgent : ip + userAgent,
    )
    const collection = await getCollection('users')
    const user = await collection.findOne<User>({ email })
    if (!user) throw new HTTPError('User not found', 400)
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw new HTTPError('Invalid password', 400)

    // see if user has session for this device but sent no credentials (ie. cookie cleanup)
    const findSessionByDevice = await findUserSession(user._id.toString(), deviceInfo)
    const sessionId = findSessionByDevice?.id ?? nanoid()
    const tokenPair = generateTokens(user._id.toString(), sessionId)

    if (!findSessionByDevice) {
      await createSession({
        userId: user._id.toString(),
        deviceInfo,
        tokenPair,
        sessionId,
      })
    } else {
      await addToHistory(sessionId, tokenPair)
    }

    res.set('Authorization', `Bearer ${tokenPair.accessToken}`)
    res.cookie('refresh_token', tokenPair.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).end()
  } catch (error) {
    if (req.cookies.refresh_token) res.clearCookie('refresh_token')
    next(error)
  }
}

export { signUp, login }
