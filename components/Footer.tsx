import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-[#29323d] bg-[#0a0c10] mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center mb-4">
                            <Image src="/logonew.svg" alt="Luke Robert" width={150} height={51} className="h-10 w-auto" />
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            Sound engineer, artist, and lifelong collector of strange textures. Free resources for the people making things.
                        </p>
                        <a href="https://lukerobert.me" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.18em] text-[#91a8b3] hover:text-[#f0ece4] transition-colors">
                            lukerobert.me ↗
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase mb-4">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <ul className="space-y-2">
                                {[
                                    { label: 'Browse Audio', href: '/' },
                                    { label: 'Collections', href: '/collections' },
                                    { label: 'Admin Panel', href: '/admin' },
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-sm text-gray-400 hover:text-[#d6a461] transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/privacy" className="hover:text-[#d6a461] transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-[#d6a461] transition-colors">Terms of Service</Link></li>
                                <li><Link href="/license" className="hover:text-[#d6a461] transition-colors">License Agreement</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-[#29323d] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">© 2026 Luke Anthony Robert. All rights reserved.</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        Made with <Heart size={12} className="text-[#d6a461]" /> for creators
                    </p>
                </div>
            </div>
        </footer>
    )
}

