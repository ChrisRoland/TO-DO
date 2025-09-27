<!-- <script setup lang="ts">
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
</template> -->

<script setup lang="ts">
import { ref } from 'vue'
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { RouterView } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import AiAssistant from '@/components/AiAssistant.vue'
import RealtimePresence from '@/components/RealTimeUserPresence.vue'
import { Menu, Bot } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const sidebarOpen = ref(false)
const aiAssistantOpen = ref(false)
</script>

<template>
  <div class="flex h-screen bg-white dark:bg-gray-800">
    <SideBar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="flex-1 overflow-y-auto relative" role="main" aria-label="Main content">
      <!-- presence indicator -->
      <div class="flex items-center justify-center p-4 max-sm:p-2">
        <RealtimePresence />
      </div>
      <!-- Mobile Header -->
      <div
        class="lg:hidden flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 border-b"
      >
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

      <!-- Floating AI Assistant Button -->
      <Button
        @click="aiAssistantOpen = true"
        class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl animate-bounce  transition-all duration-1000 z-40"
        size="icon"
        title="AI Task Assistant"
      >
        <p class="hover:animate-bounce">
          <Bot class="w-6 h-6 text-white" />
        </p>
      </Button>

      <!-- AI Assistant Modal -->
      <AiAssistant :is-open="aiAssistantOpen" @close="aiAssistantOpen = false" />
    </main>
    <Toaster position="top-center" />
  </div>
</template>
