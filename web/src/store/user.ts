import {create} from 'zustand'
import {devtools} from 'zustand/middleware'
import {TUserInfo, MenuData} from './global.d'

interface State {
  currentUser: TUserInfo | null
  permissionValue: number
  menuData: MenuData[]
}

interface Action {
  setCurrentUser: (currentUser: State['currentUser']) => void
}

export const useUserStore = create<State & Action>()(
  devtools(
    set => {
      return {
        currentUser: null,
        setCurrentUser: (currentUser: State['currentUser']) => set({currentUser}),
      }
    },
    {name: 'globalUserStore'},
  ),
)
