import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { saveLocalTrack, deleteLocalTrack, getAllTracks } from '@/lib/tracks-store'
import { Track } from '@/lib/supabase'

export async function GET() {
    try {
        const tracks = await getAllTracks()
        return NextResponse.json({ success: true, tracks })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Fetch failed' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const isAdmin = request.cookies.has('admin_session')
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { title, category, file_url, thumbnail_url, duration } = body

        if (!title || !file_url) {
            return NextResponse.json({ error: 'Title and file_url are required' }, { status: 400 })
        }

        const now = new Date().toISOString()
        let createdTrack: Track | null = null

        // 1. Try Supabase insert
        try {
            const { data, error } = await supabaseAdmin
                .from('tracks')
                .insert({
                    title,
                    category: category || null,
                    file_url,
                    thumbnail_url: thumbnail_url || null,
                    duration: duration || null,
                })
                .select()
                .single()

            if (!error && data) {
                createdTrack = data as Track
            }
        } catch {
            // fall through to local fallback
        }

        // 2. If Supabase blocked by RLS or unavailable, persist locally
        if (!createdTrack) {
            createdTrack = {
                id: crypto.randomUUID(),
                title,
                category: category || null,
                file_url,
                thumbnail_url: thumbnail_url || null,
                duration: duration || null,
                created_at: now,
            }
            saveLocalTrack(createdTrack)
        }

        return NextResponse.json({ success: true, track: createdTrack })
    } catch (err: any) {
        console.error('Insert track error:', err)
        return NextResponse.json({ error: err.message || 'Insert failed' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    const isAdmin = request.cookies.has('admin_session')
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const fileUrl = searchParams.get('fileUrl')
        const thumbnailUrl = searchParams.get('thumbnailUrl')

        if (!id) {
            return NextResponse.json({ error: 'Track ID is required' }, { status: 400 })
        }

        // 1. Delete from local JSON store
        deleteLocalTrack(id)

        // 2. Delete local uploaded files if stored under /uploads/
        if (fileUrl && fileUrl.startsWith('/uploads/')) {
            const localFilePath = path.join(process.cwd(), 'public', fileUrl)
            if (fs.existsSync(localFilePath)) {
                try { fs.unlinkSync(localFilePath) } catch {}
            }
        }
        if (thumbnailUrl && thumbnailUrl.startsWith('/uploads/')) {
            const localThumbPath = path.join(process.cwd(), 'public', thumbnailUrl)
            if (fs.existsSync(localThumbPath)) {
                try { fs.unlinkSync(localThumbPath) } catch {}
            }
        }

        // 3. Delete from Supabase Storage if paths exist in cloud
        const pathsToDelete: string[] = []
        if (fileUrl && fileUrl.includes('/audio/')) {
            const audioParts = fileUrl.split('/audio/')
            if (audioParts.length > 1) pathsToDelete.push(audioParts[1])
        }
        if (thumbnailUrl && thumbnailUrl.includes('/audio/')) {
            const thumbParts = thumbnailUrl.split('/audio/')
            if (thumbParts.length > 1) pathsToDelete.push(thumbParts[1])
        }

        if (pathsToDelete.length > 0) {
            try {
                await supabaseAdmin.storage.from('audio').remove(pathsToDelete)
            } catch {}
        }

        // 4. Try Supabase Database delete
        try {
            await supabaseAdmin.from('tracks').delete().eq('id', id)
        } catch {}

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Delete track error:', err)
        return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 })
    }
}
