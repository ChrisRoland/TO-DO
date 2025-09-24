<template>
  <div>
    <!-- Mobile Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="$emit('close')"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'flex flex-col justify-between bg-gray-200 dark:bg-gray-900 w-60 p-4 h-screen',
        'fixed lg:relative z-50 lg:z-auto',
        'transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="flex justify-between items-center lg:hidden mb-4">
        <RouterLink to="/app" @click="$emit('close')" class="text-2xl font-bold">
          T0 + D0
        </RouterLink>
        <button
          @click="$emit('close')"
          class="p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Top Section -->
      <div class="space-y-6">
        <RouterLink to="/app" class="text-2xl font-bold hidden lg:block">
          T0 + D0
        </RouterLink>

        <!-- User Info -->
        <div v-if="authStore.user" class="bg-gray-300/50 dark:bg-gray-700/50 rounded-lg p-3">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <img
                v-if="authStore.getUserAvatarUrl()"
                :src="authStore.getUserAvatarUrl()!"
                :alt="authStore.getUserDisplayName()!"
                class="w-full h-full rounded-full object-cover"
                @error="showFallbackAvatar = true"
              />
              <User v-else class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ authStore.getUserDisplayName() }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ authStore.user.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="space-y-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="$emit('close')"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive(item.path) 
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <component :is="item.icon" :class="['h-5 w-5', item.iconColor]" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
      </div>

      <!-- Bottom Section -->
      <div class="space-y-4">
        <!-- Theme Toggle -->
        <button
          @click="themeStore.toggleTheme"
          class="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Sun v-if="themeStore.theme === 'dark'" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
          <span>Switch to {{ themeStore.theme === 'light' ? 'Dark' : 'Light' }} Mode</span>
        </button>

        <!-- Sign Out -->
        <button
          v-if="authStore.user"
          @click="handleSignOut"
          class="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut class="h-5 w-5" />
          <span>Sign Out</span>
        </button>

        <!-- Footer -->
        <div class="pt-4 border-t border-gray-300 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
            © 2025 T0 + D0
          </p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Sun, Moon, CheckSquare, Star, Archive, X, LogOut, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { RouterLink } from 'vue-router'

interface SideBarProps {
  isOpen: boolean
}

defineProps<SideBarProps>()
defineEmits<{
  close: []
}>()

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const showFallbackAvatar = ref(false)

// Function to check if a route is active
const isActive = (path: string) => {
  if (path === '/app/' || path === '/app') {
    return route.path === '/app' || route.path === '/app/' || route.path === '/app/todos'
  }
  return route.path.startsWith(path)
}

const navItems = [
  {
    path: '/app/todos',
    label: 'Todos',
    icon: CheckSquare,
    iconColor: 'text-blue-500'
  },
  {
    path: '/app/important',
    label: 'Important',
    icon: Star,
    iconColor: 'text-yellow-500'
  },
  {
    path: '/app/archived',
    label: 'Archives',
    icon: Archive,
    iconColor: 'text-gray-500'
  }
]

const handleSignOut = async () => {
  await authStore.signOut()
  // Close sidebar after sign out
  // The router navigation will be handled by the auth guard
}
</script>