import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'Luke Robert — Sound Engineer & Artist',
    description: 'Luke Anthony Robert is a sound engineer and artist sharing textured sounds, music, and creative tools for the makers who need them.',
    keywords: 'Luke Robert, sound engineer, artist, free audio, music library, sound design',
    openGraph: {
        title: 'Luke Robert — Sound Engineer & Artist',
        description: 'Sound, music, and creative tools from Luke Anthony Robert.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-[#0a0c10] text-[#f0ece4] antialiased">
                <Suspense fallback={<div className="h-16 border-b border-[#29323d] bg-[#0a0c10]" />}>
                    <Navbar />
                </Suspense>
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}

