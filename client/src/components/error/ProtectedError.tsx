import { useNavigate } from 'react-router'
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser'
import AuthwallFallback from '../auth/AuthwallFallback'

const ProtectedError = () => {
  const navigate = useNavigate()
  const user = useAuthenticatedUser()

  if (!user) {
    void navigate('/login', { replace: true })
    return <AuthwallFallback />
  }

  void navigate('/login', { replace: true })
  return <div>Oops! Something went wrong.</div>
}

export default ProtectedError
