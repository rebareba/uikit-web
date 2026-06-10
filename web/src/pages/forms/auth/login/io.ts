import {createIo, IApiConf} from '@common/create-io'

export interface LoginDTO {
  accountNumber: string
  password: string
  captchaId: string
  captcha: string
  publicKey: string
}
export interface ResetDTO {
  comfirmPassword: string
  password: string
  email: string
  emailCaptcha: string
  publicKey: string
}

export interface TokenDTO {
  expire: number
  token: string
  refreshExpire: number
  refreshToken: string
}

export interface CaptchaDTO {
  id: string
  imageBase64: string
}

export interface ResetPasswordDTO {
  password: string
  email: string
  emailCaptcha: string
  publicKey: string
  confirmPassword?: string
}
const apis: Record<
  'login' | 'getCaptcha' | 'getPublicKey' | 'sendResetPasswordEmail' | 'resetPassword',
  IApiConf
> = {
  login: {
    name: '获取登陆信息',
    url: 'auth/login', // 真实接口请求地址是/api/login_info
    method: 'GET',
  },
  getCaptcha: {
    name: '获取验证码',
    method: 'GET',
    url: 'auth/captcha',
  },
  getPublicKey: {
    name: '获取公钥',
    method: 'POST',
    url: 'auth/publicKey',
  },
  sendResetPasswordEmail: {
    name: '发送重置密码邮件',
    method: 'POST',
    url: 'logout',
  },
  resetPassword: {
    name: '重置密码',
    method: 'POST',
    url: 'auth/reset/password',
  },
}

export default createIo(apis, 'login')
