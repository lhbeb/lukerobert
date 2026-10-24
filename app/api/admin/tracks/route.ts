import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

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

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, track: data })
    } catch (err: any) {
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

        // Delete files from storage if paths are provided
        const pathsToDelete: string[] = []
        if (fileUrl) {
            const audioParts = fileUrl.split('/audio/')
            if (audioParts.length > 1) pathsToDelete.push(audioParts[1])
        }
        if (thumbnailUrl) {
            const thumbParts = thumbnailUrl.split('/audio/')
            if (thumbParts.length > 1) pathsToDelete.push(thumbParts[1])
        }

        if (pathsToDelete.length > 0) {
            await supabaseAdmin.storage.from('audio').remove(pathsToDelete)
        }

        const { error } = await supabaseAdmin
            .from('tracks')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 })
    }
}
