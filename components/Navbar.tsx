'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Menu, X, Music2, Layers, ShoppingBag, Search } from 'lucide-react'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [query, setQuery] = useState('')
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Sync input with URL on mount
    useEffect(() => {
        setQuery(searchParams.get('q') ?? '')
    }, [])

    function handleSearch(value: string) {
        setQuery(value)
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('q', value)
        } else {
            params.delete('q')
        }
        const target = pathname === '/' ? `/?${params}` : `/?${params}`
        router.replace(target, { scroll: false })
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0c10]/90 border-b border-[#29323d]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group flex-shrink-0">
                        <Image src="/logonew.svg" alt="Luke Robert" width={150} height={51} className="h-9 w-auto transition-opacity group-hover:opacity-80" priority />
                    </Link>

                    {/* Search bar — center */}
                    <div className="hidden md:flex flex-1 max-w-sm mx-auto">
                        <div className="relative w-full">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                id="navbar-search"
                                type="search"
                                placeholder="Search sound, texture, mood..."
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full bg-[#11151b] border border-[#29323d] hover:border-[#3b4652] focus:border-[#d6a461] rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-1.5 font-medium group/link">
                            <Music2 size={15} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-300 group-hover/link:text-white transition-colors">Sound library</span>
                        </Link>
                        <Link href="/collections" className="flex items-center gap-1.5 font-medium group/link">
                            <Layers size={15} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-300 group-hover/link:text-white transition-colors">Collections</span>
                        </Link>
                        <a
                            href="https://buymeacoffee.com/lukerobert/extras"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-medium group/link"
                        >
                            <ShoppingBag size={15} className="text-gray-400 shrink-0" />
                            <span className="text-sm text-gray-300 group-hover/link:text-white transition-colors">Shop</span>
                        </a>
                        <a
                            href="https://buymeacoffee.com/lukerobert"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:opacity-80 transition-opacity"
                            aria-label="Buy Me a Coffee"
                        >
                            <span className="rounded-full bg-[#d6a461] px-4 py-2 text-xs font-extrabold text-[#0a0c10]">Buy me a coffee</span>
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#11151b] transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-[#29323d] bg-[#0a0c10]">
                    <div className="px-4 py-3 flex flex-col gap-3">
                        <Link href="/" className="flex items-center gap-2 py-2 group/link" onClick={() => setMenuOpen(false)}>
                            <Music2 size={15} className="text-[#d6a461] shrink-0" />
                            <span className="text-sm text-gray-300 group-hover/link:text-white transition-colors">Sound library</span>
                        </Link>
                        <Link href="/collections" className="flex items-center gap-2 py-2 group/link" onClick={() => setMenuOpen(false)}>
                            <Layers size={15} className="text-[#d6a461] shrink-0" />
                            <span className="text-sm text-gray-300 group-hover/link:text-white transition-colors">Collections</span>
                        </Link>
                        <a
                            href="https://buymeacoffee.com/lukerobert/extras"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 py-2 group/link"
                            onClick={() => setMenuOpen(false)}
                        >
                            <ShoppingBag size={15} className="text-[#d6a461] shrink-0" />
                            <span className="text-sm text-gray-300 group-hover/link:text-white transition-colors">Shop</span>
                        </a>
                        <a
                            href="https://buymeacoffee.com/lukerobert"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuOpen(false)}
                        >
                            <span className="rounded-full bg-[#d6a461] px-4 py-2 text-xs font-extrabold text-[#0a0c10]">Buy me a coffee</span>
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}

