import {createRequest, IReqOptions, TResponseData} from 'Uikit/Utils'
import {Modal, message} from 'antd'
import cloneDeep from 'lodash/cloneDeep'
import config from '@utils/config'
import mockData from '@utils/mock-data'
import {ERROR_CODE} from './constant'
// 这个表示登陆的弹框只弹出一次
let reloginFlag = false

// 创建一个request
export const request = createRequest({
  // 最后的数据处理和response拦截器处理位置不一样
  endAction: (responseData, extraData = {showMessage: true}) => {
    // 统一处理未登录的弹框
    // console.log(responseData)
    // 统一处理未登录的弹框
    if (
      responseData.success === false &&
      responseData.code === ERROR_CODE.UN_LOGIN &&
      !reloginFlag
    ) {
      reloginFlag = true
      // sessionStorage.remove('userInfo')
      Modal.confirm({
        title: '重新登录',
        content: '',
        onOk: () => {
          // location.reload()
          window.location.href = `${config.pathPrefix}/login?redirect=${window.location.pathname}${window.location.search}`
          reloginFlag = false
        },
      })
    }
    if (responseData.success === false && extraData.showMessage) {
      message.error(responseData.message)
    }
  },
  // 对返回数据进行格式化处理, 是否抛异常看返回的success字段是否为true, 返回值和responseData合并是最终结果
  formatResponse: responseData => {
    if (
      responseData.success &&
      responseData.content &&
      typeof responseData.content.success === 'boolean' &&
      (responseData.content.data !== undefined || responseData.content.message !== undefined)
    ) {
      return {
        success: responseData.content.success,
        content: responseData.content.data,
        message: responseData.content.message,
        code: responseData.content.code,
      }
    }
    // 如果上面判断处理不了，success还是true 需要进一步处理的话，可以写在这里
    if (responseData.content?.code === 'xxxxx') {
      return {
        success: false,
      }
    }
    return {}
  },
  // formatResponse，对response做统一处理，如果success是false，则会抛出异常
  mockDelay: config.mockDelay || 1000,
})

export const rejectToData = Symbol('flag')

export interface IApiConf extends IReqOptions {
  name?: string
  description?: string
}

export interface IFCall {
  (options?: Record<string, unknown>): Promise<TResponseData>
}

//
export type IIOMap<T> = {
  [P in keyof T]: IFCall
}

export type IIOConf = {
  [propName: string]: IApiConf
}

/**
 * 通过请求配置转换为请求方法
 * @param ioConfs 自定义对接口的
 * @param name
 * @returns
 */
export const createIo = <T extends IIOConf>(ioConfs: T, name?: string): Record<keyof T, IFCall> => {
  const content: Partial<IIOMap<T>> = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const key in ioConfs) {
    if (Object.hasOwn(ioConfs, key)) {
      const apiConf = ioConfs[key]
      content[key] = async (options?: Record<string | symbol, unknown>) => {
        // 这里判断简单请求封装 [rejectToData] :true 表示复杂封装
        if (!options || !options[rejectToData]) {
          options = {
            mix: options,
          }
        }
        delete options[rejectToData]
        if (config.debug === false && name && mockData[name] && mockData[name][key]) {
          // 生产情况可能是纯前端mock返回
          options.mock = cloneDeep(mockData[name][key])
        } else if (config.debug === true && name) {
          // 开发情况下传递生成mock数据的
          const mockHeader = {
            'mock-key': name,
            'mock-method': key,
            name: encodeURIComponent(apiConf.name || ''),
            description: encodeURIComponent(apiConf.description || ''),
            path: apiConf.url,
          }
          options.headers = options.headers ? {...mockHeader, ...options.headers} : mockHeader
        }
        // 如果配置也有定义请求头则合并
        // if (apiConf['headers']) {
        //   options.headers = options.headers ? {...apiConf['headers'], ...options.headers} : apiConf['headers']
        // }

        // 合并参数
        const option = {...apiConf, ...options}

        delete option.name
        delete option.description

        // url / 开头使用绝对路径不是拼接统一前缀
        if (option.url[0] !== '/') {
          option.url = `${config.apiPrefix || ''}/${option.url}`
        }
        return request(option)
      }
    }
  }
  return content as Record<keyof T, IFCall>
}
