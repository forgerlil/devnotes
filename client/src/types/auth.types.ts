// General Types
export interface User {
  _id: string
  email: string
}

// Validation
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

// Stores
export type AuthStore = {
  token: string | null
  user: User | null
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
}

export type LoaderStore = {
  loadingProgress: number
  setLoadingProgress: (progress: number) => void
}

// Actions
export interface AuthResponse {
  message?: string
}

export type LoginResponse = {
  error: string | null
  data: AuthResponse | null
}
