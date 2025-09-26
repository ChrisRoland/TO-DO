<script setup lang="ts">
defineOptions({ name: 'ArchivedTasks' })
import { computed } from 'vue'
import { useSeo } from '@/composables/useSeo'
import { useQuery } from '@tanstack/vue-query'
import { fetchTodos } from '@/api/todo'
import { RouterLink } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

useSeo({ title: 'Archived Tasks - T0+D0' })
import type { Todo } from '@/types/todo'

const { data: todos, isLoading, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  initialData: [],
})

const archived = computed(() => (todos.value ?? []).filter((todo: Todo) => todo.archived === true))
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Archived Tasks</h1>

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
      Failed to load archived tasks.
    </p>

    <div v-else>
      <p v-if="archived.length === 0">No archived tasks.</p>
      <ul v-else class="space-y-2 text-[19px]">
        <li
          v-for="todo in archived"
          :key="todo.id"
          class="p-2 border border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <RouterLink :to="`/app/todos/${todo.id}`" class="font-medium">
            {{ todo.name }}
          </RouterLink>
          <span
            :class="[
              'ml-1 text-sm sm:text-xs font-semibold',
              todo.priority === 'HIGH' ? 'text-red-500' :
              todo.priority === 'MEDIUM' ? 'text-yellow-500' :
              'text-orange-500'
            ]"
          >
            Priority: ({{ todo.priority }})
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>