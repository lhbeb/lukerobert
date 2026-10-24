'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Play, Pause, Clock, Download, Loader2 } from 'lucide-react'
import { supabase, Track } from '@/lib/supabase'

// Helper to generate deterministic fake waveform heights from string IDs (UUIDs)
function getWaveHeights(idStr: string) {
    let hash = 0
    for (let i = 0; i < Math.min(idStr.length, 10); i++) hash += idStr.charCodeAt(i)
    return Array.from({ length: 36 }, (_, i) => {
        const h = 20 + Math.abs(Math.sin(i * 1.1 + hash)) * 30 + ((i * hash) % 20)
        return `${h.toFixed(2)}%`
    })
}

const categoryColor = 'bg-gray-500/15 text-gray-400'

function AudioCard({ track, activeId, onPlay }: { track: Track; activeId: string | null; onPlay: (id: string | null) => void }) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const isPlaying = activeId === track.id
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState('0:00')
    const [waveHeights, setWaveHeights] = useState<string[]>([])

    useEffect(() => {
        setWaveHeights(getWaveHeights(track.id))
    }, [track.id])

    // Play / pause when activeId changes
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) {
            audio.play().catch(() => { })
        } else {
            audio.pause()
        }
    }, [isPlaying])

    function handleTimeUpdate() {
        const audio = audioRef.current
        if (!audio || !audio.duration) return
        const pct = (audio.currentTime / audio.duration) * 100
        setProgress(pct)
        const m = Math.floor(audio.currentTime / 60)
        const s = Math.floor(audio.currentTime % 60).toString().padStart(2, '0')
        setCurrentTime(`${m}:${s}`)
    }

    function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
        const audio = audioRef.current
        if (!audio || !audio.duration) return
        const rect = e.currentTarget.getBoundingClientRect()
        const ratio = (e.clientX - rect.left) / rect.width
        audio.currentTime = ratio * audio.duration
    }

    function handleEnded() {
        setProgress(0)
        setCurrentTime('0:00')
        onPlay(null) // deactivate
    }

    async function handleDownload(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        // Create an invisible anchor tag to trigger the browser download
        const a = document.createElement('a')
        a.href = track.file_url
        a.download = `${track.title}.mp3`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div
            className={`group bg-[#11151b] border rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#d6a461]/10 hover:-translate-y-0.5 ${isPlaying ? 'border-[#d6a461]/60 shadow-lg shadow-[#d6a461]/15' : 'border-[#29323d] hover:border-[#d6a461]/40'
                }`}
        >
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={track.file_url}
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />

            {/* Waveform / artwork area */}
            <div className="w-full h-24 bg-[#0a0c10] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                {/* Background image or Fake waveform bars */}
                {track.thumbnail_url ? (
                    <img
                        src={track.thumbnail_url}
                        alt={track.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'group-hover:scale-105'}`}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center gap-0.5 px-4">
                        {waveHeights.length > 0 && waveHeights.map((height, i) => {
                            const filled = isPlaying && (i / 36) * 100 < progress
                            return (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-full transition-colors duration-100 ${filled ? 'bg-[#d6a461]' : isPlaying ? 'bg-[#d6a461]/30' : 'bg-[#29323d]'
                                        }`}
                                    style={{ height }}
                                />
                            )
                        })}
                    </div>
                )}

                {/* Dark overlay for play button contrast */}
                <div className={`absolute inset-0 bg-black/20 transition-opacity ${isPlaying ? 'opacity-40' : 'group-hover:opacity-40'}`} />

                {/* Play/Pause button */}
                <button
                    id={`play-btn-${track.id}`}
                    onClick={() => onPlay(isPlaying ? null : track.id)}
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-110 ${isPlaying
                        ? 'bg-[#d6a461] shadow-[#d6a461]/40'
                        : 'bg-[#d6a461] hover:bg-[#b8894d] shadow-[#d6a461]/30'
                        }`}
                    aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                >
                    {isPlaying
                        ? <Pause size={15} className="text-white" fill="white" />
                        : <Play size={15} className="text-white ml-0.5" fill="white" />
                    }
                </button>
            </div>

            {/* Progress bar */}
            <div
                className="w-full h-1 bg-[#29323d] rounded-full mb-3 cursor-pointer group/bar relative"
                onClick={handleSeek}
            >
                <div
                    className="h-full bg-[#d6a461] rounded-full transition-all duration-100 group-hover/bar:bg-[#91a8b3]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Track info */}
            <div className="space-y-1.5">
                <h3 className={`font-semibold text-sm leading-snug line-clamp-1 transition-colors ${isPlaying ? 'text-[#d6a461]' : 'text-white group-hover:text-[#d6a461]'}`}>
                    {track.title}
                </h3>
                <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${categoryColor}`}>
                        {track.category || 'Audio'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                        <Clock size={11} />
                        {isPlaying ? currentTime : (track.duration || '0:00')}
                    </span>
                </div>

                {/* Download button */}
                <button
                    id={`download-btn-${track.id}`}
                    onClick={handleDownload}
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 bg-[#0a0c10] hover:bg-[#d6a461]/10 border border-[#29323d] hover:border-[#d6a461]/50 text-gray-400 hover:text-[#d6a461] text-xs font-medium py-2 rounded-xl transition-all duration-200"
                    aria-label={`Download ${track.title}`}
                >
                    <Download size={12} />
                    Download MP3
                </button>
            </div>
        </div>
    )
}

