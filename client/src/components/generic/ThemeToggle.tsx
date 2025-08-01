import { LuSunDim, LuMoon } from 'react-icons/lu'
import { useTheme } from '@/context/ThemeContext'

const ThemeToggle = ({ className, icon = false }: { className?: string; icon?: boolean }) => {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = () => {
    const newTheme = theme === 'sunScreen' ? 'midnightOil' : 'sunScreen'
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return icon ? (
    <div className='flex items-center gap-2'>
      {theme === 'sunScreen' ? <LuSunDim /> : <LuMoon />}
      <input
        type='checkbox'
        defaultChecked
        className={`toggle checked:bg-transparent ${className}`}
        onChange={handleThemeChange}
      />
    </div>
  ) : (
    <input
      type='checkbox'
      defaultChecked
      className={`toggle ${className}`}
      onChange={handleThemeChange}
    />
  )
}

export default ThemeToggle
