<template>
  <div class="flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-red-500 mb-2">Test Error</h2>
      <p class="text-gray-600 dark:text-gray-300">This is a test error page for development.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component intentionally throws an error for testing
throw new Error('This is a test error!')
</script>