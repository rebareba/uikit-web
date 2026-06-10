import ThemeButton from './icons/theme-button'
import {IconJiaretaiyang} from './icons/jiaretaiyang'
import {Icon3} from './icons/3'

interface Props {
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
  className?: string
}

const ThemeSwitcher = ({darkMode, setDarkMode, className}: Props) => {
  return (
    <ThemeButton
      onClick={() => {
        setDarkMode(!darkMode)
      }}
      className={className}
    >
      {!darkMode ? <IconJiaretaiyang className="text-[20px]" /> : <Icon3 className="text-[20px]" />}
    </ThemeButton>
  )
}

export default ThemeSwitcher
