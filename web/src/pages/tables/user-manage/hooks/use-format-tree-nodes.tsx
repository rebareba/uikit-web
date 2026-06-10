import React, {useMemo, useCallback} from 'react'
import type {TreeDataNode} from 'antd'

import {IDepartmentDTO, TDepartmentNode} from '../types'

import CustomTitle from '../components/CustomTitle'

// 高亮匹配关键词
const highlightMatch = (text: string, searchValue: string) => {
  if (!searchValue.trim()) return <span>{text}</span>

  const keywords = searchValue.toLowerCase().split(/\s+/).filter(Boolean)
  let matchStart = -1
  let matchLength = 0

  for (const kw of keywords) {
    const index = text.toLowerCase().indexOf(kw)
    if (index !== -1) {
      matchStart = index
      matchLength = kw.length
      break
    }
  }

  if (matchStart === -1) return <span>{text}</span>

  const before = text.substring(0, matchStart)
  const match = text.substring(matchStart, matchStart + matchLength)
  const after = text.substring(matchStart + matchLength)

  return (
    <span>
      {before}
      <span className="text-primary font-medium">{match}</span>
      {after}
    </span>
  )
}
// 这个后面可以提到公共方法下面， 并且进行扩展
// 构建部门树并添加 parentIds（不含自己）、childrenIds（不含自己）
const buildDepartmentTree = (
  list: IDepartmentDTO[],
  createCustomTitle: (
    title: React.ReactNode,
    node: TDepartmentNode,
    item: IDepartmentDTO,
  ) => JSX.Element,
) => {
  const map = new Map<string, TDepartmentNode>()
  const roots: TDepartmentNode[] = []

  // 1. 初始化所有节点
  list.forEach(item => {
    if (!item.departmentId) return

    const node: TDepartmentNode = {
      key: String(item.departmentId),
      title: item.departmentName || '',
      isLeaf: false,
      children: [],
      parentIds: [],
      childrenIds: [],
      departmentName: item.departmentName || '', // ✅ 保存原始名称用于搜索
    }
    map.set(`${item.departmentId}`, node)
  })

  // 2. 建立父子关系
  list.forEach(item => {
    if (!item.departmentId) return

    const node = map.get(`${item.departmentId}`)!

    if (item.parentDepartmentId && map.has(`${item.parentDepartmentId}`)) {
      map.get(`${item.parentDepartmentId}`)!.children!.push(node)
    } else {
      roots.push(node)
    }
  })

  // 3. DFS 填充 parentIds 和 childrenIds
  const dfs = (node: TDepartmentNode, parentPath: string[]): string[] => {
    // ✅ parentIds = 父路径（不包含自己）
    node.parentIds = [...parentPath]
    // 后代
    const descendants: string[] = []

    if (node.children && node.children.length > 0) {
      // 子节点的 parentPath 包含当前节点
      node.children.forEach(child => {
        const childDescendants = dfs(child, [...parentPath, String(node.key)])
        descendants.push(String(child.key), ...childDescendants)
      })
    }

    node.childrenIds = descendants
    // ✅ 此时 node.parentIds 和 childrenIds 已完整，可以安全用于 CustomTitle
    node.title = createCustomTitle(
      node.title,
      node,
      list.find(d => String(d.departmentId) === node.key)!,
    )
    return descendants
  }

  // 从根节点开始遍历，根节点 parentPath 为空
  roots.forEach(root => {
    dfs(root, [])
  })

  // 4. 标记 isLeaf
  const markLeaf = (nodes: TDepartmentNode[]) => {
    nodes.forEach(node => {
      node.isLeaf = !node.children || node.children.length === 0
      if (node.children) markLeaf(node.children)
    })
  }
  markLeaf(roots)

  return {treeData: roots, childrenMap: map}
}

/**
 * 自定义 Hook：将部门列表格式化为树，并支持搜索过滤
 */
const useFormatTreeNodes = (
  departmentList: IDepartmentDTO[],
  handleAddChild: (item: IDepartmentDTO) => void,
  handleEdit: (item: IDepartmentDTO) => void,
  handleDelete: (item: IDepartmentDTO) => void,
) => {
  const createCustomTitle = useCallback(
    (title: React.ReactNode, node: TDepartmentNode, item: IDepartmentDTO) => (
      <CustomTitle
        title={title}
        node={node}
        item={item}
        onAddChild={handleAddChild}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
    [handleAddChild, handleEdit, handleDelete],
  )
  // 构建带 parentIds 和 childrenIds 的完整树
  const {treeData, childrenMap} = useMemo(() => {
    console.log('useFormatTreeNodes')
    return buildDepartmentTree(departmentList, createCustomTitle)
  }, [departmentList, createCustomTitle])
  console.log('treeData', treeData)
  console.log('childrenMap', childrenMap)

  // 过滤函数：根据搜索关键词返回剪枝后的树
  const fillterData = useCallback(
    (searchValue: string): TDepartmentNode[] => {
      console.log('fillterData', searchValue)
      if (!searchValue || !searchValue.trim()) return treeData

      const keywords = searchValue.toLowerCase().split(/\s+/).filter(Boolean)

      // 判断是否匹配关键词（用于高亮）
      const matchesAnyKeyword = (title: string): boolean => {
        const lowerTitle = title.toLowerCase()
        return keywords.some(kw => lowerTitle.includes(kw))
      }

      // 递归构建/过滤树
      const filterTree = (nodes: TDepartmentNode[]): TDepartmentNode[] => {
        return nodes
          .map(node => {
            // ✅ 使用 departmentName 搜索（可靠字符串）
            const isMatchedByTitle = matchesAnyKeyword(node.departmentName)
            const isMatchedByChildren = node.childrenIds.some(id => {
              const childNode = childrenMap.get(id)
              return childNode && matchesAnyKeyword(childNode.departmentName)
            })

            if (!isMatchedByTitle && !isMatchedByChildren) {
              return null
            }
            let {title} = node
            if (isMatchedByTitle) {
              // 高亮标题
              const highlightedTitle = highlightMatch(node.departmentName, searchValue)
              title = createCustomTitle(
                highlightedTitle,
                node,
                departmentList.find(d => String(d.departmentId) === node.key)!,
              )
            }
            return {
              ...node,
              title,
              children: filterTree(node.children || []),
            }
          })
          .filter(Boolean) as TDepartmentNode[]
      }

      return filterTree(treeData)
    },
    [treeData, departmentList, createCustomTitle, childrenMap],
  )

  return fillterData
}

export default useFormatTreeNodes
