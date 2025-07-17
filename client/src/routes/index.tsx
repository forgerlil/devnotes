import { createBrowserRouter } from 'react-router'
import App from '@/App'
import PublicLayout from '@/layouts/PublicLayout'
import { Login, Register, NoteDashboard, NotFound } from '@/pages'
import { loginAction, registerAction, authwall } from '@/actions'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
axios.defaults.withCredentials = true

const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicLayout,
    children: [
      {
        index: true,
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
        action: registerAction,
      },
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
  {
    path: 'notes/:id',
    Component: NoteDashboard,
    loader: authwall,
  },
])

export default router
