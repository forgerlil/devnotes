import { hash } from '@/utils/hash.js'

describe('hash', () => {
  it('should hash a text', () => {
    const text = 'test'
    const hashedText = hash(text)

    expect(hashedText).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
  })

  it('should hash a text with a different algorithm', () => {
    const text = 'test'
    const hashedText = hash(text, 'sha1')

    expect(hashedText).toBe('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3')
  })

  it('should throw an error with an empty text', () => {
    const text = ''
    const hashedText = () => hash(text)

    expect(hashedText).toThrow('Invalid input')
  })

  it('should throw an error with an invalid algorithm', () => {
    const text = 'test'
    const hashedText = () => hash(text, 'invalid')

    expect(hashedText).toThrow('Digest method not supported')
  })
})
