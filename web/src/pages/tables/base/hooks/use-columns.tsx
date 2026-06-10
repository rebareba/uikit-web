import dayjs from 'dayjs'
import copy from 'copy-to-clipboard'
import {Space} from 'antd'
import {antdUtils} from 'Uikit/Utils'
import type {TableColumnsType} from 'antd'

import {useMemo} from 'react'
import {IItem, TVisible} from '../io'

interface IUseColumns {
  setVisible: (visible: TVisible) => void
  setRecord: (record: IItem) => void
  deleteConfirm: (record: IItem) => void
}

const useColumns = ({setVisible, setRecord, deleteConfirm}: IUseColumns) => {
  return useMemo(() => {
    const columns: TableColumnsType<IItem> = [
      {
        title: '模版编号',
        dataIndex: 'sn',
        key: 'sn',
        width: 150,
      },
      {
        title: '模版名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                setVisible('DetailModal')
                setRecord(record)
              }}
            >
              {text}
            </a>
          )
        },
        // render: (text, record) => {
        //   return <Link to={`/tasks/${record.taskId}`}>{text}</Link>
        // },
      },
      {
        title: '模版内容',
        dataIndex: 'content',
        key: 'content',
        ellipsis: true,
        width: 200,
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 100,
        render: (updateTime, record) => {
          return dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')
        },
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (_, record) => {
          return (
            <Space>
              {[
                <a
                  key="detail"
                  onClick={() => {
                    setVisible('AddModifyModal')
                    setRecord(record)
                  }}
                >
                  编辑
                </a>,
                <a
                  key="copy"
                  onClick={() => {
                    copy(record.content)
                    antdUtils.message.success('复制成功')
                  }}
                >
                  复制
                </a>,
                <a key="delete" onClick={() => deleteConfirm(record)}>
                  删除
                </a>,
              ]}
            </Space>
          )
        },
      },
    ]
    return columns
  }, [setVisible, setRecord, deleteConfirm])
}

export default useColumns
