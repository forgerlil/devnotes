import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Slide, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { router } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer
      position='top-center'
      autoClose={3000}
      hideProgressBar
      closeButton={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      pauseOnHover
      theme='light'
      transition={Slide}
    />
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
    </QueryClientProvider>
  </StrictMode>
)
