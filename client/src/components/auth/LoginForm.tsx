import { useState } from 'react'
import { Form } from 'react-router'
import { TiMail } from 'react-icons/ti'
import { IoKeyOutline } from 'react-icons/io5'
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa'
import { Link } from 'react-router'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <main className='flex-1 my-8 md:mt-12 px-2 xs:flex xs:justify-center'>
      <div className='card w-full h-fit xs:w-[448px] shadow-sm bg-base-100/75'>
        <div className='card-body'>
          <h1 className='text-3xl font-thin tracking-wide text-center mb-12 font-title'>Login</h1>
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

export default LoginForm
