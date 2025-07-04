// Code to meet exam requirement
import React from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Navigate,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import App from './App'
import AppLayout from './App'
import Landing from './routes/Landing'
import Login from './routes/Login'
import Register from './routes/Register'
import TodoList from './routes/TodoList'
import TodoDetail from './routes/TodoDetail'
import Important from './routes/Important'
import Archived from './routes/Archived'
import NotFound from './routes/NotFound'
import ErrorComponent from './routes/ErrorComponent'
import TestError from './routes/TestError'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
})

// Public routes
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
})

// Protected app layout route
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: AppLayout,
})

// Protected app routes (children of appLayoutRoute)
const appIndexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: TodoList,
})

const todoDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/todos/$todoId',
  component: TodoDetail,
  parseParams: (params) => ({ todoId: (params.todoId) }),
})

const importantRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/important',
  component: Important,
})

const archivedRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/archived',
  component: Archived,
})

const testErrorRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/test-error',
  component: TestError,
})

// Catch-all route for unmatched paths
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
})

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  appLayoutRoute.addChildren([
    appIndexRoute,
    todoDetailRoute,
    importantRoute,
    archivedRoute,
    testErrorRoute,
  ]),
  notFoundRoute,
])

const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: NotFound,
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