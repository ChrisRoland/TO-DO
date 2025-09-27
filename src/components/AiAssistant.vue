<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query'
import { addTodo, updateTodo, deleteTodo, fetchTodos } from '@/api/todo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Plus, Check, Trash2, Edit } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { BotMessageSquare } from 'lucide-vue-next'
import type { Todo, UpdateTodoData } from '@/types/todo'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: TodoSuggestion[]
  actions?: TodoAction[]
}

interface TodoSuggestion {
  name: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
}

interface TodoAction {
  type: 'update' | 'delete' | 'complete'
  todoId: string
  todoName: string
  newData?: Partial<TodoSuggestion>
}

const auth = useAuthStore()

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const queryClient = useQueryClient()

// Fetch existing todos
const { data: todosData } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

const todos = computed(() => todosData.value || [])

// State
const messages = ref<Message[]>([
  {
    id: '1',
    role: 'assistant',
    content:
      "Hi! I'm your AI task assistant with full access to your todos. I can help you:\n\n• Organize and prioritize existing tasks\n• Create new todos with smart suggestions\n• Update or complete existing tasks\n• Analyze your productivity patterns\n• Break down complex projects\n\nTry asking: 'What can you do?' or 'Show me my high priority tasks.'",
    timestamp: new Date(),
  },
])
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()

// Groq API key
const apiKey = ref(import.meta.env.VITE_GROQ_API_KEY || '')
const showApiKeyInput = ref(!apiKey.value)

// Todo mutations
const createTodoMutation = useMutation({
  mutationFn: addTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    toast.success('Todo created successfully!')
  },
  onError: (error) => {
    console.error('Create todo error:', error)
    toast.error('Failed to create todo: ' + error.message)
  },
})

const updateTodoMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: UpdateTodoData }) => updateTodo(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    toast.success('Todo updated successfully!')
  },
  onError: (error) => {
    console.error('Update todo error:', error)
    toast.error('Failed to update todo: ' + error.message)
  },
})

const deleteTodoMutation = useMutation({
  mutationFn: deleteTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
    toast.success('Todo deleted successfully!')
  },
  onError: (error) => {
    console.error('Delete todo error:', error)
    toast.error('Failed to delete todo: ' + error.message)
  },
})

// Scroll to bottom of messages
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Get current todos summary for AI context
const fetchTodosContext = () => {
  if (!todos.value.length) return 'User has no todos yet.'

  const summary = todos.value
    .map(
      (todo: Todo, index: number) =>
        `${index + 1}. "${todo.name}" [${todo.priority}] (${todo.status})`,
    )
    .join('\n')

  return `Current todos (${todos.value.length} total):\n${summary}`
}

