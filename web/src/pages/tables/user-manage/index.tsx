import Layout from 'Uikit/Layout'
// import {withAuth} from '@store/withAuth'
import {Splitter} from 'antd'
import {useSelector} from 'Uikit/Utils'
import {useEffect} from 'react'
import TableList from './table-list'
import SelectTree from './left-tree'
import useStore from './store'

const Index = () => {
  const {getAllRoles} = useStore(useSelector(['getAllRoles']))
  useEffect(() => {
    getAllRoles()
  }, [getAllRoles])
  return (
    <Layout>
      <Splitter className="h-full">
        <Splitter.Panel defaultSize="250" min={100} max={500}>
          <div className="p-sm min-w-[250px]">
            <SelectTree />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div className="p-sm h-full">
            <TableList />
          </div>
        </Splitter.Panel>
      </Splitter>
    </Layout>
  )
}

// export default withAuth(Index, 1)
export default Index
