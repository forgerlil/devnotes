import { createBrowserRouter } from 'react-router'
import App from '@/App'
import { Login, Register, NoteDashboard } from '@/pages'
import { loginAction } from '@/actions/login'

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
  {
    path: 'login',
    Component: Login,
    action: loginAction,
  },
  {
    path: 'register',
    Component: Register,
  },
  {
    path: 'notes/:id',
    Component: NoteDashboard,
  },
])

export default router
