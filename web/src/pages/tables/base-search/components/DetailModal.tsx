/*
 * @Author: changfeng
 * @LastEditors: changfeng
 * @LastEditTime: 2022-12-09 17:46:32
 * @Description: 添加子任务
 */
import React, {useState} from 'react'
import {
  Modal,
  Form,
  TreeSelect,
  Input,
  DatePicker,
  message,
  Select,
  Space,
  Button,
  Descriptions,
  Spin,
} from 'antd'
import {IItem} from '../io'

type TProps = IShowHide & {
  record: IItem
}

const DetailModal: React.FC<TProps> = ({record, onCancel, onFinish}) => {
  const [form] = Form.useForm()

  return (
    <Modal
      title="模版详情"
      open
      cancelText={null}
      width="600px"
      onCancel={() => {
        onCancel()
      }}
      footer={
        <Button onClick={onCancel} type="primary">
          确认
        </Button>
      }
      onOk={onCancel}
    >
      <Form
        form={form}
        {...{
          labelCol: {
            span: 5,
          },
          wrapperCol: {
            span: 18,
          },
          // colon: true,
        }}
        initialValues={record}
      >
        <Form.Item label="用户昵称" name="nickName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="邮箱地址" name="email">
          <Input disabled />
        </Form.Item>
        <Form.Item label="手机号" name="phone">
          <Input disabled />
        </Form.Item>
      </Form>
      <Descriptions title="其他信息" column={1}>
        <Descriptions.Item label="创建人">{record.createUser}</Descriptions.Item>
        <Descriptions.Item label="更新人">{record.updateUser}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default DetailModal