// Parse AI response for suggestions and actions
const parseAIResponse = (
  content: string,
): { suggestions: TodoSuggestion[]; actions: TodoAction[] } => {
  const suggestions: TodoSuggestion[] = []
  const actions: TodoAction[] = []

  // Parse todo suggestions from numbered/bulleted lists
  const lines = content.split('\n')
  lines.forEach((line) => {
    const todoMatch = line.match(
      /(?:\d+\.?\d*\s*|\-\s*|\*\s*)(.+?)(?:\s*\[(\w+)\])?(?:\s*\((\w+)\))?/i,
    )
    if (todoMatch) {
      let [, name, priority, status] = todoMatch

      name = name
        .replace(/\s*\[.*?\]\s*/g, '')
        .replace(/\s*\(.*?\)\s*/g, '')
        .trim()

      if (
        name &&
        name.length > 3 &&
        !name.includes('?') &&
        !name.toLowerCase().includes('which one')
      ) {
        const priorityInName = name.match(/\[(\w+)\]/i)
        if (priorityInName) {
          priority = priorityInName[1]
          name = name.replace(/\[.*?\]/g, '').trim()
        }

        const statusInName = name.match(/\((\w+)\)/i)
        if (statusInName) {
          status = statusInName[1]
          name = name.replace(/\(.*?\)/g, '').trim()
        }

        suggestions.push({
          name: name.trim(),
          priority: (priority?.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM',
          status: (status?.toUpperCase() as 'TODO' | 'IN_PROGRESS' | 'DONE') || 'TODO',
        })
      }
    }
  })

  // Parse creation commands
  const createMatches = content.matchAll(
    /(?:creat|add|make|new).*?(?:task|todo|reminder).*?(?:to |for |about )?["']([^"']+)["']|(?:creat|add|make|new).*?(?:task|todo|reminder).*?:\s*(.+?)(?:\n|$)/gi,
  )
  for (const match of createMatches) {
    const taskName = (match[1] || match[2])?.trim()
    if (taskName && taskName.length > 2 && taskName.length < 100) {
      let priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM'
      if (
        content.toLowerCase().includes('high priority') ||
        content.toLowerCase().includes('urgent')
      ) {
        priority = 'HIGH'
      } else if (
        content.toLowerCase().includes('low priority') ||
        content.toLowerCase().includes('later')
      ) {
        priority = 'LOW'
      }

      suggestions.push({
        name: taskName,
        priority: priority,
        status: 'TODO' as const,
      })
    }
  }

  // Parse actions on existing todos
  const actionMatches = content.matchAll(
    /(?:complete|finish|done|mark.*(?:complete|done)|update|change|delete|remove).*?(?:task|todo)?.*?"([^"]+)"/gi,
  )
  for (const match of actionMatches) {
    const taskName = match[1]
    const todo = todos.value.find(
      (t: Todo) =>
        t.name.toLowerCase().includes(taskName.toLowerCase()) ||
        taskName.toLowerCase().includes(t.name.toLowerCase()),
    )

    if (todo) {
      const matchText = match[0].toLowerCase()
      if (
        matchText.includes('complete') ||
        matchText.includes('done') ||
        matchText.includes('mark')
      ) {
        actions.push({
          type: 'complete',
          todoId: todo.id,
          todoName: todo.name,
        })
      } else if (matchText.includes('delete') || matchText.includes('remove')) {
        actions.push({
          type: 'delete',
          todoId: todo.id,
          todoName: todo.name,
        })
      }
    }
  }

  // Also look for direct commands without quotes
  const directMatches = content.matchAll(
    /(?:complete|finish|done|mark.*(?:complete|done)|delete|remove).*?(?:the |my )?(\w+.*?)(?:\s|$|\.)/gi,
  )
  for (const match of directMatches) {
    const taskPhrase = match[1].trim()
    const todo = todos.value.find((t: Todo) => {
      const todoWords = t.name.toLowerCase().split(' ')
      const phraseWords = taskPhrase.toLowerCase().split(' ')
      return (
        phraseWords.some((word) =>
          todoWords.some((todoWord: string) => todoWord.includes(word) || word.includes(todoWord)),
        ) && phraseWords.length <= 4
      )
    })

    if (todo && !actions.find((a) => a.todoId === todo.id)) {
      const matchText = match[0].toLowerCase()
      if (
        matchText.includes('complete') ||
        matchText.includes('done') ||
        matchText.includes('mark')
      ) {
        actions.push({
          type: 'complete',
          todoId: todo.id,
          todoName: todo.name,
        })
      } else if (matchText.includes('delete') || matchText.includes('remove')) {
        actions.push({
          type: 'delete',
          todoId: todo.id,
          todoName: todo.name,
        })
      }
    }
  }

  return { suggestions: suggestions.slice(0, 6), actions: actions.slice(0, 3) }
}

// Execute todo actions automatically
const executeAutomaticAction = async (action: TodoAction) => {
  try {
    switch (action.type) {
      case 'complete':
        await updateTodoMutation.mutateAsync({
          id: action.todoId,
          data: { status: 'DONE' },
        })
        break
      case 'delete':
        await deleteTodoMutation.mutateAsync(action.todoId)
        break
      case 'update':
        if (action.newData) {
          await updateTodoMutation.mutateAsync({
            id: action.todoId,
            data: action.newData,
          })
        }
        break
    }
  } catch (error) {
    console.error('Failed to execute automatic action:', error)
    toast.error(`Failed to ${action.type} "${action.todoName}"`)
  }
}

// Send message to Groq with todos context
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  if (!apiKey.value) {
    toast.error('Please enter your Groq API key first')
    showApiKeyInput.value = true
    return
  }

  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: inputMessage.value.trim(),
    timestamp: new Date(),
  }

  messages.value.push(userMessage)
  const currentInput = inputMessage.value
  inputMessage.value = ''
  isLoading.value = true

  try {
    const todosContext = fetchTodosContext()

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.value}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a smart task management assistant with full access to the user's todos. You can:

1. View and analyze existing todos
2. ACTUALLY create new tasks when requested
3. ACTUALLY complete, update, or delete existing tasks when requested
4. Help organize and prioritize work

Current todos context:
${todosContext}

IMPORTANT INSTRUCTIONS:

FOR CREATING TASKS:
- When user says "create task for X/create a todo" or "add reminder to Y", ask for details if needed and then create the task
- Example if there are no details: "Please provide more details about the task - title, description, priority, etc."
- Wait for user to provide details
- Then system will automatically create the task
- Do NOT affirm any action until the system has actually executed it

FOR MODIFYING EXISTING TASKS:
- When user asks to complete, delete, or update a task, use the EXACT task name
- Example: "I'm marking 'presentation task' as complete"
- The system will automatically execute the action

FOR SUGGESTING NEW TASKS:
- When user asks for help planning, format suggestions as:
  1. Task name [HIGH/MEDIUM/LOW] (TODO/IN_PROGRESS/DONE)

