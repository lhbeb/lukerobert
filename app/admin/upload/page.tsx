'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, FileAudio, FileImage, CheckCircle2, ArrowLeft, Loader2, Play } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Ambient', 'Nature', 'Meditation', 'Spiritual', 'Electronic', 'Acoustic', 'Cinematic', 'Lo-Fi', 'Sound Effect']

export default function UploadPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [file, setFile] = useState<File | null>(null)
    const [thumbnailStr, setThumbnailStr] = useState<File | null>(null)
    const thumbnailInputRef = useRef<HTMLInputElement>(null)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(CATEGORIES[0])

    // Status
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Auto-detect duration when file selected
    const [durationStr, setDurationStr] = useState('0:00')

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setErrorMsg('')
            setSuccess(false)

            if (!title) {
                // Pre-fill title from filename (remove .mp3)
                setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
            }

            // Detect duration
            const audio = new Audio(URL.createObjectURL(selectedFile))
            audio.onloadedmetadata = () => {
                const totalSeconds = Math.floor(audio.duration)
                const mins = Math.floor(totalSeconds / 60)
                const secs = totalSeconds % 60
                setDurationStr(`${mins}:${secs.toString().padStart(2, '0')}`)
            }
        }
    }

    function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setThumbnailStr(e.target.files[0])
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!file || !title) {
            setErrorMsg("Please select a file and enter a title.")
            return
        }

        try {
            setUploading(true)
            setErrorMsg('')
            setProgress(10)

            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `tracks/${fileName}`

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('audio')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw new Error(`Storage error: ${uploadError.message}`)

            // 2. Get Public URL for the audio file
            const { data: { publicUrl: audioPublicUrl } } = supabase.storage.from('audio').getPublicUrl(filePath)
            setProgress(60)

            // 3. Upload Thumbnail to Supabase Storage (if provided)
            let thumbnailUrl = null
            if (thumbnailStr) {
                const thumbExt = thumbnailStr.name.split('.').pop()
                const thumbName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${thumbExt}`
                const thumbPath = `thumbnails/${thumbName}`

                const { error: thumbError } = await supabase.storage
                    .from('audio') // reusing the public 'audio' bucket for thumbnails too
                    .upload(thumbPath, thumbnailStr, { cacheControl: '3600', upsert: false })

                if (thumbError) throw new Error(`Thumbnail storage error: ${thumbError.message}`)
                const { data } = supabase.storage.from('audio').getPublicUrl(thumbPath)
                thumbnailUrl = data.publicUrl
            }
            setProgress(80)

            // 4. Insert into Database
            const { error: dbError } = await supabase
                .from('tracks')
                .insert({
                    title,
                    category,
                    file_url: audioPublicUrl,
                    thumbnail_url: thumbnailUrl,
                    duration: durationStr
                })

            if (dbError) throw new Error(`Database error: ${dbError.message}`)

            setProgress(100)
            setSuccess(true)

            // Reset form
            setTimeout(() => {
                setFile(null)
                setThumbnailStr(null)
                setTitle('')
                setDurationStr('0:00')
                setProgress(0)
                setUploading(false)
                if (fileInputRef.current) fileInputRef.current.value = ''
                if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
            }, 2000)

        } catch (error: any) {
            console.error(error)
            setErrorMsg(error.message || "An unexpected error occurred during upload.")
            setUploading(false)
            setProgress(0)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#d6a461] transition-colors mb-4">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#d6a461]/15 flex items-center justify-center border border-[#d6a461]/30">
                        <Upload size={18} className="text-[#d6a461]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Upload Track</h1>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-[#11151b] border border-[#29323d] rounded-3xl p-6 sm:p-10 shadow-2xl">

                {success && (
                    <div className="mb-8 p-4 bg-[#d6a461]/10 border border-[#d6a461]/30 rounded-xl flex items-center gap-3 text-[#91a8b3]">
                        <CheckCircle2 className="flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Upload Successful!</p>
                            <p className="text-sm opacity-80">Your track is now live on the site.</p>
                        </div>
                    </div>
                )}

                {errorMsg && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Dropzone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Audio File</label>
                        <div
                            className={`relative w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors
                                ${file ? 'border-[#d6a461]/50 bg-[#d6a461]/5' : 'border-[#29323d] hover:border-gray-500 bg-[#0a0c10]/50'}`}
                        >
                            <input
                                type="file"
                                accept="audio/mpeg, audio/wav, audio/ogg"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                required
                            />

                            {file ? (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-[#d6a461] text-white flex items-center justify-center shadow-lg shadow-[#d6a461]/20 mb-3">
                                        <FileAudio size={24} />
                                    </div>
                                    <p className="text-white font-medium text-center">{file.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB • {durationStr}</p>
                                    <p className="text-xs text-[#d6a461] mt-3 font-medium">Click to change file</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-[#29323d] text-gray-400 flex items-center justify-center mb-3">
                                        <Upload size={20} />
                                    </div>
                                    <p className="text-gray-300 font-medium text-center">Click to browse or drag & drop</p>
                                    <p className="text-sm text-gray-500 mt-1">MP3, WAV, OGG up to 50MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Thumbnail Dropzone (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Track Thumbnail (Optional)</label>
                        <div
                            className={`relative w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-colors
                                ${thumbnailStr ? 'border-[#d6a461]/50 bg-[#d6a461]/5' : 'border-[#29323d] hover:border-gray-500 bg-[#0a0c10]/50'}`}
                        >
                            <input
                                type="file"
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleThumbnailChange}
                                ref={thumbnailInputRef}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />

                            {thumbnailStr ? (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-[#d6a461] text-white flex items-center justify-center shadow-lg shadow-[#d6a461]/20 mb-2">
                                        <FileImage size={20} />
                                    </div>
                                    <p className="text-white font-medium text-center text-sm">{thumbnailStr.name}</p>
                                    <p className="text-xs text-[#d6a461] mt-2 font-medium">Click to change</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-[#29323d] text-gray-400 flex items-center justify-center mb-2">
                                        <Upload size={18} />
                                    </div>
                                    <p className="text-gray-300 font-medium text-center text-sm">Upload artwork (.webp, .jpg)</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Track Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                disabled={uploading}
                                required
                                placeholder="e.g. Deep Forest Ambient"
                                className="w-full bg-[#0a0c10] border border-[#29323d] focus:border-[#d6a461] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                disabled={uploading}
                                className="w-full bg-[#0a0c10] border border-[#29323d] focus:border-[#d6a461] rounded-xl px-4 py-3 text-white outline-none transition-colors appearance-none"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {uploading && (
                        <div className="w-full bg-[#0a0c10] rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-[#d6a461] h-2.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-[#29323d]">
                        <button
                            type="submit"
                            disabled={!file || !title || uploading || success}
                            className="w-full flex items-center justify-center gap-2 bg-[#d6a461] hover:bg-[#b8894d] disabled:opacity-50 disabled:hover:bg-[#d6a461] text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-[#d6a461]/20"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Uploading... {progress}%
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle2 size={20} /> Published
                                </>
                            ) : (
                                <>
                                    Publish to Library
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

