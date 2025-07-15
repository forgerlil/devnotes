import { useEffect } from 'react'
import { useActionData, useNavigate } from 'react-router'
import { LoginForm } from '@/components/auth'
import { toastError, toastSuccess } from '@/lib/toastify'
import { LoginResponse } from '@/types/auth.types'

const Login = () => {
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

  return <LoginForm />
}

export default Login
