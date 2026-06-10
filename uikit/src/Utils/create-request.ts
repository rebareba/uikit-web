/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type {
  AxiosInterceptorManager,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosResponseHeaders,
  AxiosResponseHeaders,
} from 'axios'

// 返回的对象
export type TResponseData = {
  success: boolean // 兼容历史的
  content?: any
  data?: any
  message?: string
  status: number
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders
  code?: string | number
  [key: string]: any
}

export interface IReqOptions extends AxiosRequestConfig {
  mix?: {[propName: string]: any}
  extraData?: any
  endAction?: (responseData: TResponseData, extraData: any) => void
  url: string
  mock?: any
}

export interface IRequest {
  (options: IReqOptions): Promise<TResponseData>
}

// 创建实例的配置
export interface IRequestConfig extends AxiosRequestConfig {
  formatResponse?: (responseData: TResponseData) => {
    content?: any
    success?: boolean
    [key: string]: any
  }
  endAction?: (responseData: TResponseData, extraData?: any) => void
  // 拦截器的三个参数
  requestInterceptor?: Parameters<AxiosInterceptorManager<InternalAxiosRequestConfig>['use']>
  responseInterceptor?: Parameters<AxiosInterceptorManager<AxiosResponse>['use']>
  mockDelay?: number
}

export default function createRequest({
  formatResponse = responseData => {
    if (
      responseData.success &&
      responseData.content &&
      typeof responseData.content.success === 'boolean' &&
      (responseData.content.content !== undefined || responseData.content.message !== undefined)
    ) {
      return {...responseData.content}
    }
    return {}
  },
  requestInterceptor,
  responseInterceptor,
  endAction,
  ...option
}: IRequestConfig = {}): IRequest {
  const instance = axios.create({
    ...option,
    timeout: option.timeout || 60 * 1000, // default is `0` (no timeout)
    headers: option.headers || {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
  })
  if (requestInterceptor) {
    instance.interceptors.request.use(...requestInterceptor)
  }
  if (responseInterceptor) {
    instance.interceptors.response.use(...responseInterceptor)
  }

  return async ({extraData, ...options}: IReqOptions) => {
    // 混合请求处理字段
    if (options.mix) {
      if (typeof options.mix === 'object') {
        Object.keys(options.mix).forEach(key => {
          if (key[0] === ':' && options.mix && typeof options.mix[key] !== 'object') {
            options.url = options.url.replace(key, encodeURIComponent(options.mix[key]))
            delete options.mix[key]
          }
        })
      }
      const method = (options.method || 'get').toLowerCase()
      if (method === 'get' || method === 'head' || method === 'delete') {
        options.params = {...options.params, ...options.mix}
      } else if (Array.isArray(options.mix)) {
        options.data = options.mix
      } else {
        options.data = {...options.data, ...options.mix}
      }
    }
    // 路由参数处理
    if (typeof options.params === 'object') {
      Object.keys(options.params).forEach(key => {
        if (key[0] === ':') {
          options.url = options.url.replace(key, encodeURIComponent(options.params[key]))
          delete options.params[key]
        }
      })
    }
    let retData: TResponseData = {success: true, status: 0}
    // mock 处理
    if (options.mock) {
      const {data, headers}: {data: any; headers?: any} = await new Promise(resolve =>
        setTimeout(() => {
          if (options.mock.headers && options.mock.data) {
            resolve({headers: options.mock.headers, data: options.mock.data})
          } else {
            resolve({data: options.mock})
          }
        }, option.mockDelay || 500),
      )
      retData.data = data
      retData.content = data
      retData.headers = headers
    } else {
      try {
        if (options.mock) {
          delete options.mock
        }
        if (options.mix) {
          delete options.mix
        }
        const {data, headers, status} = await instance(options)
        retData.status = status
        retData.data = data || ''
        retData.content = data || ''
        retData.headers = headers
      } catch (err: any) {
        retData.success = false
        retData.message = err.message
        if (err.response) {
          console.log(err.response)
          retData.status = err.response.status
          retData.data = err.response.data
          retData.headers = err.response.headers
          retData.message = `${err.response.statusText}: 状态码 ${retData.status}`
        }
      }
    }
    retData = {...retData, ...formatResponse(retData)}
    // 返回前处理
    const doEndAction = options.endAction || endAction
    if (doEndAction) {
      doEndAction(retData, extraData)
    }
    if (retData.success) return retData
    return Promise.reject(retData)
  }
}
