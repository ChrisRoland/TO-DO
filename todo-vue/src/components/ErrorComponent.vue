<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

defineProps<{
  error: Error | null
}>()

useSeo({ title: 'Error - T0+D0' })
const reset = () => {
  window.location.reload()
}
</script>

<template>
  <main class="bg-red-200 p-8">
    <h1 class="text-center text-3xl font-bold mb-4 text-red-600">
      Something went wrong
    </h1>
    <pre class="whitespace-pre-wrap bg-red-900 text-white p-4 rounded animate-pulse">
      * {{ error?.message || 'An unknown error occurred' }} *
    </pre>
    <button
      @click="reset"
      class="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
    >
      Try again
    </button>
  </main>
</template>