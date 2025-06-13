// Code to meet exam requirement
import React from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import App from './App'
import TodoList from './routes/TodoList'
import TodoDetail from './routes/TodoDetail'
import Important from './routes/Important'
import NotFound from './routes/NotFound'
import ErrorComponent from './routes/ErrorComponent'

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
})

const listRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TodoList,
})

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todos/$todoId',
  component: TodoDetail,
  parseParams: (params) => ({ todoId: (params.todoId) }),
})

const importantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/important',
  component: Important,
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
})

const routeTree = rootRoute.addChildren([
  listRoute,
  detailRoute,
  importantRoute,
  notFoundRoute,
])

const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: NotFound, // fallback
})

export default router



// CODE FOR MY PREFFERED UI
// Please ignore, I plan to use it later

// import React from 'react'
// import {
//   createRootRoute,
//   createRoute,
//   createRouter,
//   Outlet,
// } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// import App from './App'
// import TodoList from './routes/TodoList'
// import Important from './routes/Important'
// import NotFound from './routes/NotFound'
// import ErrorComponent from './routes/ErrorComponent'

//root-layout route
// const rootRoute = createRootRoute({
//   component: App,
//   notFoundComponent: NotFound,
//   errorComponent: ErrorComponent,
// })

// const listRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/',
//   component: TodoList,
// })

// const importantRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/important',
//   component: Important,
// })

// // Catch-all route for unmatched paths
// const notFoundRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '*',
//   component: NotFound,
// })

// // route tree and router
// const routeTree = rootRoute.addChildren([
//   listRoute,
//   importantRoute,
//   notFoundRoute,
// ])

// const router = createRouter({ 
//   routeTree,
//   defaultNotFoundComponent: NotFound, // fallback
// })

// export default router