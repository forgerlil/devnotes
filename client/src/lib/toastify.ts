import { Slide, toast, ToastOptions } from 'react-toastify'

const toastConfig: ToastOptions = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: true,
  closeButton: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  transition: Slide,
  className: 'w-fit bg-base-100 text-base-content shadow-none',
}

export const toastSuccess = (message: string) => {
  toast.success(message, toastConfig)
}

export const toastError = (message: string) => {
  toast.error(message, toastConfig)
}
