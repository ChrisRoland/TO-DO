<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateTodo } from '@/api/todo'
import type { Todo, UpdateTodoData } from '@/types/todo'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const props = defineProps<{
  isOpen: boolean,
  todo: Todo | null
}>()

const emit = defineEmits(['close'])

const queryClient = useQueryClient()

const formState = ref<UpdateTodoData>({})

const { isPending, mutate } = useMutation({
  mutationFn: (vars: { id: string, data: UpdateTodoData }) => updateTodo(vars.id, vars.data),
  onSuccess: () => {
    toast.success('Todo updated successfully!')
    
    // Invalidate both the todos list and the individual todo query
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    if (props.todo?.id) {
      queryClient.invalidateQueries({ queryKey: ['todo', props.todo.id] })
    }
    emit('close')
  },
  onError: (error) => {
    console.error('Update failed:', error)
    toast.error('Failed to update todo. Please try again.')
  }
})

const handleSubmit = () => {
  if (props.todo && formState.value.name?.trim()) {
    console.log('Submitting form with data:', formState.value) // Debug log
    mutate({ id: props.todo.id, data: formState.value })
  }
}

watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    formState.value = {
      name: newTodo.name || '',
      description: newTodo.description || '',
      status: newTodo.status || 'TODO',
      priority: newTodo.priority || 'LOW',
      archived: newTodo.archived || false,
    }
    console.log('Form state initialized:', formState.value) // Debug log
  }
}, { immediate: true })
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => !val && emit('close')">
    <DialogContent v-if="todo">
      <DialogHeader>
        <DialogTitle>Update Todo</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 py-4">
            <div>
                <Label for="update-name">Name <span class="text-red-500">*</span></Label>
                <Input id="update-name" v-model="formState.name" :disabled="isPending" />
            </div>
            <div>
                <Label for="update-description">Description</Label>
                <Input id="update-description" v-model="formState.description" :disabled="isPending" />
            </div>
            <div>
                  <Label for="update-priority">Priority</Label>
                  <Select v-model="formState.priority" :disabled="isPending">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
            </div>
            <div>
                <Label for="update-status">Status</Label>
                <Select v-model="formState.status" :disabled="isPending">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="TODO">Todo</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div class="flex items-center space-x-2">
                <!-- Fixed Switch binding with debug -->
                <Switch 
                  id="update-archived" 
                  v-model:model-value="formState.archived"
                  :disabled="isPending" 
                />
                <Label for="update-archived">Archive</Label>
            </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('close')" :disabled="isPending">Cancel</Button>
          <Button type="submit" :disabled="!formState.name?.trim() || isPending">
            {{ isPending ? "Updating..." : "Update Todo" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>