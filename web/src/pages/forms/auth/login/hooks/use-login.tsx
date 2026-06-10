import {useRequest} from 'ahooks'
import {JSEncrypt} from 'jsencrypt'
import {useGlobalStore} from '@store'
import {useNavigate} from 'react-router-dom'
import {antdUtils} from 'Uikit/Utils'
import io, {LoginDTO} from '../io'

export const useLogin = () => {
  const {data: captcha, refresh: refreshCaptcha} = useRequest(io.getCaptcha)

  const {runAsync: login, loading: loginLoading} = useRequest(io.login, {manual: true})

  const navigate = useNavigate()
  async function loginHandle(values: LoginDTO) {
    if (!captcha) {
      return
    }
    values.captchaId = captcha.content?.id
    let publicKey: string
    try {
      const {content} = await io.getPublicKey()
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

    values.password = password
    values.publicKey = publicKey

    try {
      const {content: data} = await login(values)
      useGlobalStore.setState({
        token: data.token,
      })
      // 每次重新登录，清空keepAliveTabs
      window.localStorage.removeItem('keepAliveTabs')

      navigate('/')
    } catch (error) {
      console.log(error)
      refreshCaptcha()
    }
  }

  return {
    captcha: captcha?.content,
    refreshCaptcha,
    login: loginHandle,
    loginLoading,
  }
}
