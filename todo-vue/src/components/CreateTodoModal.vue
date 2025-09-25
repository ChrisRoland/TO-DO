<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { addTodo } from '@/api/todo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const queryClient = useQueryClient()

const name = ref('')
const description = ref('')
const status = ref('TODO')
const priority = ref('LOW')

const { isPending, mutate } = useMutation({
  mutationFn: addTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    toast.success('Todo added successfully!')
    emit('close')
    resetForm()
  },
})

const resetForm = () => {
  name.value = ''
  description.value = ''
  status.value = 'TODO'
  priority.value = 'LOW'
}

const handleSubmit = () => {
  if (name.value.trim()) {
    mutate({
      name: name.value,
      description: description.value,
      status: status.value as 'TODO' | 'IN_PROGRESS' | 'DONE',
      priority: priority.value as 'LOW' | 'MEDIUM' | 'HIGH',
    })
  }
}

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => !val && emit('close')">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Todo</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 py-4">
          <div>
            <Label for="create-name">Name <span class="text-red-500">*</span></Label>
            <Input id="create-name" v-model="name" placeholder="Enter todo name..." :disabled="isPending" />
          </div>
          <div>
            <Label for="create-description">Description</Label>
            <Input id="create-description" v-model="description" placeholder="Enter description..." :disabled="isPending" />
          </div>
          <div>
            <Label for="create-status">Status</Label>
            <Select v-model="status" :disabled="isPending">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="create-priority">Priority</Label>
            <Select v-model="priority" :disabled="isPending">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('close')" :disabled="isPending">Cancel</Button>
          <Button type="submit" :disabled="!name.trim() || isPending">
            {{ isPending ? "Adding..." : "Add Todo" }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>