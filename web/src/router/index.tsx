import {createBrowserRouter, Navigate, RouteObject} from 'react-router-dom'
import {Error500Page} from 'Uikit/Components'
import Frame from './frame/Frame'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/tables/base" />,
  },
  {
    path: '*',
    element: <Frame />,
    children: [],
    errorElement: <Error500Page />,
  },
]

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(routes)
