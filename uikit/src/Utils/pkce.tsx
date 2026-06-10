import {SHA256, enc} from 'crypto-js'

// 生成符合规范的 64 位随机字符串 (实际为 64 字符)
export const generateCodeVerifier = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  // 浏览器安全的随机生成方式
  const randomValues = new Uint8Array(64)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomValues)
  } else {
    for (let i = 0; i < 64; i++) {
      randomValues[i] = Math.floor(Math.random() * 256)
    }
  }
  // 转换为符合 RFC 7636 的字符
  for (let i = 0; i < randomValues.length; i++) {
    result += chars[randomValues[i] % chars.length]
  }
  return result
}

// 生成 code_challenge (SHA-256 + Base64URL)
export const generateCodeChallenge = (verifier: string): string => {
  // 计算 SHA-256 哈希
  const hash = SHA256(verifier)
  // 转换为 Base64URL
  return hash.toString(enc.Base64).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
