import { useAuthStore } from '@/stores/AuthStore'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router'

const NoteDashboard = () => {
  const navigate = useNavigate()
  const { user, token, setUser, setToken } = useAuthStore()

  if (!user) return <Navigate to='/login' />

  // TODO: Move this to action
  const logout = async () => {
    try {
      await axios.post(
        '/api/auth/logout',
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      setUser(null)
      setToken(null)

      await navigate('/login')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1>NoteDashboard</h1>
      <p>Welcome, {user?.email}!</p>
      <p>Notes will be dynamically rendered here!</p>
      <button onClick={logout} className='btn btn-primary'>
        Logout
      </button>
      <Link className='btn btn-primary' to={`/notes/${crypto.randomUUID()}`}>
        Other note
      </Link>
    </div>
  )
}

export default NoteDashboard
