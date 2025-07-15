export const validate = (name: string, value: string, formData?: Record<string, string>) => {
  switch (name) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    case 'password':
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
    case 'containsNumbers':
      return /\d/.test(value)
    case 'containsLowercaseLetters':
      return /[a-z]/.test(value)
    case 'containsUppercaseLetters':
      return /[A-Z]/.test(value)
    case 'containsSpecialCharacters':
      return /[@$!%*?&]/.test(value)
    case 'confirmPassword':
      return value === formData?.password
    default:
      return false
  }
}
