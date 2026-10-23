'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2, ListMusic, Loader2 } from 'lucide-react'
import { supabase, Track } from '@/lib/supabase'

export default function ManagePage() {
    const [tracks, setTracks] = useState<Track[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        fetchTracks()
    }, [])

    async function fetchTracks() {
        setLoading(true)
        const { data, error } = await supabase.from('tracks').select('*').order('created_at', { ascending: false })
        if (!error && data) {
            setTracks(data)
        }
        setLoading(false)
    }

    async function handleDelete(id: string, fileUrl: string, thumbnailUrl: string | null) {
        if (!confirm('Are you sure you want to delete this track? This cannot be undone.')) return

        try {
            setDeletingId(id)

            // Extract the storage path for audio
            const audioUrlParts = fileUrl.split('/audio/')
            const audioPath = audioUrlParts.length > 1 ? audioUrlParts[1] : null

            // Extract the storage path for thumbnail
            let thumbPath = null
            if (thumbnailUrl) {
                const thumbUrlParts = thumbnailUrl.split('/audio/')
                thumbPath = thumbUrlParts.length > 1 ? thumbUrlParts[1] : null
            }

            // 1. Delete from Storage (both audio and thumb if exists)
            const pathsToDelete = []
            if (audioPath) pathsToDelete.push(audioPath)
            if (thumbPath) pathsToDelete.push(thumbPath)

            if (pathsToDelete.length > 0) {
                await supabase.storage.from('audio').remove(pathsToDelete)
            }

            // 2. Delete from Database
            await supabase.from('tracks').delete().eq('id', id)

            // Update UI
            setTracks(prev => prev.filter(t => t.id !== id))
        } catch (error) {
            console.error("Failed to delete track:", error)
            alert("Failed to delete track. Please check console for details.")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#d6a461] transition-colors mb-4">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#d6a461]/15 flex items-center justify-center border border-[#d6a461]/30">
                            <ListMusic size={18} className="text-[#d6a461]" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Manage Tracks</h1>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-[#11151b] border border-[#29323d] rounded-2xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="py-20 flex flex-col justify-center items-center text-gray-500">
                        <Loader2 className="animate-spin mb-4" size={30} />
                        <p>Loading tracks...</p>
                    </div>
                ) : tracks.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        <ListMusic className="mx-auto mb-4 opacity-50" size={40} />
                        <p className="text-lg font-medium text-gray-300">No tracks found</p>
                        <p className="mb-6 mt-1">You haven&apos;t uploaded any audio tracks yet.</p>
                        <Link
                            href="/admin/upload"
                            className="inline-flex items-center justify-center bg-[#d6a461] hover:bg-[#b8894d] text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
                        >
                            Upload First Track
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#0a0c10] text-gray-500 border-b border-[#29323d]">
                                <tr>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Title & Category</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Duration</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Uploaded</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#29323d]">
                                {tracks.map((track) => (
                                    <tr key={track.id} className="hover:bg-[#141a22] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white mb-1">{track.title}</div>
                                            <div className="inline-flex bg-gray-500/15 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                {track.category}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono">{track.duration || '--'}</td>
                                        <td className="px-6 py-4">{new Date(track.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(track.id, track.file_url, track.thumbnail_url)}
                                                disabled={deletingId === track.id}
                                                className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors p-2"
                                                title="Delete Track"
                                            >
                                                {deletingId === track.id ? (
                                                    <Loader2 className="animate-spin" size={16} />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                                <span className="sr-only">Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

