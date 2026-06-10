import React, {useState, useMemo, useEffect, useCallback} from 'react'
import {Tree, Input, Dropdown, Spin, message, Modal, Empty, TreeDataNode, TreeProps} from 'antd'
import {SearchOutlined} from '@ant-design/icons'

import {useSelector} from 'Uikit/Utils'

import style from './style.module.css'

import io, {ioPro} from './io'
import useFormatTreeNodes from './hooks/use-format-tree-nodes'
import {IDepartmentDTO, TDepartmentNode} from './types'
import useStore from './store'

const SelectTree = () => {
  const {setSearchDepartmentIds} = useStore(useSelector(['setSearchDepartmentIds']))
  const [loading, setLoading] = useState(false)

  // const [treeData, setTreeData] = useState<TreeDataNode[]>([])

  const [departmentList, setDepartmentList] = useState<IDepartmentDTO[]>([])

  const [treeData, setTreeData] = useState<TDepartmentNode[]>([])

  // 部门搜索 可以纯前端实现
  const getDepartmentList = useCallback(async () => {
    try {
      setLoading(true)
      const departmentList = await ioPro.getDepartmentList<IDepartmentDTO[]>()
      console.log('getDepartmentList', departmentList)
      setDepartmentList(departmentList)
    } catch (e) {
      //
    } finally {
      setLoading(false)
    }
  }, [])

  // 添加子节点
  const handleAddChild = useCallback(async (item: IDepartmentDTO) => {
    // 弹窗添加
  }, [])

  // 编辑节点
  const handleEdit = useCallback(async (item: IDepartmentDTO) => {
    //
  }, [])

  // 删除节点
  const handleDelete = useCallback(
    async (item: IDepartmentDTO) => {
      Modal.confirm({
        maskClosable: false,
        title: '删除',
        content: '确定要删除该部门吗？',
        okText: '确认',
        cancelText: '取消',
        okType: 'danger',
        onOk() {
          if (item.departmentId) {
            // 调用删除接口
            getDepartmentList()
          }
        },
      })
    },
    [getDepartmentList],
  )

  // 获取部门
  useEffect(() => {
    getDepartmentList()
  }, [getDepartmentList])

  // 转为树结构 并且支持筛选
  const fillterData = useFormatTreeNodes(departmentList, handleAddChild, handleEdit, handleDelete)
  // const debounceFillterData = useMemo(() => debounce(fillterData, 500), [fillterData])
  // 搜索筛选
  const [search, setSearch] = useState('')
  useEffect(() => {
    const treeData = fillterData(search)
    console.log('treeData1', treeData)
    setTreeData(treeData || [])
  }, [search, fillterData])

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  // 选择部门
  const onSelect: TreeProps<TDepartmentNode>['onSelect'] = (selectedKeys, {node}) => {
    console.log('selectedKeys', node)
    setSelectedKeys(selectedKeys)
    setSearchDepartmentIds(selectedKeys.length > 0 ? [node.key, ...node.childrenIds] : [])
  }
  // return null
  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="请输入部门关键词搜索"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full"
        />
      </div>
      {/* <Tree showLine draggable blockNode /> */}
      <Spin spinning={loading}>
        {treeData.length > 0 ? (
          <Tree
            showLine
            draggable
            blockNode
            defaultExpandAll
            selectedKeys={selectedKeys}
            // switcherIcon={<DownOutlined />}
            // defaultExpandedKeys={['0-0-0']}
            onSelect={onSelect}
            treeData={treeData}
            className={style.leftTree}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </div>
  )
}

export default SelectTree
