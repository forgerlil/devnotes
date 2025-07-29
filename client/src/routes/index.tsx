import { createBrowserRouter } from 'react-router'
import App from '@/App'
import PublicLayout from '@/layouts/PublicLayout'
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
        lazy: async () => {
          const [{ default: Component }, { loginAction }] = await Promise.all([
            import('@/pages/Login'),
            import('@/actions/login'),
          ])
          return { Component, action: loginAction }
        },
      },
      {
        path: 'register',
        lazy: async () => {
          const [{ default: Component }, { registerAction }] = await Promise.all([
            import('@/pages/Register'),
            import('@/actions/register'),
          ])
          return { Component, action: registerAction }
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { default: Component } = await import('@/pages/NotFound')
          return { Component }
        },
      },
    ],
  },
  {
    path: 'notes/:id',
    lazy: async () => {
      const [{ default: Component }, { authwall }] = await Promise.all([
        import('@/pages/NoteDashboard'),
        import('@/actions/authwall'),
      ])
      return { Component, loader: authwall }
    },
  },
])

export default router
