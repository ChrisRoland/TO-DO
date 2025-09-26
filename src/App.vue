<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { RouterView } from 'vue-router'
import ErrorComponent from '@/components/ErrorComponent.vue'

const capturedError = ref<Error | null>(null)

onErrorCaptured((err) => {
  capturedError.value = err
  // Return false to prevent the error from propagating further up.
  return false
})
</script>

<template>
  <!-- If an error is captured, show the ErrorComponent -->
  <ErrorComponent v-if="capturedError" :error="capturedError" />
  
  <!-- Otherwise, show the regular router view -->
  <RouterView v-else />
</template>