import React from 'react'

interface IProps {
  title: React.ReactNode
  logoIcon?: React.ReactNode
}

const HeaderTitle: React.FC<IProps> = ({title, logoIcon}) => {
  return (
    <div className="flex justify-between items-center text-white">
      <div className="flex items-center text-[20px] px-[24px] pr-0 mr-[12px]">
        {logoIcon ? (
          typeof logoIcon === 'string' ? (
            <img src={logoIcon} alt="logo" width={26} height={26} />
          ) : (
            logoIcon
          )
        ) : (
          ''
        )}
        <div className="text-[18px] ml-xs font-medium">{title}</div>
      </div>
    </div>
  )
}

export default HeaderTitle
