import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`group relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line text-content transition-colors duration-300 hover:border-brand-400 hover:text-brand-500 dark:hover:bg-steel-800/60 ${className}`}
    >
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark ? 'translate-y-6 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
        }`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-6 -rotate-90 opacity-0'
        }`}
      />
    </button>
  )
}
