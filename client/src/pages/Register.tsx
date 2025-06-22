import { useState } from 'react'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    console.log(formData)
  }

  return (
    <main className='flex justify-center items-center h-screen'>
      <div className='card w-[448px] bg-base-300 shadow-sm'>
        <div className='card-body'>
          <h1 className='text-3xl font-bold text-center mb-12'>Register</h1>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <label className='input input-lg validator w-full'>
              <svg
                className='h-[1em] opacity-50'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
              >
                <g
                  strokeLinejoin='round'
                  strokeLinecap='round'
                  strokeWidth='2.5'
                  fill='none'
                  stroke='currentColor'
                >
                  <rect width='20' height='16' x='2' y='4' rx='2'></rect>
                  <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'></path>
                </g>
              </svg>
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <div className='validator-hint hidden'>Enter valid email address</div>
            <label className='input input-lg validator w-full'>
              <svg
                className='h-[1em] opacity-50'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
              >
                <g
                  strokeLinejoin='round'
                  strokeLinecap='round'
                  strokeWidth='2.5'
                  fill='none'
                  stroke='currentColor'
                >
                  <path d='M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z'></path>
                  <circle cx='16.5' cy='7.5' r='.5' fill='currentColor'></circle>
                </g>
              </svg>
              <input
                type='password'
                name='password'
                placeholder='Password'
                minLength={8}
                pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
                title='Must be more than 8 characters, including number, lowercase letter, uppercase letter'
              />
            </label>
            <p className='validator-hint hidden'>
              Must be more than 8 characters, including
              <br />
              At least one number <br />
              At least one lowercase letter <br />
              At least one uppercase letter
            </p>
            <label className='input input-lg validator w-full'>
              <svg
                className='h-[1em] opacity-50'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
              >
                <g
                  strokeLinejoin='round'
                  strokeLinecap='round'
                  strokeWidth='2.5'
                  fill='none'
                  stroke='currentColor'
                >
                  <path d='M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z'></path>
                  <circle cx='16.5' cy='7.5' r='.5' fill='currentColor'></circle>
                </g>
              </svg>
              <input
                type='password'
                name='confirmPassword'
                placeholder='Confirm password'
                minLength={8}
                pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
                title='Must be more than 8 characters, including number, lowercase letter, uppercase letter'
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </label>
            <p className='validator-hint hidden'>Passwords do not match</p>
            <button className='btn btn-primary btn-block my-10' type='submit'>
              Register
            </button>
          </form>
          <p className='text-center text-sm text-gray-500'>
            Already have an account?{' '}
            <a className='text-primary font-bold' href='/login'>
              Login
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Register
