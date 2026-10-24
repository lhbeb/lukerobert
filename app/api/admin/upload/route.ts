import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
    const isAdmin = request.cookies.has('admin_session')
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        const filePath = formData.get('filePath') as string | null

        if (!file || !filePath) {
            return NextResponse.json({ error: 'File and filePath are required' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { error: uploadError } = await supabaseAdmin.storage
            .from('audio')
            .upload(filePath, buffer, {
                contentType: file.type || 'audio/mpeg',
                cacheControl: '3600',
                upsert: true,
            })

        if (uploadError) {
            return NextResponse.json({ error: uploadError.message }, { status: 500 })
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('audio')
            .getPublicUrl(filePath)

        return NextResponse.json({ success: true, publicUrl })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
    }
}
