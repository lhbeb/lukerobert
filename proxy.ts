import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://blkdfmbyxhotmjbokzrw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2RmbWJ5eGhvdG1qYm9renJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MDk4MDksImV4cCI6MjEwODI4NTgwOX0.XeXljtHfvgqT5rreDh2H6mec6DkSUD8nVm6ANF-Iz6k'

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                response = NextResponse.next({ request })
                cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
            },
        },
    })

    const { data: { user } } = await supabase.auth.getUser()
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isLoginRoute = request.nextUrl.pathname === '/login'

    let isAdmin = false
    if (user) {
        const { data } = await supabase.rpc('is_admin')
        isAdmin = data === true
    }

    if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }

    if (isLoginRoute && isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
}
