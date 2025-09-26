<script setup lang="ts">
defineOptions({ name: 'ImportantTasks' })

import { computed } from 'vue'
import { useSeo } from '@/composables/useSeo'
import { useQuery } from '@tanstack/vue-query'
import { fetchTodos } from '@/api/todo'
import { RouterLink } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Todo } from '@/types/todo'

useSeo({ title: 'Important Tasks - T0+D0' })
const { data: todos, isLoading, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  initialData: [],
})

const highPriority = computed(() => (todos.value || []).filter((todo: Todo) => todo.priority === 'HIGH' && !todo.archived))
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Important Tasks</h1>

    <Card v-if="isLoading">
      <CardContent class="p-6 space-y-2">
        <Skeleton class="h-8 w-1/4" />
        <Skeleton class="h-6 w-full" />
        <Skeleton class="h-6 w-full" />
        <Skeleton class="h-6 w-full" />
        <Skeleton class="h-6 w-full" />
      </CardContent>
    </Card>

    <p v-else-if="isError" class="animate-bounce max-w-md mx-auto bg-red-100 dark:bg-red-950 text-red-500">
      Failed to load important tasks.
    </p>

    <div v-else>
      <p v-if="highPriority.length === 0">No high-priority tasks.</p>
      <ul v-else class="space-y-2 text-[19px]">
        <li
          v-for="todo in highPriority"
          :key="todo.id"
          class="p-2 border border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <RouterLink :to="`/app/todos/${todo.id}`" class="font-medium">
            {{ todo.name }}
          </RouterLink>
          <span
            :class="[
              'ml-2 text-sm sm:text-xs font-semibold',
              todo.status === 'DONE' ? 'text-green-500/85 max-sm:text-green-500' : 
              todo.status === 'IN_PROGRESS' ? 'text-yellow-500/85 max-sm:text-yellow-500' : 
              'text-orange-500/85 max-sm:text-orange-500'
            ]"
          >
            Status: {{ todo.status === "DONE" ? " Completed" : todo.status === "IN_PROGRESS" ? " In Progress" : " Todo" }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>