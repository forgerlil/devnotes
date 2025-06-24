import { useEffect, useState } from 'react'
import { TiMail } from 'react-icons/ti'
import { IoKeyOutline } from 'react-icons/io5'
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { validate } from '@/utils/validate'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    if (error) {
      toast.error(error)
      setError('')
    }
  }, [error])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    if (!validate('password', formData.password, formData)) {
      setError('Incorrect password')
      return
    }

    toast.success('Login successful')
  }

  return (
    <main className='flex justify-center items-center h-screen relative bg-neutral'>
      <img
        src='/photo-1517842645767-c639042777db.avif'
        alt='logo'
        className='w-full h-full object-cover absolute top-0 left-0 blur-lg'
        draggable={false}
      />
      <div className='card w-[448px] shadow-sm bg-base-300/85'>
        <div className='card-body'>
          <h1 className='text-3xl font-thin tracking-wide text-center mb-12'>Login</h1>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit} noValidate>
            <label className='input input-lg w-full validator'>
              <TiMail size={24} className='opacity-50' />
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <div className='validator-hint hidden -mt-2'>Enter valid email address</div>
            <div className='relative flex items-center flex-wrap gap-2'>
              <label className='input input-lg w-full'>
                <IoKeyOutline size={20} className='opacity-50' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>
              {showPassword ? (
                <FaRegEyeSlash
                  size={20}
                  className='w-fit h-[90%] absolute z-10 p-3 right-1 bg-base-100 text-gray-400 hover:cursor-pointer'
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <FaRegEye
                  size={20}
                  className='w-fit h-[90%] absolute z-10 p-3 right-1 bg-base-100 text-gray-400 hover:cursor-pointer'
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>
            <button className='btn btn-primary btn-block my-10' type='submit'>
              Login
            </button>
          </form>
          <p className='text-center text-sm text-base-content font-thin'>
            Don't have an account?{' '}
            <a className='link link-primary link-hover font-bold' href='/register'>
              Register
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Login
