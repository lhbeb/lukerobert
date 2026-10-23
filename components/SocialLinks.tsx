'use client'

import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function EmailSection() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setEmail('')
        }, 3000)
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="bg-[#11151b] border border-[#29323d] rounded-3xl p-8 sm:p-12 text-center">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#d6a461]/15 border border-[#d6a461]/30 flex items-center justify-center mx-auto mb-5">
                    <Mail size={24} className="text-[#d6a461]" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Get the next signal</h2>
                <p className="text-sm text-gray-400 mb-7 max-w-sm mx-auto leading-relaxed">
                    New sounds, studio notes, and occasional behind-the-scenes dispatches from the Luke Robert studio.
                </p>

                {submitted ? (
                    <div className="flex items-center justify-center gap-2 text-[#d6a461] font-semibold">
                        <CheckCircle2 size={20} />
                        You&apos;re in. Watch your inbox for the next signal.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <div className="relative flex-1">
                            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                id="email-section-input"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-[#0a0c10] border border-[#29323d] focus:border-[#d6a461] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                            />
                        </div>
                        <button
                            id="email-section-submit"
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 bg-[#d6a461] hover:bg-[#b8894d] text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-[#d6a461]/25 hover:scale-105 whitespace-nowrap"
                        >
                            Subscribe <ArrowRight size={15} />
                        </button>
                    </form>
                )}

                <p className="text-[11px] text-gray-600 mt-4">No spam, unsubscribe anytime.</p>
            </div>
        </section>
    )
}

