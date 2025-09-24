<template>
  <div>
    <!-- Initialize auth store -->
    <div v-if="authStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
    
    <div v-else-if="$route.meta.requiresAuth" class="flex h-screen bg-white dark:bg-gray-800">
      <SideBar :is-open="sidebarOpen" @close="() => setSidebarOpen(false)" />
      
      <main class="flex-1 overflow-y-auto" role="main" aria-label="Main content">
        <!-- The Header on mobile with Hamburger Menu -->
        <div class="lg:hidden flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 border-b">
          <button
            @click="() => setSidebarOpen(true)"
            class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Open menu"
          >
            <Menu :size="24" />
          </button>
          <h1 class="text-xl font-bold">T0 + D0</h1>
          <div class="w-10" />
        </div>
        
        <div class="p-6">
          <RouterView />
        </div>
      </main>
    </div>
    
    <!-- Public routes (Landing, Login, Register) -->
    <div v-else class="min-h-screen">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Menu } from 'lucide-vue-next'
import SideBar from '@/components/SideBar.vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const sidebarOpen = ref(false)

const setSidebarOpen = (value: boolean) => {
  sidebarOpen.value = value
}

// Initialize auth on app startup
onMounted(() => {
  authStore.initialize()
})
</script>