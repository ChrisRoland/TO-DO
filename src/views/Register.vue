<template>
  <div class="flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <CheckSquare class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Register</h2>
      <p class="text-gray-600 dark:text-gray-300">Registration functionality coming soon...</p>
      <div class="mt-6">
        <RouterLink to="/" class="text-blue-600 hover:text-blue-700">
          ← Back to Landing
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckSquare } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>