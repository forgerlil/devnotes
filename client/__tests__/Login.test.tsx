import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { createRoutesStub } from 'react-router'
import { Login, Register, NoteDashboard } from '@/pages'
import { toastError, toastSuccess } from '@/lib/toastify'

vi.mock('@/lib/toastify', () => ({
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}))

const loginRoute = {
  path: '/login',
  Component: Login,
  action: () => {},
}

const registerRoute = {
  path: '/register',
  Component: Register,
}

const notesRoute = {
  path: '/notes/:id',
  Component: NoteDashboard,
}

describe('<Login />', () => {
  afterEach(() => {
    loginRoute.action = () => {}
    vi.resetAllMocks()
  })

  it('should render the Login page', () => {
    const Stub = createRoutesStub([loginRoute])

    render(<Stub initialEntries={['/login']} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
  })

  it('should show error toast if form is submitted with empty fields', async () => {
    loginRoute.action = () => ({
      error: 'Email and password are required',
      data: null,
    })
    const Stub = createRoutesStub([loginRoute])

    render(<Stub initialEntries={['/login']} />)
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Email and password are required')
      expect(toastSuccess).not.toHaveBeenCalled()
    })
  })

  it('shows error toast if fields fail validation', async () => {
    loginRoute.action = () => ({
      error: 'Incorrect username or password, please verify and try again',
      data: null,
    })
    const Stub = createRoutesStub([loginRoute])

    render(<Stub initialEntries={['/login']} />)
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        'Incorrect username or password, please verify and try again'
      )
      expect(toastSuccess).not.toHaveBeenCalled()
    })
  })

  it('shows success toast and redirects to notes page with valid credentials', async () => {
    loginRoute.action = () => ({
      error: null,
      data: null,
    })
    const Stub = createRoutesStub([loginRoute, notesRoute])

    render(<Stub initialEntries={['/login']} />)
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'Password123!')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith('Welcome back!')
    })

    expect(await screen.findByRole('heading', { name: 'NoteDashboard' })).toBeInTheDocument()
  })

  it('redirects to register page on respective link', async () => {
    const Stub = createRoutesStub([loginRoute, registerRoute])

    render(<Stub initialEntries={['/login']} />)
    await userEvent.click(screen.getByRole('link', { name: 'Register' }))

    expect(await screen.findByRole('heading', { name: 'Register' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Login' })).not.toBeInTheDocument()
  })
})
