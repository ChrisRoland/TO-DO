<template>
  <div class="flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <Archive class="h-16 w-16 text-gray-500 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Archived Tasks</h2>
      <p class="text-gray-600 dark:text-gray-300">Completed and archived todos will appear here...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Archive } from 'lucide-vue-next'
</script>