'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Upload, ListMusic, Settings, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
    const router = useRouter()

    async function handleSignOut() {
        document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#d6a461] text-sm font-semibold mb-3 uppercase tracking-wide">
                        <LayoutDashboard size={15} />
                        Admin Panel
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">Dashboard</h1>
                    <p className="text-gray-400">Manage your audio library from here.</p>
                </div>

                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#11151b] hover:bg-[#29323d] border border-[#29323d] px-4 py-2 rounded-xl transition-colors"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Link href="/admin/upload" className="group bg-[#11151b] border border-[#29323d] hover:border-[#d6a461]/50 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#d6a461]/10">
                    <div className="w-11 h-11 rounded-xl bg-[#d6a461]/15 flex items-center justify-center mb-4 group-hover:bg-[#d6a461]/25 transition-colors">
                        <Upload size={20} className="text-[#d6a461]" />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-1 group-hover:text-[#d6a461] transition-colors">Upload Audio</h2>
                    <p className="text-sm text-gray-500">Add new MP3 tracks to the library</p>
                </Link>

                <Link href="/admin/manage" className="group bg-[#11151b] border border-[#29323d] hover:border-[#d6a461]/50 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#d6a461]/10">
                    <div className="w-11 h-11 rounded-xl bg-[#d6a461]/15 flex items-center justify-center mb-4 group-hover:bg-[#d6a461]/25 transition-colors">
                        <ListMusic size={20} className="text-[#d6a461]" />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-1 group-hover:text-[#d6a461] transition-colors">Manage Tracks</h2>
                    <p className="text-sm text-gray-500">View, edit and delete uploaded audio</p>
                </Link>
            </div>
        </div>
    )
}

