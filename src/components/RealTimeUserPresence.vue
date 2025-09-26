<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-vue-next'
import { createClient } from '@supabase/supabase-js'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { toast } from 'vue-sonner'
import type {
  UserPresence,
  PresenceUser,
  PresenceJoinPayload,
  PresenceLeavePayload,
} from '@/types/presence'

const auth = useAuthStore()

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// State
const onlineUsers = ref(0)
const userList = ref<PresenceUser[]>([])
const channel = ref<RealtimeChannel | null>(null)

// Setup presence tracking
const setupPresence = () => {
  if (!auth.user?.id) return

  // Create a channel for the todo app presence
  channel.value = supabase.channel('todo-app-presence', {
    config: {
      presence: {
        key: auth.user.id,
      },
    },
  })

  // Track presence state
  channel.value
    .on('presence', { event: 'sync' }, () => {
      const presenceState = channel.value?.presenceState()
      if (!presenceState) return

      const users: PresenceUser[] = Object.keys(presenceState).map((key) => {
        const presence = presenceState[key][0] as unknown as UserPresence // Get the first (latest) presence
        return {
          id: key,
          name: presence.name || 'Anonymous User',
          avatar: presence.avatar || undefined,
          online_at: presence.online_at,
        }
      })

      userList.value = users
      onlineUsers.value = users.length
    })
    .on('presence', { event: 'join' }, (payload: PresenceJoinPayload) => {
      console.log('User joined:', payload.key, payload.newPresences)
      const userPresence = payload.newPresences[0] as unknown as UserPresence
      toast.success(`${userPresence.name || 'Someone'} joined the page`)
    })
    .on('presence', { event: 'leave' }, (payload: PresenceLeavePayload) => {
      console.log('User left:', payload.key, payload.leftPresences)
      const userPresence = payload.leftPresences[0] as unknown as UserPresence
      toast.error(`${userPresence.name || 'Someone'} left the page`)
    })
    .subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED' && auth.user?.id) {
        // Send initial presence
        const presenceData: UserPresence = {
          user_id: auth.user.id,
          name: auth.getUserDisplayName || 'Anonymous User',
          avatar: auth.getUserAvatarUrl || null,
          online_at: new Date().toISOString(),
        }

        await channel.value?.track(presenceData)
      }
    })
}

// Cleanup presence
const cleanup = () => {
  if (channel.value) {
    channel.value.untrack()
    channel.value.unsubscribe()
    channel.value = null
  }
}

// Format presence message
const getPresenceMessage = (): string => {
  if (onlineUsers.value === 0) {
    return 'Loading...'
  } else if (onlineUsers.value === 1) {
    return 'You are the only user viewing this page'
  } else {
    return `You and ${onlineUsers.value - 1} other users are currently viewing this page`
  }
}

// Get other users (excluding current user)
const getOtherUsers = (): PresenceUser[] => {
  return userList.value.filter((user) => user.id !== auth.user?.id)
}

// Lifecycle
onMounted(() => {
  if (auth.user?.id) {
    setupPresence()
  }
})

onUnmounted(() => {
  cleanup()
})

// Watch for auth changes
auth.$subscribe((mutation, state) => {
  if (state.user?.id && !channel.value) {
    setupPresence()
  } else if (!state.user?.id && channel.value) {
    cleanup()
  }
})
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Main presence badge -->
    <Badge
      variant="outline"
      class="flex items-center gap-2 px-3 py-1 bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
    >
      <div class="flex items-center gap-1">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <Eye class="w-3 h-3" />
      </div>
      <span class="text-xs font-medium">
        {{ getPresenceMessage() }}
      </span>
    </Badge>

    <!-- Show other users if more than just current user -->
    <div v-if="getOtherUsers().length > 0" class="flex items-center gap-1">
      <div v-for="user in getOtherUsers().slice(0, 3)" :key="user.id" class="relative">
        <div
          class="max-sm:hidden w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium overflow-hidden"
        >
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            :title="user.name"
            class="w-full h-full object-cover"
          />
          <span v-else :title="user.name">
            {{ user.name.charAt(0).toUpperCase() }}
          </span>
        </div>
        <!-- Online indicator -->
        <div
          class="max-sm:hidden absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"
        ></div>
      </div>

      <!-- Show count if more than 3 other users -->
      <div v-if="getOtherUsers().length > 3" class="text-xs text-muted-foreground ml-1">
        +{{ getOtherUsers().length - 3 }} more
      </div>
    </div>
  </div>
</template>
