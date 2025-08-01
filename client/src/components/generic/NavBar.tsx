import { Link } from 'react-router'
import { CiMenuKebab } from 'react-icons/ci'
import { useEffect, useState } from 'react'
import logo from '/logo.svg'
import ThemeToggle from './ThemeToggle'
import Dropdown from './Dropdown'

const MobileMenu = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dropdown className='dropdown-end sm:hidden'>
      <Dropdown.Header>
        <CiMenuKebab />
      </Dropdown.Header>
      <Dropdown.Items>
        {children}
        <Dropdown.Item>
          <ThemeToggle icon />
        </Dropdown.Item>
      </Dropdown.Items>
    </Dropdown>
  )
}

const DesktopMenu = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='hidden sm:flex'>
      <ThemeToggle icon />
      <ul className='menu menu-horizontal px-3 py-1 gap-2'>{children}</ul>
    </div>
  )
}

const MenuItem = ({
  children,
  to,
  primary,
}: {
  children: React.ReactNode
  to: string
  primary?: boolean
}) => {
  return (
    <li>
      <Link
        className={`btn ${primary ? 'btn-primary' : 'btn-ghost'} py-1 px-2 font-normal`}
        to={to}
      >
        {children}
      </Link>
    </li>
  )
}

const NavBar = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return (
    <div
      className={`flex-0 sticky top-0 z-10 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full scale-90'
      }`}
    >
      <div className='navbar min-h-14 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] justify-between mx-auto my-4 px-4 py-0 shadow-sm rounded-field bg-base-200'>
        <Link to='/' className='text-xl flex items-center gap-2 font-title'>
          <img src={logo} alt='DevNotes' className='w-10 h-10' />
          DevNotes
        </Link>
        {children}
      </div>
    </div>
  )
}

NavBar.MenuItem = MenuItem
NavBar.DesktopMenu = DesktopMenu
NavBar.MobileMenu = MobileMenu

export default NavBar
