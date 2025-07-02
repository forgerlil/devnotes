import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from '@/pages/Login'

describe('Login page', () => {
  beforeEach(() => {
    render(<Login />)
  })

  it('should render the Login page', () => {
    expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
  })
})
