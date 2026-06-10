import React from 'react'
import {Button} from 'antd'
import {LinkButtonProps} from './interface'

const LinkButton = ({disabled, onClick, children, className}: LinkButtonProps) => {
  return (
    <Button type="link" onClick={onClick} disabled={disabled} className={`${className} p-0 h-auto`}>
      {children}
    </Button>
  )
}

export default LinkButton
