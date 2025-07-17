import { createContext, use } from 'react'

export const ThemeContext = createContext<{
  theme: 'sunScreen' | 'midnightOil'
  setTheme: React.Dispatch<React.SetStateAction<'sunScreen' | 'midnightOil'>>
}>({
  theme: 'sunScreen',
  setTheme: () => {},
})

export const useTheme = () => use(ThemeContext)
