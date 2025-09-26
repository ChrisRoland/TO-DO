<script setup lang="ts">
throw new Error('This is a test error to check if the error boundary works');
</script>

<template>
  <div>
    <h1>If you can see this, the error handling isn't working</h1>
  </div>
</template>