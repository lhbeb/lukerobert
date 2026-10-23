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

    useEffect(() => {
        setQuery(searchParams.get('q') ?? '')
    }, [searchParams])

    function handleSearch(value: string) {
        setQuery(value)
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('q', value)
        } else {
            params.delete('q')
        }
        router.replace(`${pathname === '/' ? '/' : '/'}?${params}`, { scroll: false })
    }

    function closeMenu() {
        setMenuOpen(false)
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-[#29323d] bg-[#0a0c10]/95 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-[4.5rem] items-center gap-4 xl:gap-6">
                    <Link href="/" className="group flex flex-shrink-0 items-center" aria-label="Luke Robert home">
                        <Image
                            src="/logonew.svg"
                            alt="Luke Robert"
                            width={136}
                            height={45}
                            className="h-8 w-auto transition-opacity group-hover:opacity-80 sm:h-9"
                            priority
                        />
                    </Link>

                    <div className="hidden items-center gap-1 xl:flex">
                        <Link href="/" className="group/link flex items-center gap-2 rounded-lg px-3 py-2">
                            <Music2 size={15} className="shrink-0 text-[#a8b2bd] transition-colors group-hover/link:text-[#d6a461]" />
                            <span className="text-sm font-semibold text-[#d5d8dc] transition-colors group-hover/link:text-[#f0ece4]">Library</span>
                        </Link>
                        <Link href="/collections" className="group/link flex items-center gap-2 rounded-lg px-3 py-2">
                            <Layers size={15} className="shrink-0 text-[#a8b2bd] transition-colors group-hover/link:text-[#d6a461]" />
                            <span className="text-sm font-semibold text-[#d5d8dc] transition-colors group-hover/link:text-[#f0ece4]">Collections</span>
                        </Link>
                        <a
                            href="https://buymeacoffee.com/lukerobert/extras"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center gap-2 rounded-lg px-3 py-2"
                        >
                            <ShoppingBag size={15} className="shrink-0 text-[#a8b2bd] transition-colors group-hover/link:text-[#d6a461]" />
                            <span className="text-sm font-semibold text-[#d5d8dc] transition-colors group-hover/link:text-[#f0ece4]">Shop</span>
                        </a>
                    </div>

                    <div className="ml-auto hidden w-full max-w-[19rem] md:flex xl:max-w-[22rem]">
                        <div className="relative w-full">
                            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8b2bd]" />
                            <input
                                id="navbar-search"
                                type="search"
                                placeholder="Search the library"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full rounded-full border border-[#29323d] bg-[#11151b] py-2.5 pl-10 pr-4 text-sm text-[#f0ece4] outline-none transition-colors placeholder:text-[#89929d] hover:border-[#3b4652] focus:border-[#d6a461]"
                            />
                        </div>
                    </div>

                    <button
                        className="rounded-lg p-2 text-[#d5d8dc] transition-colors hover:bg-[#11151b] hover:text-[#f0ece4] xl:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? <X size={21} /> : <Menu size={21} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-[#29323d] bg-[#0a0c10] xl:hidden">
                    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div className="relative md:hidden">
                            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8b2bd]" />
                            <input
                                id="mobile-navbar-search"
                                type="search"
                                placeholder="Search the library"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full rounded-xl border border-[#29323d] bg-[#11151b] py-3 pl-10 pr-4 text-sm text-[#f0ece4] outline-none transition-colors placeholder:text-[#89929d] focus:border-[#d6a461]"
                            />
                        </div>

                        <div className="grid gap-1 sm:grid-cols-3">
                            <Link href="/" onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#d5d8dc] transition-colors hover:bg-[#11151b] hover:text-[#f0ece4]">
                                <Music2 size={16} className="text-[#d6a461]" />
                                Library
                            </Link>
                            <Link href="/collections" onClick={closeMenu} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#d5d8dc] transition-colors hover:bg-[#11151b] hover:text-[#f0ece4]">
                                <Layers size={16} className="text-[#d6a461]" />
                                Collections
                            </Link>
                            <a
                                href="https://buymeacoffee.com/lukerobert/extras"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={closeMenu}
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#d5d8dc] transition-colors hover:bg-[#11151b] hover:text-[#f0ece4]"
                            >
                                <ShoppingBag size={16} className="text-[#d6a461]" />
                                Shop
                            </a>
                        </div>

                    </div>
                </div>
            )}
        </nav>
    )
}
