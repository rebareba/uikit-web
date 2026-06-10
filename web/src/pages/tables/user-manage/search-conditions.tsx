import React, {useCallback, useEffect, useState} from 'react'

import {Button, DatePicker, Form, Input, Radio, Divider, Select, Col, Row, Space} from 'antd'
import {FormInstance} from 'antd/lib'

export const ROLES = [
  {value: 2, name: '学生'},
  {value: 1, name: '老师'},
  {value: 0, name: '管理员'},
]

interface ISerachConditionsProps {
  submit: () => void
  reset: () => void
  form: FormInstance
  loading: boolean
}
// 搜索条件
const SerachConditions: React.FC<ISerachConditionsProps> = ({form, reset, submit, loading}) => {
  return (
    <div>
      <Form form={form} colon={false} {...{wrapperCol: {span: 19}, labelCol: {span: 5}}}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="nickName" label="昵称">
              <Input placeholder="搜索昵称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="isDeleted" label="状态">
              <Select placeholder="请选择状态" allowClear>
                <Select.Option>全部</Select.Option>
                <Select.Option value={false}>启用</Select.Option>
                <Select.Option value>停用</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="roleType" label="角色">
              <Select placeholder="请选择角色" allowClear>
                <Select.Option>全部</Select.Option>
                {ROLES.map(it => {
                  return (
                    <Select.Option key={it.value} value={it.value}>
                      {it.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="email" label="邮箱">
              <Input placeholder="搜索邮箱" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="phone" label="手机号">
              <Input placeholder="搜索手机号" allowClear maxLength={11} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item className="text-right" labelCol={{span: 0}} wrapperCol={{span: 24}}>
              <Space>
                <Button type="primary" onClick={submit}>
                  查询
                </Button>
                <Button onClick={reset}>重置</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default SerachConditions
