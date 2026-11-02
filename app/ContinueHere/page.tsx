import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Thank you | Luke Robert',
    description: 'Thank you for visiting Luke Robert.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function ContinueHerePage() {
    return (
        <section className="relative isolate flex min-h-[calc(100vh-9rem)] items-center overflow-hidden border-b border-[#29323d] bg-[#0a0c10] px-4 py-16 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute -right-32 top-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#d6a461]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-0 -z-10 h-80 w-80 rounded-full bg-[#91a8b3]/10 blur-3xl" />

            <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-[#29323d] bg-[#11151b] p-8 text-center shadow-2xl shadow-black/30 sm:p-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d6a461] text-[#0a0c10] shadow-lg shadow-[#d6a461]/20">
                    <CheckCircle2 size={27} strokeWidth={2.5} />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#d6a461]">Thank you</p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#f0ece4] sm:text-5xl">
                    Thank you for visiting Luke Robert.
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#c0c5cb] sm:text-lg">
                    Luke makes free music, sound effects, ambient audio, and downloadable packs for creators. Your support helps make more audio available to everyone.
                </p>

                <Link
                    href="/"
                    className="mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-[#d6a461] px-5 py-3.5 text-sm font-bold text-[#0a0c10] shadow-lg shadow-[#d6a461]/20 transition-colors hover:bg-[#e5c58b]"
                >
                    <ArrowLeft size={16} /> Back to the audio library
                </Link>
            </div>
        </section>
    )
}
