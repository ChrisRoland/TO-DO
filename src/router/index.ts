import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AppLayout from '@/layout/AppLayout.vue'
import Landing from '@/views/Landing.vue'
import Login from '@/views/LoginPage.vue'
import Register from '@/views/Register.vue'
import TodoList from '@/views/TodoList.vue'
import Important from '@/views/Important.vue'
import Archived from '@/views/Archived.vue'
import TodoDetail from '@/views/TodoDetail.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Landing },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
      path: '/app',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', component: TodoList },
        { path: 'important', component: Important },
        { path: 'archived', component: Archived },
        { path: 'todos/:todoId', component: TodoDetail },
      ],
    },
    {
      path: '/:pathMatch(.*)*', // Catch-all route
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (auth.loading) {
      await new Promise((resolve) => {
        const unsubscribe = auth.$subscribe((_mutation, state) => {
          if (!state.loading) {
            unsubscribe()
            resolve(undefined)
          }
        })
      })
    }
    if (!auth.user) {
      return next({ path: '/login' })
    }
  }
  next()
})

export default router
