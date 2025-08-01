import axios from 'axios'
import { useNavigate } from 'react-router'
import Avatar from '@/components/generic/Avatar'
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser'
import { useAuthStore } from '@/stores/AuthStore'
import Dropdown from '@/components/generic/Dropdown'

const UserActions = ({ isOpen }: { isOpen: boolean }) => {
  const user = useAuthenticatedUser()
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)

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
    <Dropdown className='w-full'>
      <Dropdown.Header className='justify-start px-0'>
        <Avatar user={user} size={8} />
        <p
          className={`transition-all duration-200 ease-in-out text-sm font-normal truncate ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {user.displayName || user.email}
        </p>
      </Dropdown.Header>
      <Dropdown.Items className='p-4'>
        <Dropdown.Item>
          <button className='btn btn-ghost font-normal w-52'>Settings</button>
        </Dropdown.Item>
        <Dropdown.Item>
          <button className='btn btn-ghost font-normal w-52' onClick={logout}>
            Logout
          </button>
        </Dropdown.Item>
      </Dropdown.Items>
    </Dropdown>
  )
}

export default UserActions
