'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, KeyRound, Mail, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        })

        if (signInError) {
            setErrorMsg(signInError.message === 'Invalid login credentials'
                ? 'Invalid email or password.'
                : signInError.message)
            setLoading(false)
            return
        }

        const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin')

        if (adminCheckError || !isAdmin) {
            await supabase.auth.signOut()
            setErrorMsg('This account is not authorized to access the admin area.')
            setLoading(false)
            return
        }

        router.push('/admin')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#11151b] border border-[#29323d] rounded-3xl p-8 sm:p-10 shadow-2xl">

                {/* Logo & Header */}
                <div className="flex flex-col items-center justify-center mb-10">
                            <div className="mb-6 flex items-center gap-3">
                                <Image src="/logonew.svg" alt="Luke Robert" width={180} height={61} className="h-12 w-auto" priority />
                            </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-400 text-sm text-center">Sign in to manage your audio library</p>
                </div>

                {/* Error Box */}
                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                        <AlertCircle className="flex-shrink-0 mt-0.5" size={16} />
                        <p>{errorMsg}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                                required
                                placeholder="admin@example.com"
                                className="w-full bg-[#0a0c10] border border-[#29323d] focus:border-[#d6a461] rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                placeholder="••••••••"
                                className="w-full bg-[#0a0c10] border border-[#29323d] focus:border-[#d6a461] rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!email || !password || loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#d6a461] hover:bg-[#b8894d] disabled:opacity-50 disabled:hover:bg-[#d6a461] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#d6a461]/20 mt-8"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" size={18} /> Signing in...</>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

            </div>
        </div>
    )
}

