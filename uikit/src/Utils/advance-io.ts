/* eslint-disable no-await-in-loop */
import type {
  Params as AntdTableParams,
  Data as AntdTableData,
  Service,
} from 'ahooks/lib/useAntdTable/types'

import type {TResponseData} from './create-request'
// -----------------------------

// @utils/enhance-io-method.ts

export interface IFCall {
  (options?: Record<string, unknown>): Promise<Pick<TResponseData, 'content' | 'data'>>
}

// createAntdTableFetcher.ts

// -----------------------------
// 定义通用的分页响应结构（与 ahooks 兼容）
// -----------------------------
export interface PageResult<T> {
  content?: {
    data: T[]
    totalCount: number
  }
}

// -----------------------------
// 泛型 Fetcher 函数
// -----------------------------
export type GetPageListFn<FormData, T> = (
  params: {
    currentPage: number
    pageSize: number
  } & Partial<FormData>,
) => Promise<PageResult<T>>

// -----------------------------
// 处理参数函数类型
// -----------------------------
export type HandleParamsFn<FormData> = (
  tableParams: AntdTableParams[0], // 来自 ahooks 的 params 结构
  formData?: FormData,
  extractParams?: Record<string, unknown>,
) => {currentPage: number; pageSize: number} & Partial<FormData>

// -----------------------------
// 返回类型匹配 useAntdTable<Service>
// -----------------------------
export type FetcherResult<T> = {
  total: number
  list: T[]
  [key: string]: unknown
}

// -----------------------------
// 转换函数类型， 适配 ahooks 的 useAntdTable
// -----------------------------
export function createAntdTableFetcher<
  T,
  FormData extends Record<string, unknown> = Record<string, unknown>,
>(
  getPageList: (
    options?: Record<string, unknown>,
  ) => Promise<{content?: {data: T[]; totalCount: number}}>,
  extractParams: Record<string, unknown> = {},
  handleParams: HandleParamsFn<FormData> = (params, formData, extractParams = {}) => {
    const filteredFormData = (
      formData
        ? Object.entries(formData).reduce(
            (acc, [key, value]) => {
              if (value !== '' && value !== null && value !== undefined) {
                acc[key] = value
              }
              return acc
            },
            {} as Record<string, unknown>,
          )
        : {}
    ) as Partial<FormData>

    return {
      currentPage: params.current,
      pageSize: params.pageSize,
      ...filteredFormData,
      ...extractParams,
    }
  },
): Service<FetcherResult<T>, AntdTableParams> {
  return async (params: AntdTableParams[0], formData?: FormData) => {
    const reqParams = handleParams(params, formData, extractParams)
    const res = await getPageList(reqParams)
    return {
      ...res,
      total: res.content?.totalCount || 0,
      list: res.content?.data || [],
    }
  }
}

// 支持提取的字段
type ExtractField = 'content' | 'data'

// 通用上下文，用于传递状态
interface IoContext {
  loading: boolean
  error: Error | null
  [key: string]: unknown
}

// 缓存配置：boolean 表示启用（默认 60s），number 表示毫秒
export type CacheConfig = boolean | number

// 增强配置：T 是 transform 返回类型，也是 Promise<T> 的类型
export interface EnhanceOptions<T = unknown> {
  field?: ExtractField
  transform?: (input: unknown) => T
  onError?: (err: Error, ctx: IoContext) => void | Promise<void>
  onLoading?: (loading: boolean, ctx: IoContext) => void
  retryCount?: number
  retryDelay?: number
  cache?: CacheConfig
  /**
   * 可修改 options 并返回新值
   * @param options 原始 options
   * @param ctx 上下文
   * @returns 修改后的 options（可选）
   */
  beforeRequest?: (options: Parameters<IFCall>[0], ctx: IoContext) => Parameters<IFCall>[0] | void
}

// 默认缓存时间：60 秒
const DEFAULT_CACHE_TTL = 60 * 1000

// 辅助函数：延迟
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 增强单个 io 方法
 * 返回一个带泛型的函数：<T = unknown>(options?) => Promise<T>
 */
export function enhanceIoMethod(method: IFCall, options: EnhanceOptions = {}) {
  const {
    field = 'content',
    transform,
    onError,
    onLoading,
    retryCount = 0,
    retryDelay = 0,
    cache = false,
    beforeRequest,
  } = options

  const cacheStore = new Map<string, {data: unknown; expire: number}>()
  const getCacheKey = (opts: unknown) => JSON.stringify(opts || {}, Object.keys(opts || {}).sort())
  const cacheTTL = typeof cache === 'number' ? cache : DEFAULT_CACHE_TTL

  // ✅ 关键：返回的函数才带泛型！
  return async <T = unknown>(inputOptions?: Parameters<IFCall>[0]): Promise<T> => {
    const ctx: IoContext = {loading: false, error: null}

    if (onLoading) onLoading(true, ctx)

    // 缓存逻辑
    if (cache) {
      const key = getCacheKey(inputOptions)
      const cached = cacheStore.get(key)
      if (cached && Date.now() < cached.expire) {
        if (onLoading) onLoading(false, ctx)
        return cached.data as T
      }
    }

    let finalOptions = inputOptions
    if (beforeRequest) {
      const result = beforeRequest(inputOptions, ctx)
      if (result) finalOptions = result
    }

    let value: unknown
    try {
      for (let i = 0; i <= retryCount; i++) {
        try {
          const res = await method(finalOptions)
          value = res[field]
          if (transform) value = transform(value)
          break
        } catch (err) {
          if (i === retryCount) throw err
          if (retryDelay) await sleep(retryDelay)
        }
      }
    } catch (err) {
      ctx.error = err as Error
      if (onError) {
        await onError(err as Error, ctx)
      }
      throw err
    } finally {
      if (onLoading && ctx.loading) onLoading(false, ctx)
    }

    if (cache) {
      const key = getCacheKey(inputOptions)
      cacheStore.set(key, {data: value, expire: Date.now() + cacheTTL})
    }

    return value as T
  }
}

type IFCallPro = <T = unknown>(options?: Parameters<IFCall>[0]) => Promise<T>
type IIOMapPro<T extends Record<string, IFCall>> = {[K in keyof T]: IFCallPro}

export function createIoPro<T extends Record<string, IFCall>>(
  io: T,
  defaultOptions: EnhanceOptions = {},
): IIOMapPro<T> {
  const result = {} as Partial<IIOMapPro<T>>
  for (const key in io) {
    if (Object.hasOwn(io, key)) {
      result[key] = enhanceIoMethod(io[key], defaultOptions) // ✅ 正确返回泛型函数
    }
  }
  return result as IIOMapPro<T>
}
