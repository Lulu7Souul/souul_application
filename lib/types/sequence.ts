// Core types for Souul — mirrors the database schema

export type SequenceType = 'routine' | 'story' | 'practice' | 'calm'

export type StepType =
  | 'standard'
  | 'first_then'
  | 'choice'
  | 'communication'
  | 'calm_trigger'

export type CueType = 'start' | 'transition' | 'pacing' | 'calm' | 'celebration'

export type CompletionAction = 'celebrate' | 'next_sequence' | 'return_to_today'

export interface CommunicationOption {
  label: string
  symbol_url?: string
}

export interface Step {
  id: string
  sequence_id: string
  order_index: number
  title?: string             // adult-facing label only, not shown to child
  step_type: StepType
  visual_url?: string
  audio_url?: string
  cue_type?: CueType
  duration_seconds?: number
  help_text?: string
  communication_options?: CommunicationOption[]
  created_at: string
}

export interface Sequence {
  id: string
  owner_id: string
  child_profile_id?: string
  title: string
  type: SequenceType
  is_template: boolean
  is_published: boolean
  is_archived: boolean
  completion_action: CompletionAction
  reward_text?: string
  reward_image_url?: string
  steps?: Step[]
  created_at: string
  updated_at: string
}

export interface SessionLog {
  id: string
  sequence_id: string
  child_profile_id: string
  started_at: string
  completed_at?: string
  steps_skipped: number[]
  help_tapped_count: number
  break_tapped_count: number
  time_extensions_count: number
}
