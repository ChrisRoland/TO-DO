<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { Sun, Moon, CheckSquare, Star, Archive, X, LogOut } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const themeStore = useThemeStore()
const auth = useAuthStore()
const route = useRoute()

const isActive = (path: string) => {
  if (path === '/app/') {
    return route.path === '/app' || route.path === '/app/'
  }
  return route.path.startsWith(path)
}

const navItems = [
  { path: '/app/', label: 'Todos', icon: CheckSquare, iconColor: 'text-blue-500' },
  { path: '/app/important', label: 'Important', icon: Star, iconColor: 'text-yellow-500' },
  { path: '/app/archived', label: 'Archives', icon: Archive, iconColor: 'text-gray-500' },
]

const handleSignOut = async () => {
  await auth.signOut()
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    @click="emit('close')"
  />

  <aside
    :class="[
      'flex flex-col justify-between bg-gray-200 dark:bg-gray-900 w-60 p-4 h-screen',
      'fixed lg:relative z-50 lg:z-auto',
      'transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex justify-between items-center lg:hidden mb-4">
      <RouterLink to="/app" @click="emit('close')" class="text-2xl font-bold text-white">
        T0 + D0
      </RouterLink>
      <button @click="emit('close')" class="p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700">
        <X :size="20" />
      </button>
    </div>

    <div class="space-y-6">
      <RouterLink to="/app" class="text-2xl font-bold hidden lg:block">
        T0 + D0
      </RouterLink>

      <div v-if="auth.user" class="bg-gray-300/50 dark:bg-gray-700/50 rounded-lg p-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <img
              v-if="auth.getUserAvatarUrl"
              :src="auth.getUserAvatarUrl"
              :alt="auth.getUserDisplayName || 'User'"
              class="w-full h-full rounded-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ auth.getUserDisplayName }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ auth.user.email }}
            </p>
          </div>
        </div>
      </div>

      <nav>
        <ul class="space-y-2">
          <li
            v-for="item in navItems"
            :key="item.path"
            :class="[
              'px-2 py-1 rounded transition duration-300 border-2',
              isActive(item.path)
                ? 'bg-gray-400 dark:bg-gray-300/30 border-gray-600 dark:border-gray-400 shadow-sm'
                : 'border-transparent hover:bg-gray-300 dark:hover:bg-gray-700',
            ]"
          >
            <RouterLink
              :to="item.path"
              :class="[
                'flex gap-2 items-center',
                isActive(item.path) ? 'font-semibold' : 'text-gray-700 dark:text-gray-300',
              ]"
              @click="emit('close')"
            >
              <component :is="item.icon" :class="['size-4', isActive(item.path) ? '' : item.iconColor]" />
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="flex flex-col items-center space-y-3">
      <button @click="themeStore.toggleTheme" aria-label="Toggle light/dark mode" class="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600">
        <Moon v-if="themeStore.theme === 'light'" :size="20" />
        <Sun v-else :size="20" />
      </button>
      <p class="text-xs text-center">
        {{ themeStore.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode' }}
      </p>

      <Button @click="handleSignOut" variant="ghost" size="sm" class="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20">
        <LogOut class="w-4 h-4 mr-2" />
        Sign Out
      </Button>

      <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
        © {{ new Date().getFullYear() }} T0 + D0
      </p>
    </div>
  </aside>
</template>