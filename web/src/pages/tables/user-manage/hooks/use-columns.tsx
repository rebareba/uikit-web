import dayjs from 'dayjs'
import copy from 'copy-to-clipboard'
import {Badge, Popconfirm, Space, Tag, Tooltip} from 'antd'
import {antdUtils} from 'Uikit/Utils'
import type {TableColumnsType} from 'antd'

import {useMemo} from 'react'
import {LinkButton} from 'Uikit/Components'
import {IItem, TVisible} from '../types'

interface IUseColumns {
  setVisible: (visible: TVisible) => void
  setRecord: (record: IItem) => void
  deleteConfirm: (record: IItem) => void
}

// 这里需要优化
const useColumns = ({setVisible, setRecord, deleteConfirm}: IUseColumns) => {
  return useMemo(() => {
    const columns: TableColumnsType<IItem> = [
      {
        title: '账号',
        dataIndex: 'userCode',
        width: 120,
        fixed: 'left',
        render: (text, record) => {
          return (
            <div>
              {record.isTenantOwner && (
                <Tag
                  className="cursor-pointer"
                  color="processing"
                  onClick={() => {
                    // setCurrentRecord(record)
                    // setTransferVisible(true)
                  }}
                >
                  所有者
                </Tag>
              )}
              <span>{text}</span>
            </div>
          )
        },
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'isActive',
        width: 60,
        render: (isActive, record) => {
          return isActive ? (
            <Badge status="processing" text="正常" />
          ) : (
            <Badge status="default" text="停用" />
          )
        },
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        width: 150,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        width: 150,
      },
      {
        dataIndex: 'expireTime',
        title: '有效期',
        width: 150,
        render: expireTime => {
          return expireTime ? dayjs(expireTime).format('YYYY-MM-DD') : '-'
        },
      },
      {
        dataIndex: 'updateTime',
        title: '更新时间',
        width: 200,
        render: updateTime => {
          return dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')
        },
      },
      {
        title: '操作',
        key: 'operation',
        width: 200,
        fixed: 'right',
        render: (_, record) => {
          return (
            <Space>
              <LinkButton
                key="resetPasswd"
                onClick={() => {
                  // setCurrentRecord(record)
                  // setResetPasswordVisible(true)
                }}
              >
                重置密码
              </LinkButton>
              <LinkButton
                key="auth"
                onClick={() => {
                  // setCurrentRecord(record)
                  // setAuthorizationVisible(true)
                }}
              >
                授权
              </LinkButton>
              <LinkButton
                key="detail"
                onClick={() => {
                  // setCurrentRecord(record)
                  // setAddUserVisible(true)
                }}
              >
                编辑
              </LinkButton>
              {record.allowDelete ? (
                <Popconfirm
                  key="delete"
                  title="删除"
                  description="确认删除该用户吗?"
                  onConfirm={() => {
                    if (record.uid) {
                      // deleteConfirm(record)
                    }
                  }}
                >
                  <a key="delete">删除</a>
                </Popconfirm>
              ) : (
                <Tooltip title="不支持删除">
                  <span>
                    <LinkButton disabled>删除</LinkButton>
                  </span>
                </Tooltip>
              )}
            </Space>
          )
        },
      },
    ]
    return columns
  }, [])
}

export default useColumns
