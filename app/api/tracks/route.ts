import { NextResponse } from 'next/server'
import { getAllTracks } from '@/lib/tracks-store'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const tracks = await getAllTracks()
        return NextResponse.json({ success: true, tracks })
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Fetch failed' }, { status: 500 })
    }
}
