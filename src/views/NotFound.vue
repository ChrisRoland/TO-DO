<template>
  <div class="flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">The page you're looking for doesn't exist.</p>
      <RouterLink to="/" class="text-blue-600 hover:text-blue-700 font-medium">
        ← Go Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>