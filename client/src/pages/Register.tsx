import { useEffect, useState } from 'react'
import { TiMail } from 'react-icons/ti'
import { IoKeyOutline } from 'react-icons/io5'
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa'
import { validate } from '@/utils/validate'
import { RegisterValidation, LoginResponse } from '@/types/auth.types'
import { toastError, toastSuccess } from '@/lib/toastify'
import { Link, Form, useActionData, useNavigate } from 'react-router'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const actionData = useActionData<LoginResponse>()
  const navigate = useNavigate()

  const [validation, setValidation] = useState<RegisterValidation>({
    email: {
      valid: true,
      message: 'Invalid email format',
      dirty: false,
    },
    password: {
      valid: true,
      messages: {
        'Have at least 8 characters': false,
        'Have at least one number (0-9)': false,
        'Have at least one lowercase letter (a-z)': false,
        'Have at least one uppercase letter (A-Z)': false,
        'Have at least one special character (@$!%*?&)': false,
      },
      dirty: false,
    },
    confirmPassword: {
      valid: true,
      message: 'Passwords do not match',
      dirty: false,
    },
  })

  useEffect(() => {
    if (actionData) {
      if (actionData.error) toastError(actionData.error)
      else {
        toastSuccess(actionData.data?.message || 'Welcome!')
        void navigate('/notes/1')
      }
    }
  }, [actionData, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Handle password validation on change for updating message styles
    if (name === 'password') {
      const hasNums = validate('containsNumbers', value)
      const hasLowercase = validate('containsLowercaseLetters', value)
      const hasUppercase = validate('containsUppercaseLetters', value)
      const hasSpecial = validate('containsSpecialCharacters', value)
      const hasLength = value.length >= 8

      setValidation((prev) => ({
        ...prev,
        password: {
          ...prev.password,
          messages: {
            'Have at least 8 characters': hasLength,
            'Have at least one number (0-9)': hasNums,
            'Have at least one lowercase letter (a-z)': hasLowercase,
            'Have at least one uppercase letter (A-Z)': hasUppercase,
            'Have at least one special character (@$!%*?&)': hasSpecial,
          },
        },
      }))
    }

    if (name === 'confirmPassword') {
      setValidation((prev) => ({
        ...prev,
        confirmPassword: {
          ...prev.confirmPassword,
          valid: value === formData.password && value.length > 0,
        },
      }))
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Verify password validity on blur
    if (name === 'password') {
      const hasNums = validate('containsNumbers', value)
      const hasLowercase = validate('containsLowercaseLetters', value)
      const hasUppercase = validate('containsUppercaseLetters', value)
      const hasSpecial = validate('containsSpecialCharacters', value)
      const hasLength = value.length >= 8

      const isValid = hasNums && hasLowercase && hasUppercase && hasSpecial && hasLength

      setValidation((prev) => ({
        ...prev,
        password: {
          valid: isValid,
          messages: {
            'Have at least 8 characters': hasLength,
            'Have at least one number (0-9)': hasNums,
            'Have at least one lowercase letter (a-z)': hasLowercase,
            'Have at least one uppercase letter (A-Z)': hasUppercase,
            'Have at least one special character (@$!%*?&)': hasSpecial,
          },
          dirty: true,
        },
        confirmPassword: {
          ...prev.confirmPassword,
          valid: prev.confirmPassword.dirty
            ? value.length > 0 && value === formData.confirmPassword
            : true,
        },
      }))

      return
    }

    setValidation((prev) => ({
      ...prev,
      [name]: {
        ...prev[name as keyof RegisterValidation],
        valid: validate(name, value),
        dirty: true,
      },
    }))
  }

  return (
    <main className='flex justify-center items-center h-screen relative bg-neutral'>
      <img
        src='/photo-1517842645767-c639042777db.avif'
        alt='logo'
        className='w-full h-full object-cover absolute top-0 left-0 blur-lg '
      />
      <div className='card w-[448px] shadow-sm bg-base-300/85'>
        <div className='card-body'>
          <h1 className='text-3xl font-thin tracking-wide text-center mb-12'>Register</h1>
          <Form className='flex flex-col gap-4' method='post'>
            <label
              className={`input input-lg w-full ${
                validation.email.dirty
                  ? validation.email.valid
                    ? 'border-success border-[1px] focus-within:outline-success'
                    : 'border-error border-[1px] focus-within:outline-error'
                  : ''
              }`}
            >
              <TiMail size={24} className='opacity-50' />
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </label>
            {!validation.email.valid && (
              <p className='text-xs text-error'>{validation.email.message}</p>
            )}
            <div className='relative flex items-center gap-2'>
              <label
                className={`input input-lg w-full ${
                  validation.password.dirty
                    ? validation.password.valid
                      ? 'border-success border-[1px] focus-within:outline-success'
                      : 'border-error border-[1px] focus-within:outline-error'
                    : ''
                }`}
              >
                <IoKeyOutline size={20} className='opacity-50' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {showPassword ? (
                <FaRegEyeSlash
                  size={21}
                  className='absolute z-10 w-fit p-3 h-[90%] right-1 bg-base-100 text-gray-400 hover:cursor-pointer'
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <FaRegEye
                  size={20}
                  className='absolute z-10 w-fit p-3 h-[90%] right-1 bg-base-100 text-gray-400 hover:cursor-pointer'
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>
            {!validation.password.valid && (
              <ul className='list-disc list-inside -mt-2'>
                <span className='text-xs text-gray-400'>Passwords must:</span>
                {Object.entries(validation.password.messages).map(([key, value]) => (
                  <li key={key} className={`text-xs ${value ? 'text-success' : 'text-error'}`}>
                    {key}
                  </li>
                ))}
              </ul>
            )}
            <div className='relative flex items-center gap-2'>
              <label
                className={`input input-lg w-full ${
                  validation.confirmPassword.dirty
                    ? validation.confirmPassword.valid
                      ? 'border-success border-[1px] focus-within:outline-success'
                      : 'border-error border-[1px] focus-within:outline-error'
                    : ''
                }`}
              >
                <IoKeyOutline size={20} className='opacity-50' />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  placeholder='Confirm password'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {showConfirmPassword ? (
                <FaRegEyeSlash
                  size={20}
                  className='absolute z-10 w-fit p-3 h-[90%] right-1 bg-base-100 text-gray-400 hover:cursor-pointer'
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                />
              ) : (
                <FaRegEye
                  size={20}
                  className='absolute z-10 w-fit p-3 h-[90%] right-1 bg-base-100 text-gray-400 hover:cursor-pointer'
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                />
              )}
            </div>
            {!validation.confirmPassword.valid && (
              <p className='text-xs text-error'>{validation.confirmPassword.message}</p>
            )}
            <button
              className='btn btn-primary btn-block my-10'
              type='submit'
              disabled={
                !validation.email.valid ||
                !validation.password.valid ||
                !validation.confirmPassword.valid
              }
            >
              Register
            </button>
          </Form>
          <p className='text-center text-sm text-base-content font-thin'>
            Already have an account?{' '}
            <Link to='/login' className='link link-primary link-hover font-bold'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Register
