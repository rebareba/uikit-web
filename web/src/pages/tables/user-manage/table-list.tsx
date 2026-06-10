import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Button, Form, Input, Space, Table, TableColumnsType, TableProps} from 'antd'
import {useAntdTable, useRequest} from 'ahooks'
import {antdUtils, useSelector, createAntdTableFetcher} from 'Uikit/Utils'
import io from './io'
import {IItem, TVisible} from './types'
// import AddModifyModal from './components/AddModifyModal'
// import DetailModal from './components/DetailModal'
import useColumns from './hooks/use-columns'
import useStore from './store'

// interface ITableListProps {
//   tableProps: Partial<TableProps<IItem>>
//   reloadData: () => void
// }

// const TableList = ({tableProps}: ITableListProps) => {
// const TableList: React.FC<ITableListProps> = ({tableProps, reloadData}) => {
const TableList = () => {
  // 使用ahooks的useAntdTable的封装
  const [form] = Form.useForm()
  const {searchDepartmentIds} = useStore(useSelector(['searchDepartmentIds']))
  const {
    loading,
    params,
    tableProps,
    search: {reset, submit, type, changeType},
  } = useAntdTable(
    // async ({current, pageSize, sorter, filters, extra}, formData) => {
    //   const res = await io.getPageList({
    //     currentPage: current,
    //     pageSize,
    //     search: formData.search ? formData.search : undefined,
    //   })
    //   console.log('res', res)

    //   const {content} = res
    //   return {
    //     total: content.totalCount,
    //     list: (content.data || []) as IItem[],
    //   }
    // },
    createAntdTableFetcher<IItem>(io.getPageList, {searchDepartmentIds}),
    {
      form,
      defaultParams: [
        {
          current: 1,
          pageSize: 10,
        },
        {
          search: '',
        },
      ],
      defaultPageSize: 10,
      refreshDeps: [searchDepartmentIds],
    },
  )

  const deleteConfirm = useCallback(
    (record: IItem) => {
      // antdUtils.modal.confirm({
      //   title: '你确定要删除该记录？',
      //   content: '',
      //   onOk: async () => {
      //     io.deleteData({':promptId': record.id})
      //       .then(() => {
      //         antdUtils.message.success('删除成功')
      //         reset()
      //       })
      //       .catch(e => {})
      //   },
      //   // onCancel() {},
      // })
      io.deleteData({':promptId': record.id})
        .then(() => {
          antdUtils.message.success('删除成功')
          reset()
        })
        .catch(e => {})
    },
    [reset],
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
        <Form layout="inline" form={form}>
          <Form.Item label="搜索" name="search">
            <Input.Search placeholder="请输入搜索内容" onSearch={submit} style={{width: 200}} />
          </Form.Item>
        </Form>
        <Space>
          {/* <Button type="primary">操作A</Button> */}
          <Button type="primary" onClick={() => setVisible('AddModifyModal')}>
            新建模版
          </Button>
        </Space>
      </div>

      <Table tableLayout="fixed" {...tableProps} columns={columns} rowKey="id" />
    </div>
  )
}

export default TableList
