import { ArrowRight, BriefcaseBusiness, Download, PackageOpen } from 'lucide-react'

const offers = [
    {
        number: '01',
        icon: Download,
        title: 'Free music + sound effects',
        description: 'Useful audio for video editors, filmmakers, podcasters, YouTubers, and anyone shaping a story. Listen, download, and build under a creator-friendly license.',
        action: 'Explore free audio',
        href: '#audio-grid',
        className: 'bg-[#11151b] border-[#29323d] hover:border-[#d6a461]/60',
        iconClass: 'bg-[#d6a461] text-[#0a0c10]',
        actionClass: 'text-[#e5c58b] hover:text-[#f0ece4]',
    },
    {
        number: '02',
        icon: PackageOpen,
        title: 'Premium packs',
        description: 'When you need a deeper palette, find carefully made collections of production-ready music and sound effects on Buy Me a Coffee.',
        action: 'Find premium packs',
        href: 'https://buymeacoffee.com/lukerobert/extras',
        className: 'bg-[#d6a461] border-[#d6a461] text-[#0a0c10] hover:bg-[#e5c58b]',
        iconClass: 'bg-[#0a0c10] text-[#d6a461]',
        actionClass: 'text-[#0a0c10] hover:text-[#29323d]',
    },
    {
        number: '03',
        icon: BriefcaseBusiness,
        title: 'Audio engineering help',
        description: 'Need a mix, master, custom sound design pass, or original piece? Bring Luke into the project and make the final signal count.',
        action: 'Work with Luke',
        href: 'https://lukerobert.me',
        className: 'bg-[#11151b] border-[#29323d] hover:border-[#91a8b3]/70',
        iconClass: 'bg-[#91a8b3] text-[#0a0c10]',
        actionClass: 'text-[#e5c58b] hover:text-[#f0ece4]',
    },
]

export default function AudioOffers() {
    return (
        <section id="offers" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-8 flex flex-col gap-2 border-b border-[#29323d] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-2xl font-extrabold text-[#f0ece4] sm:text-3xl">
                    Start with what you need.
                </h2>
                <p className="max-w-sm text-sm leading-6 text-[#89929d]">
                    Free tools for creators, premium packs for deeper work, and a sound engineer when you need one.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {offers.map(({ number, icon: Icon, title, description, action, href, className, iconClass, actionClass }) => {
                    const external = href.startsWith('http')
                    return (
                        <article key={number} className={`group flex min-h-[22rem] flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 sm:p-7 ${className}`}>
                            <div className="flex items-start justify-between">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}>
                                    <Icon size={19} strokeWidth={2.4} />
                                </div>
                                <span className="text-[11px] font-extrabold tracking-[0.16em] opacity-50">{number}</span>
                            </div>
                            <div className="mt-10">
                                <h3 className="mt-2 text-2xl font-extrabold">{title}</h3>
                                <p className="mt-4 text-sm leading-6 opacity-75">{description}</p>
                            </div>
                            <a
                                href={href}
                                target={external ? '_blank' : undefined}
                                rel={external ? 'noopener noreferrer' : undefined}
                                className={`mt-auto inline-flex items-center gap-2 pt-8 text-sm font-extrabold transition-colors ${actionClass}`}
                            >
                                {action} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                            </a>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}
