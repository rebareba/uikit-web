import {create} from 'zustand'

import io, {ioPro} from './io'

import {IRoleDTO} from './types'

interface StoreState {
  searchDepartmentIds: string[]
  setSearchDepartmentIds: (ids: string[]) => void
  allRoles: IRoleDTO[]
  rolesLoading: boolean
  getAllRoles: () => void
}

const useStore = create<StoreState>((set, getState) => ({
  searchDepartmentIds: [],
  setSearchDepartmentIds: ids => set(() => ({searchDepartmentIds: ids})),
  rolesLoading: false,
  allRoles: [],
  // 获取所有角色
  getAllRoles: async () => {
    try {
      set({rolesLoading: true})
      const allRoles = await ioPro.getAllRoles<IRoleDTO[]>()
      set({allRoles})
    } catch (e) {
      //
    } finally {
      set({rolesLoading: false})
    }
  },
}))

export default useStore
