<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { deleteTodo } from '@/api/todo'
import type { Todo } from '@/types/todo'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertTriangleIcon } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean,
  todo: Todo | null
}>()

const emit = defineEmits(['close'])

const queryClient = useQueryClient()

const { isPending, mutate } = useMutation({
  mutationFn: deleteTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    toast.success('Todo deleted successfully!')
    emit('close')
  },
})

const handleDelete = () => {
  if (props.todo) {
    mutate(props.todo.id)
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => !val && emit('close')">
    <DialogContent v-if="todo">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2 text-red-600">
          <AlertTriangleIcon class="h-5 w-5" />
          Delete Todo
        </DialogTitle>
      </DialogHeader>
      <div class="py-4">
        <p class="text-base mb-2">
          Are you sure you want to delete <strong>"{{ todo.name }}"</strong>?
        </p>
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
          <div class="flex items-center gap-2">
            <AlertTriangleIcon class="h-4 w-4 text-red-500" />
            <p class="text-sm text-red-700 dark:text-red-400 font-medium">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" @click="emit('close')" :disabled="isPending">
          Cancel
        </Button>
        <Button type="button" variant="destructive" @click="handleDelete" :disabled="isPending" class="bg-red-600 hover:bg-red-700">
          {{ isPending ? "Deleting..." : "Delete Todo" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>