import Layout from 'Uikit/Layout'
// import {withAuth} from '@store/withAuth'
import {Form} from 'antd'
import {useAntdTable, useRequest} from 'ahooks'
import {createAntdTableFetcher} from 'Uikit/Utils'
import io, {IItem, TVisible} from './io'
import TableList from './table-list'
import SerachConditions from './search-conditions'

const Index = () => {
  // 使用ahooks的useAntdTable的封装
  const [form] = Form.useForm()

  const {
    loading,
    params,
    tableProps,
    search: {reset, submit, type, changeType},
  } = useAntdTable(createAntdTableFetcher<IItem>(io.getPageList), {
    form,
    defaultPageSize: 10,
    refreshDeps: [],
  })
  return (
    <Layout>
      <div className="p-sm">
        <div>
          <SerachConditions submit={submit} reset={reset} form={form} loading={loading} />
        </div>
        <TableList tableProps={tableProps} reloadData={submit} />
      </div>
    </Layout>
  )
}

// export default withAuth(Index, 1)
export default Index
