<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSeo } from '@/composables/useSeo'
import { useQuery } from '@tanstack/vue-query'
import { RouterLink } from 'vue-router'
import { fetchTodos } from '@/api/todo'
import type { Todo } from '@/types/todo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchIcon, CheckCheckIcon, BadgeXIcon, PlusIcon, EditIcon, TrashIcon, RefreshCcw } from 'lucide-vue-next'
import CreateTodoModal from '@/components/CreateTodoModal.vue'
import UpdateTodoModal from '@/components/UpdateTodoModal.vue'
import DeleteTodoModal from '@/components/DeleteTodoModal.vue'

useSeo({ title: 'Your Todos - T0+D0' })
const { data: todos, isLoading, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

// States
const page = ref(1)
const search = ref('')
const status = ref('all')
const perPage = 10

const showCreateModal = ref(false)
const showUpdateModal = ref(false)
const showDeleteModal = ref(false)

const selectedTodoForUpdate = ref<Todo | null>(null)
const selectedTodoForDelete = ref<Todo | null>(null)

// Filtering and pagination logic with sorting added
// Filtering and pagination logic with better sorting strategy
const filtered = computed(() => {
  const filteredTodos = (todos.value || [])
    .filter((t: Todo) => !t.archived)
    .filter((t: Todo) => t.name.toLowerCase().includes(search.value.toLowerCase()))
    .filter((t: Todo) =>
      status.value === 'complete'
        ? t.status === 'DONE'
        : status.value === 'incomplete'
          ? t.status !== 'DONE'
          : true
    )

  // Sort by updatedAt (most recently updated first) since createdAt is unreliable
  return filteredTodos.sort((a, b) => {
    const updateA = new Date(a.updatedAt || '1970-01-01').getTime()
    const updateB = new Date(b.updatedAt || '1970-01-01').getTime()
    
    // Most recently updated first
    if (updateB !== updateA) {
      return updateB - updateA
    }
    
    // Fallback: alphabetical by name if update times are identical
    return a.name.localeCompare(b.name)
  })

})

const pageCount = computed(() => Math.ceil(filtered.value.length / perPage))
const paginated = computed(() =>
  filtered.value.slice((page.value - 1) * perPage, page.value * perPage)
)

// Event handlers
const openCreateModal = () => {
  showCreateModal.value = true
}
const openUpdateModal = (todo: Todo) => {
  selectedTodoForUpdate.value = todo
  showUpdateModal.value = true
}
const openDeleteModal = (todo: Todo) => {
  selectedTodoForDelete.value = todo
  showDeleteModal.value = true
}
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading">
      <!-- Search and filter skeleton -->
      <div class="flex flex-wrap gap-2 mb-6">
        <Skeleton class="h-10 w-full mb-4" />
      </div>
      
      <!-- Todo cards skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card v-for="i in 8" :key="i" class="border rounded-lg p-4">
          <Skeleton class="h-6 w-3/4 mb-3" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-1/2" />
            <Skeleton class="h-4 w-2/3" />
          </div>
        </Card>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="isError" class="animate-bounce max-w-md mx-auto bg-red-100 dark:bg-red-950 text-red-500 p-4 rounded-md">
      Failed to load todos.
    </div>

    <!-- Content -->
    <div v-else>
      <div class="flex flex-wrap gap-2 mb-6 relative">
        <Input
          placeholder="Search todos…"
          v-model="search"
          @update:model-value="page = 1"
          class="dark:bg-gray-300/30 dark:border-gray-500 mb-4"
        />
        <SearchIcon class="size-7 text-gray-500 dark:text-gray-400 absolute top-1 right-2" />

        <Button
          v-for="f in ['all', 'complete', 'incomplete']"
          :key="f"
          :variant="status === f ? 'default' : 'outline'"
          @click="status = f; page = 1"
        >
          {{ f.charAt(0).toUpperCase() + f.slice(1) }}
        </Button>

        <Button
          variant="default"
          @click="openCreateModal"
          class="bg-blue-600 dark:bg-blue-800 dark:text-white dark:hover:bg-blue-700 hover:bg-blue-800 sm:ml-auto"
        >
          <PlusIcon class="w-4 h-4 mr-1" />
          Add Todo
        </Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card
          v-for="todo in paginated"
          :key="todo.id"
          class="hover:scale-[1.02] hover:shadow-lg dark:shadow-white dark:hover:shadow transition duration-200 relative group"
        >
          <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" @click.prevent="openUpdateModal(todo)" class="h-8 w-8 p-0 hover:bg-blue-100" title="Edit todo">
              <EditIcon class="h-4 w-4 text-blue-600" />
            </Button>
            <Button size="sm" variant="ghost" @click.prevent="openDeleteModal(todo)" class="h-8 w-8 p-0 hover:bg-red-100" title="Delete todo">
              <TrashIcon class="h-4 w-4 text-red-600" />
            </Button>
          </div>

          <RouterLink :to="`/app/todos/${todo.id}`" class="text-lg max-sm:text-center font-medium">
            <CardHeader class="pr-16">{{ todo.name }}</CardHeader>
            <CardContent class="flex gap-3 max-sm:justify-between text-[14px] text-gray-600 dark:text-gray-400">
              <p>Priority: 
                <span :class="`inline-flex items-center flex-row gap-1 ${todo.priority === 'HIGH' ? 'text-red-500' : todo.priority === 'MEDIUM' ? 'text-yellow-500' : 'text-orange-500'}`">
                  <template v-if="todo.priority === 'HIGH'">(HIGH)</template>
                  <template v-else-if="todo.priority === 'MEDIUM'">(MED)</template>
                  <template v-else>(LOW)</template>
                </span>
              </p>
              <p>Status:
                <span :class="`inline-flex items-center flex-row gap-1 ${todo.status === 'DONE' ? 'text-green-500' : todo.status === 'IN_PROGRESS' ? 'text-yellow-500' : 'text-orange-500'}`">
                  <template v-if="todo.status === 'DONE'">Completed <CheckCheckIcon class="inline w-4 h-4 text-green-500" /></template>
                  <template v-else-if="todo.status === 'IN_PROGRESS'">In Progress <RefreshCcw class="inline w-4 h-4 text-yellow-500 animate-spin" /></template>
                  <template v-else>Todo <BadgeXIcon class="inline w-3 h-3 text-orange-500" /></template>
                </span>
              </p>
            </CardContent>
          </RouterLink>
        </Card>
      </div>

      <div v-if="!isLoading && filtered.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p class="text-lg">No todos found</p>
        <p v-if="search" class="text-sm mt-2">Try adjusting your search term or filters</p>
      </div>

      <div v-if="!isLoading && filtered.length > 0" class="flex items-center justify-between mt-6 mb-2 text-sm text-gray-600 dark:text-gray-400">
        <div>
          Showing {{ (page - 1) * perPage + 1 }} to {{ Math.min(page * perPage, filtered.length) }} of {{ filtered.length }}
        </div>
        <div class="flex items-center gap-2">
            <Button @click="page = 1" :disabled="page === 1" variant="ghost" size="sm" class="px-2" title="Go to first page">
              <span class="hidden sm:inline">««</span>
              <span class="sm:hidden">‹‹</span>
            </Button>
            <Button @click="page = Math.max(page - 1, 1)" :disabled="page === 1" variant="ghost" size="sm">
              Previous
            </Button>
            <div class="flex items-center gap-1 px-2">
              <span>{{ page }}</span> / <span>{{ pageCount }}</span>
            </div>
            <Button @click="page = Math.min(page + 1, pageCount)" :disabled="page === pageCount" variant="ghost" size="sm">
              Next
            </Button>
            <Button @click="page = pageCount" :disabled="page === pageCount" variant="ghost" size="sm" class="px-2" title="Go to last page">
              <span class="hidden sm:inline">»»</span>
              <span class="sm:hidden">››</span>
            </Button>
        </div>
      </div>

      </div>
      <CreateTodoModal :is-open="showCreateModal" @close="showCreateModal = false" />
      <UpdateTodoModal :is-open="showUpdateModal" @close="showUpdateModal = false" :todo="selectedTodoForUpdate" />
      <DeleteTodoModal :is-open="showDeleteModal" @close="showDeleteModal = false" :todo="selectedTodoForDelete" />
  </div>
</template>