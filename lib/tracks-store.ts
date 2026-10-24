import fs from 'fs'
import path from 'path'
import { supabaseAdmin } from './supabase-admin'
import { Track } from './supabase'

const DATA_DIR = path.join(process.cwd(), 'data')
const TRACKS_FILE = path.join(DATA_DIR, 'tracks.json')

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(TRACKS_FILE)) {
        fs.writeFileSync(TRACKS_FILE, JSON.stringify([], null, 2), 'utf-8')
    }
}

export function getLocalTracks(): Track[] {
    try {
        ensureDataFile()
        const content = fs.readFileSync(TRACKS_FILE, 'utf-8')
        return JSON.parse(content) || []
    } catch (err) {
        console.error('Error reading local tracks:', err)
        return []
    }
}

export function saveLocalTrack(track: Track): void {
    try {
        ensureDataFile()
        const tracks = getLocalTracks()
        const existingIdx = tracks.findIndex(t => t.id === track.id)
        if (existingIdx >= 0) {
            tracks[existingIdx] = track
        } else {
            tracks.unshift(track)
        }
        fs.writeFileSync(TRACKS_FILE, JSON.stringify(tracks, null, 2), 'utf-8')
    } catch (err) {
        console.error('Error saving local track:', err)
    }
}

export function deleteLocalTrack(id: string): void {
    try {
        ensureDataFile()
        const tracks = getLocalTracks()
        const filtered = tracks.filter(t => t.id !== id)
        fs.writeFileSync(TRACKS_FILE, JSON.stringify(filtered, null, 2), 'utf-8')
    } catch (err) {
        console.error('Error deleting local track:', err)
    }
}

export async function getAllTracks(): Promise<Track[]> {
    const localTracks = getLocalTracks()

    try {
        const { data: cloudTracks, error } = await supabaseAdmin
            .from('tracks')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && Array.isArray(cloudTracks)) {
            // Merge cloud and local, avoiding duplicates
            const cloudIds = new Set(cloudTracks.map(t => t.id))
            const uniqueLocal = localTracks.filter(t => !cloudIds.has(t.id))
            const merged = [...cloudTracks, ...uniqueLocal]
            return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }
    } catch (err) {
        console.warn('Could not fetch cloud tracks, using local:', err)
    }

    return localTracks
}
