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

            {/* Clear entry points for free library, paid packs, and engineering work */}
            <AudioOffers />

            {/* Latest free audio */}
            <AudioGridPlaceholder
                limit={4}
                title="Latest free sounds"
                subtitle="Licensed music, effects, textures, and ambiences ready for your projects"
            />

            {/* Support / Donation */}
            <SupportSection />

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 mt-8">
                <div className="border-t border-[#29323d]" />
            </div>

            {/* Full free audio library */}
            <AudioGridPlaceholder
                title="Free sound library"
                subtitle="Explore the full collection of music, sound effects, and sonic textures"
            />

            {/* Email Subscription Links */}
            <SocialLinks />
        </div>
    )
}

