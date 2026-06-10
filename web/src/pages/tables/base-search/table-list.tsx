import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Button, Form, Input, Space, Table, TableColumnsType, TableProps} from 'antd'
import {antdUtils} from 'Uikit/Utils'
import io, {ioPro, IItem, TVisible} from './io'
import AddModifyModal from './components/AddModifyModal'
import DetailModal from './components/DetailModal'
import useColumns from './hooks/use-columns'

interface ITableListProps {
  tableProps: Partial<TableProps<IItem>>
  reloadData: () => void
}

// const TableList = ({tableProps}: ITableListProps) => {
const TableList: React.FC<ITableListProps> = ({tableProps, reloadData}) => {
  // const TableList = () => {

  const deleteConfirm = useCallback(
    (record: IItem) => {
      antdUtils.modal.confirm({
        title: '你确定要删除该记录？',
        content: '',
        onOk: async () => {
          ioPro
            .deleteData({':promptId': record.id})
            .then(() => {
              antdUtils.message.success('删除成功')
            })
            .catch(e => {})
            .finally(() => {
              reloadData()
            })
        },
        // onCancel() {},
      })
    },
    [reloadData],
  )

  const [record, setRecord] = useState<IItem>()
  const [visible, setVisible] = useState<TVisible>('')

  const columns = useColumns({
    setVisible,
    setRecord,
    deleteConfirm,
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-sm">
        <Space>
          {/* <Button type="primary">操作A</Button> */}
          <Button type="primary" onClick={() => setVisible('AddModifyModal')}>
            新建用户
          </Button>
        </Space>
      </div>

      <Table tableLayout="fixed" {...tableProps} columns={columns} rowKey="id" />
      {visible === 'AddModifyModal' && (
        <AddModifyModal
          record={record}
          onCancel={() => {
            setVisible('')
            setRecord(undefined)
          }}
          onFinish={() => {
            setVisible('')
            setRecord(undefined)
            reloadData()
          }}
        />
      )}
      {visible === 'DetailModal' && record && (
        <DetailModal
          record={record}
          onCancel={() => {
            setVisible('')
            setRecord(undefined)
          }}
        />
      )}
    </div>
  )
}

export default TableList
