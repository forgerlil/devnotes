import axios from 'axios'
import { useNavigate } from 'react-router'

const NoteDashboard = () => {
  const navigate = useNavigate()

  const logout = async () => {
    //await axios.post('/api/logout')
    await navigate('/login')
  }

  return (
    <div>
      <h1>NoteDashboard</h1>
      <p>Notes will be dynamically rendered here!</p>
      <button onClick={logout} className='btn btn-primary'>
        Logout
      </button>
    </div>
  )
}

export default NoteDashboard