export default function AudioGridPlaceholder({
    limit,
    title = "Latest Tracks",
    subtitle = "Freshly added audio for your projects"
}: {
    limit?: number
    title?: string
    subtitle?: string
}) {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [tracks, setTracks] = useState<Track[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const query = searchParams.get('q')?.toLowerCase().trim() ?? ''

    useEffect(() => {
        async function fetchTracks() {
            setLoading(true)
            try {
                const res = await fetch('/api/tracks')
                const json = await res.json()
                if (res.ok && Array.isArray(json.tracks)) {
                    setTracks(json.tracks)
                    setLoading(false)
                    return
                }
            } catch {
                // fall through to Supabase
            }

            const { data, error } = await supabase.from('tracks').select('*').order('created_at', { ascending: false })
            if (!error && data) {
                setTracks(data)
            }
            setLoading(false)
        }
        fetchTracks()
    }, [])

    let filteredTracks = query
        ? tracks.filter(t =>
            t.title.toLowerCase().includes(query) ||
            (t.category && t.category.toLowerCase().includes(query))
        )
        : tracks

    if (limit && !query) {
        filteredTracks = filteredTracks.slice(0, limit)
    }

    function handlePlay(id: string | null) {
        setActiveId(id)
    }

    return (
        <section id="audio-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        {query ? `Results for "${query}"` : title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {query ? `${filteredTracks.length} track${filteredTracks.length !== 1 ? 's' : ''} found` : subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-[#11151b] border border-[#29323d] rounded-full px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d6a461] animate-pulse" />
                    {activeId ? 'Playing' : 'Live'}
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                    <Loader2 className="animate-spin mb-4" size={30} />
                    <p className="text-sm">Loading tracks from database...</p>
                </div>
            )}

            {/* No results */}
            {!loading && filteredTracks.length === 0 && (
                <div className="text-center py-20 text-gray-500 border border-[#29323d] border-dashed rounded-3xl bg-[#0a0c10]/50">
                    <p className="text-lg font-medium text-white mb-1">No tracks found</p>
                    <p className="text-sm">
                        {query ? "Try a different keyword or browse all tracks." : "There are currently no tracks in the database."}
                    </p>
                </div>
            )}

            {/* Audio Card Grid */}
            {!loading && filteredTracks.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredTracks.map((track) => (
                        <AudioCard
                            key={track.id}
                            track={track}
                            activeId={activeId}
                            onPlay={handlePlay}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

