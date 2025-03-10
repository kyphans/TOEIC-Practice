import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for database
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string
          avatar_url?: string
          role?: 'user' | 'admin'
          updated_at?: string
        }
      }
      tests: {
        Row: {
          id: string
          name: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          test_id: string
          type: string
          section: string
          part: number
          template: Json
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          test_id: string
          type: string
          section: string
          part: number
          template: Json
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          type?: string
          section?: string
          part?: number
          template?: Json
          order?: number
          updated_at?: string
        }
      }
      test_attempts: {
        Row: {
          id: string
          test_id: string
          user_id: string
          started_at: string
          completed_at: string | null
          score: number | null
          answers: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          test_id: string
          user_id: string
          started_at?: string
          completed_at?: string
          score?: number
          answers?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string
          score?: number
          answers?: Json
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          total_tests: number
          average_score: number
          last_test_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_tests?: number
          average_score?: number
          last_test_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          total_tests?: number
          average_score?: number
          last_test_date?: string
          updated_at?: string
        }
      }
    }
  }
} 