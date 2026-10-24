import Image from 'next/image'
import { Coffee, ShoppingBag } from 'lucide-react'

export default function SupportSection() {
    return (
        <section id="support" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#d6a461]/15 to-[#d6a461]/5 border border-[#d6a461]/30 rounded-3xl">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d6a461]/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d6a461]/5 rounded-full blur-[60px] pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row">

                    {/* ── Photo — left, flush, no border, no shadow, no caption ── */}
                    <div className="relative w-full lg:w-80 xl:w-96 min-h-[320px] lg:min-h-full flex-shrink-0">
                        <Image
                            src="/luke-portrait.jpg"
                            alt="Luke Anthony Robert"
                            fill
                            className="object-cover object-center rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
                            sizes="(max-width: 1024px) 100vw, 384px"
                            quality={90}
                        />
                    </div>

                    {/* ── Text side — right ── */}
                    <div className="flex-1 p-8 sm:p-12">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#d6a461] bg-[#d6a461] px-3 py-1 mb-6">
                            <Coffee size={13} className="text-[#0a0c10]" />
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#0a0c10]">Support independent audio</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                            Keep good sound in circulation{' '}
                            <span className="bg-gradient-to-r from-[#d6a461] to-[#91a8b3] bg-clip-text text-transparent">
                                for everyone
                            </span>
                        </h2>

                        <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
                            <p>
                                I&apos;m Luke Anthony Robert — a sound engineer and artist who composes, records, edits, mixes, masters, designs sound, and builds production-ready audio packs.
                                This library is where I leave the doors open and share the sounds I make along the way.
                            </p>
                            <p>
                                Download free music, sound effects, ambiences, and textures for your next project. For deeper collections, premium sample libraries live on Buy Me a Coffee. If the work helps your project, a donation funds more studio time, more releases, and more audio made available to the community.
                            </p>
                            <p className="text-white font-medium">
                                Your support keeps the signal moving from the studio to the people who need better sound.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="https://buymeacoffee.com/lukerobert"
                                target="_blank"
                                rel="noopener noreferrer"
                                id="support-buymeacoffee-btn"
                                aria-label="Support Luke Robert on Buy Me a Coffee"
                                className="group inline-flex h-14 w-full max-w-[20rem] items-center justify-center overflow-hidden rounded-2xl bg-[#ffd400] shadow-lg shadow-[#ffd400]/20 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[#ffd400]/35 sm:w-[20rem]"
                            >
                                <Image
                                    src="/buy-me-a-coffee-button.png"
                                    alt="Buy Me a Coffee"
                                    width={640}
                                    height={180}
                                    sizes="(max-width: 640px) 100vw, 320px"
                                    className="h-full w-full object-contain"
                                />
                            </a>
                            <a
                                href="https://buymeacoffee.com/lukerobert/extras"
                                target="_blank"
                                rel="noopener noreferrer"
                                id="support-shop-btn"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-[#d6a461]/50 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm"
                            >
                                <ShoppingBag size={17} />
                                Browse premium packs
                            </a>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

