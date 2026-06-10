import React, {useEffect} from 'react'
import {Spin} from 'antd'
import NProgress from 'nprogress'

const NProgressLoading = () => {
  useEffect(() => {
    NProgress.start()

    return () => {
      NProgress.done()
    }
  }, [])

  return (
    <div className="flex justify-center">
      <Spin />
    </div>
  )
}

export default NProgressLoading
