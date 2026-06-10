import React, {useEffect, useState} from 'react'
import {Modal, Form, message, Input, Spin, Select} from 'antd'
import {useRequest} from 'ahooks'
import {antdUtils, Rules} from 'Uikit/Utils'
import io, {IItem} from '../io'

type PropsType = IShowHide & {
  record?: IItem
}

const AddModifyModal: React.FC<PropsType> = ({record, onCancel, onFinish}) => {
  const [form] = Form.useForm()
  const {runAsync: updateData, loading: updateLoading} = useRequest(io.updateData, {
    manual: true,
    onSuccess: (data, params) => {
      antdUtils.message?.success('更新成功！')
      onFinish?.()
      onCancel()
    },
    onError: (e, params) => {
      // antdUtils.message?.error('更新失败！')
    },
  })
  const {runAsync: createData, loading: createLoading} = useRequest(io.createData, {
    manual: true,
    onSuccess: (data, params) => {
      antdUtils.message?.success('新建成功！')
      // message.success('新建成功！')
      onFinish?.()
    },
    onError: (e, params) => {
      // antdUtils.message?.error('新建失败！')
    },
  })
  // 获取详情
  // const {
  //   data,
  //   loading: detailLoading,
  //   // mutate,
  // } = useRequest(io.getDetail, {
  //   // manual: true,
  //   onSuccess: (data, params) => {
  //     console.log('detailData', data)
  //   },
  //   ready: !!record,
  // })
  useEffect(() => {
    const formData = record || {}
    if (formData) {
      form.setFieldsValue(formData)
    }
  }, [record, form])

  const submit = async () => {
    try {
      const formData = await form.validateFields()
      try {
        if (record) {
          await updateData({...formData, id: record.id})
        } else {
          await createData(formData)
        }
      } catch (e) {
        console.error(e)
      }
      // history.push(`${pathPrefix}/detail/${content.projectId}`)
    } catch (e) {
      // TODO: 表单校验失败的处理
    }
  }

  return (
    <Modal
      title={record ? `编辑提示词` : `新建提示词`}
      open
      width="600px"
      onCancel={onCancel}
      confirmLoading={updateLoading || createLoading}
      onOk={submit}
    >
      {/* <Spin> */}
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
      >
        <Form.Item
          name="nickName"
          label="用户昵称"
          rules={[
            {
              required: true,
              message: '请输入用户昵称',
            },
            {
              pattern: Rules.username,
              message: '长度为2-31的大小写英文、中文-_',
            },
          ]}
        >
          <Input placeholder="请输入2-31个字符的用户名，仅支持中文、英文、数字、-、_、." />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱地址"
          rules={[
            {required: true, message: '请输入邮箱地址'},
            {pattern: Rules.mail, message: '请输入正确的邮箱地址'},
          ]}
        >
          <Input placeholder="请输入邮箱地址，如user@example.com" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            {
              required: true,
              message: '请输入手机号！',
            },
            {
              pattern: Rules.mobile,
              message: '请输入正确的手机号！',
            },
          ]}
        >
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>
        <Form.Item
          name="account"
          label="账户名称"
          rules={[
            {required: true, message: '请输入账户名称'},
            {pattern: Rules.name, message: '长度为2-31的大小写英文、中文-、_、.、和空格'},
          ]}
        >
          <Input placeholder="请输入账户名称，长度为2-31的大小写英文、中文-、_、.、和空格" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[]}>
          <Input.Password placeholder="请输入密码，如123456" />
        </Form.Item>
        <Form.Item name="isDeleted" label="状态">
          <Select placeholder="请选择状态">
            <Select.Option value={false}>启用</Select.Option>
            <Select.Option value>停用</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      {/* </Spin> */}
    </Modal>
  )
}

export default AddModifyModal
