import { useEffect, useState } from 'react'
import { Link, Form, useActionData, useNavigate } from 'react-router'
import { TiMail } from 'react-icons/ti'
import { IoKeyOutline } from 'react-icons/io5'
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa'
import { toastError, toastSuccess } from '@/lib/toastify'
import { LoginResponse } from '@/types/auth.types'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const actionData = useActionData<LoginResponse>()
  const navigate = useNavigate()

  useEffect(() => {
    if (actionData) {
      if (actionData.error) toastError(actionData.error)
      else {
        toastSuccess(actionData.data?.message || 'Welcome back!')
        void navigate('/notes/1')
      }
    }
  }, [actionData, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
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
          <Form className='flex flex-col gap-4' method='post'>
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
          </Form>
          <p className='text-center text-sm text-base-content font-thin'>
            Don't have an account?{' '}
            <Link to='/register' className='link link-primary link-hover font-bold'>
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Login
