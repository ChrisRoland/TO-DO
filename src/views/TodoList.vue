<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Todos</h1>
      <Button class="bg-blue-600 hover:bg-blue-700 text-white">
        <PlusIcon class="h-4 w-4 mr-2" />
        Add Todo
      </Button>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 space-y-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            v-model="search"
            type="text"
            placeholder="Search todos..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div class="flex gap-2">
          <Button
            :variant="status === 'all' ? 'default' : 'outline'"
            @click="status = 'all'"
            class="px-4 py-2"
          >
            All
          </Button>
          <Button
            :variant="status === 'complete' ? 'default' : 'outline'"
            @click="status = 'complete'"
            class="px-4 py-2"
          >
            Complete
          </Button>
          <Button
            :variant="status === 'incomplete' ? 'default' : 'outline'"
            @click="status = 'incomplete'"
            class="px-4 py-2"
          >
            Incomplete
          </Button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <Card v-for="i in 5" :key="i" class="p-4">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="text-center py-8">
      <p class="text-red-500 text-lg">Failed to load todos. Please try again.</p>
      <Button @click="() => refetch()" class="mt-4">
        <RefreshCcw class="h-4 w-4 mr-2" />
        Retry
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTodos.length === 0" class="text-center py-12">
      <CheckSquare class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No todos found</h3>
      <p class="text-gray-500 dark:text-gray-400">
        {{ search ? 'Try adjusting your search or filters.' : 'Get started by creating your first todo!' }}
      </p>
    </div>

    <!-- Todos Grid -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card 
        v-for="todo in paginatedTodos" 
        :key="todo.id"
        class="p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="$router.push(`/app/todos/${todo.id}`)"
      >
        <div class="space-y-2">
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ todo.name }}</h3>
          <p v-if="todo.description" class="text-sm text-gray-600 dark:text-gray-300">
            {{ todo.description }}
          </p>
          <div class="flex items-center justify-between">
            <span 
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                todo.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                todo.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              ]"
            >
              {{ todo.priority }}
            </span>
            <span 
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                todo.status === 'DONE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                todo.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              ]"
            >
              {{ todo.status.replace('_', ' ') }}
            </span>
          </div>
        </div>
      </Card>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center space-x-2">
      <Button
        variant="outline"
        :disabled="page <= 1"
        @click="page--"
      >
        Previous
      </Button>
      <span class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
        Page {{ page }} of {{ totalPages }}
      </span>
      <Button
        variant="outline"
        :disabled="page >= totalPages"
        @click="page++"
      >
        Next
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { CheckSquare, SearchIcon, PlusIcon, RefreshCcw } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import { fetchTodos } from '@/api/todo'
import type { Todo } from '@/types/todo'

// Reactive state
const page = ref(1)
const search = ref('')
const status = ref('all')
const perPage = 10

// Data fetching
const { data: todos, isLoading, isError, refetch } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos
})

// Computed properties
const filteredTodos = computed(() => {
  const todoList = todos.value || []
  let filtered = todoList.filter((t: Todo) => !t.archived)

  // Search filter
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter((t: Todo) => 
      t.name.toLowerCase().includes(searchLower) ||
      (t.description && t.description.toLowerCase().includes(searchLower))
    )
  }

  // Status filter
  if (status.value === 'complete') {
    filtered = filtered.filter((t: Todo) => t.status === 'DONE')
  } else if (status.value === 'incomplete') {
    filtered = filtered.filter((t: Todo) => t.status !== 'DONE')
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredTodos.value.length / perPage))

const paginatedTodos = computed(() => {
  const start = (page.value - 1) * perPage
  const end = start + perPage
  return filteredTodos.value.slice(start, end)
})

// Watch for filter changes to reset pagination
watch([search, status], () => {
  page.value = 1
})
</script>