import { useEffect, useState } from 'react'
import { LuSunDim, LuMoon } from 'react-icons/lu'

const ThemeToggle = ({ className, icon = false }: { className?: string; icon?: boolean }) => {
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'midnightOil' : 'sunScreen'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return icon ? (
    <div className='flex items-center gap-2'>
      {theme === 'sunScreen' ? <LuSunDim /> : <LuMoon />}
      <input
        type='checkbox'
        defaultChecked
        className={`toggle checked:bg-transparent ${className}`}
        onChange={() => setTheme(theme === 'sunScreen' ? 'midnightOil' : 'sunScreen')}
      />
    </div>
  ) : (
    <input
      type='checkbox'
      defaultChecked
      className={`toggle ${className}`}
      onChange={() => setTheme(theme === 'sunScreen' ? 'midnightOil' : 'sunScreen')}
    />
  )
}

export default ThemeToggle
