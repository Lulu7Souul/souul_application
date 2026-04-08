export type CommunicationMode = 'symbols_only' | 'symbols_words' | 'words_only'

export type TeamPermission = 'view' | 'edit'

export interface ChildProfile {
  id: string
  owner_id: string
  name: string
  avatar_url?: string
  audio_enabled: boolean
  motion_enabled: boolean
  communication_mode: CommunicationMode
  pin: string              // hashed — never returned to client in plaintext
  calm_sequence_id?: string
  created_at: string
}

export interface UserProfile {
  id: string
  full_name?: string
  plan: 'free' | 'family' | 'educator'
  consent_given_at?: string
  created_at: string
}

export interface TeamMember {
  id: string
  owner_id: string
  member_email: string
  member_id?: string
  permission: TeamPermission
  invited_at: string
  accepted_at?: string
}