WHEN LISTING TODOS:
- Only list 20 tasks max and then ask the user if they want to see more

Be helpful, concise, and actionable. Always respond as if you're actually performing the requested actions.`,
          },
          ...messages.value.slice(-8).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: 'user',
            content: currentInput,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `API request failed: ${response.status} - ${errorData.error?.message || response.statusText}`,
      )
    }

    const data = await response.json()
    const aiResponse =
      data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    const { suggestions, actions } = parseAIResponse(aiResponse)

    // Auto-execute actions that the AI suggests
    if (actions.length > 0) {
      for (const action of actions) {
        await executeAutomaticAction(action)
      }
    }

    // Auto-create todos when AI detects creation intent
    const hasCreationCommand = currentInput
      .toLowerCase()
      .match(/(?:creat|add|make|new).*?(?:task|todo|reminder)/i)
    if (hasCreationCommand && suggestions.length > 0) {
      for (const suggestion of suggestions.slice(0, 3)) {
        try {
          console.log('Creating todo:', suggestion)
          await createTodoMutation.mutateAsync({
            name: suggestion.name,
            description: suggestion.description,
            priority: suggestion.priority,
            status: suggestion.status || 'TODO',
          })
        } catch (error) {
          console.error('Failed to auto-create todo:', error)
          toast.error(`Failed to create "${suggestion.name}"`)
        }
      }
      // Remove auto-created suggestions from manual suggestions
      suggestions.splice(0, Math.min(3, suggestions.length))
    }

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      actions: actions.length > 0 ? actions : undefined,
    }

    messages.value.push(assistantMessage)
    await scrollToBottom()
  } catch (error: unknown) {
    console.error('Groq API Error:', error)
    let errorMessage = 'Unknown error'

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = 'Invalid API key. Please check your Groq API key.'
        showApiKeyInput.value = true
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
      } else {
        errorMessage = error.message || 'Unknown error'
      }
    }

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Sorry, I encountered an error: ${errorMessage}`,
      timestamp: new Date(),
    }
    messages.value.push(assistantMessage)
  } finally {
    isLoading.value = false
  }
}

// Execute todo actions manually (for button clicks)
const executeTodoAction = async (action: TodoAction) => {
  console.log('Executing todo action:', action)
  try {
    await executeAutomaticAction(action)
    toast.success(`Successfully ${action.type}d "${action.todoName}"`)
  } catch (error) {
    console.error('Error executing todo action:', error)
    toast.error(`Failed to ${action.type} "${action.todoName}"`)
  }
}

// Create todo from suggestion
const createTodoFromSuggestion = async (suggestion: TodoSuggestion) => {
  console.log('Creating todo from suggestion:', suggestion)
  try {
    await createTodoMutation.mutateAsync({
      name: suggestion.name,
      description: suggestion.description,
      priority: suggestion.priority,
      status: suggestion.status || 'TODO',
    })
    toast.success(`Successfully created "${suggestion.name}"`)
  } catch (error) {
    console.error('Failed to create todo from suggestion:', error)
    toast.error(`Failed to create "${suggestion.name}"`)
  }
}

// Quick commands
const quickCommands = [
  { text: 'Show me my high priority tasks' },
  { text: 'Help me organize my todos' },
  { text: 'What should I work on next?' },
  { text: 'Create a todo' },
]

const sendQuickCommand = (command: string) => {
  inputMessage.value = command
  sendMessage()
}

// Handle enter key
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// Set API key
const saveApiKey = () => {
  if (apiKey.value.trim().startsWith('gsk_')) {
    showApiKeyInput.value = false
    toast.success('Groq API key saved!')
  } else {
    toast.error('Please enter a valid Groq API key (starts with gsk_)')
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Watch todos and update context when they change
watch(
  todos,
  () => {
    // You could optionally auto-notify the AI of changes
  },
  { deep: true },
)
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => !val && emit('close')">
    <DialogContent class="max-w-3xl max-h-[85vh] p-0">
      <DialogHeader class="p-6 pb-4 border-b">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center"
            >
              <BotMessageSquare class="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle class="text-lg font-semibold">To+Do AI Assistant</DialogTitle>
              <p class="text-sm text-muted-foreground">
                Connected to your todos • {{ todos?.length || 0 }} tasks tracked
              </p>
            </div>
          </div>
          <!-- <Button variant="ghost" size="sm" @click="emit('close')" title="Close">
            <X class="w-4 h-4" />
          </Button> -->
        </div>
      </DialogHeader>

      <!-- API Key Input -->
      <div v-if="showApiKeyInput" class="p-6 border-b bg-orange-50 dark:bg-orange-900/20">
        <div class="flex items-center gap-2 mb-3">
          <BotMessageSquare class="w-5 h-5 text-orange-500" />
          <h3 class="font-medium">Groq API Key Required</h3>
        </div>
        <p class="text-sm text-muted-foreground mb-3">
          Get your FREE Groq API key at
          <a href="https://console.groq.com" target="_blank" class="text-blue-500 hover:underline">
            console.groq.com
          </a>
        </p>
        <div class="flex gap-2">
          <Input v-model="apiKey" type="password" placeholder="gsk_..." class="flex-1" />
          <Button @click="saveApiKey" size="sm">Save</Button>
        </div>
      </div>

      <!-- Quick Commands -->
      <div v-if="!showApiKeyInput && messages.length === 1" class="p-6 pb-4 border-b">
        <p class="text-sm text-muted-foreground mb-3">Quick commands:</p>
        <div class="grid grid-cols-2 gap-2">
          <Button
            v-for="command in quickCommands"
            :key="command.text"
            variant="outline"
            size="sm"
            class="justify-start text-left h-auto py-2 px-3"
            @click="sendQuickCommand(command.text)"
          >
            <span class="text-xs">{{ command.text }}</span>
          </Button>
        </div>
      </div>

      <!-- Messages -->
      <ScrollArea ref="messagesContainer" class="flex-1 p-6 max-h-96">
        <div class="space-y-4">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div
              v-if="message.role === 'assistant'"
              class="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            >
              <BotMessageSquare class="w-4 h-4 text-white" />
            </div>

            <div
              :class="[
                'max-w-[75%] rounded-lg px-4 py-2',
                message.role === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-muted',
              ]"
            >
              <div class="whitespace-pre-wrap text-sm">{{ message.content }}</div>

              <!-- Todo Actions -->
              <div v-if="message.actions && message.actions.length > 0" class="mt-3 space-y-2">
                <div class="text-xs text-muted-foreground font-medium">Suggested Actions:</div>
                <div class="space-y-1">
                  <div
                    v-for="action in message.actions"
                    :key="action.todoId"
                    class="flex items-center justify-between gap-2 p-2 bg-background/50 rounded border text-xs"
                  >
                    <div class="flex-1">
                      <div class="font-medium">{{ action.todoName }}</div>
                      <div class="text-muted-foreground capitalize">{{ action.type }} task</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      @click.stop="executeTodoAction(action)"
                      :disabled="
                        (action.type === 'complete' || action.type === 'update') ? updateTodoMutation.isPending.value : 
                        action.type === 'delete' ? deleteTodoMutation.isPending.value : 
                        false
                      "
                      class="h-8 px-3 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                      type="button"
                    >
                      <Check v-if="action.type === 'complete'" class="w-4 h-4" />
                      <Trash2 v-else-if="action.type === 'delete'" class="w-4 h-4" />
                      <Edit v-else class="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Todo Suggestions -->
              <div
                v-if="message.suggestions && message.suggestions.length > 0"
                class="mt-3 space-y-2"
              >
                <div class="text-xs text-muted-foreground font-medium">Create New Tasks:</div>
                <div class="space-y-1">
                  <div
                    v-for="suggestion in message.suggestions"
                    :key="suggestion.name"
                    class="flex items-center justify-between gap-2 p-2 bg-background/50 rounded border text-xs"
                  >
                    <div class="flex-1">
                      <div class="font-medium">{{ suggestion.name }}</div>
                      <div class="text-muted-foreground">{{ suggestion.priority }} priority</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      @click.stop="createTodoFromSuggestion(suggestion)"
                      :disabled="createTodoMutation.isPending.value"
                      class="h-8 px-3 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                      type="button"
                    >
                      <Plus class="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div class="text-xs opacity-70 mt-2">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>

            <div
              v-if="message.role === 'user'"
              class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            >
              <img
                v-if="auth.getUserAvatarUrl"
                :src="auth.getUserAvatarUrl"
                :alt="auth.getUserDisplayName || 'User'"
                :title="auth.getUserDisplayName || 'User'"
                class="w-full h-full rounded-full object-cover"
              />
              <div v-else class="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="isLoading" class="flex gap-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <BotMessageSquare class="w-4 h-4 text-white" />
            </div>
            <div class="bg-muted rounded-lg px-4 py-2">
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style="animation-delay: 0.1s"
                ></div>
                <div
                  class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style="animation-delay: 0.2s"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <!-- Input -->
      <div class="p-6 pt-4 border-t">
        <div class="flex gap-2">
          <Input
            v-model="inputMessage"
            placeholder="Ask me anything about your todos..."
            class="flex-1"
            @keypress="handleKeyPress"
            :disabled="isLoading"
          />
          <Button @click="sendMessage" :disabled="!inputMessage.trim() || isLoading" class="px-3">
            <Send class="w-4 h-4" />
          </Button>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p class="text-xs text-muted-foreground">Connected • 1,000 requests/day</p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
