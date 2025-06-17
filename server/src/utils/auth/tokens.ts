import jwt from 'jsonwebtoken'
import configs from '@/configs/index.js'
import { nanoid } from 'nanoid'

export const generateTokens = (email: string) => {
  const accessToken = jwt.sign({ email }, configs.jwtSecret as string, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ token: nanoid() }, configs.jwtSecret as string, {
    expiresIn: '7d',
  })
  return { accessToken, refreshToken }
}
