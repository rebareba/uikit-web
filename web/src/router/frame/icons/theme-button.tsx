import {Button, ButtonProps} from 'antd'
import cls from 'classnames'
import {twMerge} from 'tailwind-merge'

export interface IconButtonProps {
  children: React.ReactNode
  onClick?: ButtonProps['onClick']
  className?: string
}

const IconButton = ({children, onClick, className}: IconButtonProps) => {
  return (
    <Button
      className={twMerge(
        cls(
          'bg-shallow dark:bg-[rgb(41,49,79)] text-primary w-[34px] text-[16px] h-[34px] flex items-center justify-center rounded-[8px] select-none cursor-pointer',
          className,
        ),
      )}
      onClick={onClick}
      type="primary"
    >
      {children}
    </Button>
  )
}

export default IconButton
