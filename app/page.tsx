import { Suspense } from 'react'
import HeroSection from '@/components/HeroSection'
import AudioOffers from '@/components/AudioOffers'
import AudioGridPlaceholder from '@/components/AudioGridPlaceholder'
import SupportSection from '@/components/SupportSection'
import SocialLinks from '@/components/SocialLinks'

export default function HomePage() {
    return (
        <div>
            {/* Profile Hero (cover + avatar + follow) */}
            <HeroSection />

            {/* Clear entry points for free audio, premium packs, and engineering help */}
            <AudioOffers />

            {/* Latest free audio */}
            <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#a8b2bd] sm:px-6 lg:px-8">Loading audio library…</div>}>
                <AudioGridPlaceholder
                    limit={4}
                    title="Free audio for your next project"
                    subtitle="Licensed music, movie-ready effects, textures, and ambiences for edits, episodes, and stories"
                />
            </Suspense>

            {/* Support / Donation */}
            <SupportSection />

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 mt-8">
                <div className="border-t border-[#29323d]" />
            </div>

            {/* Full free audio library */}
            <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#a8b2bd] sm:px-6 lg:px-8">Loading audio library…</div>}>
                <AudioGridPlaceholder
                    title="Explore the free library"
                    subtitle="Find music, sound effects, and sonic textures for videos, films, podcasts, YouTube, and more"
                />
            </Suspense>

            {/* Email Subscription Links */}
            <SocialLinks />
        </div>
    )
}

