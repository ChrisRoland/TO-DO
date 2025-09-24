import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from './stores/auth'

// Lazy-loaded components
const Landing = () => import('./views/Landing.vue')
const Login = () => import('./views/Login.vue')
const Register = () => import('./views/Register.vue')
const TodoList = () => import('./views/TodoList.vue')
const TodoDetail = () => import('./views/TodoDetail.vue')
const Important = () => import('./views/Important.vue')
const Archived = () => import('./views/Archived.vue')
const NotFound = () => import('./views/NotFound.vue')
const TestError = () => import('./views/TestError.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing,
      meta: { isPublic: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { isPublic: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { isPublic: true }
    },
    {
      path: '/app',
      name: 'App',
      redirect: '/app/todos',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'todos',
          name: 'TodoList',
          component: TodoList,
        },
        {
          path: 'todos/:id',
          name: 'TodoDetail',
          component: TodoDetail,
        },
        {
          path: 'important',
          name: 'Important',
          component: Important,
        },
        {
          path: 'archived',
          name: 'Archived',
          component: Archived,
        },
        {
          path: 'test-error',
          name: 'TestError',
          component: TestError,
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

// Navigation guard for authentication
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  // Wait for auth to initialize if it hasn't yet
  if (authStore.loading) {
    await new Promise(resolve => {
      const unwatch = watch(() => authStore.loading, (loading) => {
        if (!loading) {
          unwatch()
          resolve(undefined)
        }
      })
    })
  }
  
  if (to.meta.requiresAuth && !authStore.user) {
    return { name: 'Login' }
  }
  
  if (to.meta.isPublic && authStore.user && to.name !== 'Landing') {
    return { name: 'TodoList' }
  }
})

export default router