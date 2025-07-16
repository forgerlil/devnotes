import { useLocation, Outlet } from 'react-router'
import NavBar from '@/components/generic/NavBar'

const PublicLayout = () => {
  const { pathname } = useLocation()

  const menuItems: Record<string, { primary?: boolean; content: string; to: string }[]> = {
    '/': [
      {
        primary: true,
        content: 'Login',
        to: '/login',
      },
      {
        content: 'Register',
        to: '/register',
      },
    ],
    '/login': [
      {
        content: 'Register',
        to: '/register',
      },
    ],
    '/register': [
      {
        content: 'Login',
        to: '/login',
      },
    ],
  }

  const menu = menuItems[pathname] || menuItems['/']

  return (
    <div className='min-h-screen relative flex flex-col'>
      <img
        src='/photo-1517842645767-c639042777db.avif'
        alt='logo'
        className='w-full h-full object-cover absolute top-0 left-0 blur-lg -z-10'
        draggable={false}
      />
      <NavBar>
        <NavBar.DesktopMenu>
          {menu.map((item) => (
            <NavBar.MenuItem key={`${item.to}-navbar-desktop`} to={item.to} primary={item.primary}>
              {item.content}
            </NavBar.MenuItem>
          ))}
        </NavBar.DesktopMenu>
        <NavBar.MobileMenu>
          {menu.map((item) => (
            <NavBar.MenuItem key={`${item.to}-navbar-mobile`} to={item.to} primary={item.primary}>
              {item.content}
            </NavBar.MenuItem>
          ))}
        </NavBar.MobileMenu>
      </NavBar>
      <Outlet />
    </div>
  )
}

export default PublicLayout
