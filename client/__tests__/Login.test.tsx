import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRoutesStub } from 'react-router'
import { Login, Register, NoteDashboard } from '@/pages'
import { toastError } from '@/lib/toastify'
import { useAuthStore } from '@/stores/AuthStore'

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
    })
  })

  it('shows success toast and redirects to notes page with valid credentials', async () => {
    loginRoute.action = () => ({
      error: null,
      data: null,
    })
    const Stub = createRoutesStub([loginRoute, notesRoute])
    useAuthStore.getState().setUser({
      _id: '68505a07509f48ac99f58b71',
      email: 'test@test.com',
    })

    render(<Stub initialEntries={['/login']} />)
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'Password123!')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'NoteDashboard' })).toBeInTheDocument()
    })
  })

  it('redirects to register page on respective link', async () => {
    const Stub = createRoutesStub([loginRoute, registerRoute])

    render(<Stub initialEntries={['/login']} />)
    await userEvent.click(screen.getByRole('link', { name: 'Register' }))

    expect(await screen.findByRole('heading', { name: 'Register' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Login' })).not.toBeInTheDocument()
  })
})
