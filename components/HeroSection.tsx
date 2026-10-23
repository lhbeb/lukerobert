'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowDownRight, ArrowRight, CheckCircle2, Download, Mail, Music2, Users, X } from 'lucide-react'

const waveform = [26, 54, 36, 72, 44, 86, 50, 68, 32, 60, 42, 78, 30, 66, 48, 90, 40, 74, 34, 58]

export default function ProfileHero() {
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [following, setFollowing] = useState(false)

    function handleFollow() {
        if (following) {
            setFollowing(false)
            return
        }
        setShowModal(true)
    }

    function handleSubscribe(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return
        setSubmitted(true)
        setFollowing(true)
        setTimeout(() => {
            setShowModal(false)
            setSubmitted(false)
            setEmail('')
        }, 2200)
    }

    return (
        <>
            <section className="relative isolate overflow-hidden border-b border-[#29323d] bg-[#0a0c10]">
                <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#d6a461]/[0.08] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-[#91a8b3]/[0.06] blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5c58b] bg-[#d6a461] px-3 py-1.5 text-[11px] font-extrabold text-[#0a0c10] shadow-sm shadow-[#d6a461]/25">
                                    <Music2 size={11} /> Sound Engineer &amp; Artist
                                </span>
                                <span className="text-[11px] font-bold tracking-[0.12em] text-[#a8b2bd]">Free library · paid packs · custom work</span>
                            </div>

                            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.94] text-[#f0ece4] sm:text-6xl lg:text-8xl">
                                Better sound
                                <span className="block text-[#d6a461]">starts here.</span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-[#89929d] sm:text-base">
                                <span className="text-[#f0ece4]">@lukerobert</span> · Sound Engineer &amp; Artist · Music, sound effects, and production-ready packs
                            </p>

                            <p className="mt-7 max-w-xl text-base leading-8 text-[#c0c5cb] sm:text-lg">
                                Luke Anthony Robert is a sound engineer and artist building honest, tactile audio for films, games, brands, and the spaces between genres. Start with free licensed music and sound effects, buy a focused pack, or bring the engineer into your session.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="#audio-grid"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d6a461] px-5 py-3.5 text-sm font-extrabold text-[#0a0c10] shadow-lg shadow-[#d6a461]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b8894d]"
                                >
                                    Browse free sounds <ArrowRight size={16} />
                                </a>
                                <a
                                    href="https://buymeacoffee.com/lukerobert/extras"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#29323d] bg-[#11151b] px-5 py-3.5 text-sm font-bold text-[#d5d8dc] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d6a461]/60 hover:bg-[#141a22]"
                                >
                                    <Download size={16} className="text-[#e5c58b]" /> Shop paid packs
                                </a>
                            </div>

                            <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-[#29323d] py-4">
                                <div className="border-r border-[#29323d] pr-4">
                                    <div className="flex items-center gap-1.5 text-xl font-extrabold text-[#f0ece4]"><Users size={15} className="text-[#d6a461]" />15,682</div>
                                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a8b2bd]">Listeners</div>
                                </div>
                                <div className="border-r border-[#29323d] px-4">
                                    <div className="text-xl font-extrabold text-[#f0ece4]">1.2K</div>
                                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a8b2bd]">Tracks</div>
                                </div>
                                <div className="pl-4">
                                    <div className="text-xl font-extrabold text-[#f0ece4]">50K</div>
                                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a8b2bd]">Downloads</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative mx-auto min-h-[30rem] w-full max-w-[34rem] lg:min-h-[38rem]">
                            <div className="absolute right-0 top-0 h-[27rem] w-[82%] overflow-hidden rounded-[2rem] border border-[#3b4652] bg-[#11151b] shadow-2xl shadow-black/40 sm:h-[34rem]">
                                <Image
                                    src="/luke-portrait.jpg"
                                    alt="Luke Robert with field recording equipment"
                                    fill
                                    sizes="(max-width: 1024px) 80vw, 32rem"
                                    className="object-cover object-center grayscale-[0.08] transition-transform duration-700 hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10]/80 via-transparent to-[#0a0c10]/10" />
                                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                                    <div>
                                        <div className="text-lg font-bold text-[#f0ece4]">Useful sound, with feeling</div>
                                    </div>
                                    <ArrowDownRight size={22} className="text-[#d6a461]" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 h-48 w-40 overflow-hidden rounded-[1.5rem] border-4 border-[#0a0c10] bg-[#11151b] shadow-2xl shadow-black/50 sm:h-56 sm:w-48">
                                <Image
                                    src="/luke-studio.jpg"
                                    alt="Luke Robert working at a recording console"
                                    fill
                                    sizes="12rem"
                                    className="object-cover object-center"
                                />
                            </div>

                            <div className="absolute bottom-8 right-[-0.5rem] w-48 rounded-2xl border border-[#3b4652] bg-[#11151b]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:right-[-1.25rem]">
                                <div className="flex items-center justify-between text-[10px] font-extrabold tracking-[0.12em] text-[#a8b2bd]">
                                    <span>Live waveform</span>
                                    <span className="text-[#d6a461]">Live</span>
                                </div>
                                <div className="mt-4 flex h-9 items-center gap-1">
                                    {waveform.map((height, index) => (
                                        <span key={index} className="flex-1 rounded-full bg-[#d6a461]" style={{ height: `${height}%`, opacity: index % 3 === 0 ? 0.45 : 0.85 }} />
                                    ))}
                                </div>
                                <div className="mt-3 text-xs font-semibold text-[#c0c5cb]">Free sounds / paid packs / studio work</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-4 border-t border-[#29323d] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#d5d8dc]">
                            <span className="h-2 w-2 rounded-full bg-[#d6a461] shadow-[0_0_0_4px_rgba(214,164,97,0.12)]" />
                            Free music + sound effects under a creator-friendly license
                        </div>
                        <button
                            id="follow-btn"
                            onClick={handleFollow}
                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition-all duration-200 ${following
                                ? 'border border-[#d6a461]/60 bg-[#11151b] text-[#e5c58b]'
                                : 'bg-[#d6a461] text-[#0a0c10] shadow-lg shadow-[#d6a461]/20 hover:-translate-y-0.5 hover:bg-[#b8894d]'
                                }`}
                        >
                            {following ? <><CheckCircle2 size={15} /> Following</> : <>Follow Luke</>}
                        </button>
                    </div>
                </div>
            </section>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#29323d] bg-[#11151b] p-8 shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a0c10] text-gray-500 transition-colors hover:text-white" aria-label="Close">
                            <X size={15} />
                        </button>

                        {submitted ? (
                            <div className="py-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d6a461]/15"><CheckCircle2 size={32} className="text-[#d6a461]" /></div>
                                <h3 className="mb-2 text-xl font-bold text-white">You&apos;re in! 🎵</h3>
                                <p className="text-sm text-gray-400">Welcome to the community. Watch your inbox for new drops.</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#d6a461]/50"><Image src="/luke-portrait.jpg" alt="Luke Anthony Robert" fill sizes="3rem" className="object-cover" /></div>
                                    <div><div className="text-sm font-bold text-white">Luke Robert</div><div className="text-[11px] text-[#e5c58b]">invites you to follow</div></div>
                                </div>
                                <div className="mb-2">
                                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#d6a461]/30 bg-[#d6a461]/10 px-3 py-1"><Mail size={12} className="text-[#d6a461]" /><span className="text-xs font-semibold text-[#e5c58b]">Newsletter</span></div>
                                    <h3 className="mb-2 text-2xl font-extrabold leading-snug text-white">Get new audio drops<br />every week 🎧</h3>
                                    <p className="text-sm leading-relaxed text-gray-400">Enter your email address, become a follower and get fresh audio drops straight to your inbox — absolutely free.</p>
                                </div>
                                <form onSubmit={handleSubscribe} className="mt-5 space-y-3">
                                    <div className="relative"><Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" /><input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full rounded-xl border border-[#29323d] bg-[#0a0c10] py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#d6a461]" /></div>
                                    <button id="newsletter-submit" type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d6a461] py-3 font-bold text-[#0a0c10] shadow-lg shadow-[#d6a461]/25 transition-all duration-200 hover:bg-[#b8894d]">Become a Follower <ArrowRight size={16} /></button>
                                    <p className="text-center text-[11px] text-gray-600">No spam, unsubscribe anytime.</p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
