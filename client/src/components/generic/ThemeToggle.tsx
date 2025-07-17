import { LuSunDim, LuMoon } from 'react-icons/lu'
import { useTheme } from '@/context/ThemeContext'

const ThemeToggle = ({ className, icon = false }: { className?: string; icon?: boolean }) => {
  const { theme, setTheme } = useTheme()

  return icon ? (
    <div className='flex items-center gap-2'>
      {theme === 'sunScreen' ? <LuSunDim /> : <LuMoon />}
      <input
        type='checkbox'
        defaultChecked
        className={`toggle checked:bg-transparent ${className}`}
        onChange={() => setTheme((prev) => (prev === 'sunScreen' ? 'midnightOil' : 'sunScreen'))}
      />
    </div>
  ) : (
    <input
      type='checkbox'
      defaultChecked
      className={`toggle ${className}`}
      onChange={() => setTheme((prev) => (prev === 'sunScreen' ? 'midnightOil' : 'sunScreen'))}
    />
  )
}

export default ThemeToggle
