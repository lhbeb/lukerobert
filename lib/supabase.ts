import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://blkdfmbyxhotmjbokzrw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2RmbWJ5eGhvdG1qYm9renJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MDk4MDksImV4cCI6MjEwODI4NTgwOX0.XeXljtHfvgqT5rreDh2H6mec6DkSUD8nVm6ANF-Iz6k'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type Track = {
    id: string
    title: string
    file_url: string
    duration: string | null
    category: string | null
    thumbnail_url: string | null
    created_at: string
}
