import { toast } from 'react-toastify'

export const toastError = (message: string) => {
  toast.error(message, {
    className: '!bg-base-300/75 !backdrop-blur-xl',
  })
}

export const toastSuccess = (message: string) => {
  toast.success(message, {
    className: '!bg-base-300/75 !backdrop-blur-xl',
  })
}
