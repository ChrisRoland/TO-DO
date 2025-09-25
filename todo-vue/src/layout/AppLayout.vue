<script setup lang="ts">
import { ref } from 'vue'
import 'vue-sonner/style.css'
import { Toaster } from "@/components/ui/sonner"
import { RouterView } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import { Menu } from 'lucide-vue-next'

const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex h-screen bg-white dark:bg-gray-800">
      <SideBar :is-open="sidebarOpen" @close="sidebarOpen = false" />
      <main class="flex-1 overflow-y-auto" role="main" aria-label="Main content">
      <!-- Mobile Header -->
      <div class="lg:hidden flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 border-b">
        <button
          @click="sidebarOpen = true"
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
    <Toaster position="top-center" />
  </div>
</template>
