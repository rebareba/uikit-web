import Layout from 'Uikit/Layout'
// import {withAuth} from '@store/withAuth'
import TableList from './table-list'

const Index = () => {
  return (
    <Layout>
      <div className="p-sm">
        <TableList />
      </div>
    </Layout>
  )
}

// export default withAuth(Index, 1)
export default Index
