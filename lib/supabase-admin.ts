import { createClient } from '@supabase/supabase-js'

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseUrl = (rawUrl && !rawUrl.includes('placeholder'))
    ? rawUrl
    : 'https://blkdfmbyxhotmjbokzrw.supabase.co'

const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2RmbWJ5eGhvdG1qYm9renJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MDk4MDksImV4cCI6MjEwODI4NTgwOX0.XeXljtHfvgqT5rreDh2H6mec6DkSUD8nVm6ANF-Iz6k')

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
})
