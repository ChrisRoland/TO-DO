// src/router.jsx
import React from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import App from './App'
import TodoList from './pages/TodoList'
import TodoDetail from './pages/TodoDetail'
import Important from './pages/Important'
import NotFound from './pages/NotFound'
import ErrorComponent from './pages/ErrorComponent'


// 1) Define root-layout route
const rootRoute = createRootRoute({
  // Renders your <App> (which contains the <Outlet/> for children)
  component: App,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
})

// 2) Define all child routes
const listRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TodoList,
})

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todos/$todoId',
  component: TodoDetail,
  parseParams: (params) => ({ todoId: Number(params.todoId) }),
})

const importantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/important',
  component: Important,
})

// Catch-all route for unmatched paths
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
})

// 3) Build the route tree and router
const routeTree = rootRoute.addChildren([
  listRoute,
  detailRoute,
  importantRoute,
  notFoundRoute, // Add the catch-all route
])

const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: NotFound, // Router-level fallback
})

// 4) Export the router instance directly
export default router