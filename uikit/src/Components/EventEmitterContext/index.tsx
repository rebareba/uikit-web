import {createContext, useContext} from 'use-context-selector'
import {useEventEmitter} from 'ahooks'
import type {EventEmitter} from 'ahooks/lib/useEventEmitter'
import React, {useMemo} from 'react'

const EventEmitterContext = createContext<{eventEmitter: EventEmitter<string> | null}>({
  eventEmitter: null,
})

export const useEventEmitterContextContext = () => useContext(EventEmitterContext)

type EventEmitterContextProviderProps = {
  children: React.ReactNode
}
export const EventEmitterContextProvider = ({children}: EventEmitterContextProviderProps) => {
  const eventEmitter = useEventEmitter<string>()
  const value = useMemo(() => ({eventEmitter}), [eventEmitter])
  return <EventEmitterContext.Provider value={value}>{children}</EventEmitterContext.Provider>
}

export default EventEmitterContext
