/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2024-12-19 17:23:22
 * @Description: 压缩图片处理
 */

import Compressor from 'compressorjs'

export default (file: File | null, overSize = 100 * 1024, quality = 0.3): Promise<Blob | File> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      // eslint-disable-next-line no-promise-executor-return
      return reject(new Error('图片文件未找到'))
    }
    if (file.size >= overSize) {
      // eslint-disable-next-line no-new
      new Compressor(file, {
        quality,
        success(result) {
          // formData.append('file', result, result.name)
          resolve(result)
        },
        error(err) {
          reject(err)
        },
      })
    } else {
      resolve(file)
    }
  })
}
