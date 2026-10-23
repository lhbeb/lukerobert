import { MapPin, Calendar, Users, Download, Eye, Music2, Star } from 'lucide-react'

const stats = [
    { icon: Star, label: 'Likes', value: '12.4K' },
    { icon: Eye, label: 'Views', value: '850K' },
    { icon: Download, label: 'Downloads', value: '50K' },
    { icon: Music2, label: 'Items Published', value: '1,200' },
]

export default function CreatorProfile() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-14">
            <div className="bg-[#11151b] border border-[#29323d] rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d6a461] to-[#91a8b3] flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            R
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#d6a461] border-2 border-[#11151b]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h2 className="text-xl font-bold text-white">Luke Robert Studio</h2>
                            <span className="inline-flex items-center gap-1 bg-[#d6a461]/10 border border-[#d6a461]/30 text-[#d6a461] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                ✓ Creator
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-lg mb-3">
                            Sound engineering, original music, and a growing shelf of royalty-free textures for creators worldwide.
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-[#d6a461]" />
                                Worldwide
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={12} className="text-[#d6a461]" />
                                Joined Jan 2020
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users size={12} className="text-[#d6a461]" />
                                Worldwide / Remote
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full sm:w-auto">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-[#0a0c10] border border-[#29323d] rounded-xl p-3 text-center min-w-[80px]">
                                <stat.icon size={16} className="text-[#d6a461] mx-auto mb-1.5" />
                                <div className="text-base font-bold text-white">{stat.value}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

