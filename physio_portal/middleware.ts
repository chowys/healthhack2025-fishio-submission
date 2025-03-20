import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('physiotoken')
    // console.log(token)
    if (request.nextUrl.pathname === '/dashboard' && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    if (request.nextUrl.pathname === '/auth/login' && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

}
