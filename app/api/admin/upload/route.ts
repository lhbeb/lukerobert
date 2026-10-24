import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
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

        // 1. Try Supabase Storage first
        try {
            const { error: uploadError } = await supabaseAdmin.storage
                .from('audio')
                .upload(filePath, buffer, {
                    contentType: file.type || 'audio/mpeg',
                    cacheControl: '3600',
                    upsert: true,
                })

            if (!uploadError) {
                const { data: { publicUrl } } = supabaseAdmin.storage
                    .from('audio')
                    .getPublicUrl(filePath)

                return NextResponse.json({ success: true, publicUrl })
            }
        } catch {
            // fall through to local storage
        }

        // 2. Fall back to local file storage under public/uploads
        const localDestPath = path.join(process.cwd(), 'public', 'uploads', filePath)
        fs.mkdirSync(path.dirname(localDestPath), { recursive: true })
        fs.writeFileSync(localDestPath, buffer)

        const localPublicUrl = `/uploads/${filePath}`
        return NextResponse.json({ success: true, publicUrl: localPublicUrl })

    } catch (err: any) {
        console.error('Upload handler error:', err)
        return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
    }
}
