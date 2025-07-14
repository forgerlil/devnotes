import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { validate } from '@/utils/validate'
import { AuthResponse } from '@/types/userValidation.types'
import { toastError, toastSuccess } from '@/lib/toastify'

export const loginAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')
}
