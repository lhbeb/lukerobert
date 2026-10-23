import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfServicePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#d6a461] transition-colors mb-8">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-gray-400 mb-12">Last updated: March 2026</p>

            <div className="space-y-8 text-gray-300 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                    <p>By accessing and using Luke Robert ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our website.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">2. Use of Audio Assets</h2>
                    <p>The core purpose of Luke Robert is to provide audio assets for creators. Unless explicitly stated otherwise on the individual track page, all audio assets downloaded from our platform are subject to our <Link href="/license" className="text-[#d6a461] hover:underline">Audio Licensing Agreement</Link>, which grants you specific rights to use the audio in your projects while prohibiting the resale or redistribution of the raw files.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">3. Professional Services</h2>
                    <p>In addition to our free library, we offer professional audio production services (mixing, mastering, sound design). Any engagement for professional services constitutes a separate agreement. Payments made via third-party providers (like Buy Me a Coffee or PayPal) are subject to the terms of those platforms.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">4. Site Availability and Integrity</h2>
                    <p>We strive to maintain the availability of our website and its content but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
                    <p>In no event shall Luke Robert or its creator be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the website or our audio assets. All assets are provided "as is" without warranty of any kind.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">6. Changes to Terms</h2>
                    <p>We reserve the right to modify these Terms of Service at any time. Significant changes will be posted on this page, and your continued use of the website constitutes acceptance of the modified terms.</p>
                </section>
            </div>
        </div>
    )
}

