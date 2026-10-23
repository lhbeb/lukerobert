import Link from 'next/link'
import { Music2, Layers } from 'lucide-react'

const categories = [
    { name: 'Popular', count: 120, color: 'from-[#d6a461] to-[#91a8b3]' },
    { name: 'Ambient', count: 85, color: 'from-blue-500 to-indigo-500' },
    { name: 'Nature', count: 64, color: 'from-slate-500 to-slate-300' },
    { name: 'Meditation', count: 47, color: 'from-purple-500 to-violet-400' },
    { name: 'Spiritual', count: 38, color: 'from-amber-500 to-yellow-400' },
    { name: 'Cinematic', count: 55, color: 'from-red-500 to-rose-400' },
]

export default function CollectionsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 text-[#d6a461] text-sm font-semibold mb-3 uppercase tracking-wide">
                    <Layers size={15} />
                    Browse the signal archive
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">The sound library</h1>
                <p className="text-gray-400 max-w-lg">Curated textures, atmospheres, and musical fragments for work that wants a pulse.</p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={`/collections/${cat.name.toLowerCase()}`}
                        className="group relative overflow-hidden bg-[#11151b] border border-[#29323d] hover:border-[#d6a461]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d6a461]/10"
                    >
                        {/* Gradient accent */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color} rounded-t-2xl`} />

                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg`}>
                                        <Music2 size={16} className="text-white" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-[#d6a461] transition-colors">{cat.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{cat.count} tracks</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

