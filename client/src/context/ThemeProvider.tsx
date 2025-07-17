import { useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'sunScreen' | 'midnightOil'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'midnightOil' : 'sunScreen'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}

export default ThemeProvider
