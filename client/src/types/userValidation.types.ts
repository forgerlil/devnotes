export interface LoginValidation {
  email: {
    valid: boolean | null
    message: string
    dirty: boolean
  }
  password: {
    valid: boolean | null
    messages: Record<string, boolean>
    dirty: boolean
  }
}

export interface RegisterValidation extends LoginValidation {
  confirmPassword: {
    valid: boolean | null
    message: string
    dirty: boolean
  }
}

export interface AuthResponse {
  message?: string
}

export interface User {
  _id: string
  email: string
}
