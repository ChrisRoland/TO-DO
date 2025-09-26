<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { fetchTodo } from '@/api/todo'
// import type { Todo } from '@/types/todo'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, EditIcon, TrashIcon } from 'lucide-vue-next'
import UpdateTodoModal from '@/components/UpdateTodoModal.vue'
import DeleteTodoModal from '@/components/DeleteTodoModal.vue'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()
const todoId = ref(route.params.todoId as string)
useSeo({ title: 'Todo Details - T0+D0' })

const {
  data: todo,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetchTodo(todoId.value),
  enabled: !!todoId.value,
})

// Modal states and handlers
const showUpdateModal = ref(false)
const showDeleteModal = ref(false)

const handleUpdateSuccess = () => {
  queryClient.invalidateQueries({ queryKey: ['todo', todoId.value] })
  showUpdateModal.value = false
}

const handleDeleteSuccess = () => {
  showDeleteModal.value = false
  router.push('/app')
}
</script>

<template>
  <main class="max-w-md mx-auto">
    <!-- 1. Invalid ID State -->
    <Card v-if="!todoId" class="bg-red-100 dark:bg-red-950 text-red-500">
      <CardContent class="p-6 text-center">
        <p>* Invalid todo ID *</p>
        <Button @click="router.push('/app')" class="mt-4">
          Back to List
        </Button>
      </CardContent>
    </Card>

    <!-- Loading State -->
    <Card v-else-if="isLoading" class="max-w-md mx-auto">
      <CardContent class="p-6">
        <Skeleton class="h-6 w-3/4 mb-4" />
        <Skeleton class="h-4 w-1/2 mb-2" />
        <Skeleton class="h-4 w-1/3 mb-2" />
        <Skeleton class="h-4 w-1/3 mb-2" />
        <Skeleton class="h-4 w-4/4" />
      </CardContent>
    </Card>

    <!-- Error State -->
    <Card v-else-if="isError" class="bg-red-100 dark:bg-red-950 text-red-500">
      <CardContent class="p-6 text-center">
        <p>* Error loading todo: {{ error?.message || "Unknown error" }} *</p>
        <Button @click="router.push('/app')" class="mt-4">Back to List</Button>
      </CardContent>
    </Card>

    <!-- Not Found State -->
     <Card v-else-if="!todo" class="bg-red-100 dark:bg-red-950 text-red-500">
        <CardContent class="p-6 text-center">
          <p>Todo not found</p>
          <Button @click="router.push('/app')" class="mt-4">Back to List</Button>
        </CardContent>
      </Card>

    <!-- Success State -->
    <Card v-else class="relative">
      <div class="flex items-center mt-4">
        <Button @click="router.push('/app')" variant="ghost" size="sm" class="p-2 ml-5">
          <ChevronLeft class="w-4 h-4" />
        </Button>
      </div>
      <div class="absolute top-3 right-3 flex items-center gap-1">
        <Button size="sm" variant="ghost" @click="showUpdateModal = true" class="h-8 w-8 p-0 hover:bg-blue-100" title="Edit todo">
          <EditIcon class="!h-5 !w-5 sm:!h-4 sm:!w-4 text-blue-600" />
        </Button>
        <Button size="sm" variant="ghost" @click="showDeleteModal = true" class="h-8 w-8 p-0 hover:bg-red-100" title="Delete todo">
          <TrashIcon class="!h-5 !w-5 sm:!h-4 sm:!w-4 text-red-600" />
        </Button>
      </div>
      <h3 class="w-full text-xl text-center font-semibold ml-2">Todo Details</h3>
      <CardHeader>
        <h2 class="text-lg font-semibold">{{ todo.name }}</h2>
      </CardHeader>
      <CardContent>
        <div class="space-y-2 text-sm">
            <p><strong>Status:</strong> <span :class="`${todo.status === 'DONE' ? 'text-green-500' : todo.status === 'IN_PROGRESS' ? 'text-yellow-500' : 'text-orange-500'}`">{{ todo.status === "DONE" ? " Completed" : todo.status === "IN_PROGRESS" ? " In Progress" : " Todo" }}</span></p>
            <p><strong>Priority:</strong> <span :class="`${todo.priority === 'HIGH' ? 'text-red-500' : todo.priority === 'MEDIUM' ? 'text-yellow-500' : 'text-orange-500'}`">{{ todo.priority }}</span></p>
            <p><strong>Archived:</strong> {{ todo.archived ? "Yes" : "No" }}</p>
            <p class="!my-5 text-center text-[16px] text-gray-600 dark:text-gray-300">
              <strong>Description: </strong> <br />
              {{ todo.description }}
            </p>
            <div class="flex gap-4 justify-center text-sm text-center">
              <p v-if="todo.createdAt"><strong>Created:</strong> {{ todo.createdAt.slice(0, 10) }} ~ {{ todo.createdAt.slice(11, 19) }}</p>
              <p v-if="todo.updatedAt"><strong>Updated:</strong> {{ todo.updatedAt.slice(0, 10) }} ~ {{ todo.updatedAt.slice(11, 19) }}</p>
            </div>
        </div>
      </CardContent>
    </Card>

    <!-- Modals -->
    <UpdateTodoModal
      v-if="todo"
      :is-open="showUpdateModal"
      @close="handleUpdateSuccess"
      :todo="todo"
    />
    <DeleteTodoModal
      v-if="todo"
      :is-open="showDeleteModal"
      @close="handleDeleteSuccess"
      :todo="todo"
    />
  </main>
</template>