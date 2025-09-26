export interface UserPresence {
  user_id: string
  name: string
  avatar: string | null
  online_at: string
}

export interface PresenceUser {
  id: string
  name: string
  avatar?: string | undefined // Changed to undefined to match usage
  online_at?: string
}

export interface SupabasePresencePayload {
  [key: string]: unknown
}

export interface PresenceJoinPayload {
  key: string
  newPresences: SupabasePresencePayload[]
}

export interface PresenceLeavePayload {
  key: string
  leftPresences: SupabasePresencePayload[]
}
