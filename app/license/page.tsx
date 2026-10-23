import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'

export default function LicensePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#d6a461] transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <h1 className="text-4xl font-bold text-white mb-4">Audio License Agreement</h1>
            <p className="text-gray-400 mb-12">Clear, simple rules for using the audio assets downloaded from Luke Robert.</p>

            <div className="space-y-8 text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
                    <p>All audio assets (music, stems, sound effects) provided for free download on Luke Robert are licensed to you under a broad, creator-friendly royalty-free license. This means you can use them in almost any creative project without paying royalties.</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <div className="bg-[#d6a461]/5 border border-[#d6a461]/20 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="text-[#d6a461]" /> You CAN:
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex gap-2"><span className="text-[#d6a461] flex-shrink-0">•</span> Use the audio in personal, educational, and commercial projects (e.g., YouTube videos, podcasts, indie games, films).</li>
                            <li className="flex gap-2"><span className="text-[#d6a461] flex-shrink-0">•</span> Modify, cut, splice, and process the audio to fit your project.</li>
                            <li className="flex gap-2"><span className="text-[#d6a461] flex-shrink-0">•</span> Use the audio without required attribution (though tagging/crediting Luke Robert is highly appreciated!).</li>
                            <li className="flex gap-2"><span className="text-[#d6a461] flex-shrink-0">•</span> Monetize the videos or projects that incorporate this audio.</li>
                        </ul>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <XCircle className="text-red-400" /> You CANNOT:
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">•</span> Resell, redistribute, sub-license, or share the raw, standalone audio files.</li>
                            <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">•</span> Claim ownership or authorship of the original audio composition.</li>
                            <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">•</span> Upload the unaltered tracks to streaming platforms (Spotify, Apple Music) as your own release or register them in Content ID systems that would falsely flag other creators.</li>
                        </ul>
                    </div>
                </div>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">Content ID & Copyright Claims</h2>
                    <p>The tracks on this site are NOT registered with YouTube Content ID or other automated fingerprinting services. You will not receive copyright strikes for using these tracks as intended in your videos. If you ever receive a false claim from a third party regarding audio downloaded here, please contact us immediately to help resolve it.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">Professional Services</h2>
                    <p>If you hire Luke Robert for custom audio production, mixing, or mastering, the licensing terms for those specific deliverables will be outlined in a separate written agreement tailored to your project.</p>
                </section>
            </div>
        </div>
    )
}

