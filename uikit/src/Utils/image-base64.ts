/* eslint-disable prefer-destructuring */
export function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

/**
 * 将 Base64 字符串转换为 File 对象
 * @param {string} base64String - Base64 编码的字符串（可包含 data URL 前缀）
 * @param {string} fileName - 文件名
 * @param {string} mimeType - MIME 类型（如 'image/jpeg', 'image/png'）
 * @returns {File} File 对象
 */
export function base64ToFile(base64String: string, fileName = 'image.png', mimeType = 'image/png') {
  try {
    // 处理带有 data URL 前缀的 base64 字符串
    let base64Data = base64String
    let detectedMimeType = mimeType

    // 检查是否有 data URL 前缀
    if (base64String.startsWith('data:')) {
      const matches = base64String.match(/^data:([^;]+);base64,(.+)$/)
      if (matches) {
        detectedMimeType = matches[1] // 自动检测 MIME 类型
        base64Data = matches[2] // 提取纯 base64 数据
      }
    }
    // Base64 解码
    const binaryString = atob(base64Data)
    const len = binaryString.length
    const bytes = new Uint8Array(len)

    // 转换为字节数组
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // 创建 File 对象
    return new File([bytes], fileName, {
      type: detectedMimeType,
      lastModified: Date.now(),
    })
  } catch (error) {
    throw new Error('无效的Base64字符串')
  }
}
