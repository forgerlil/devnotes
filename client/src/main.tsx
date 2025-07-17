import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Slide, ToastContainer } from 'react-toastify'
import router from './routes'
import ThemeProvider from './context/ThemeProvider'

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
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
