import {useEffect} from 'react'
import {Button, Carousel, Form, Input} from 'antd'
import {LockOutlined} from '@ant-design/icons'
import {JSEncrypt} from 'jsencrypt'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import {useRequest} from 'ahooks'
import {antdUtils} from 'Uikit/Utils'
import {getParamsByUrl} from 'Uikit/utils'
import io, {ResetDTO} from './io'

const ResetPassword = () => {
  const navigate = useNavigate()

  const {runAsync: getPublicKey} = useRequest(io.getPublicKey, {manual: true})
  const {runAsync: resetPassword, loading} = useRequest(io.resetPassword, {manual: true})

  // const [query] = useSearchParams()

  useEffect(() => {
    const params = getParamsByUrl()
    if (!params.emial || !params.emailCaptcha) {
      antdUtils.message?.error('重置链接不正确，请检查。')
    }
  }, [])

  const onFinish = async (values: ResetDTO) => {
    if (values.comfirmPassword !== values.password) {
      antdUtils.message?.error('两次密码不一致')
    }
    let publicKey: string
    try {
      const {content} = await getPublicKey()
      publicKey = content
    } catch (error) {
      return antdUtils.message.error('获取公钥失败，请稍后再试')
    }

    // 使用公钥对密码加密
    const encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey)
    const password = encrypt.encrypt(values.password)
    if (!password) {
      return
    }
    const params = getParamsByUrl()
    values.password = password
    values.publicKey = publicKey
    values.email = params.email as string
    values.emailCaptcha = params.emailCaptcha as string
    try {
      await resetPassword(values)
      antdUtils.message?.success('密码重置成功')
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="light:bg-[rgb(238,242,246)] flex justify-center items-center h-[100vh]">
      <div className="flex-[2.5] flex justify-center">
        <div className="dark:bg-[rgb(33,41,70)] w-[400px] px-[32px] py-[20px] mt-[-12%] bg-white rounded-lg <lg:(w-[94%] mx-auto)">
          <div className="mb-[32px]">
            <div className="flex gap-2">
              <h2 className="text-[rgb(124,77,255)]" style={{marginBottom: '0.6em'}}>
                重置密码
              </h2>
            </div>
            <div className="text-[16px]">设置你的新密码</div>
          </div>
          <Form name="super-admin" className="login-form" onFinish={onFinish} size="large">
            <Form.Item name="password" rules={[{required: true, message: '请输入密码'}]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="密码"
                size="large"
                type="password"
              />
            </Form.Item>
            <Form.Item name="comfirmPassword" rules={[{required: true, message: '请输入密码'}]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="重复密码"
              />
            </Form.Item>
            <Form.Item style={{marginBottom: 18}}>
              <Button type="primary" loading={loading} block htmlType="submit">
                确认
              </Button>
            </Form.Item>
            <Form.Item noStyle style={{marginBottom: 0}}>
              <div className="text-right mb-[18px]">
                <Link
                  to="/login"
                  className="text-[16px] !text-[rgb(124,77,255)] select-none"
                  type="link"
                >
                  返回登录
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
